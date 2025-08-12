# Guide de Développement - BrightPath

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Structure du Projet](#structure-du-projet)
4. [Conventions de Code](#conventions-de-code)
5. [Développement](#développement)
6. [Tests](#tests)
7. [Déploiement](#déploiement)
8. [Dépannage](#dépannage)

## 🛠️ Prérequis

### Outils Requis
- **Node.js** : Version 16 ou supérieure
- **npm** : Version 8 ou supérieure
- **Git** : Version 2.30 ou supérieure
- **VS Code** (recommandé) : Avec extensions TypeScript et ESLint

### Extensions VS Code Recommandées
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

## 🚀 Installation

### 1. Cloner le Repository
```bash
git clone https://github.com/your-username/brightpath.git
cd brightpath
```

### 2. Installer les Dépendances
```bash
# Installation des dépendances frontend
npm install

# Installation des dépendances backend (si applicable)
cd backend && npm install
```

### 3. Configuration de l'Environnement
```bash
# Copier le fichier d'environnement
cp .env.example .env.local

# Éditer les variables d'environnement
nano .env.local
```

**Variables d'environnement requises :**
```env
# Frontend
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development

# Backend (si applicable)
PORT=3001
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
DATABASE_URL=your-database-url
```

### 4. Démarrer le Développement
```bash
# Frontend
npm run dev

# Backend (dans un autre terminal)
cd backend && npm run dev
```

## 📁 Structure du Projet

### Organisation des Fichiers
```
brightpath/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ApplicationsTable.tsx
│   │   ├── Navigation.tsx
│   │   └── UI/              # Composants UI de base
│   ├── pages/               # Pages principales
│   │   ├── Applications.tsx
│   │   ├── LettresMotivation.tsx
│   │   └── CVGenerator.tsx
│   ├── services/            # Services API
│   │   ├── aiApiService.ts
│   │   └── apiService.ts
│   ├── config/              # Configuration
│   │   ├── environment.ts
│   │   └── constants.ts
│   ├── types/               # Types TypeScript
│   │   ├── api.ts
│   │   └── models.ts
│   └── utils/               # Utilitaires
│       ├── pdfGenerator.ts
│       └── formatters.ts
├── docs/                    # Documentation
├── public/                  # Assets statiques
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

### Règles de Nommage

#### **Fichiers**
- **Composants** : `PascalCase.tsx` (ex: `ApplicationsTable.tsx`)
- **Pages** : `PascalCase.tsx` (ex: `CVGenerator.tsx`)
- **Services** : `camelCase.ts` (ex: `aiApiService.ts`)
- **Types** : `camelCase.ts` (ex: `apiTypes.ts`)
- **Utilitaires** : `camelCase.ts` (ex: `pdfGenerator.ts`)

#### **Variables et Fonctions**
- **Variables** : `camelCase` (ex: `userData`)
- **Fonctions** : `camelCase` (ex: `handleSubmit`)
- **Constantes** : `UPPER_SNAKE_CASE` (ex: `API_BASE_URL`)
- **Types/Interfaces** : `PascalCase` (ex: `UserData`)

## 📝 Conventions de Code

### TypeScript

#### **Interfaces et Types**
```typescript
// Interface pour les props de composant
interface ApplicationsTableProps {
  applications: Application[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// Type pour les données API
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// Enum pour les constantes
enum ApplicationStatus {
  PENDING = 'En cours',
  INTERVIEW = 'Entretien',
  REJECTED = 'Refusé',
  ACCEPTED = 'Accepté'
}
```

#### **Composants React**
```typescript
// Composant fonctionnel avec TypeScript
const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onEdit,
  onDelete
}) => {
  // Hooks en haut du composant
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers avec useCallback
  const handleEdit = useCallback((id: string) => {
    onEdit(id);
  }, [onEdit]);

  // Effets avec useEffect
  useEffect(() => {
    // Logique d'effet
  }, [dependencies]);

  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};
```

### CSS/Tailwind

#### **Classes Tailwind**
```typescript
// Utilisation cohérente des classes
const buttonClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded",
  disabled: "bg-gray-400 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
};

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Contenu */}
</div>
```

#### **Styles Personnalisés**
```css
/* styles/globals.css */
@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors;
  }
  
  .card-hover {
    @apply hover:shadow-lg transition-shadow duration-200;
  }
}
```

### Gestion d'État

#### **useState pour l'État Local**
```typescript
const [formData, setFormData] = useState<FormData>({
  nom: '',
  prenom: '',
  email: ''
});

const handleInputChange = (field: keyof FormData, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};
```

#### **useReducer pour l'État Complexe**
```typescript
type CVState = {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  competences: string[];
  formations: Formation[];
};

type CVAction = 
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<PersonalInfo> }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'REMOVE_EXPERIENCE'; payload: string };

const cvReducer = (state: CVState, action: CVAction): CVState => {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload }
      };
    // Autres cas...
  }
};
```

## 🔧 Développement

### Workflow de Développement

#### **1. Créer une Branche**
```bash
# Branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Branche bugfix
git checkout -b bugfix/correction-bug
```

#### **2. Développer**
```bash
# Démarrer le serveur de développement
npm run dev

# Linting en temps réel
npm run lint:watch
```

#### **3. Tester**
```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e
```

#### **4. Commiter**
```bash
# Ajouter les fichiers
git add .

# Commit avec message conventionnel
git commit -m "feat: ajouter optimisation IA pour les descriptions"

# Push vers la branche
git push origin feature/nouvelle-fonctionnalite
```

### Messages de Commit

Utilisez les conventions [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Types de commit
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactorisation
test: ajout de tests
chore: tâches de maintenance

# Exemples
feat: ajouter génération PDF pour les CV
fix: corriger l'erreur de validation email
docs: mettre à jour la documentation API
style: formater le code avec Prettier
refactor: simplifier la logique d'optimisation IA
test: ajouter tests pour le service PDF
chore: mettre à jour les dépendances
```

### Debugging

#### **Console Logs**
```typescript
// Logs de développement
console.log('🔍 Debug:', { data, state });

// Logs d'erreur
console.error('❌ Erreur:', error);

// Logs d'information
console.info('ℹ️ Info:', message);

// Logs d'avertissement
console.warn('⚠️ Warning:', warning);
```

#### **React DevTools**
- Installer l'extension React DevTools
- Utiliser les onglets Components et Profiler
- Inspecter les props et l'état des composants

#### **Network Tab**
- Vérifier les requêtes API
- Analyser les réponses et erreurs
- Tester les endpoints

## 🧪 Tests

### Tests Unitaires

#### **Configuration Jest**
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

#### **Tests de Composants**
```typescript
// __tests__/ApplicationsTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ApplicationsTable from '../components/ApplicationsTable';

describe('ApplicationsTable', () => {
  const mockApplications = [
    {
      id: '1',
      entreprise: 'TechCorp',
      poste: 'Développeur',
      statut: 'En cours'
    }
  ];

  it('affiche les candidatures', () => {
    render(<ApplicationsTable applications={mockApplications} />);
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
  });

  it('appelle onEdit quand on clique sur modifier', () => {
    const mockOnEdit = jest.fn();
    render(
      <ApplicationsTable 
        applications={mockApplications} 
        onEdit={mockOnEdit}
      />
    );
    
    fireEvent.click(screen.getByText('Modifier'));
    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });
});
```

#### **Tests de Services**
```typescript
// __tests__/aiApiService.test.ts
import { AiApiService } from '../services/aiApiService';

describe('AiApiService', () => {
  let service: AiApiService;

  beforeEach(() => {
    service = new AiApiService();
  });

  it('optimise le texte avec succès', async () => {
    const mockResponse = {
      content: 'Texte optimisé',
      message: 'Succès'
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await service.professionalizeText({
      originalText: 'Test',
      context: 'Test'
    });

    expect(result.content).toBe('Texte optimisé');
  });
});
```

### Tests d'Intégration

#### **Tests API**
```typescript
// __tests__/api.test.ts
import request from 'supertest';
import app from '../server';

describe('API Endpoints', () => {
  it('POST /api/ai/professionalize-text retourne 200', async () => {
    const response = await request(app)
      .post('/api/ai/professionalize-text')
      .send({
        originalText: 'Test',
        context: 'Test'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### Tests E2E

#### **Configuration Playwright**
```typescript
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' }
    }
  ]
};

export default config;
```

#### **Tests E2E**
```typescript
// tests/e2e/cv-generator.spec.ts
import { test, expect } from '@playwright/test';

test('génère un CV complet', async ({ page }) => {
  await page.goto('/cv-generator');
  
  // Remplir les informations personnelles
  await page.fill('[data-testid="nom"]', 'Doe');
  await page.fill('[data-testid="prenom"]', 'John');
  
  // Ajouter une expérience
  await page.click('[data-testid="add-experience"]');
  await page.fill('[data-testid="poste"]', 'Développeur');
  
  // Télécharger le PDF
  await page.click('[data-testid="download-pdf"]');
  
  // Vérifier le téléchargement
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toContain('.pdf');
});
```

## 🚀 Déploiement

### Build de Production

#### **Build Frontend**
```bash
# Build optimisé
npm run build

# Vérifier le build
npm run preview
```

#### **Variables d'Environnement Production**
```env
REACT_APP_API_BASE_URL=https://api.brightpath.com
REACT_APP_ENVIRONMENT=production
```

### Déploiement

#### **Vercel (Recommandé)**
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

#### **Netlify**
```bash
# Build et déployer
npm run build
netlify deploy --prod --dir=dist
```

#### **Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Dépannage

### Problèmes Courants

#### **Erreurs TypeScript**
```bash
# Vérifier les types
npm run type-check

# Corriger automatiquement
npm run lint:fix
```

#### **Erreurs ESLint**
```bash
# Voir les erreurs
npm run lint

# Corriger automatiquement
npm run lint:fix
```

#### **Problèmes de Build**
```bash
# Nettoyer le cache
npm run clean

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

#### **Problèmes de Performance**
```bash
# Analyser le bundle
npm run analyze

# Vérifier les imports
npm run check-imports
```

### Outils de Développement

#### **Scripts Utiles**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "clean": "rm -rf dist node_modules/.cache"
  }
}
```

#### **Configuration VS Code**
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

---

## 📚 Ressources

- **Documentation React** : https://react.dev/
- **Documentation TypeScript** : https://www.typescriptlang.org/
- **Documentation Tailwind** : https://tailwindcss.com/
- **Conventional Commits** : https://www.conventionalcommits.org/
- **Jest Documentation** : https://jestjs.io/
- **Playwright Documentation** : https://playwright.dev/

**Bon développement ! 🚀** 