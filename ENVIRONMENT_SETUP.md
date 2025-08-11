# 🔧 Configuration des Variables d'Environnement - BrightPath

## 📋 Vue d'Ensemble

Ce guide explique comment configurer les variables d'environnement pour le projet BrightPath.

---

## 🚀 Configuration Rapide

### **1. Copier le fichier d'exemple**
```bash
cp env.example .env.local
```

### **2. Configurer l'API Backend**
```bash
# Ouvrir .env.local et modifier :
REACT_APP_API_URL=http://localhost:3001/api
```

### **3. Redémarrer l'application**
```bash
npm start
```

---

## 📝 Variables d'Environnement

### **🔴 Variables Obligatoires**

| Variable | Description | Exemple |
|----------|-------------|---------|
| `REACT_APP_API_URL` | URL de l'API backend | `http://localhost:3001/api` |

### **🟡 Variables Optionnelles**

#### **Configuration Frontend**
```env
# URL de base de l'application
REACT_APP_BASE_URL=http://localhost:3000

# Titre de l'application
REACT_APP_TITLE=BrightPath

# Description de l'application
REACT_APP_DESCRIPTION=Plateforme d'optimisation de recherche d'emploi
```

#### **Configuration Analytics**
```env
# Google Analytics (optionnel)
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX

# Sentry pour le monitoring d'erreurs (optionnel)
REACT_APP_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxx@xxxxx.ingest.sentry.io/xxxxx
```

#### **Configuration Features**
```env
# Activer/désactiver des fonctionnalités
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_ERROR_MONITORING=false
REACT_APP_ENABLE_DEBUG_MODE=true
```

#### **Configuration Performance**
```env
# Taille maximale des fichiers (5MB par défaut)
REACT_APP_MAX_FILE_SIZE=5242880

# Timeout des requêtes API (30s par défaut)
REACT_APP_API_TIMEOUT=30000
```

---

## 🌍 Environnements

### **Développement**
```env
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_BASE_URL=http://localhost:3000
REACT_APP_ENABLE_DEBUG_MODE=true
```

### **Production**
```env
NODE_ENV=production
REACT_APP_API_URL=https://api.brightpath.com/api
REACT_APP_BASE_URL=https://brightpath.com
REACT_APP_ENABLE_DEBUG_MODE=false
```

### **Test**
```env
NODE_ENV=test
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_TEST_API_URL=http://localhost:3001/api
```

---

## 📁 Fichiers d'Environnement

### **Fichiers Supportés**
- `.env` : Variables par défaut
- `.env.local` : Variables locales (priorité)
- `.env.development` : Variables de développement
- `.env.production` : Variables de production
- `.env.test` : Variables de test

### **Ordre de Priorité**
1. `.env.local` (toujours ignoré par Git)
2. `.env.development` / `.env.production` / `.env.test`
3. `.env`

---

## 🔒 Sécurité

### **Variables Sensibles**
```env
# ❌ Ne jamais commiter ces variables
REACT_APP_SECRET_KEY=your-secret-key
REACT_APP_DATABASE_PASSWORD=password123
REACT_APP_API_SECRET=secret123

# ✅ Ces variables peuvent être commitées
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_TITLE=BrightPath
```

### **Bonnes Pratiques**
- ✅ Utiliser `REACT_APP_` pour toutes les variables React
- ✅ Commiter `env.example` dans Git
- ❌ Ne jamais commiter `.env.local`
- ✅ Utiliser des valeurs par défaut dans le code
- ✅ Valider les variables au démarrage

---

## 🛠️ Utilisation dans le Code

### **Accès aux Variables**
```typescript
// Configuration API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configuration Features
const DEBUG_MODE = process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true';

// Configuration Performance
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '30000');
```

### **Validation des Variables**
```typescript
// utils/envValidation.ts
export const validateEnvironment = () => {
  const requiredVars = [
    'REACT_APP_API_URL'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Variables d'environnement manquantes: ${missing.join(', ')}`);
  }
};
```

---

## 🧪 Tests

### **Configuration de Test**
```env
# .env.test
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_TEST_API_URL=http://localhost:3001/api
REACT_APP_ENABLE_DEBUG_MODE=false
```

### **Tests avec Variables Mock**
```typescript
// tests/setup.ts
beforeEach(() => {
  // Mock des variables d'environnement pour les tests
  process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
  process.env.REACT_APP_ENABLE_DEBUG_MODE = 'false';
});
```

---

## 🚨 Dépannage

### **Problèmes Courants**

#### **1. Variables non reconnues**
```bash
# ❌ Erreur : Variable non définie
console.log(process.env.API_URL);

# ✅ Solution : Préfixer avec REACT_APP_
console.log(process.env.REACT_APP_API_URL);
```

#### **2. Application ne redémarre pas**
```bash
# Solution : Redémarrer manuellement
npm start
```

#### **3. Variables en production**
```bash
# Vérifier que les variables sont définies
echo $REACT_APP_API_URL

# Redéployer si nécessaire
npm run build
```

---

## 📚 Ressources

### **Documentation Officielle**
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Create React App Environment](https://create-react-app.dev/docs/advanced-configuration/)

### **Outils Utiles**
- [dotenv](https://www.npmjs.com/package/dotenv) : Chargement des variables
- [env-cmd](https://www.npmjs.com/package/env-cmd) : Exécution avec variables

---

## ✅ Checklist de Configuration

### **Développement**
- [ ] Copier `env.example` vers `.env.local`
- [ ] Configurer `REACT_APP_API_URL`
- [ ] Tester la connexion à l'API
- [ ] Vérifier les logs de debug

### **Production**
- [ ] Configurer les variables de production
- [ ] Tester l'application en mode production
- [ ] Vérifier la sécurité des variables
- [ ] Documenter les variables utilisées

### **Tests**
- [ ] Configurer les variables de test
- [ ] Exécuter les tests avec les bonnes variables
- [ ] Vérifier la couverture des tests

---

Cette configuration permet une gestion flexible et sécurisée des variables d'environnement pour tous les environnements ! 🚀 