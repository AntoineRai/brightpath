# BrightPath - Application de Suivi de Candidatures et Génération de CV

## 📋 Description

BrightPath est une application web moderne développée en React/TypeScript qui permet aux utilisateurs de :
- Gérer leur suivi de candidatures
- Générer des lettres de motivation avec l'IA
- Créer des CV professionnels personnalisables
- Optimiser leurs textes avec l'intelligence artificielle

## 🚀 Fonctionnalités Principales

### 📊 Suivi de Candidatures
- **Interface responsive** : Tableau sur desktop, cartes sur mobile
- **Gestion complète** : Ajout, modification, suppression de candidatures
- **Filtres et recherche** : Trouvez rapidement vos candidatures
- **Statuts visuels** : Suivi en temps réel de vos candidatures

### ✍️ Générateur de Lettres de Motivation
- **Génération IA** : Création automatique avec l'intelligence artificielle
- **Personnalisation** : Champs personnalisables (nom, entreprise, poste, etc.)
- **Export PDF** : Téléchargement en format PDF professionnel
- **Copie presse-papiers** : Copie rapide du contenu
- **Aperçu en temps réel** : Visualisation immédiate du résultat

### 📄 Générateur de CV
- **4 modèles de CV** : Moderne, Classique, Minimaliste, Professionnel
- **Personnalisation des couleurs** : Color picker pour chaque modèle
- **Gestion dynamique** : Ajout/suppression d'expériences, compétences, formations
- **Optimisation IA** : Amélioration automatique des descriptions
- **Export PDF** : Téléchargement en format A4 professionnel
- **Aperçu adaptatif** : Hauteur dynamique selon le contenu

### 🤖 Intelligence Artificielle
- **Optimisation de texte** : Professionnalisation automatique des descriptions
- **Génération de contenu** : Création de lettres de motivation intelligentes
- **Contexte intelligent** : Utilisation du poste et de l'entreprise pour l'optimisation
- **Mode développement** : Mock automatique quand l'API n'est pas disponible

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** : Framework principal
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **jsPDF** : Génération de PDF côté client
- **html2canvas** : Conversion HTML vers image pour PDF

### Backend (API)
- **Node.js** : Runtime JavaScript
- **Express** : Framework web
- **JWT** : Authentification
- **OpenAI GPT** : Intelligence artificielle

### Outils de Développement
- **Vite** : Build tool et dev server
- **ESLint** : Linting du code
- **Prettier** : Formatage du code

## 📁 Structure du Projet

```
brightpath/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ApplicationsTable.tsx
│   │   └── ...
│   ├── pages/              # Pages principales
│   │   ├── Applications.tsx
│   │   ├── LettresMotivation.tsx
│   │   ├── CVGenerator.tsx
│   │   └── ...
│   ├── services/           # Services API
│   │   ├── aiApiService.ts
│   │   └── ...
│   ├── config/             # Configuration
│   │   ├── environment.ts
│   │   └── ...
│   └── types/              # Types TypeScript
├── docs/                   # Documentation détaillée
├── README.md              # Ce fichier
└── package.json
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone [url-du-repo]
cd brightpath

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Build pour la production
npm run build
```

### Variables d'Environnement
Créer un fichier `.env.local` :
```env
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

## 📚 Documentation Détaillée

- [Guide d'Utilisation](./docs/USAGE.md) - Comment utiliser l'application
- [Architecture Technique](./docs/ARCHITECTURE.md) - Structure technique détaillée
- [API Documentation](./docs/API.md) - Documentation des endpoints API
- [Guide de Développement](./docs/DEVELOPMENT.md) - Guide pour les développeurs
- [Accessibilité (a11y)](./docs/ACCESSIBILITE.md) - Principes, bonnes pratiques et checklist
- [Données personnelles & RGPD](./docs/RGPD_DONNEES_PERSONNELLES.md) - Usage de l'IA, droit à l'oubli et bonnes pratiques

## 🎯 Fonctionnalités Avancées

### Responsive Design
- **Mobile-first** : Optimisé pour les appareils mobiles
- **Breakpoints intelligents** : Adaptation automatique selon la taille d'écran
- **Navigation tactile** : Interface optimisée pour le touch

### Performance
- **Lazy loading** : Chargement à la demande
- **Optimisation des images** : Compression automatique
- **Cache intelligent** : Mise en cache des données

### Sécurité
- **Authentification JWT** : Sécurisation des API
- **Validation des données** : Vérification côté client et serveur
- **HTTPS** : Chiffrement des communications

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ par l'équipe BrightPath**
