import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('Intégration CVGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('flux complet: création d\'un CV de A à Z', async () => {
    const user = userEvent.setup();
    (aiApiService.professionalizeText as jest.Mock).mockResolvedValue({
      content: 'Description optimisée par l\'IA',
      message: 'Texte professionnalisé avec succès'
    });

    render(<CVGenerator />);

    // Étape 1: Informations personnelles
    expect(screen.getByText('Étape 1 sur 4')).toBeInTheDocument();
    
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean.dupont@email.com');
    await user.type(screen.getByLabelText('Téléphone *'), '01 23 45 67 89');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur Frontend Senior');
    await user.type(screen.getByLabelText('Résumé professionnel'), 'Développeur passionné avec 5 ans d\'expérience');

    await user.click(screen.getByText('Suivant'));

    // Étape 2: Expérience professionnelle
    expect(screen.getByText('Étape 2 sur 4')).toBeInTheDocument();
    
    await user.type(screen.getByLabelText('Poste *'), 'Développeur Frontend');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Date de fin'), '2024-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Développement d\'applications React');

    // Optimiser la description avec l'IA
    const optimizeButton = screen.getByTitle('Optimiser avec l\'IA');
    await user.click(optimizeButton);

    await waitFor(() => {
      expect(aiApiService.professionalizeText).toHaveBeenCalledWith({
        originalText: 'Développement d\'applications React',
        context: 'Description d\'expérience professionnelle'
      });
    });

    await user.click(screen.getByText('Suivant'));

    // Étape 3: Compétences et formation
    expect(screen.getByText('Étape 3 sur 4')).toBeInTheDocument();
    
    // Ajouter des compétences
    const competenceInput = screen.getByPlaceholderText('Ajouter une compétence...');
    await user.type(competenceInput, 'Vue.js');
    await user.keyboard('{Enter}');
    await user.type(competenceInput, 'Node.js');
    await user.keyboard('{Enter}');

    // Ajouter une formation
    await user.type(screen.getByLabelText('Diplôme *'), 'Master en Informatique');
    await user.type(screen.getByLabelText('Établissement *'), 'Université de Paris');
    await user.type(screen.getByLabelText('Année de début *'), '2018');
    await user.type(screen.getByLabelText('Année de fin *'), '2020');

    await user.click(screen.getByText('Suivant'));

    // Étape 4: Personnalisation
    expect(screen.getByText('Étape 4 sur 4')).toBeInTheDocument();
    
    // Changer le modèle
    const modelSelect = screen.getByLabelText('Modèle de CV *');
    await user.selectOptions(modelSelect, 'classic');

    // Vérifier l'aperçu
    expect(screen.getByText('Aperçu du CV')).toBeInTheDocument();
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('Développeur Frontend Senior')).toBeInTheDocument();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();

    // Télécharger le PDF
    const downloadButton = screen.getByText('Télécharger en PDF');
    expect(downloadButton).toBeInTheDocument();
  });

  test('gestion de plusieurs expériences professionnelles', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Aller à l'étape 2
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Première expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur Junior');
    await user.type(screen.getByLabelText('Entreprise *'), 'StartupXYZ');
    await user.type(screen.getByLabelText('Date de début *'), '2018-01-01');
    await user.type(screen.getByLabelText('Date de fin'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Première expérience en développement');

    // Ajouter une deuxième expérience
    await user.click(screen.getByText('+ Ajouter une expérience'));

    const posteInputs = screen.getAllByLabelText('Poste *');
    const entrepriseInputs = screen.getAllByLabelText('Entreprise *');

    await user.type(posteInputs[1], 'Développeur Senior');
    await user.type(entrepriseInputs[1], 'BigCorp');
    await user.type(screen.getAllByLabelText('Date de début *')[1], '2020-01-01');
    await user.type(screen.getAllByLabelText('Date de fin')[1], '2024-01-01');
    await user.type(screen.getAllByLabelText('Description *')[1], 'Deuxième expérience en développement');

    await user.click(screen.getByText('Suivant'));

    // Vérifier que nous sommes à l'étape 3
    expect(screen.getByText('Étape 3 sur 4')).toBeInTheDocument();
  });

  test('gestion des compétences multiples', async () => {
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

    // Ajouter plusieurs compétences
    const competenceInput = screen.getByPlaceholderText('Ajouter une compétence...');
    const competences = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'];

    for (const competence of competences) {
      await user.type(competenceInput, competence);
      await user.keyboard('{Enter}');
    }

    // Vérifier que toutes les compétences sont affichées
    for (const competence of competences) {
      expect(screen.getByText(competence)).toBeInTheDocument();
    }

    // Supprimer une compétence
    const deleteButtons = screen.getAllByText('×');
    await user.click(deleteButtons[0]); // Supprimer React

    expect(screen.queryByText('React')).not.toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('changement de modèle et personnalisation des couleurs', async () => {
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

    // Tester différents modèles
    const modelSelect = screen.getByLabelText('Modèle de CV *');
    
    await user.selectOptions(modelSelect, 'classic');
    expect(modelSelect).toHaveValue('classic');

    await user.selectOptions(modelSelect, 'minimal');
    expect(modelSelect).toHaveValue('minimal');

    await user.selectOptions(modelSelect, 'professional');
    expect(modelSelect).toHaveValue('professional');

    // Vérifier que les inputs de couleur sont présents
    expect(screen.getByLabelText('Couleur principale')).toBeInTheDocument();
    expect(screen.getByLabelText('Couleur secondaire')).toBeInTheDocument();
    expect(screen.getByLabelText('Couleur d\'accent')).toBeInTheDocument();
  });

  test('optimisation IA de plusieurs descriptions', async () => {
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

    // Première expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur Junior');
    await user.type(screen.getByLabelText('Entreprise *'), 'StartupXYZ');
    await user.type(screen.getByLabelText('Date de début *'), '2018-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description 1 à optimiser');

    // Optimiser la première description
    const optimizeButtons = screen.getAllByTitle('Optimiser avec l\'IA');
    await user.click(optimizeButtons[0]);

    // Ajouter une deuxième expérience
    await user.click(screen.getByText('+ Ajouter une expérience'));

    const descriptionInputs = screen.getAllByLabelText('Description *');
    await user.type(descriptionInputs[1], 'Description 2 à optimiser');

    // Optimiser la deuxième description
    const newOptimizeButtons = screen.getAllByTitle('Optimiser avec l\'IA');
    await user.click(newOptimizeButtons[1]);

    await waitFor(() => {
      expect(aiApiService.professionalizeText).toHaveBeenCalledTimes(2);
    });
  });

  test('gestion des erreurs lors de l\'optimisation IA', async () => {
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

    // Essayer d'optimiser (cela devrait gérer l'erreur gracieusement)
    const optimizeButton = screen.getByTitle('Optimiser avec l\'IA');
    await user.click(optimizeButton);

    await waitFor(() => {
      expect(aiApiService.professionalizeText).toHaveBeenCalled();
    });

    // Vérifier que l'interface reste fonctionnelle
    expect(screen.getByText('Suivant')).toBeInTheDocument();
  });

  test('validation des champs requis à chaque étape', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Essayer de passer à l'étape 2 sans remplir les champs
    await user.click(screen.getByText('Suivant'));
    expect(screen.getByText('Étape 1 sur 4')).toBeInTheDocument();

    // Remplir partiellement les champs
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.click(screen.getByText('Suivant'));
    expect(screen.getByText('Étape 1 sur 4')).toBeInTheDocument();

    // Remplir tous les champs requis
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.click(screen.getByText('Suivant'));

    // Maintenant on devrait être à l'étape 2
    expect(screen.getByText('Étape 2 sur 4')).toBeInTheDocument();
  });

  test('persistance des données entre les étapes', async () => {
    const user = userEvent.setup();
    render(<CVGenerator />);

    // Étape 1: Remplir les informations personnelles
    await user.type(screen.getByLabelText('Prénom *'), 'Jean');
    await user.type(screen.getByLabelText('Nom *'), 'Dupont');
    await user.type(screen.getByLabelText('Email *'), 'jean@test.com');
    await user.type(screen.getByLabelText('Téléphone *'), '0123456789');
    await user.type(screen.getByLabelText('Titre du poste recherché *'), 'Développeur');
    await user.type(screen.getByLabelText('Résumé professionnel'), 'Résumé test');

    await user.click(screen.getByText('Suivant'));

    // Étape 2: Remplir une expérience
    await user.type(screen.getByLabelText('Poste *'), 'Développeur');
    await user.type(screen.getByLabelText('Entreprise *'), 'TechCorp');
    await user.type(screen.getByLabelText('Date de début *'), '2020-01-01');
    await user.type(screen.getByLabelText('Description *'), 'Description test');

    await user.click(screen.getByText('Suivant'));

    // Étape 3: Ajouter des compétences
    const competenceInput = screen.getByPlaceholderText('Ajouter une compétence...');
    await user.type(competenceInput, 'React');
    await user.keyboard('{Enter}');

    await user.click(screen.getByText('Suivant'));

    // Étape 4: Vérifier que toutes les données sont présentes dans l'aperçu
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('Développeur')).toBeInTheDocument();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();

    // Revenir à l'étape 1 et vérifier que les données sont conservées
    await user.click(screen.getByText('Précédent'));
    await user.click(screen.getByText('Précédent'));
    await user.click(screen.getByText('Précédent'));

    expect(screen.getByDisplayValue('Jean')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dupont')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jean@test.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0123456789')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Développeur')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Résumé test')).toBeInTheDocument();
  });
});
