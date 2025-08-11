# 🌍 Guide de Gestion des Environnements - BrightPath

## Vue d'Ensemble

L'application BrightPath utilise un système de configuration automatique qui détecte l'environnement et utilise les bonnes URLs d'API et de base selon le contexte.

## 🔧 Configuration Automatique

### **Environnements Supportés**

| Environnement | NODE_ENV | API URL | Base URL | Mode Mock |
|---------------|----------|---------|----------|-----------|
| **Développement** | `development` | `http://localhost:3001/api` | `http://localhost:3000` | ✅ Activé |
| **Production** | `production` | `https://api.brightpath.com/api` | `https://brightpath.com` | ❌ Désactivé |
| **Tests** | `test` | `http://localhost:3001/api` | `http://localhost:3000` | ✅ Activé |

### **Détection Automatique**

L'application détecte automatiquement l'environnement via `NODE_ENV` :

```typescript
// src/config/environment.ts
export const getApiUrl = (): string => {
  const env = ENV_CONFIG.NODE_ENV as keyof typeof ENV_CONFIG.API_URLS;
  return ENV_CONFIG.API_URLS[env] || ENV_CONFIG.API_URLS.development;
};
```

## 📁 Fichiers de Configuration

### **1. Variables d'Environnement**

#### **Développement (.env.development)**
```env
NODE_ENV=development
REACT_APP_DEV_API_URL=http://localhost:3001/api
REACT_APP_DEV_BASE_URL=http://localhost:3000
REACT_APP_ENABLE_MOCK_MODE=true
REACT_APP_ENABLE_DEBUG_MODE=true
```

#### **Production (.env.production)**
```env
NODE_ENV=production
REACT_APP_PROD_API_URL=https://api.brightpath.com/api
REACT_APP_PROD_BASE_URL=https://brightpath.com
REACT_APP_ENABLE_MOCK_MODE=false
REACT_APP_ENABLE_DEBUG_MODE=false
```

#### **Tests (.env.test)**
```env
NODE_ENV=test
REACT_APP_TEST_API_URL=http://localhost:3001/api
REACT_APP_TEST_BASE_URL=http://localhost:3000
REACT_APP_ENABLE_MOCK_MODE=true
REACT_APP_ENABLE_DEBUG_MODE=false
```

### **2. Configuration Centralisée**

```typescript
// src/config/environment.ts
export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  API_URLS: {
    development: process.env.REACT_APP_DEV_API_URL || 'http://localhost:3001/api',
    production: process.env.REACT_APP_PROD_API_URL || 'https://api.brightpath.com/api',
    test: process.env.REACT_APP_TEST_API_URL || 'http://localhost:3001/api'
  },
  
  FEATURES: {
    mockMode: process.env.REACT_APP_ENABLE_MOCK_MODE === 'true',
    debugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true'
  }
};
```

## 🚀 Utilisation

### **Développement Local**

```bash
# Démarrer en mode développement
npm start

# L'application utilise automatiquement :
# - API: http://localhost:3001/api
# - Base URL: http://localhost:3000
# - Mode Mock: Activé (si API non disponible)
```

### **Production**

```bash
# Build pour la production
npm run build

# L'application utilise automatiquement :
# - API: https://api.brightpath.com/api
# - Base URL: https://brightpath.com
# - Mode Mock: Désactivé
```

### **Tests**

```bash
# Lancer les tests
npm test

# L'application utilise automatiquement :
# - API: http://localhost:3001/api
# - Base URL: http://localhost:3000
# - Mode Mock: Activé
```

## 🔄 Mode Mock

### **Quand est-il Activé ?**

Le mode mock s'active automatiquement quand :
1. `NODE_ENV === 'development'` OU `NODE_ENV === 'test'`
2. `REACT_APP_ENABLE_MOCK_MODE === 'true'`
3. L'API backend n'est pas accessible (erreur réseau)

### **Comportement**

```typescript
// Exemple dans applicationApiService.ts
if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
  console.warn('API backend non disponible, utilisation du mode mock');
  return this.mockGetApplications(filters);
}
```

### **Indicateur Visuel**

En mode développement, un badge jaune "Mode Mock" apparaît en bas à droite de l'écran.

## 🛠️ Configuration Avancée

### **Variables d'Environnement Personnalisées**

Vous pouvez surcharger les URLs par défaut :

```env
# .env.local (priorité la plus haute)
REACT_APP_DEV_API_URL=http://localhost:3002/api
REACT_APP_PROD_API_URL=https://api-staging.brightpath.com/api
```

### **Features Conditionnelles**

```typescript
// Activer/désactiver des fonctionnalités selon l'environnement
if (ENV_CONFIG.FEATURES.analytics) {
  // Initialiser Google Analytics
}

if (ENV_CONFIG.FEATURES.errorMonitoring) {
  // Initialiser Sentry
}
```

### **Logs de Debug**

En développement, la configuration est loggée au démarrage :

```javascript
// Console au démarrage en développement
🔧 Configuration Environnement: {
  NODE_ENV: "development",
  API_URL: "http://localhost:3001/api",
  BASE_URL: "http://localhost:3000",
  FEATURES: { mockMode: true, debugMode: true }
}
```

## 📋 Checklist de Déploiement

### **Avant le Déploiement en Production**

- [ ] Vérifier `NODE_ENV=production`
- [ ] Configurer `REACT_APP_PROD_API_URL`
- [ ] Configurer `REACT_APP_PROD_BASE_URL`
- [ ] Désactiver `REACT_APP_ENABLE_MOCK_MODE=false`
- [ ] Désactiver `REACT_APP_ENABLE_DEBUG_MODE=false`
- [ ] Tester le build de production localement

### **Avant le Déploiement en Staging**

- [ ] Créer un environnement staging
- [ ] Configurer les URLs staging
- [ ] Activer les logs de debug
- [ ] Tester l'intégration API

## 🔍 Dépannage

### **Problème : Mauvaise URL d'API**

1. **Vérifier NODE_ENV** :
   ```bash
   echo $NODE_ENV
   ```

2. **Vérifier les variables d'environnement** :
   ```bash
   # Dans la console du navigateur
   console.log(process.env.REACT_APP_DEV_API_URL);
   ```

3. **Redémarrer l'application** après modification des variables

### **Problème : Mode Mock Non Activé**

1. **Vérifier la configuration** :
   ```typescript
   console.log('NODE_ENV:', process.env.NODE_ENV);
   console.log('Mock Mode:', process.env.REACT_APP_ENABLE_MOCK_MODE);
   ```

2. **Vérifier la connectivité API** :
   ```bash
   curl http://localhost:3001/api/health
   ```

## 📚 Ressources

- [Documentation React - Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Documentation Node.js - NODE_ENV](https://nodejs.org/api/process.html#process_process_env)
- [Guide de Déploiement](DEPLOYMENT.md)

---

Ce système permet une gestion transparente des environnements sans modification de code ! 🎯 