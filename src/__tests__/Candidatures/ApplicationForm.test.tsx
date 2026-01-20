import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ApplicationForm from '../../components/ApplicationForm';
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
  onSubmit: jest.fn(),
  onCancel: jest.fn()
};

describe('ApplicationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le titre "Ajouter une candidature" en mode création', () => {
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(screen.getByText('Ajouter une candidature')).toBeInTheDocument();
  });

  test('affiche le titre "Modifier la candidature" en mode édition', () => {
    render(
      <ApplicationForm
        application={mockApplication}
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(screen.getByText('Modifier la candidature')).toBeInTheDocument();
  });

  test('remplit le formulaire avec les données existantes en mode édition', () => {
    render(
      <ApplicationForm
        application={mockApplication}
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(screen.getByDisplayValue('TechCorp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Développeur Frontend')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Paris')).toBeInTheDocument();
    expect(screen.getByDisplayValue('45000€')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jean.dupont@techcorp.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('01 23 45 67 89')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Développement d\'applications React/TypeScript')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Candidature envoyée via LinkedIn')).toBeInTheDocument();
  });

  test('initialise le formulaire avec des valeurs par défaut en mode création', () => {
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    const today = new Date().toISOString().split('T')[0];
    expect(screen.getByDisplayValue(today)).toBeInTheDocument();
    expect(screen.getByDisplayValue('pending')).toBeInTheDocument();
  });

  test('met à jour les valeurs du formulaire quand l\'utilisateur tape', async () => {
    const user = userEvent.setup();
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    const companyInput = screen.getByLabelText('Entreprise *');
    await user.clear(companyInput);
    await user.type(companyInput, 'Nouvelle Entreprise');

    expect(companyInput).toHaveValue('Nouvelle Entreprise');
  });

  test('appelle onSubmit avec les données du formulaire quand il est soumis', async () => {
    const user = userEvent.setup();
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    // Remplir les champs requis
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Date de candidature *'), '2024-01-15');

    // Soumettre le formulaire
    await user.click(screen.getByText('Ajouter'));

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        company: 'TechCorp',
        position: 'Développeur',
        applicationDate: '2024-01-15',
        status: 'pending'
      })
    );
  });

  test('appelle onCancel quand le bouton Annuler est cliqué', async () => {
    const user = userEvent.setup();
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    await user.click(screen.getByText('Annuler'));
    expect(mockHandlers.onCancel).toHaveBeenCalledTimes(1);
  });

  test('affiche "Mettre à jour" sur le bouton de soumission en mode édition', () => {
    render(
      <ApplicationForm
        application={mockApplication}
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(screen.getByText('Mettre à jour')).toBeInTheDocument();
  });

  test('affiche "Ajouter" sur le bouton de soumission en mode création', () => {
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(screen.getByText('Ajouter')).toBeInTheDocument();
  });

  test('valide que les champs requis sont présents', () => {
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(screen.getByLabelText('Entreprise *')).toBeRequired();
    expect(screen.getByLabelText('Poste *')).toBeRequired();
    expect(screen.getByLabelText('Date de candidature *')).toBeRequired();
    expect(screen.getByLabelText('Statut *')).toBeRequired();
  });

  test('affiche une alerte pour une date invalide', async () => {
    const user = userEvent.setup();
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    // Remplir les champs requis
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    
    // Entrer une date invalide
    const dateInput = screen.getByLabelText('Date de candidature *');
    await user.clear(dateInput);
    await user.type(dateInput, 'date-invalide');

    // Soumettre le formulaire
    await user.click(screen.getByText('Ajouter'));

    expect(alertMock).toHaveBeenCalledWith('Veuillez entrer une date valide');
    expect(mockHandlers.onSubmit).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  test('permet de changer le statut via le select', async () => {
    const user = userEvent.setup();
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    const statusSelect = screen.getByLabelText('Statut *');
    await user.selectOptions(statusSelect, 'interview');

    expect(statusSelect).toHaveValue('interview');
  });

  test('affiche toutes les options de statut', () => {
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    const statusSelect = screen.getByLabelText('Statut *');
    expect(statusSelect).toHaveDisplayValue('En attente');
    
    const options = Array.from(statusSelect.querySelectorAll('option'));
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveValue('pending');
    expect(options[1]).toHaveValue('interview');
    expect(options[2]).toHaveValue('rejected');
    expect(options[3]).toHaveValue('accepted');
  });

  test('gère les champs optionnels correctement', async () => {
    const user = userEvent.setup();
    render(
      <ApplicationForm
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    // Remplir les champs requis
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Date de candidature *'), '2024-01-15');

    // Remplir les champs optionnels
    await user.type(screen.getByLabelText('Lieu'), 'Paris');
    await user.type(screen.getByLabelText('Salaire proposé'), '45000€');
    await user.type(screen.getByLabelText('Personne de contact'), 'Jean Dupont');
    await user.type(screen.getByLabelText('Email de contact'), 'jean@techcorp.com');
    await user.type(screen.getByLabelText('Téléphone de contact'), '01 23 45 67 89');
    await user.type(screen.getByLabelText('Description du poste'), 'Description du poste');
    await user.type(screen.getByLabelText('Notes'), 'Notes personnelles');

    // Soumettre le formulaire
    await user.click(screen.getByText('Ajouter'));

    expect(mockHandlers.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        location: 'Paris',
        salary: '45000€',
        contactPerson: 'Jean Dupont',
        contactEmail: 'jean@techcorp.com',
        contactPhone: '01 23 45 67 89',
        jobDescription: 'Description du poste',
        notes: 'Notes personnelles'
      })
    );
  });

  test('préserve les valeurs des champs optionnels lors de la modification', () => {
    render(
      <ApplicationForm
        application={mockApplication}
        onSubmit={mockHandlers.onSubmit}
        onCancel={mockHandlers.onCancel}
      />
    );

    expect(screen.getByDisplayValue('Paris')).toBeInTheDocument();
    expect(screen.getByDisplayValue('45000€')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jean.dupont@techcorp.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('01 23 45 67 89')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Développement d\'applications React/TypeScript')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Candidature envoyée via LinkedIn')).toBeInTheDocument();
  });
});
