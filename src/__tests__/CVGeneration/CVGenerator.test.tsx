import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CVGenerator from '../../pages/CVGenerator';

// Mock des services
jest.mock('../../services/aiApiService', () => ({
  __esModule: true,
  default: {
    professionalizeText: jest.fn()
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

// Import du service mocké
import aiApiService from '../../services/aiApiService';

describe('CVGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le titre de la page', () => {
    render(<CVGenerator />);

    expect(screen.getByText('Générateur de CV')).toBeInTheDocument();
  });

  test('affiche les étapes de génération', () => {
    render(<CVGenerator />);

    expect(screen.getByText('Étape 1 sur 4')).toBeInTheDocument();
    expect(screen.getByText('Informations personnelles')).toBeInTheDocument();
  });

  test('affiche le formulaire des informations personnelles par défaut', () => {
    render(<CVGenerator />);

    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Titre du poste recherché *')).toBeInTheDocument();
    expect(screen.getByLabelText('Résumé professionnel')).toBeInTheDocument();
  });

  test('permet de naviguer vers l\'étape suivante', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Remplir les champs requis
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');

    // Cliquer sur Suivant
    await user.click(screen.getByText('Suivant'));

    // Vérifier que nous sommes à l'étape 2
    expect(screen.getByText('Étape 2 sur 4')).toBeInTheDocument();
    expect(screen.getByText('Expérience professionnelle')).toBeInTheDocument();
  });

  test('permet de revenir à l\'étape précédente', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 2
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Revenir à l'étape 1
    await user.click(screen.getByText('Précédent'));

    expect(screen.getByText('Étape 1 sur 4')).toBeInTheDocument();
    expect(screen.getByText('Informations personnelles')).toBeInTheDocument();
  });

  test('affiche l\'étape des expériences professionnelles', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 2
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    expect(screen.getByText('Expérience professionnelle')).toBeInTheDocument();
    expect(screen.getByLabelText('Poste *')).toBeInTheDocument();
    expect(screen.getByLabelText('Entreprise *')).toBeInTheDocument();
    expect(screen.getByLabelText('Date de début *')).toBeInTheDocument();
    expect(screen.getByLabelText('Date de fin')).toBeInTheDocument();
    expect(screen.getByLabelText('Description *')).toBeInTheDocument();
  });

  test('permet d\'ajouter une nouvelle expérience', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 2
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Ajouter une expérience
    await user.click(screen.getByText('+ Ajouter une expérience'));

    // Vérifier qu'il y a maintenant 2 sections d'expérience
    const experienceSections = screen.getAllByText('Expérience professionnelle');
    expect(experienceSections).toHaveLength(2);
  });

  test('permet de supprimer une expérience', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 2
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Ajouter une expérience
    await user.click(screen.getByText('+ Ajouter une expérience'));

    // Supprimer la deuxième expérience
    const deleteButtons = screen.getAllByText('Supprimer');
    await user.click(deleteButtons[1]);

    // Vérifier qu'il n'y a plus qu'une section d'expérience
    const experienceSections = screen.getAllByText('Expérience professionnelle');
    expect(experienceSections).toHaveLength(1);
  });

  test('affiche l\'étape des compétences et formation', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 3
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description test');
    await user.click(screen.getByText('Suivant'));

    expect(screen.getByText('Compétences et formation')).toBeInTheDocument();
    expect(screen.getByText('Compétences')).toBeInTheDocument();
    expect(screen.getByText('Formation')).toBeInTheDocument();
  });

  test('permet d\'ajouter des compétences', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 3
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description test');
    await user.click(screen.getByText('Suivant'));

    // Ajouter une compétence
    const competenceInput = screen.getByPlaceholderText('Ajouter une compétence...');
    await user.type(competenceInput, 'React');
    await user.keyboard('{Enter}');

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  test('permet de supprimer des compétences', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 3
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description test');
    await user.click(screen.getByText('Suivant'));

    // Supprimer une compétence existante
    const deleteButtons = screen.getAllByText('×');
    await user.click(deleteButtons[0]); // Supprimer JavaScript

    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
  });

  test('affiche l\'étape de personnalisation', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 4
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description test');
    await user.click(screen.getByText('Suivant'));

    // Aller à l'étape 4
    await user.click(screen.getByText('Suivant'));

    expect(screen.getByText('Personnalisation')).toBeInTheDocument();
    expect(screen.getByText('Modèle de CV')).toBeInTheDocument();
    expect(screen.getByText('Couleurs personnalisées')).toBeInTheDocument();
  });

  test('permet de changer le modèle de CV', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 4
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description test');
    await user.click(screen.getByText('Suivant'));

    // Aller à l'étape 4
    await user.click(screen.getByText('Suivant'));

    // Changer le modèle
    const modelSelect = screen.getByLabelText('Modèle de CV *');
    await user.selectOptions(modelSelect, 'classic');

    expect(modelSelect).toHaveValue('classic');
  });

  test('affiche le bouton de téléchargement PDF', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 4
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description test');
    await user.click(screen.getByText('Suivant'));

    // Aller à l'étape 4
    await user.click(screen.getByText('Suivant'));

    expect(screen.getByText('Télécharger en PDF')).toBeInTheDocument();
  });

  test('affiche l\'aperçu du CV', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 4
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description test');
    await user.click(screen.getByText('Suivant'));

    // Aller à l'étape 4
    await user.click(screen.getByText('Suivant'));

    expect(screen.getByText('Aperçu du CV')).toBeInTheDocument();
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('Développeur')).toBeInTheDocument();
  });

  test('permet d\'optimiser une description avec l\'IA', async () => {
    const user = userEvent.setup();
    (aiApiService.professionalizeText as jest.Mock).mockResolvedValue({
      content: 'Description optimisée par l\'IA',
      message: 'Texte professionnalisé avec succès'
    });

    render(<CVGenerator />);

    // Aller à l'étape 2
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une description
    await user.type(screen.getByLabelText('Description *'), 'Description test');

    // Cliquer sur le bouton d'optimisation
    const optimizeButton = screen.getByTitle('Optimiser avec l\'IA');
    await user.click(optimizeButton);

    await waitFor(() => {
      expect(aiApiService.professionalizeText).toHaveBeenCalledWith({
        originalText: 'Description test',
        context: 'Description d\'expérience professionnelle'
      });
    });
  });

  test('gère les erreurs lors de l\'optimisation IA', async () => {
    const user = userEvent.setup();
    (aiApiService.professionalizeText as jest.Mock).mockRejectedValue(
      new Error('Erreur d\'optimisation')
    );

    render(<CVGenerator />);

    // Aller à l'étape 2
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une description
    await user.type(screen.getByLabelText('Description *'), 'Description test');

    // Cliquer sur le bouton d'optimisation
    const optimizeButton = screen.getByTitle('Optimiser avec l\'IA');
    await user.click(optimizeButton);

    await waitFor(() => {
      expect(aiApiService.professionalizeText).toHaveBeenCalled();
    });
  });

  test('valide les champs requis avant de passer à l\'étape suivante', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Essayer de passer à l'étape suivante sans remplir les champs
    await user.click(screen.getByText('Suivant'));

    // Vérifier que nous sommes toujours à l'étape 1
    expect(screen.getByText('Étape 1 sur 4')).toBeInTheDocument();
  });

  test('permet de personnaliser les couleurs du CV', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 4
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Remplir une expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description test');
    await user.click(screen.getByText('Suivant'));

    // Aller à l'étape 4
    await user.click(screen.getByText('Suivant'));

    // Vérifier que les inputs de couleur sont présents
    expect(screen.getByLabelText('Couleur principale')).toBeInTheDocument();
    expect(screen.getByLabelText('Couleur secondaire')).toBeInTheDocument();
    expect(screen.getByLabelText('Couleur d\'accent')).toBeInTheDocument();
  });
});
