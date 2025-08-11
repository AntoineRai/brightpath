// Configuration de l'API backend
export const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  // Endpoints d'authentification
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
      VERIFY: '/auth/verify'
    },
    CV: {
      GENERATE: '/cv/generate',
      LIST: '/cv',
      GET: '/cv/:id',
      UPDATE: '/cv/:id',
      DELETE: '/cv/:id'
    },
    LETTERS: {
      GENERATE: '/letters/generate',
      LIST: '/letters',
      GET: '/letters/:id',
      UPDATE: '/letters/:id',
      DELETE: '/letters/:id'
    },
    TEMPLATES: {
      CV: '/templates/cv',
      LETTERS: '/templates/letters'
    }
  },
  
  // Configuration des requêtes
  REQUEST_CONFIG: {
    TIMEOUT: 30000, // 30 secondes
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // 1 seconde
  },
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Fonction pour construire l'URL complète d'un endpoint
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour créer les headers d'authentification
export const createAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    ...API_CONFIG.DEFAULT_HEADERS
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}; 