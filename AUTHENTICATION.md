# Système d'Authentification JWT - BrightPath

## Vue d'ensemble

Le système d'authentification JWT a été implémenté pour sécuriser l'accès aux fonctionnalités principales de l'application BrightPath. Les utilisateurs doivent être connectés pour accéder au suivi des candidatures, au générateur de CV et aux lettres de motivation.

## Architecture

### 1. Contexte d'Authentification (`AuthContext`)

**Fichier :** `src/contexts/AuthContext.tsx`

Le contexte d'authentification gère l'état global de l'utilisateur connecté :

- **État :** Token JWT, informations utilisateur, état de chargement
- **Fonctions :** `login()`, `logout()`, `isAuthenticated`
- **Persistance :** Stockage automatique dans le localStorage

### 2. Service d'Authentification (`AuthService`)

**Fichier :** `src/services/authService.ts`

Service centralisé pour les appels API d'authentification :

- **Endpoints :** `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/verify`, `/auth/me`
- **Gestion des tokens :** Stockage, récupération, suppression automatique
- **Headers d'authentification :** Ajout automatique du Bearer token

### 3. Hook Personnalisé (`useAuthService`)

**Fichier :** `src/hooks/useAuthService.ts`

Hook React pour simplifier l'utilisation du service d'authentification :

- **Gestion d'état :** Loading, erreurs
- **Fonctions simplifiées :** `login()`, `register()`, `logout()`

### 4. Protection des Routes (`ProtectedRoute`)

**Fichier :** `src/components/ProtectedRoute.tsx`

Composant HOC pour protéger les routes nécessitant une authentification :

- **Redirection automatique** vers `/login` si non connecté
- **Écran de chargement** pendant la vérification
- **Rendu conditionnel** du contenu protégé

## Fonctionnalités Implémentées

### ✅ Authentification Conditionnelle dans la Navbar

- **Utilisateur non connecté :** Affiche uniquement le bouton "Connexion"
- **Utilisateur connecté :** Affiche les options protégées + nom d'utilisateur + bouton "Déconnexion"
- **Responsive :** Fonctionne sur desktop et mobile

### ✅ Protection des Routes

Les routes suivantes sont protégées :
- `/candidatures` - Suivi des candidatures
- `/cv-generator` - Générateur de CV  
- `/lettres-motivation` - Lettres de motivation

### ✅ Page de Connexion/Inscription Améliorée

- **Redirection automatique** si déjà connecté
- **Gestion des erreurs** avec affichage visuel
- **État de chargement** avec spinner
- **Mode connexion/inscription** avec toggle
- **Validation des formulaires**
- **Champ nom complet** pour l'inscription
- **Confirmation de mot de passe** avec validation
- **Connexion automatique** après inscription réussie

### ✅ Persistance de Session

- **localStorage** pour le token JWT et les données utilisateur
- **Restauration automatique** de la session au rechargement
- **Nettoyage automatique** en cas d'erreur de parsing

## Configuration

### Variables d'Environnement

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Structure des Données

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
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
```

## Intégration Backend

### Endpoints Requis

Le backend doit implémenter les endpoints suivants :

1. **POST /api/auth/login**
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **POST /api/auth/register**
   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "name": "John Doe"
   }
   ```

3. **POST /api/auth/logout**
   - Headers: `Authorization: Bearer <token>`

4. **GET /api/auth/verify**
   - Headers: `Authorization: Bearer <token>`

5. **GET /api/auth/me**
   - Headers: `Authorization: Bearer <token>`

### Réponse d'Authentification

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Utilisation

### Dans un Composant

```typescript
import { useAuth } from '../contexts/AuthContext';

function MonComposant() {
  const { isAuthenticated, user, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }
  
  return (
    <div>
      <h1>Bonjour {user?.name}</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

### Protection d'une Route

```typescript
import ProtectedRoute from '../components/ProtectedRoute';

<Route path="/protected" element={
  <ProtectedRoute>
    <MonComposantProtege />
  </ProtectedRoute>
} />
```

## Sécurité

### Bonnes Pratiques Implémentées

1. **Stockage sécurisé** des tokens dans le localStorage
2. **Nettoyage automatique** des tokens invalides
3. **Headers d'authentification** automatiques
4. **Gestion des erreurs** robuste
5. **Redirection sécurisée** pour les routes protégées

### Recommandations Backend

1. **Expiration des tokens** (JWT avec `exp`)
2. **Refresh tokens** pour renouveler l'accès
3. **Validation côté serveur** de tous les tokens
4. **Rate limiting** sur les endpoints d'authentification
5. **HTTPS obligatoire** en production

## Tests

### Mode Développement

En mode développement, l'application utilise des tokens mock pour tester l'interface :

```typescript
// Dans Login.tsx - à remplacer par l'appel API réel
const mockToken = 'mock-jwt-token-' + Date.now();
const mockUser = {
  id: '1',
  email: email,
  name: email.split('@')[0]
};
```

### Tests Manuels

1. **Connexion :** Remplir le formulaire et vérifier l'accès aux fonctionnalités
2. **Déconnexion :** Cliquer sur "Déconnexion" et vérifier la redirection
3. **Persistance :** Recharger la page et vérifier que la session est maintenue
4. **Protection :** Essayer d'accéder directement aux URLs protégées sans connexion

## Prochaines Étapes

1. **Intégration backend** avec les vrais endpoints API
2. **Refresh tokens** pour une meilleure sécurité
3. **Gestion des rôles** (admin, utilisateur, etc.)
4. **Tests automatisés** pour l'authentification
5. **Monitoring** des sessions et tentatives de connexion 