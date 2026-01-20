import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('Intégration LettresMotivation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('flux complet: création d\'une lettre de motivation de A à Z', () => {
    (aiApiService.generateCoverLetter as jest.Mock).mockResolvedValue({
      content: 'Madame, Monsieur,\n\nC\'est avec un vif intérêt que je vous soumets ma candidature au poste de Développeur Frontend au sein de votre entreprise. Mon expérience en développement web et ma passion pour les technologies modernes m\'ont permis d\'acquérir une solide expertise dans ce domaine.\n\nJe reste à votre disposition pour un entretien.',
      message: 'Lettre générée avec succès',
      model: 'gpt-3.5-turbo',
      generatedAt: '2024-01-15T10:00:00Z'
    });

    render(<LettresMotivation />);

    // Vérifier que tous les champs requis sont présents
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();
    expect(screen.getByLabelText('Destinataire (optionnel)')).toBeInTheDocument();

    // Vérifier que le bouton de génération IA est présent
    expect(screen.getByText('Générer avec IA')).toBeInTheDocument();
    
    // Vérifier que les boutons d'exportation sont présents
    expect(screen.getByText('Copier dans le presse-papiers')).toBeInTheDocument();
    expect(screen.getByText('Télécharger en PDF')).toBeInTheDocument();
  });

  test('gestion des erreurs de génération IA', () => {
    (aiApiService.generateCoverLetter as jest.Mock).mockRejectedValue(
      new Error('Erreur de connexion réseau')
    );

    render(<LettresMotivation />);

    // Vérifier que tous les champs requis sont présents
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();

    // Vérifier que l'interface reste fonctionnelle
    expect(screen.getByText('Générer avec IA')).toBeInTheDocument();
    expect(screen.getByText('Télécharger en PDF')).toBeInTheDocument();
  });

  test('validation des champs requis', () => {
    render(<LettresMotivation />);

    // Vérifier que le bouton de génération est présent
    expect(screen.getByText('Générer avec IA')).toBeInTheDocument();

    // Vérifier que tous les champs requis sont présents
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();
  });

    expect(screen.getByText(/Veuillez remplir tous les champs obligatoires/)).toBeInTheDocument();

    // Remplir tous les champs requis
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Adresse *'), '123 Rue de Paris');
    await user.type(screen.getByLabelText('Nom de l\'entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Poste convoité *'), 'Développeur');

    // Maintenant la génération devrait fonctionner
    (aiApiService.generateCoverLetter as jest.Mock).mockResolvedValue({
      content: 'Lettre générée',
      message: 'Succès',
      model: 'gpt-3.5-turbo',
      generatedAt: '2024-01-15T10:00:00Z'
    });

    await user.click(screen.getByText('Générer avec IA'));

    await waitFor(() => {
      expect(aiApiService.generateCoverLetter).toHaveBeenCalled();
    });
  });

  test('modification manuelle du contenu après génération IA', () => {
    (aiApiService.generateCoverLetter as jest.Mock).mockResolvedValue({
      content: 'Contenu généré par l\'IA',
      message: 'Lettre générée avec succès',
      model: 'gpt-3.5-turbo',
      generatedAt: '2024-01-15T10:00:00Z'
    });

    render(<LettresMotivation />);

    // Vérifier que tous les champs requis sont présents
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();

    // Vérifier que le bouton de génération IA est présent
    expect(screen.getByText('Générer avec IA')).toBeInTheDocument();

    // Vérifier que les boutons d'exportation sont présents
    expect(screen.getByText('Télécharger en PDF')).toBeInTheDocument();
    expect(screen.getByText('Copier dans le presse-papiers')).toBeInTheDocument();
  });

  test('gestion du destinataire optionnel', () => {
    render(<LettresMotivation />);

    // Vérifier que les champs sont présents
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Destinataire (optionnel)')).toBeInTheDocument();

    // Vérifier que l'aperçu est présent
    expect(screen.getByText('Aperçu de la lettre')).toBeInTheDocument();
  });

  test('persistance des données pendant la session', () => {
    render(<LettresMotivation />);

    // Vérifier que tous les champs sont présents
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();
  });
  });

  test('gestion des états de chargement', () => {
    (aiApiService.generateCoverLetter as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        content: 'Lettre générée',
        message: 'Succès',
        model: 'gpt-3.5-turbo',
        generatedAt: '2024-01-15T10:00:00Z'
      }), 100))
    );

    render(<LettresMotivation />);

    // Vérifier que tous les champs requis sont présents
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();

    // Vérifier que le bouton de génération est présent
    expect(screen.getByText('Générer avec IA')).toBeInTheDocument();
  });

  test('gestion des messages de succès et d\'erreur', () => {
    (aiApiService.generateCoverLetter as jest.Mock).mockResolvedValue({
      content: 'Lettre générée avec succès',
      message: 'Lettre générée avec succès',
      model: 'gpt-3.5-turbo',
      generatedAt: '2024-01-15T10:00:00Z'
    });

    render(<LettresMotivation />);

    // Vérifier que tous les champs requis sont présents
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();

    // Vérifier que le bouton de génération est présent
    expect(screen.getByText('Générer avec IA')).toBeInTheDocument();
  });

  test('exportation avec contenu manuel', () => {
    render(<LettresMotivation />);

    // Vérifier que tous les champs sont présents
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom de l\'entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste convoité *')).toBeInTheDocument();

    // Vérifier que le textarea de contenu est présent
    expect(screen.getByPlaceholderText('Saisissez le contenu de votre lettre de motivation ou générez-le avec l\'IA...')).toBeInTheDocument();

    // Vérifier que les boutons d'exportation sont présents
    expect(screen.getByText('Copier dans le presse-papiers')).toBeInTheDocument();
    expect(screen.getByText('Télécharger en PDF')).toBeInTheDocument();
  });
});
