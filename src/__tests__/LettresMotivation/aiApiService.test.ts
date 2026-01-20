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

describe('aiApiService - Lettres de Motivation', () => {
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
      content: 'Madame, Monsieur,\n\nC\'est avec un vif intérêt que je vous soumets ma candidature...',
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

    test('gère les requêtes sans destinataire', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const requestWithoutDestinataire = { ...mockRequest };
      delete requestWithoutDestinataire.destinataire;

      await aiApiService.generateCoverLetter(requestWithoutDestinataire);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/ai/cover-letter',
        expect.objectContaining({
          body: JSON.stringify(requestWithoutDestinataire)
        })
      );
    });

    test('le mock génère un contenu cohérent avec les données fournies', async () => {
      (isDevelopment as jest.Mock).mockReturnValue(true);
      (fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const result = await aiApiService.generateCoverLetter(mockRequest);

      expect(result.content).toContain('Madame, Monsieur');
      expect(result.content).toContain(mockRequest.prenom);
      expect(result.content).toContain(mockRequest.nom);
      expect(result.content).toContain(mockRequest.position);
      expect(result.content).toContain(mockRequest.company);
      expect(result.content).toContain('candidature');
      expect(result.content).toContain('motivation');
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

    test('gère les erreurs de réseau spécifiques', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(aiApiService.generateCoverLetter({
        position: 'Test',
        company: 'Test',
        nom: 'Test',
        prenom: 'Test',
        email: 'test@test.com',
        telephone: '123456789',
        adresse: 'Test'
      })).rejects.toThrow('Impossible de se connecter au serveur');
    });
  });

  describe('Validation des données', () => {
    test('valide que tous les champs requis sont présents', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const validRequest = {
        position: 'Développeur',
        company: 'Entreprise',
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'email@test.com',
        telephone: '0123456789',
        adresse: 'Adresse complète'
      };

      await aiApiService.generateCoverLetter(validRequest);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/ai/cover-letter',
        expect.objectContaining({
          body: JSON.stringify(validRequest)
        })
      );
    });

    test('gère les champs optionnels', async () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const requestWithOptional = {
        position: 'Développeur',
        company: 'Entreprise',
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'email@test.com',
        telephone: '0123456789',
        adresse: 'Adresse complète',
        destinataire: 'M. Responsable RH'
      };

      await aiApiService.generateCoverLetter(requestWithOptional);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/ai/cover-letter',
        expect.objectContaining({
          body: JSON.stringify(requestWithOptional)
        })
      );
    });
  });
});
