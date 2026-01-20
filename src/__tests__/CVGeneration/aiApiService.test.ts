import aiApiService from '../../services/aiApiService';
import { isDevelopment } from '../../config/environment';

// Mock de l'environnement
jest.mock('../../config/environment', () => ({
  isDevelopment: jest.fn(),
  getApiUrl: jest.fn(() => 'http://localhost:3001/api')
}));

// Mock de fetch
global.fetch = jest.fn();

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('aiApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    localStorageMock.getItem.mockClear();
  });

  describe('generateCoverLetter', () => {
    const mockRequest = {
      position: 'Développeur Frontend',
      company: 'TechCorp',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      telephone: '01 23 45 67 89',
      adresse: '123 Rue de Paris, 75001 Paris',
      destinataire: 'M. Martin'
    };

    const mockResponse = {
      message: 'Lettre générée avec succès',
      content: 'Contenu de la lettre...',
      usage: {
        prompt_tokens: 245,
        completion_tokens: 312,
        total_tokens: 557
      },
      model: 'gpt-3.5-turbo',
      generatedAt: '2024-01-15T10:00:00Z'
    };

    test('génère une lettre de motivation avec succès', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await aiApiService.generateCoverLetter(mockRequest);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/ai/cover-letter',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          },
          body: JSON.stringify(mockRequest)
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('utilise le mock en mode développement quand l\'API n\'est pas disponible', async () => {
      (isDevelopment as jest.Mock).mockReturnValue(true);
      (fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const result = await aiApiService.generateCoverLetter(mockRequest);

      expect(result.message).toContain('mode mock');
      expect(result.content).toContain(mockRequest.prenom);
      expect(result.content).toContain(mockRequest.nom);
      expect(result.content).toContain(mockRequest.position);
      expect(result.content).toContain(mockRequest.company);
      expect(result.model).toContain('mock');
    });

    test('lance une erreur en mode production quand l\'API n\'est pas disponible', async () => {
      (isDevelopment as jest.Mock).mockReturnValue(false);
      (fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(aiApiService.generateCoverLetter(mockRequest))
        .rejects.toThrow('Impossible de se connecter au serveur');
    });

    test('gère les erreurs HTTP', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Erreur serveur' })
      });

      await expect(aiApiService.generateCoverLetter(mockRequest))
        .rejects.toThrow('Erreur serveur');
    });

    test('gère les timeouts', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('AbortError'));

      await expect(aiApiService.generateCoverLetter(mockRequest))
        .rejects.toThrow('La requête a pris trop de temps');
    });

    test('n\'inclut pas le token d\'autorisation si non disponible', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await aiApiService.generateCoverLetter(mockRequest);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/ai/cover-letter',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
    });
  });

  describe('professionalizeText', () => {
    const mockRequest = {
      originalText: 'J\'ai bossé sur plusieurs projets dans différents domaines',
      context: 'Description d\'expérience professionnelle'
    };

    const mockResponse = {
      message: 'Texte professionnalisé avec succès',
      content: 'J\'ai travaillé sur divers projets au sein de différents domaines',
      usage: {
        prompt_tokens: 45,
        completion_tokens: 28,
        total_tokens: 73
      },
      model: 'gpt-3.5-turbo',
      generatedAt: '2024-01-15T10:00:00Z'
    };

    test('professionnalise un texte avec succès', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await aiApiService.professionalizeText(mockRequest);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/ai/professionalize-text',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          },
          body: JSON.stringify(mockRequest)
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('utilise le mock en mode développement pour la professionnalisation', async () => {
      (isDevelopment as jest.Mock).mockReturnValue(true);
      (fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const result = await aiApiService.professionalizeText(mockRequest);

      expect(result.message).toContain('mode mock');
      expect(result.content).toContain('travaillé');
      expect(result.content).toContain('divers');
      expect(result.model).toContain('mock');
    });

    test('lance une erreur en mode production pour la professionnalisation', async () => {
      (isDevelopment as jest.Mock).mockReturnValue(false);
      (fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(aiApiService.professionalizeText(mockRequest))
        .rejects.toThrow('Impossible de se connecter au serveur');
    });

    test('gère les erreurs HTTP pour la professionnalisation', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Requête invalide' })
      });

      await expect(aiApiService.professionalizeText(mockRequest))
        .rejects.toThrow('Requête invalide');
    });

    test('gère les timeouts pour la professionnalisation', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('AbortError'));

      await expect(aiApiService.professionalizeText(mockRequest))
        .rejects.toThrow('La requête a pris trop de temps');
    });

    test('le mock de professionnalisation remplace les mots familiers', async () => {
      (isDevelopment as jest.Mock).mockReturnValue(true);
      (fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const result = await aiApiService.professionalizeText({
        originalText: 'J\'ai bossé dans plusieurs domaines et j\'ai eu l\'occasion de bosser sur plusieurs projets',
        context: 'CV'
      });

      expect(result.content).toContain('travaillé');
      expect(result.content).toContain('divers');
      expect(result.content).toContain('opportunité');
      expect(result.content).toContain('au sein de');
    });
  });

  describe('Gestion des erreurs', () => {
    test('gère les erreurs JSON invalides', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error('JSON invalide'); }
      });

      await expect(aiApiService.generateCoverLetter({
        position: 'Test',
        company: 'Test',
        nom: 'Test',
        prenom: 'Test',
        email: 'test@test.com',
        telephone: '123456789',
        adresse: 'Test'
      })).rejects.toThrow('Erreur HTTP: 500');
    });

    test('gère les erreurs inattendues', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Erreur inattendue'));

      await expect(aiApiService.generateCoverLetter({
        position: 'Test',
        company: 'Test',
        nom: 'Test',
        prenom: 'Test',
        email: 'test@test.com',
        telephone: '123456789',
        adresse: 'Test'
      })).rejects.toThrow('Erreur lors de la génération: Erreur inattendue');
    });
  });
});
