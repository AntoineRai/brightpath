# Documentation API - BrightPath

## 📋 Vue d'Ensemble

L'API BrightPath est une API RESTful construite avec Node.js et Express, fournissant des endpoints pour la gestion des candidatures, la génération de lettres de motivation, la création de CV et l'optimisation de texte avec l'intelligence artificielle.

## 🔐 Authentification

### JWT Token

Toutes les requêtes API nécessitent un token JWT valide dans le header `Authorization`.

```http
Authorization: Bearer <your-jwt-token>
```

### Obtention du Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## 🤖 API Intelligence Artificielle

### Optimisation de Texte

#### `POST /api/ai/professionalize-text`

Optimise et professionnalise un texte donné en utilisant l'intelligence artificielle.

**Headers :**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body :**
```json
{
  "originalText": "Pendant mon alternance à Cap Habitat j'ai eu l'occasion de bosser dans plusieurs domaines",
  "context": "Développeur web, alternance"
}
```

**Réponse :**
```json
{
  "message": "Texte professionnalisé avec succès",
  "content": "Dans le cadre de mon alternance chez Cap Habitat, j'ai pu développer une expertise polyvalente en intervenant sur divers projets techniques et fonctionnels.",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 28,
    "total_tokens": 73
  },
  "model": "gpt-3.5-turbo",
  "generatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Codes d'Erreur :**
- `400` : Données invalides
- `401` : Token manquant ou invalide
- `500` : Erreur serveur

### Génération de Lettre de Motivation

#### `POST /api/ai/cover-letter`

Génère une lettre de motivation personnalisée avec l'IA.

**Headers :**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body :**
```json
{
  "position": "Développeur Frontend",
  "company": "TechCorp",
  "nom": "Doe",
  "prenom": "John",
  "email": "john.doe@email.com",
  "telephone": "+33 6 12 34 56 78",
  "adresse": "123 Rue de la Paix, 75001 Paris",
  "destinataire": "M. Martin Dupont"
}
```

**Réponse :**
```json
{
  "message": "Lettre de motivation générée avec succès",
  "content": "John Doe\n123 Rue de la Paix, 75001 Paris\njohn.doe@email.com\n+33 6 12 34 56 78\n\n[Date]\n\nM. Martin Dupont\nTechCorp\n\nObjet : Candidature au poste de Développeur Frontend\n\nMadame, Monsieur,\n\nC'est avec un vif intérêt que je vous soumets ma candidature...",
  "usage": {
    "prompt_tokens": 245,
    "completion_tokens": 312,
    "total_tokens": 557
  },
  "model": "gpt-3.5-turbo",
  "generatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 📊 API Candidatures

### Récupérer toutes les candidatures

#### `GET /api/applications`

Récupère la liste de toutes les candidatures de l'utilisateur.

**Headers :**
```http
Authorization: Bearer <jwt-token>
```

**Query Parameters :**
- `status` (optionnel) : Filtrer par statut
- `search` (optionnel) : Recherche dans le nom de l'entreprise ou du poste
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 10)

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "entreprise": "TechCorp",
      "poste": "Développeur Frontend",
      "dateCandidature": "2024-01-15",
      "statut": "En cours",
      "notes": "Candidature envoyée par email",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Créer une candidature

#### `POST /api/applications`

Crée une nouvelle candidature.

**Headers :**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body :**
```json
{
  "entreprise": "TechCorp",
  "poste": "Développeur Frontend",
  "dateCandidature": "2024-01-15",
  "statut": "En cours",
  "notes": "Candidature envoyée par email"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "entreprise": "TechCorp",
    "poste": "Développeur Frontend",
    "dateCandidature": "2024-01-15",
    "statut": "En cours",
    "notes": "Candidature envoyée par email",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Modifier une candidature

#### `PUT /api/applications/:id`

Modifie une candidature existante.

**Headers :**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body :**
```json
{
  "statut": "Entretien",
  "notes": "Entretien prévu le 20 janvier"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "entreprise": "TechCorp",
    "poste": "Développeur Frontend",
    "dateCandidature": "2024-01-15",
    "statut": "Entretien",
    "notes": "Entretien prévu le 20 janvier",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

### Supprimer une candidature

#### `DELETE /api/applications/:id`

Supprime une candidature.

**Headers :**
```http
Authorization: Bearer <jwt-token>
```

**Réponse :**
```json
{
  "success": true,
  "message": "Candidature supprimée avec succès"
}
```

---

## 📄 API CV

### Sauvegarder un CV

#### `POST /api/cv`

Sauvegarde un CV généré.

**Headers :**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body :**
```json
{
  "personalInfo": {
    "nom": "Doe",
    "prenom": "John",
    "email": "john.doe@email.com",
    "telephone": "+33 6 12 34 56 78",
    "titrePoste": "Développeur Frontend",
    "resume": "Développeur passionné avec 5 ans d'expérience..."
  },
  "experiences": [
    {
      "poste": "Développeur Frontend",
      "entreprise": "TechCorp",
      "dateDebut": "2020-01-01",
      "dateFin": "2023-12-31",
      "description": "Développement d'applications React..."
    }
  ],
  "competences": ["JavaScript", "React", "TypeScript"],
  "formations": [
    {
      "diplome": "Master Informatique",
      "etablissement": "Université Paris",
      "anneeDebut": "2018",
      "anneeFin": "2020"
    }
  ],
  "model": "modern",
  "customColors": {
    "primary": "#06b6d4",
    "secondary": "#64748b",
    "accent": "#0891b2"
  }
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "456",
    "name": "CV_John_Doe_2024-01-15",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Récupérer les CV sauvegardés

#### `GET /api/cv`

Récupère la liste des CV sauvegardés.

**Headers :**
```http
Authorization: Bearer <jwt-token>
```

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": "456",
      "name": "CV_John_Doe_2024-01-15",
      "model": "modern",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Récupérer un CV spécifique

#### `GET /api/cv/:id`

Récupère un CV spécifique.

**Headers :**
```http
Authorization: Bearer <jwt-token>
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "456",
    "personalInfo": { /* ... */ },
    "experiences": [ /* ... */ ],
    "competences": [ /* ... */ ],
    "formations": [ /* ... */ ],
    "model": "modern",
    "customColors": { /* ... */ },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🔐 API Authentification

### Connexion

#### `POST /api/auth/login`

Authentifie un utilisateur.

**Headers :**
```http
Content-Type: application/json
```

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Inscription

#### `POST /api/auth/register`

Crée un nouveau compte utilisateur.

**Headers :**
```http
Content-Type: application/json
```

**Body :**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Rafraîchir le token

#### `POST /api/auth/refresh`

Rafraîchit un token expiré.

**Headers :**
```http
Authorization: Bearer <refresh-token>
```

**Réponse :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Déconnexion

#### `POST /api/auth/logout`

Déconnecte l'utilisateur.

**Headers :**
```http
Authorization: Bearer <jwt-token>
```

**Réponse :**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## 📊 Codes d'Erreur

### Codes HTTP

| Code | Description |
|------|-------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `400` | Requête invalide |
| `401` | Non autorisé |
| `403` | Accès interdit |
| `404` | Ressource non trouvée |
| `422` | Données de validation invalides |
| `429` | Trop de requêtes |
| `500` | Erreur serveur interne |

### Format des Erreurs

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données fournies sont invalides",
    "details": [
      {
        "field": "email",
        "message": "L'email doit être valide"
      }
    ]
  }
}
```

### Codes d'Erreur Spécifiques

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Erreur de validation des données |
| `AUTHENTICATION_ERROR` | Erreur d'authentification |
| `AUTHORIZATION_ERROR` | Erreur d'autorisation |
| `NOT_FOUND_ERROR` | Ressource non trouvée |
| `RATE_LIMIT_ERROR` | Limite de requêtes dépassée |
| `AI_SERVICE_ERROR` | Erreur du service IA |
| `PDF_GENERATION_ERROR` | Erreur de génération PDF |

---

## 📈 Rate Limiting

L'API implémente un système de limitation de débit pour protéger contre les abus :

- **Requêtes générales** : 1000 requêtes par heure
- **API IA** : 100 requêtes par heure
- **Génération PDF** : 50 requêtes par heure

### Headers de Rate Limiting

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642233600
```

---

## 🔧 Exemples d'Utilisation

### JavaScript/TypeScript

```typescript
// Configuration de base
const API_BASE_URL = 'http://localhost:3001/api';

// Fonction d'authentification
async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  return response.json();
}

// Fonction d'optimisation de texte
async function optimizeText(text: string, context: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/ai/professionalize-text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ originalText: text, context }),
  });
  
  return response.json();
}

// Fonction de récupération des candidatures
async function getApplications(token: string, filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/applications?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
}
```

### cURL

```bash
# Connexion
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Optimisation de texte
curl -X POST http://localhost:3001/api/ai/professionalize-text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"originalText":"Mon texte","context":"Développeur"}'

# Récupération des candidatures
curl -X GET http://localhost:3001/api/applications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Ressources

- **Documentation Postman** : Collection disponible sur demande
- **Tests d'API** : [DEVELOPMENT.md](./DEVELOPMENT.md#tests)
- **Support** : Ouvrir une issue sur GitHub

**API conçue pour la performance et la scalabilité ! 🚀** 