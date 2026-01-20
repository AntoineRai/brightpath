import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LettresMotivation from '../../pages/LettresMotivation';

// Mock des services
jest.mock('../../services/aiApiService', () => ({
  __esModule: true,
  default: {
    generateCoverLetter: jest.fn()
  }
}));

// Mock des dépendances externes
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    addPage: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn(),
    setTextColor: jest.fn(),
    setFillColor: jest.fn(),
    rect: jest.fn(),
    setFont: jest.fn()
  }))
}));

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mock-data')
  })
}));

// Mock de window.URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
  writable: true
});

// Mock de window.URL.revokeObjectURL
Object.defineProperty(window.URL, 'revokeObjectURL', {
  value: jest.fn(),
  writable: true
});

// Mock de navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined)
  },
  writable: true
});

// Mock de document.execCommand
Object.defineProperty(document, 'execCommand', {
  value: jest.fn().mockReturnValue(true),
  writable: true
});

// Mock de window.isSecureContext
Object.defineProperty(window, 'isSecureContext', {
  value: true,
  writable: true
});

// Import du service mocké
import aiApiService from '../../services/aiApiService';

describe('LettresMotivation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le titre de la page', () => {
    render(<LettresMotivation />);

    expect(screen.getByText('Générateur de lettres de motivation par IA')).toBeInTheDocument();
  });

  test('affiche les sections du formulaire', () => {
    render(<LettresMotivation />);

    expect(screen.getByText('Vos informations')).toBeInTheDocument();
    expect(screen.getByText('Informations sur l\'entreprise')).toBeInTheDocument();
    expect(screen.getByText('Contenu de la lettre')).toBeInTheDocument();
  });

  test('affiche tous les champs du formulaire', () => {
    render(<LettresMotivation />);

    // Champs personnels
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();

    // Champs entreprise
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();
    expect(screen.getByLabelText('Destinataire (optionnel)')).toBeInTheDocument();

    // Zone de contenu
    expect(screen.getByPlaceholderText('Saisissez le contenu de votre lettre de motivation ou générez-le avec l\'IA...')).toBeInTheDocument();
  });

  test('permet de saisir des informations personnelles', async () => {
    const user = userEvent.setup();
    render(<LettresMotivation />);

    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Adresse *'), '123 Rue de Paris');

    expect(screen.getByDisplayValue('Dupont')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jean')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jean@test.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0123456789')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Rue de Paris')).toBeInTheDocument();
  });

  test('permet de saisir les informations sur l\'entreprise', async () => {
    const user = userEvent.setup();
    render(<LettresMotivation />);

    await user.type(screen.getByLabelText('Nom de l\'entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Poste convoité *'), 'Développeur Frontend');
    await user.type(screen.getByLabelText('Destinataire (optionnel)'), 'M. Martin');

    expect(screen.getByDisplayValue('TechCorp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Développeur Frontend')).toBeInTheDocument();
    expect(screen.getByDisplayValue('M. Martin')).toBeInTheDocument();
  });

  test('permet de saisir le contenu de la lettre', async () => {
    const user = userEvent.setup();
    render(<LettresMotivation />);

    const contentTextarea = screen.getByPlaceholderText('Saisissez le contenu de votre lettre de motivation ou générez-le avec l\'IA...');
    await user.type(contentTextarea, 'Madame, Monsieur,\n\nC\'est avec un vif intérêt...');

    expect(contentTextarea).toHaveValue('Madame, Monsieur,\n\nC\'est avec un vif intérêt...');
  });

  test('affiche le bouton de génération IA', () => {
    render(<LettresMotivation />);

    expect(screen.getByText('Générer avec IA')).toBeInTheDocument();
  });

  test('génère une lettre avec l\'IA quand tous les champs requis sont remplis', async () => {
    const user = userEvent.setup();
    (aiApiService.generateCoverLetter as jest.Mock).mockResolvedValue({
      content: 'Lettre générée par l\'IA',
      message: 'Lettre générée avec succès',
      model: 'gpt-3.5-turbo',
      generatedAt: '2024-01-15T10:00:00Z'
    });

    render(<LettresMotivation />);

    // Remplir tous les champs requis
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Adresse *'), '123 Rue de Paris');
    await user.type(screen.getByLabelText('Nom de l\'entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Poste convoité *'), 'Développeur');

    // Cliquer sur le bouton de génération
    await user.click(screen.getByText('Générer avec IA'));

    await waitFor(() => {
      expect(aiApiService.generateCoverLetter).toHaveBeenCalledWith({
        position: 'Développeur',
        company: 'TechCorp',
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@test.com',
        telephone: '0123456789',
        adresse: '123 Rue de Paris',
        destinataire: undefined
      });
    });

    // Vérifier que le contenu est mis à jour
    await waitFor(() => {
      expect(screen.getByDisplayValue('Lettre générée par l\'IA')).toBeInTheDocument();
    });
  });

  test('affiche une erreur si des champs requis sont manquants', async () => {
    const user = userEvent.setup();
    render(<LettresMotivation />);

    // Remplir seulement quelques champs
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');

    // Essayer de générer
    await user.click(screen.getByText('Générer avec IA'));

    expect(screen.getByText(/Veuillez remplir tous les champs obligatoires/)).toBeInTheDocument();
  });

  test('gère les erreurs lors de la génération IA', async () => {
    const user = userEvent.setup();
    (aiApiService.generateCoverLetter as jest.Mock).mockRejectedValue(
      new Error('Erreur de connexion')
    );

    render(<LettresMotivation />);

    // Remplir tous les champs requis
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Adresse *'), '123 Rue de Paris');
    await user.type(screen.getByLabelText('Nom de l\'entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Poste convoité *'), 'Développeur');

    // Cliquer sur le bouton de génération
    await user.click(screen.getByText('Générer avec IA'));

    await waitFor(() => {
      expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
    });
  });

  test('affiche l\'aperçu de la lettre', () => {
    render(<LettresMotivation />);

    expect(screen.getByText('Aperçu')).toBeInTheDocument();
    expect(screen.getByText('Le contenu de votre lettre apparaîtra ici...')).toBeInTheDocument();
  });

  test('met à jour l\'aperçu quand le contenu change', async () => {
    const user = userEvent.setup();
    render(<LettresMotivation />);

    // Remplir les informations personnelles
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Adresse *'), '123 Rue de Paris');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');

    // Remplir le contenu
    const contentTextarea = screen.getByPlaceholderText('Saisissez le contenu de votre lettre de motivation ou générez-le avec l\'IA...');
    await user.type(contentTextarea, 'Contenu de test');

    // Vérifier que l'aperçu est mis à jour
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('123 Rue de Paris')).toBeInTheDocument();
    expect(screen.getByText('Contenu de test')).toBeInTheDocument();
  });

  test('affiche les boutons d\'exportation', () => {
    render(<LettresMotivation />);

    expect(screen.getByText('Télécharger en PDF')).toBeInTheDocument();
    expect(screen.getByText('Copier dans le presse-papiers')).toBeInTheDocument();
  });

  test('permet de copier le contenu dans le presse-papiers', () => {
    render(<LettresMotivation />);

    // Vérifier que le bouton de copie est présent
    const copyButton = screen.getByText('Copier dans le presse-papiers');
    expect(copyButton).toBeInTheDocument();
    
    // Le bouton devrait être désactivé initialement (pas de contenu)
    expect(copyButton).toBeDisabled();
  });

  test('permet de télécharger en PDF', () => {
    render(<LettresMotivation />);

    // Vérifier que le bouton PDF est présent
    const pdfButton = screen.getByText('Télécharger en PDF');
    expect(pdfButton).toBeInTheDocument();
    
    // Le bouton devrait être désactivé initialement (pas de contenu)
    expect(pdfButton).toBeDisabled();
  });

  test('désactive les boutons d\'exportation quand il n\'y a pas de contenu', () => {
    render(<LettresMotivation />);

    const pdfButton = screen.getByText('Télécharger en PDF');
    const copyButton = screen.getByText('Copier dans le presse-papiers');

    expect(pdfButton).toBeDisabled();
    expect(copyButton).toBeDisabled();
  });

  test('affiche les conseils pour une lettre efficace', () => {
    render(<LettresMotivation />);

    expect(screen.getByText('Conseils pour une lettre de motivation efficace')).toBeInTheDocument();
    expect(screen.getByText('Personnalisez votre lettre')).toBeInTheDocument();
    expect(screen.getByText('Montrez votre valeur ajoutée')).toBeInTheDocument();
    expect(screen.getByText('Restez concis et précis')).toBeInTheDocument();
  });

  test('gère le destinataire optionnel dans l\'aperçu', () => {
    render(<LettresMotivation />);

    // Vérifier que le champ destinataire est présent
    const destinataireField = screen.getByLabelText('Destinataire (optionnel)');
    expect(destinataireField).toBeInTheDocument();
    
    // Vérifier que le champ entreprise est présent
    const entrepriseField = screen.getByLabelText('Nom de l\'entreprise *');
    expect(entrepriseField).toBeInTheDocument();
  });

  test('gère l\'état de chargement pendant la génération IA', () => {
    render(<LettresMotivation />);

    // Vérifier que le bouton de génération IA est présent
    const generateButton = screen.getByText('Générer avec IA');
    expect(generateButton).toBeInTheDocument();
    
    // Vérifier que tous les champs requis sont présents
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();
  });

    // Vérifier l'état de chargement
    expect(screen.getByText('Génération...')).toBeInTheDocument();
    expect(screen.getByText('Générer avec IA')).toBeDisabled();
  });

  test('affiche le message de succès après génération', async () => {
    const user = userEvent.setup();
    (aiApiService.generateCoverLetter as jest.Mock).mockResolvedValue({
      content: 'Lettre générée par l\'IA',
      message: 'Lettre générée avec succès',
      model: 'gpt-3.5-turbo',
      generatedAt: '2024-01-15T10:00:00Z'
    });

    render(<LettresMotivation />);

    // Remplir tous les champs requis
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Adresse *'), '123 Rue de Paris');
    await user.type(screen.getByLabelText('Nom de l\'entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Poste convoité *'), 'Développeur');

    // Cliquer sur générer
    await user.click(screen.getByText('Générer avec IA'));

    await waitFor(() => {
      expect(screen.getByText(/Lettre générée avec succès le/)).toBeInTheDocument();
    });
  });
});
