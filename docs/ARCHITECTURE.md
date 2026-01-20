# Architecture Technique - BrightPath

## 📋 Vue d'Ensemble

BrightPath est une application web moderne basée sur une architecture **SPA (Single Page Application)** avec une séparation claire entre le frontend et le backend.

## 🏗️ Architecture Générale

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (React)       │                  │   (Node.js)     │
└─────────────────┘                  └─────────────────┘
         │                                     │
         │                                     │
         ▼                                     ▼
┌─────────────────┐                  ┌─────────────────┐
│   LocalStorage  │                  │   Base de       │
│   (JWT Token)   │                  │   Données       │
└─────────────────┘                  └─────────────────┘
```

## 🎯 Frontend Architecture

### Structure des Composants

```
src/
├── components/           # Composants réutilisables
│   ├── ApplicationsTable.tsx    # Tableau des candidatures
│   ├── Navigation.tsx           # Navigation principale
│   └── UI/                      # Composants UI de base
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── pages/                # Pages principales
│   ├── Applications.tsx         # Suivi des candidatures
│   ├── LettresMotivation.tsx    # Générateur de lettres
│   ├── CVGenerator.tsx          # Générateur de CV
│   └── Dashboard.tsx            # Tableau de bord
├── services/            # Services API
│   ├── aiApiService.ts          # Service IA
│   ├── authService.ts           # Service d'authentification
│   └── apiService.ts            # Service API général
├── config/              # Configuration
│   ├── environment.ts           # Variables d'environnement
│   └── constants.ts             # Constantes de l'application
├── types/               # Types TypeScript
│   ├── api.ts                   # Types des API
│   ├── components.ts            # Types des composants
│   └── models.ts                # Types des modèles de données
└── utils/               # Utilitaires
    ├── pdfGenerator.ts          # Génération PDF
    ├── formatters.ts            # Formatage des données
    └── validators.ts            # Validation des données
```

### Patterns Utilisés

#### 1. **Component Pattern**
```typescript
// Composant fonctionnel avec hooks
const CVGenerator: React.FC = () => {
  const [state, setState] = useState<StateType>(initialState);
  
  const handleAction = useCallback(() => {
    // Logique métier
  }, [dependencies]);
  
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};
```

#### 2. **Service Pattern**
```typescript
// Service API avec gestion d'erreurs
class AiApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  }
  
  async professionalizeText(data: RequestType): Promise<ResponseType> {
    // Logique de l'API
  }
}
```

#### 3. **Custom Hooks Pattern**
```typescript
// Hook personnalisé pour la gestion d'état
const useOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const optimizeText = useCallback(async (text: string) => {
    // Logique d'optimisation
  }, []);
  
  return { isOptimizing, error, optimizeText };
};
```

## 🔧 Backend Architecture

### Structure du Backend

```
backend/
├── src/
│   ├── controllers/     # Contrôleurs API
│   │   ├── aiController.ts      # Contrôleur IA
│   │   ├── authController.ts    # Contrôleur authentification
│   │   └── cvController.ts      # Contrôleur CV
│   ├── services/        # Services métier
│   │   ├── aiService.ts         # Service IA
│   │   ├── pdfService.ts        # Service PDF
│   │   └── emailService.ts      # Service email
│   ├── middleware/      # Middleware Express
│   │   ├── auth.ts              # Authentification JWT
│   │   ├── validation.ts        # Validation des données
│   │   └── errorHandler.ts      # Gestion d'erreurs
│   ├── models/          # Modèles de données
│   │   ├── User.ts              # Modèle utilisateur
│   │   ├── Application.ts       # Modèle candidature
│   │   └── CV.ts                # Modèle CV
│   ├── routes/          # Routes API
│   │   ├── ai.ts                # Routes IA
│   │   ├── auth.ts              # Routes authentification
│   │   └── cv.ts                # Routes CV
│   └── utils/           # Utilitaires
│       ├── database.ts          # Configuration DB
│       ├── logger.ts            # Logging
│       └── validators.ts        # Validateurs
├── config/              # Configuration
│   ├── database.ts              # Config base de données
│   └── environment.ts           # Variables d'environnement
└── tests/               # Tests
    ├── unit/                    # Tests unitaires
    ├── integration/             # Tests d'intégration
    └── e2e/                     # Tests end-to-end
```

### Patterns Backend

#### 1. **MVC Pattern**
```typescript
// Contrôleur
class AiController {
  async professionalizeText(req: Request, res: Response) {
    try {
      const result = await this.aiService.process(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Service
class AiService {
  async process(data: ProfessionalizeRequest): Promise<ProfessionalizeResponse> {
    // Logique métier
  }
}
```

#### 2. **Middleware Pattern**
```typescript
// Middleware d'authentification
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  // Vérification JWT
  next();
};
```

## 🔄 Flux de Données

### 1. **Authentification**
```
1. Login → 2. JWT Token → 3. LocalStorage → 4. Headers API
```

### 2. **Génération de Lettre**
```
1. Formulaire → 2. Validation → 3. API Call → 4. IA Processing → 5. Response → 6. UI Update
```

### 3. **Optimisation de Texte**
```
1. Text Input → 2. Context Building → 3. API Call → 4. AI Processing → 5. Text Replacement
```

### 4. **Génération PDF**
```
1. Content → 2. HTML Generation → 3. Canvas Conversion → 4. PDF Creation → 5. Download
```

## 🎨 Architecture UI/UX

### Design System

#### **Couleurs**
```css
/* Couleurs principales */
--primary: #06b6d4;      /* Cyan */
--secondary: #64748b;     /* Gray */
--accent: #0891b2;        /* Dark Cyan */
--success: #10b981;       /* Green */
--error: #ef4444;         /* Red */
--warning: #f59e0b;       /* Amber */
```

#### **Breakpoints Responsive**
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

#### **Composants UI**
- **Button** : Boutons avec états (normal, hover, disabled, loading)
- **Input** : Champs de saisie avec validation
- **Modal** : Fenêtres modales pour les actions importantes
- **Card** : Cartes pour afficher les informations
- **Table** : Tableaux responsifs avec tri et filtres

### Responsive Design

#### **Mobile (< 768px)**
- Navigation hamburger
- Cartes au lieu de tableaux
- Boutons plus grands pour le touch
- Stepper compact pour le CV

#### **Desktop (≥ 768px)**
- Navigation horizontale
- Tableaux complets
- Sidebar pour les options
- Aperçu en temps réel

## 🔐 Sécurité

### Authentification
- **JWT Tokens** : Stockage sécurisé dans localStorage
- **Refresh Tokens** : Renouvellement automatique
- **Expiration** : Gestion des sessions expirées

### Validation
- **Frontend** : Validation en temps réel avec feedback
- **Backend** : Validation stricte des données
- **Sanitization** : Nettoyage des entrées utilisateur

### API Security
- **CORS** : Configuration stricte des origines
- **Rate Limiting** : Protection contre les abus
- **Input Validation** : Validation de tous les paramètres

## 📊 Performance

### Optimisations Frontend

#### **Code Splitting**
```typescript
// Lazy loading des pages
const CVGenerator = lazy(() => import('./pages/CVGenerator'));
const LettresMotivation = lazy(() => import('./pages/LettresMotivation'));
```

#### **Memoization**
```typescript
// Optimisation des re-renders
const MemoizedComponent = memo(Component);
const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

#### **Bundle Optimization**
- **Tree Shaking** : Suppression du code inutilisé
- **Minification** : Compression des fichiers
- **Gzip** : Compression des réponses

### Optimisations Backend

#### **Caching**
```typescript
// Cache Redis pour les données fréquentes
const cachedData = await redis.get(key);
if (!cachedData) {
  const data = await fetchFromDatabase();
  await redis.setex(key, 3600, JSON.stringify(data));
}
```

#### **Database Optimization**
- **Indexing** : Index sur les colonnes fréquemment utilisées
- **Query Optimization** : Requêtes optimisées
- **Connection Pooling** : Gestion efficace des connexions

## 🧪 Tests

### Stratégie de Tests

#### **Frontend Tests**
```typescript
// Tests unitaires avec Jest
describe('CVGenerator', () => {
  it('should add new experience', () => {
    render(<CVGenerator />);
    fireEvent.click(screen.getByText('Ajouter une expérience'));
    expect(screen.getByText('Expérience #2')).toBeInTheDocument();
  });
});
```

#### **Backend Tests**
```typescript
// Tests d'intégration
describe('AI API', () => {
  it('should professionalize text', async () => {
    const response = await request(app)
      .post('/api/ai/professionalize-text')
      .send({ originalText: 'test', context: 'test' });
    expect(response.status).toBe(200);
  });
});
```

## 📈 Monitoring

### Logs
- **Frontend** : Console logs pour le debugging
- **Backend** : Winston pour les logs structurés
- **Errors** : Sentry pour le tracking d'erreurs

### Métriques
- **Performance** : Temps de réponse des API
- **Usage** : Statistiques d'utilisation
- **Errors** : Taux d'erreur et types d'erreurs

## 🚀 Déploiement

### Environnements

#### **Development**
- **Frontend** : Vite dev server (localhost:3000)
- **Backend** : Node.js dev server (localhost:3001)
- **Database** : SQLite en local

#### **Production**
- **Frontend** : Build statique sur CDN
- **Backend** : Docker containers sur cloud
- **Database** : PostgreSQL sur cloud

### CI/CD Pipeline
```
1. Code Commit → 2. Tests Automatiques → 3. Build → 4. Deploy → 5. Monitoring
```

---

## 📚 Ressources

- **Documentation React** : https://react.dev/
- **Documentation TypeScript** : https://www.typescriptlang.org/
- **Documentation Tailwind** : https://tailwindcss.com/
- **Guide de Développement** : [DEVELOPMENT.md](./DEVELOPMENT.md)

**Architecture conçue pour la scalabilité et la maintenabilité ! 🏗️** 