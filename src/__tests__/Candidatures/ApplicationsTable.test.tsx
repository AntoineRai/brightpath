import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicationsTable from '../../components/ApplicationsTable';
import { Application } from '../../types';

// Mock data pour les tests
const mockApplications: Application[] = [
  {
    id: '1',
    company: 'TechCorp',
    position: 'Développeur Frontend',
    applicationDate: '2024-01-15',
    status: 'pending',
    notes: 'Candidature envoyée via LinkedIn',
    contactPerson: 'Jean Dupont',
    contactEmail: 'jean.dupont@techcorp.com',
    contactPhone: '01 23 45 67 89',
    location: 'Paris',
    salary: '45000€',
    jobDescription: 'Développement d\'applications React/TypeScript',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    company: 'StartupXYZ',
    position: 'Développeur Full Stack',
    applicationDate: '2024-01-20',
    status: 'interview',
    notes: 'Entretien prévu la semaine prochaine',
    contactPerson: 'Marie Martin',
    contactEmail: 'marie.martin@startupxyz.com',
    contactPhone: '01 98 76 54 32',
    location: 'Lyon',
    salary: '50000€',
    jobDescription: 'Développement full stack avec React et Node.js',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  }
];

const mockHandlers = {
  onView: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn()
};

describe('ApplicationsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche un message quand aucune candidature n\'est présente', () => {
    render(
      <ApplicationsTable
        applications={[]}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    expect(screen.getByText('Aucune candidature trouvée. Ajoutez votre première candidature !')).toBeInTheDocument();
  });

  test('affiche les candidatures dans la version mobile (cartes)', () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    // Vérifier que les entreprises sont affichées
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
    expect(screen.getByText('StartupXYZ')).toBeInTheDocument();

    // Vérifier que les postes sont affichés
    expect(screen.getByText('Développeur Frontend')).toBeInTheDocument();
    expect(screen.getByText('Développeur Full Stack')).toBeInTheDocument();

    // Vérifier que les dates sont formatées
    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    expect(screen.getByText('20/01/2024')).toBeInTheDocument();
  });

  test('affiche les badges de statut correctement', () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    expect(screen.getByText('En attente')).toBeInTheDocument();
    expect(screen.getByText('Entretien')).toBeInTheDocument();
  });

  test('appelle onView quand le bouton voir est cliqué', () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    const viewButtons = screen.getAllByTitle('Voir les détails');
    fireEvent.click(viewButtons[0]);

    expect(mockHandlers.onView).toHaveBeenCalledWith(mockApplications[0]);
  });

  test('appelle onEdit quand le bouton modifier est cliqué', () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    const editButtons = screen.getAllByTitle('Modifier');
    fireEvent.click(editButtons[0]);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockApplications[0]);
  });

  test('appelle onDelete quand le bouton supprimer est cliqué', () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    const deleteButtons = screen.getAllByTitle('Supprimer');
    fireEvent.click(deleteButtons[0]);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  test('affiche tous les badges de statut pour différents statuts', () => {
    const applicationsWithAllStatuses: Application[] = [
      { ...mockApplications[0], status: 'pending' },
      { ...mockApplications[1], status: 'interview' },
      { ...mockApplications[0], id: '3', status: 'rejected' },
      { ...mockApplications[1], id: '4', status: 'accepted' }
    ];

    render(
      <ApplicationsTable
        applications={applicationsWithAllStatuses}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    expect(screen.getAllByText('En attente')).toHaveLength(2);
    expect(screen.getByText('Entretien')).toBeInTheDocument();
    expect(screen.getByText('Refusé')).toBeInTheDocument();
    expect(screen.getByText('Accepté')).toBeInTheDocument();
  });

  test('formate correctement les dates', () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    // Les dates devraient être formatées selon la locale française
    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    expect(screen.getByText('20/01/2024')).toBeInTheDocument();
  });

  test('affiche "Date non spécifiée" pour une date vide', () => {
    const applicationWithoutDate = [
      { ...mockApplications[0], applicationDate: '' }
    ];

    render(
      <ApplicationsTable
        applications={applicationWithoutDate}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    expect(screen.getByText('Date non spécifiée')).toBeInTheDocument();
  });

  test('affiche "Date invalide" pour une date invalide', () => {
    const applicationWithInvalidDate = [
      { ...mockApplications[0], applicationDate: 'date-invalide' }
    ];

    render(
      <ApplicationsTable
        applications={applicationWithInvalidDate}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    expect(screen.getByText('Date invalide')).toBeInTheDocument();
  });

  test('affiche les en-têtes du tableau en version desktop', () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    // Les en-têtes du tableau devraient être présents
    expect(screen.getByText('Entreprise')).toBeInTheDocument();
    expect(screen.getByText('Poste')).toBeInTheDocument();
    expect(screen.getByText('Date de candidature')).toBeInTheDocument();
    expect(screen.getByText('Statut')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('gère les actions pour chaque candidature individuellement', () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    const viewButtons = screen.getAllByTitle('Voir les détails');
    const editButtons = screen.getAllByTitle('Modifier');
    const deleteButtons = screen.getAllByTitle('Supprimer');

    // Cliquer sur les boutons de la première candidature
    fireEvent.click(viewButtons[0]);
    fireEvent.click(editButtons[0]);
    fireEvent.click(deleteButtons[0]);

    expect(mockHandlers.onView).toHaveBeenCalledWith(mockApplications[0]);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockApplications[0]);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');

    // Cliquer sur les boutons de la deuxième candidature
    fireEvent.click(viewButtons[1]);
    fireEvent.click(editButtons[1]);
    fireEvent.click(deleteButtons[1]);

    expect(mockHandlers.onView).toHaveBeenCalledWith(mockApplications[1]);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockApplications[1]);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('2');
  });

  test('affiche le bon nombre de boutons d\'action', () => {
    render(
      <ApplicationsTable
        applications={mockApplications}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
      />
    );

    // Il devrait y avoir 2 candidatures, donc 2 boutons de chaque type
    // Le composant affiche à la fois la version mobile et desktop, donc 4 boutons au total
    expect(screen.getAllByTitle('Voir les détails')).toHaveLength(4);
    expect(screen.getAllByTitle('Modifier')).toHaveLength(4);
    expect(screen.getAllByTitle('Supprimer')).toHaveLength(4);
  });
});
