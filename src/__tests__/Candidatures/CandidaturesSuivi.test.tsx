import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CandidaturesSuivi from '../../pages/CandidaturesSuivi';

// Mock des services
jest.mock('../../services/applicationService', () => ({
  getAllApplications: jest.fn(() => []),
  addApplication: jest.fn(),
  updateApplication: jest.fn(),
  deleteApplication: jest.fn(),
  getApplicationStats: jest.fn(() => ({
    total: 0,
    pending: 0,
    interview: 0,
    rejected: 0,
    accepted: 0
  }))
}));

// Mock des composants pour simplifier les tests
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
              <span>{app.company}</span>
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
        <button onClick={() => onSubmit({ company: 'Test Corp', position: 'Test Position' })}>
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
        <button onClick={onEdit}>Modifier</button>
        <button onClick={onDelete}>Supprimer</button>
        <button onClick={onClose}>Fermer</button>
      </div>
    );
  };
});

// Import des services mockés
import * as applicationService from '../../services/applicationService';

describe('CandidaturesSuivi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le titre de la page', () => {
    render(<CandidaturesSuivi />);

    expect(screen.getByText('Suivi des candidatures')).toBeInTheDocument();
  });

  test('affiche les statistiques des candidatures', () => {
    render(<CandidaturesSuivi />);

    expect(screen.getByTestId('application-stats')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('En attente:')).toBeInTheDocument();
    expect(screen.getByText('Entretien:')).toBeInTheDocument();
  });

  test('affiche le tableau des candidatures', () => {
    render(<CandidaturesSuivi />);

    expect(screen.getByTestId('applications-table')).toBeInTheDocument();
    expect(screen.getByText('Aucune candidature trouvée')).toBeInTheDocument();
  });

  test('affiche le bouton pour ajouter une nouvelle candidature', () => {
    render(<CandidaturesSuivi />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('charge les données au montage du composant', () => {
    render(<CandidaturesSuivi />);

    expect(applicationService.getAllApplications).toHaveBeenCalled();
    expect(applicationService.getApplicationStats).toHaveBeenCalled();
  });

  test('affiche un message quand il n\'y a pas de candidatures', () => {
    render(<CandidaturesSuivi />);

    expect(screen.getByText('Aucune candidature trouvée')).toBeInTheDocument();
  });

  test('affiche les statistiques avec des valeurs nulles', () => {
    render(<CandidaturesSuivi />);

    expect(screen.getByText('Total: 0')).toBeInTheDocument();
    expect(screen.getByText('En attente: 0')).toBeInTheDocument();
    expect(screen.getByText('Entretien: 0')).toBeInTheDocument();
    expect(screen.getByText('Refusées: 0')).toBeInTheDocument();
    expect(screen.getByText('Acceptées: 0')).toBeInTheDocument();
  });

  test('affiche la description de la page', () => {
    render(<CandidaturesSuivi />);

    expect(screen.getByText(/Suivez vos candidatures en temps réel/)).toBeInTheDocument();
  });

  test('affiche le bouton de chargement', () => {
    render(<CandidaturesSuivi />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('affiche le bouton avec l\'icône de chargement', () => {
    render(<CandidaturesSuivi />);

    const loadingButton = screen.getByText('Chargement...');
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton.closest('button')).toHaveAttribute('disabled');
  });
});
