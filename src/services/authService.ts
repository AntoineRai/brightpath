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
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class AuthService {
  // Récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Définir le token dans le localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Supprimer le token
  removeToken(): void {
    localStorage.removeItem('authToken');
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
      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
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
      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      // Même si l'appel API échoue, on supprime le token localement
      this.removeToken();
      
      if (!response.ok) {
        console.warn('Erreur lors de la déconnexion côté serveur');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // On supprime quand même le token localement
      this.removeToken();
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