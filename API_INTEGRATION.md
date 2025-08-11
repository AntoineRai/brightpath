# 🔗 Intégration API Backend - BrightPath

## 📋 Vue d'Ensemble

Ce document décrit l'intégration du frontend React avec l'API backend BrightPath qui tourne sur `localhost:3001`.

---

## 🏗️ Architecture de l'Intégration

### **Configuration API**
- **URL de base** : `http://localhost:3001/api`
- **Authentification** : JWT avec access token + refresh token
- **Format** : JSON pour toutes les requêtes/réponses
- **CORS** : Configuré pour `http://localhost:3000`

### **Structure des Services**
```
src/
├── services/
│   └── authService.ts          # Service d'authentification
├── config/
│   └── api.ts                  # Configuration API
├── contexts/
│   └── AuthContext.tsx         # Contexte d'authentification
└── hooks/
    └── useAuthService.ts       # Hook pour les services d'auth
```

---

## 🔐 Authentification

### **Format de Réponse de l'API**

#### **Connexion Réussie**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "email": "admin@brightpath.com",
    "name": "Admin",
    "role": "admin"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Erreur de Connexion**
```json
{
  "message": "Email ou mot de passe incorrect",
  "error": "INVALID_CREDENTIALS"
}
```

### **Endpoints d'Authentification**

| Méthode | Endpoint | Description | Headers Requis |
|---------|----------|-------------|----------------|
| `POST` | `/api/auth/login` | Connexion utilisateur | `Content-Type: application/json` |
| `POST` | `/api/auth/register` | Inscription utilisateur | `Content-Type: application/json` |
| `POST` | `/api/auth/logout` | Déconnexion | `Authorization: Bearer <token>` |
| `POST` | `/api/auth/refresh` | Rafraîchir le token | `Content-Type: application/json` |
| `GET` | `/api/auth/me` | Informations utilisateur | `Authorization: Bearer <token>` |

---

## 🛠️ Implémentation Frontend

### **1. Service d'Authentification**

```typescript
// src/services/authService.ts
import { buildApiUrl, createAuthHeaders } from '../config/api';

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

class AuthService {
  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(buildApiUrl('/auth/login'), {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur de connexion');
    }

    const data: AuthResponse = await response.json();
    this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  }

  // Gestion des tokens
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  removeTokens(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
}
```

### **2. Contexte d'Authentification**

```typescript
// src/contexts/AuthContext.tsx
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  // ... reste du contexte
};
```

### **3. Page de Connexion**

```typescript
// src/pages/Login.tsx
import authService from '../services/authService';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    if (isLogin) {
      // Appel à l'API de connexion
      const response = await authService.login({ email, password });
      
      // Connexion réussie
      login(
        response.tokens.accessToken,
        response.tokens.refreshToken,
        response.user
      );
      navigate('/');
    }
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  } finally {
    setLoading(false);
  }
};
```

---

## 🔄 Gestion des Tokens

### **Refresh Token Automatique**

```typescript
// src/services/authService.ts
async refreshToken(): Promise<boolean> {
  try {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    const response = await fetch(buildApiUrl('/auth/refresh'), {
      method: 'POST',
      headers: createAuthHeaders(),
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
    this.removeTokens();
    return false;
  }
}
```

### **Interceptor pour les Requêtes Authentifiées**

```typescript
// src/utils/apiInterceptor.ts
export const createAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const headers = {
    ...createAuthHeaders(token),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Si le token a expiré, essayer de le rafraîchir
  if (response.status === 401) {
    const refreshed = await authService.refreshToken();
    if (refreshed) {
      const newToken = localStorage.getItem('authToken');
      const newHeaders = {
        ...createAuthHeaders(newToken!),
        ...options.headers,
      };
      
      return fetch(url, {
        ...options,
        headers: newHeaders,
      });
    } else {
      // Rediriger vers la page de connexion
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
  }

  return response;
};
```

---

## 🧪 Tests de l'Intégration

### **Test de Connexion**

```typescript
// tests/auth.test.ts
describe('API Integration', () => {
  test('should login successfully with valid credentials', async () => {
    const credentials = {
      email: 'admin@brightpath.com',
      password: 'password'
    };

    const response = await authService.login(credentials);
    
    expect(response.message).toBe('Connexion réussie');
    expect(response.user).toHaveProperty('id');
    expect(response.user).toHaveProperty('email');
    expect(response.user).toHaveProperty('name');
    expect(response.user).toHaveProperty('role');
    expect(response.tokens).toHaveProperty('accessToken');
    expect(response.tokens).toHaveProperty('refreshToken');
  });

  test('should handle login error with invalid credentials', async () => {
    const credentials = {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    };

    await expect(authService.login(credentials)).rejects.toThrow();
  });
});
```

---

## 🚨 Gestion des Erreurs

### **Types d'Erreurs API**

```typescript
// src/types/api.types.ts
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export class ApiException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiException';
  }
}
```

### **Gestion Centralisée des Erreurs**

```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: any): string => {
  if (error instanceof ApiException) {
    switch (error.statusCode) {
      case 401:
        return 'Session expirée. Veuillez vous reconnecter.';
      case 403:
        return 'Accès refusé.';
      case 404:
        return 'Ressource non trouvée.';
      case 422:
        return 'Données invalides.';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      default:
        return error.message;
    }
  }
  
  return 'Une erreur inattendue est survenue.';
};
```

---

## 🔧 Configuration Environnement

### **Variables d'Environnement**

```env
# .env.development
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development

# .env.production
REACT_APP_API_URL=https://api.brightpath.com/api
REACT_APP_ENVIRONMENT=production
```

### **Configuration CORS Backend**

```typescript
// Backend - CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📊 Monitoring et Debugging

### **Logs de Développement**

```typescript
// src/utils/logger.ts
export const logApiRequest = (method: string, url: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌐 API Request: ${method} ${url}`, data);
  }
};

export const logApiResponse = (method: string, url: string, response: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ API Response: ${method} ${url}`, response);
  }
};
```

### **Intercepteur de Requêtes**

```typescript
// src/services/apiService.ts
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    
    logApiRequest(options.method || 'GET', url, options.body);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: createAuthHeaders(),
      });
      
      const data = await response.json();
      
      logApiResponse(options.method || 'GET', url, data);
      
      if (!response.ok) {
        throw new ApiException(
          data.message || 'Erreur API',
          response.status,
          data.error
        );
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}
```

---

## ✅ Checklist d'Intégration

### **Phase 1: Configuration de Base**
- [ ] Configuration de l'URL de l'API
- [ ] Setup CORS côté backend
- [ ] Variables d'environnement
- [ ] Service d'authentification

### **Phase 2: Authentification**
- [ ] Endpoint de connexion fonctionnel
- [ ] Gestion des tokens (access + refresh)
- [ ] Contexte d'authentification
- [ ] Page de connexion intégrée

### **Phase 3: Sécurité**
- [ ] Refresh token automatique
- [ ] Gestion des erreurs 401
- [ ] Logout et nettoyage des tokens
- [ ] Protection des routes

### **Phase 4: Tests et Monitoring**
- [ ] Tests d'intégration
- [ ] Logs de développement
- [ ] Gestion d'erreurs centralisée
- [ ] Monitoring des performances

---

## 🎯 Prochaines Étapes

1. **Intégration des endpoints CV** : Génération et gestion des CV
2. **Intégration des endpoints Lettres** : Génération et gestion des lettres
3. **Gestion des templates** : Récupération et application des templates
4. **Optimisation des performances** : Cache et mise en cache
5. **Tests automatisés** : Tests E2E complets

---

Cette intégration permet une communication fluide et sécurisée entre le frontend React et l'API backend BrightPath ! 🚀 