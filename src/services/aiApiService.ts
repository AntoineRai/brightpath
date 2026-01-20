import { isDevelopment, getApiUrl } from '../config/environment';

const API_BASE_URL = getApiUrl();

interface CoverLetterRequest {
  position: string;
  company: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  destinataire?: string;
}

interface CoverLetterResponse {
  message: string;
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  generatedAt: string;
}

interface ProfessionalizeTextRequest {
  originalText: string;
  context: string;
}

interface ProfessionalizeTextResponse {
  message: string;
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  generatedAt: string;
}

class AiApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  }

  // Générer une lettre de motivation avec l'IA
  async generateCoverLetter(data: CoverLetterRequest): Promise<CoverLetterResponse> {
    try {
      console.log('🌐 Tentative de connexion à l\'API:', `${API_BASE_URL}/ai/cover-letter`);
      
      // Créer un AbortController pour gérer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes

      try {
        const response = await fetch(`${API_BASE_URL}/ai/cover-letter`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        return await this.handleResponse<CoverLetterResponse>(response);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la lettre de motivation:', error);
      
      // Gestion spécifique des erreurs de réseau
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('🌐 Erreur de connexion réseau détectée');
        
        // En mode développement ou si l'API n'est pas disponible, utiliser le mock
        if (isDevelopment()) {
          console.warn('🔄 Utilisation du mode mock pour la génération IA');
          return this.mockGenerateCoverLetter(data);
        } else {
          throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.');
        }
      }
      
      // Gestion des erreurs de timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
      }
      
      // Autres erreurs
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la génération: ${error.message}`);
      }
      
      throw new Error('Une erreur inattendue s\'est produite. Veuillez réessayer.');
    }
  }

  // Mock pour le mode développement
  private mockGenerateCoverLetter(data: CoverLetterRequest): Promise<CoverLetterResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockContent = `${data.prenom} ${data.nom}
${data.adresse}
${data.email}
${data.telephone}

[Date]

${data.destinataire ? `${data.destinataire}\n` : ''}${data.company}

Objet : Candidature au poste de ${data.position}

Madame, Monsieur,

C'est avec un vif intérêt que je vous soumets ma candidature au poste de ${data.position} au sein de ${data.company}, entreprise dont la réputation d'excellence et d'innovation n'est plus à faire.

Actuellement en recherche d'opportunités professionnelles stimulantes, je possède une solide expérience dans le développement web et les technologies modernes qui me permettrait d'apporter une réelle valeur ajoutée à votre équipe.

Particulièrement attiré(e) par la culture d'innovation de ${data.company} et les défis techniques que représente ce poste, je suis convaincu(e) que mes compétences en développement full-stack, ma capacité d'adaptation et ma passion pour les nouvelles technologies seraient un atout pour répondre aux enjeux que vous rencontrez.

Mon expérience dans la conception et le développement d'applications web performantes, couplée à ma capacité à travailler en équipe et à m'adapter rapidement aux nouvelles technologies, me permettrait de contribuer efficacement aux projets de votre entreprise.

Je reste à votre disposition pour un entretien au cours duquel je pourrai vous démontrer ma motivation et vous apporter plus de détails sur mon parcours professionnel et mes réalisations.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${data.prenom} ${data.nom}`;

        resolve({
          message: "Lettre de motivation générée avec succès (mode mock)",
          content: mockContent,
          usage: {
            prompt_tokens: 245,
            completion_tokens: 312,
            total_tokens: 557
          },
          model: "gpt-3.5-turbo (mock)",
          generatedAt: new Date().toISOString()
        });
      }, 2000); // Simulation d'un délai de génération
    });
  }

  // Professionnaliser un texte avec l'IA
  async professionalizeText(data: ProfessionalizeTextRequest): Promise<ProfessionalizeTextResponse> {
    try {
      console.log('🌐 Tentative de professionnalisation du texte:', `${API_BASE_URL}/ai/professionalize-text`);
      
      // Créer un AbortController pour gérer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes

      try {
        const response = await fetch(`${API_BASE_URL}/ai/professionalize-text`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        return await this.handleResponse<ProfessionalizeTextResponse>(response);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la professionnalisation du texte:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('🌐 Erreur de connexion réseau détectée');
        
        if (isDevelopment()) {
          console.warn('🔄 Utilisation du mode mock pour la professionnalisation');
          return this.mockProfessionalizeText(data);
        } else {
          throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.');
        }
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
      }
      
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la professionnalisation: ${error.message}`);
      }
      
      throw new Error('Une erreur inattendue s\'est produite. Veuillez réessayer.');
    }
  }

  // Mock pour la professionnalisation de texte
  private mockProfessionalizeText(data: ProfessionalizeTextRequest): Promise<ProfessionalizeTextResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulation d'une professionnalisation basique
        const professionalizedText = data.originalText
          .replace(/bosser/g, 'travailler')
          .replace(/avoir l'occasion de/g, 'avoir l\'opportunité de')
          .replace(/plusieurs domaines/g, 'divers domaines')
          .replace(/j'ai eu/g, 'j\'ai pu')
          .replace(/dans/g, 'au sein de');

        resolve({
          message: "Texte professionnalisé avec succès (mode mock)",
          content: professionalizedText,
          usage: {
            prompt_tokens: 45,
            completion_tokens: 28,
            total_tokens: 73
          },
          model: "gpt-3.5-turbo (mock)",
          generatedAt: new Date().toISOString()
        });
      }, 1500); // Simulation d'un délai de génération
    });
  }
}

const aiApiService = new AiApiService();
export default aiApiService; 