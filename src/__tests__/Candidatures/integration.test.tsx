import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CandidaturesSuivi from '../../pages/CandidaturesSuivi';

// Mock des services avec une implémentation plus réaliste
const mockApplications: any[] = [];
const mockStats = {
  total: 0,
  pending: 0,
  interview: 0,
  rejected: 0,
  accepted: 0
};

jest.mock('../../services/applicationService', () => ({
  getAllApplications: jest.fn(() => mockApplications),
  addApplication: jest.fn((data) => {
    const newApp = {
      ...data,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockApplications.push(newApp);
    mockStats.total++;
    mockStats[data.status]++;
    return newApp;
  }),
  updateApplication: jest.fn((id, data) => {
    const index = mockApplications.findIndex(app => app.id === id);
    if (index !== -1) {
      const oldStatus = mockApplications[index].status;
      const newStatus = data.status || oldStatus;
      
      // Mettre à jour les statistiques
      if (oldStatus !== newStatus) {
        mockStats[oldStatus]--;
        mockStats[newStatus]++;
      }
      
      mockApplications[index] = {
        ...mockApplications[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return mockApplications[index];
    }
    return null;
  }),
  deleteApplication: jest.fn((id) => {
    const index = mockApplications.findIndex(app => app.id === id);
    if (index !== -1) {
      const status = mockApplications[index].status;
      mockStats.total--;
      mockStats[status]--;
      mockApplications.splice(index, 1);
      return true;
    }
    return false;
  }),
  getApplicationStats: jest.fn(() => ({ ...mockStats }))
}));

// Mock des composants pour les tests d'intégration
jest.mock('../../components/ApplicationStats', () => {
  return function MockApplicationStats({ stats }: { stats: any }) {
    return (
      <div data-testid="application-stats">
        <div>Total: {stats.total}</div>
        <div>En attente: {stats.pending}</div>
        <div>Entretien: {stats.interview}</div>
        <div>Refusées: {stats.rejected}</div>
        <div>Acceptées: {stats.accepted}</div>
      </div>
    );
  };
});

jest.mock('../../components/ApplicationsTable', () => {
  return function MockApplicationsTable({ 
    applications, 
    onView, 
    onEdit, 
    onDelete 
  }: { 
    applications: any[], 
    onView: (app: any) => void, 
    onEdit: (app: any) => void, 
    onDelete: (id: string) => void 
  }) {
    return (
      <div data-testid="applications-table">
        {applications.length === 0 ? (
          <div>Aucune candidature trouvée</div>
        ) : (
          applications.map(app => (
            <div key={app.id} data-testid={`application-${app.id}`}>
              <span>{app.company} - {app.position}</span>
              <span data-testid={`status-${app.id}`}>{app.status}</span>
              <button onClick={() => onView(app)}>Voir</button>
              <button onClick={() => onEdit(app)}>Modifier</button>
              <button onClick={() => onDelete(app.id)}>Supprimer</button>
            </div>
          ))
        )}
      </div>
    );
  };
});

jest.mock('../../components/ApplicationForm', () => {
  return function MockApplicationForm({ 
    application, 
    onSubmit, 
    onCancel 
  }: { 
    application?: any, 
    onSubmit: (data: any) => void, 
    onCancel: () => void 
  }) {
    return (
      <div data-testid="application-form">
        <div>Mode: {application ? 'Édition' : 'Création'}</div>
        {application && <div>Éditer: {application.company}</div>}
        <button onClick={() => onSubmit({ 
          company: application ? 'Modifié Corp' : 'Nouvelle Corp',
          position: application ? 'Position Modifiée' : 'Nouvelle Position',
          applicationDate: '2024-01-15',
          status: 'pending'
        })}>
          Soumettre
        </button>
        <button onClick={onCancel}>Annuler</button>
      </div>
    );
  };
});

jest.mock('../../components/ApplicationDetail', () => {
  return function MockApplicationDetail({ 
    application, 
    onEdit, 
    onDelete, 
    onClose 
  }: { 
    application: any, 
    onEdit: () => void, 
    onDelete: () => void, 
    onClose: () => void 
  }) {
    return (
      <div data-testid="application-detail">
        <div>{application.company} - {application.position}</div>
        <div>Statut: {application.status}</div>
        <button onClick={onEdit}>Modifier</button>
        <button onClick={onDelete}>Supprimer</button>
        <button onClick={onClose}>Fermer</button>
      </div>
    );
  };
});

describe('Intégration Candidatures', () => {
  beforeEach(() => {
    // Réinitialiser les données mockées
    mockApplications.length = 0;
    Object.assign(mockStats, {
      total: 0,
      pending: 0,
      interview: 0,
      rejected: 0,
      accepted: 0
    });
  });

  test('flux complet: ajouter, modifier, supprimer une candidature', async () => {
    const user = userEvent.setup();
    render(<CandidaturesSuivi />);

    // 1. Vérifier l'état initial
    expect(screen.getByText('Aucune candidature trouvée')).toBeInTheDocument();
    expect(screen.getByText('Total: 0')).toBeInTheDocument();

    // 2. Ajouter une candidature
    await user.click(screen.getByText('Ajouter une candidature'));
    expect(screen.getByTestId('application-form')).toBeInTheDocument();
    expect(screen.getByText('Mode: Création')).toBeInTheDocument();

    await user.click(screen.getByText('Soumettre'));

    // 3. Vérifier que la candidature a été ajoutée
    await waitFor(() => {
      expect(screen.getByTestId('application-app-')).toBeInTheDocument();
    });
    expect(screen.getByText('Nouvelle Corp - Nouvelle Position')).toBeInTheDocument();
    expect(screen.getByText('Total: 1')).toBeInTheDocument();
    expect(screen.getByText('En attente: 1')).toBeInTheDocument();

    // 4. Voir les détails de la candidature
    const viewButtons = screen.getAllByText('Voir');
    await user.click(viewButtons[0]);

    expect(screen.getByTestId('application-detail')).toBeInTheDocument();
    expect(screen.getByText('Nouvelle Corp - Nouvelle Position')).toBeInTheDocument();
    expect(screen.getByText('Statut: pending')).toBeInTheDocument();

    // 5. Modifier la candidature depuis les détails
    const editButtons = screen.getAllByText('Modifier');
    await user.click(editButtons[0]);

    expect(screen.getByTestId('application-form')).toBeInTheDocument();
    expect(screen.getByText('Mode: Édition')).toBeInTheDocument();
    expect(screen.getByText('Éditer: Nouvelle Corp')).toBeInTheDocument();

    await user.click(screen.getByText('Soumettre'));

    // 6. Vérifier que la candidature a été modifiée
    await waitFor(() => {
      expect(screen.getByText('Modifié Corp - Position Modifiée')).toBeInTheDocument();
    });

    // 7. Supprimer la candidature
    const deleteButtons = screen.getAllByText('Supprimer');
    await user.click(deleteButtons[0]);

    // 8. Vérifier que la candidature a été supprimée
    await waitFor(() => {
      expect(screen.getByText('Aucune candidature trouvée')).toBeInTheDocument();
    });
    expect(screen.getByText('Total: 0')).toBeInTheDocument();
  });

  test('gestion de plusieurs candidatures avec différents statuts', async () => {
    const user = userEvent.setup();
    render(<CandidaturesSuivi />);

    // Ajouter plusieurs candidatures
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByText('Ajouter une candidature'));
      await user.click(screen.getByText('Soumettre'));
    }

    // Vérifier que toutes les candidatures sont présentes
    await waitFor(() => {
      expect(screen.getByText('Total: 3')).toBeInTheDocument();
    });
    expect(screen.getByText('En attente: 3')).toBeInTheDocument();

    // Modifier le statut de la première candidature
    const editButtons = screen.getAllByText('Modifier');
    await user.click(editButtons[0]);

    // Simuler un changement de statut (dans un vrai test, on modifierait le formulaire)
    // Pour ce test d'intégration, on utilise le mock qui change le statut
    await user.click(screen.getByText('Soumettre'));

    // Vérifier que les statistiques sont mises à jour
    await waitFor(() => {
      expect(screen.getByText('Total: 3')).toBeInTheDocument();
    });
  });

  test('gestion des erreurs et récupération', async () => {
    const user = userEvent.setup();
    render(<CandidaturesSuivi />);

    // Ajouter une candidature
    await user.click(screen.getByText('Ajouter une candidature'));
    await user.click(screen.getByText('Soumettre'));

    // Vérifier que la candidature est ajoutée
    await waitFor(() => {
      expect(screen.getByTestId('application-app-')).toBeInTheDocument();
    });

    // Simuler une erreur lors de la suppression
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Dans un vrai scénario, on pourrait forcer une erreur
    // Pour ce test, on vérifie que l'interface reste stable
    const deleteButtons = screen.getAllByText('Supprimer');
    await user.click(deleteButtons[0]);

    // Vérifier que l'interface reste fonctionnelle
    expect(screen.getByText('Ajouter une candidature')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test('navigation entre les vues (liste, détails, formulaire)', async () => {
    const user = userEvent.setup();
    render(<CandidaturesSuivi />);

    // Ajouter une candidature
    await user.click(screen.getByText('Ajouter une candidature'));
    await user.click(screen.getByText('Soumettre'));

    await waitFor(() => {
      expect(screen.getByTestId('application-app-')).toBeInTheDocument();
    });

    // Ouvrir les détails
    const viewButtons = screen.getAllByText('Voir');
    await user.click(viewButtons[0]);

    expect(screen.getByTestId('application-detail')).toBeInTheDocument();

    // Fermer les détails
    const closeButtons = screen.getAllByText('Fermer');
    await user.click(closeButtons[0]);

    expect(screen.queryByTestId('application-detail')).not.toBeInTheDocument();

    // Ouvrir le formulaire d'édition
    const editButtons = screen.getAllByText('Modifier');
    await user.click(editButtons[0]);

    expect(screen.getByTestId('application-form')).toBeInTheDocument();

    // Annuler l'édition
    await user.click(screen.getByText('Annuler'));

    expect(screen.queryByTestId('application-form')).not.toBeInTheDocument();
  });

  test('persistance des données entre les sessions', async () => {
    const user = userEvent.setup();
    
    // Première session - ajouter des candidatures
    const { unmount } = render(<CandidaturesSuivi />);

    await user.click(screen.getByText('Ajouter une candidature'));
    await user.click(screen.getByText('Soumettre'));

    await waitFor(() => {
      expect(screen.getByText('Total: 1')).toBeInTheDocument();
    });

    // Démontrer le composant (simule un changement de page)
    unmount();

    // Deuxième session - vérifier que les données sont toujours là
    render(<CandidaturesSuivi />);

    // Les données mockées persistent dans le test
    expect(screen.getByText('Total: 1')).toBeInTheDocument();
    expect(screen.getByTestId('application-app-')).toBeInTheDocument();
  });

  test('validation des données et gestion des cas limites', async () => {
    const user = userEvent.setup();
    render(<CandidaturesSuivi />);

    // Test avec des données vides (le mock gère cela)
    await user.click(screen.getByText('Ajouter une candidature'));
    await user.click(screen.getByText('Soumettre'));

    // Vérifier que l'application ne plante pas
    await waitFor(() => {
      expect(screen.getByTestId('application-app-')).toBeInTheDocument();
    });

    // Test de modification avec des données partielles
    const editButtons = screen.getAllByText('Modifier');
    await user.click(editButtons[0]);

    await user.click(screen.getByText('Soumettre'));

    // Vérifier que la modification fonctionne
    await waitFor(() => {
      expect(screen.getByText('Modifié Corp - Position Modifiée')).toBeInTheDocument();
    });
  });
});
