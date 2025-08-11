import { getApiUrl, isDevelopment } from '../config/environment';

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// Configuration de l'API
const API_BASE_URL = getApiUrl();

class AuthService {
  // Récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Récupérer le refresh token depuis le localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Définir les tokens dans le localStorage
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Supprimer les tokens
  removeTokens(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  // Créer les headers avec le token d'authentification
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de connexion');
      }

      const data: AuthResponse = await response.json();
      this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      // Mode développement : fallback avec données mock si l'API n'est pas disponible
      if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('API backend non disponible, utilisation du mode mock pour le développement');
        return this.mockLogin(credentials);
      }
      
      throw error;
    }
  }

  // Mode mock pour le développement
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockResponse: AuthResponse = {
      message: 'Connexion réussie (mode mock)',
      user: {
        id: 1,
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: 'user'
      },
      tokens: {
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`
      }
    };
    
    return mockResponse;
  }

  // Inscription
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur d\'inscription');
      }

      const data: AuthResponse = await response.json();
      this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Mode développement : fallback avec données mock si l'API n'est pas disponible
      if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('API backend non disponible, utilisation du mode mock pour l\'inscription');
        return this.mockRegister(credentials);
      }
      
      throw error;
    }
  }

  // Mode mock pour l'inscription
  private async mockRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResponse: AuthResponse = {
      message: 'Inscription réussie (mode mock)',
      user: {
        id: Math.floor(Math.random() * 1000) + 1,
        email: credentials.email,
        name: credentials.name,
        role: 'user'
      },
      tokens: {
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`
      }
    };
    
    return mockResponse;
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      // Même si l'appel API échoue, on supprime les tokens localement
      this.removeTokens();
      
      if (!response.ok) {
        console.warn('Erreur lors de la déconnexion côté serveur');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // On supprime quand même les tokens localement
      this.removeTokens();
    }
  }

  // Vérifier si le token est valide
  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  }

  // Rafraîchir le token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.removeTokens();
        return false;
      }

      const data = await response.json();
      this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      return true;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.removeTokens();
      return false;
    }
  }

  // Récupérer les informations de l'utilisateur
  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      return null;
    }
  }
}

export default new AuthService(); 