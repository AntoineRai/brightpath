import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicationDetail from '../../components/ApplicationDetail';
import { Application } from '../../types';

// Mock data pour les tests
const mockApplication: Application = {
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
};

const mockHandlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onClose: jest.fn()
};

describe('ApplicationDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche correctement les informations de base de la candidature', () => {
    render(
      <ApplicationDetail
        application={mockApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('TechCorp - Développeur Frontend')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('45000€')).toBeInTheDocument();
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('jean.dupont@techcorp.com')).toBeInTheDocument();
    expect(screen.getByText('01 23 45 67 89')).toBeInTheDocument();
  });

  test('affiche le badge de statut "En attente" pour le statut pending', () => {
    render(
      <ApplicationDetail
        application={mockApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('En attente')).toBeInTheDocument();
  });

  test('affiche le badge de statut "Entretien" pour le statut interview', () => {
    const interviewApplication = { ...mockApplication, status: 'interview' as const };
    
    render(
      <ApplicationDetail
        application={interviewApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('Entretien')).toBeInTheDocument();
  });

  test('affiche le badge de statut "Refusé" pour le statut rejected', () => {
    const rejectedApplication = { ...mockApplication, status: 'rejected' as const };
    
    render(
      <ApplicationDetail
        application={rejectedApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('Refusé')).toBeInTheDocument();
  });

  test('affiche le badge de statut "Accepté" pour le statut accepted', () => {
    const acceptedApplication = { ...mockApplication, status: 'accepted' as const };
    
    render(
      <ApplicationDetail
        application={acceptedApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('Accepté')).toBeInTheDocument();
  });

  test('affiche la description du poste quand elle est fournie', () => {
    render(
      <ApplicationDetail
        application={mockApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('Description du poste')).toBeInTheDocument();
    expect(screen.getByText('Développement d\'applications React/TypeScript')).toBeInTheDocument();
  });

  test('affiche les notes quand elles sont fournies', () => {
    render(
      <ApplicationDetail
        application={mockApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Candidature envoyée via LinkedIn')).toBeInTheDocument();
  });

  test('n\'affiche pas les champs optionnels quand ils sont vides', () => {
    const minimalApplication = {
      ...mockApplication,
      location: undefined,
      salary: undefined,
      contactPerson: undefined,
      contactEmail: undefined,
      contactPhone: undefined,
      jobDescription: undefined,
      notes: undefined
    };

    render(
      <ApplicationDetail
        application={minimalApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.queryByText('Lieu')).not.toBeInTheDocument();
    expect(screen.queryByText('Salaire proposé')).not.toBeInTheDocument();
    expect(screen.queryByText('Personne de contact')).not.toBeInTheDocument();
    expect(screen.queryByText('Email de contact')).not.toBeInTheDocument();
    expect(screen.queryByText('Téléphone de contact')).not.toBeInTheDocument();
    expect(screen.queryByText('Description du poste')).not.toBeInTheDocument();
    expect(screen.queryByText('Notes')).not.toBeInTheDocument();
  });

  test('formate correctement les dates', () => {
    render(
      <ApplicationDetail
        application={mockApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    // La date devrait être formatée selon la locale française
    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
  });

  test('affiche "Date non spécifiée" pour une date vide', () => {
    const applicationWithoutDate = { ...mockApplication, applicationDate: '' };
    
    render(
      <ApplicationDetail
        application={applicationWithoutDate}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('Date non spécifiée')).toBeInTheDocument();
  });

  test('affiche "Date invalide" pour une date invalide', () => {
    const applicationWithInvalidDate = { ...mockApplication, applicationDate: 'date-invalide' };
    
    render(
      <ApplicationDetail
        application={applicationWithInvalidDate}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    expect(screen.getByText('Date invalide')).toBeInTheDocument();
  });

  test('appelle onEdit quand le bouton Modifier est cliqué', () => {
    render(
      <ApplicationDetail
        application={mockApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    fireEvent.click(screen.getByText('Modifier'));
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
  });

  test('appelle onDelete quand le bouton Supprimer est cliqué', () => {
    render(
      <ApplicationDetail
        application={mockApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    fireEvent.click(screen.getByText('Supprimer'));
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
  });

  test('appelle onClose quand le bouton de fermeture est cliqué', () => {
    render(
      <ApplicationDetail
        application={mockApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: '' }); // Le bouton X n'a pas de texte
    fireEvent.click(closeButton);
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });

  test('rend un lien email cliquable pour l\'email de contact', () => {
    render(
      <ApplicationDetail
        application={mockApplication}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onClose={mockHandlers.onClose}
      />
    );

    const emailLink = screen.getByText('jean.dupont@techcorp.com');
    expect(emailLink).toHaveAttribute('href', 'mailto:jean.dupont@techcorp.com');
  });
});
