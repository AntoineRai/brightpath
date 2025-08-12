import { isDevelopment } from '../config/environment';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

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
      const response = await fetch(`${API_BASE_URL}/api/ai/cover-letter`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      return await this.handleResponse<CoverLetterResponse>(response);
    } catch (error) {
      console.error('Erreur lors de la génération de la lettre de motivation:', error);
      
      // Mode développement : fallback avec données mock si l'API n'est pas disponible
      if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('API backend non disponible, utilisation du mode mock pour la génération IA');
        return this.mockGenerateCoverLetter(data);
      }
      
      throw error;
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
}

const aiApiService = new AiApiService();
export default aiApiService; 