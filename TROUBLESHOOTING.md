# 🔧 Guide de Dépannage - BrightPath

## 📋 Problèmes Courants et Solutions

---

## 🚨 Erreur de Connexion API

### **Erreur : `ERR_CONNECTION_REFUSED`**

```
POST http://localhost:3001/api/auth/login net::ERR_CONNECTION_REFUSED
```

#### **Causes Possibles**
1. **Backend non démarré** : Le serveur backend n'est pas en cours d'exécution
2. **Port incorrect** : Le backend écoute sur un port différent
3. **URL incorrecte** : L'URL de l'API est mal configurée
4. **Firewall** : Le pare-feu bloque la connexion

#### **Solutions**

##### **1. Vérifier si le Backend est Démarré**
```bash
# Windows
netstat -an | findstr :3001

# macOS/Linux
lsof -i :3001
```

**Résultat attendu :**
```
TCP    0.0.0.0:3001    0.0.0.0:0    LISTENING
```

##### **2. Démarrer le Backend**
```bash
# Naviguer vers le dossier backend
cd ../backend  # ou le chemin vers votre backend

# Installer les dépendances
npm install

# Démarrer le serveur
npm start
```

##### **3. Vérifier la Configuration**
```bash
# Vérifier le fichier .env.local
cat .env.local

# S'assurer que l'URL est correcte
REACT_APP_API_URL=http://localhost:3001/api
```

##### **4. Tester l'API Manuellement**
```bash
# Test avec curl
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@brightpath.com","password":"password"}'
```

---

## 🎭 Mode Mock (Développement)

### **Quand l'API n'est pas Disponible**

Le frontend inclut un **mode mock** qui s'active automatiquement en développement quand l'API backend n'est pas accessible.

#### **Indicateur Visuel**
- **Badge jaune** en bas à droite : "Mode Mock"
- **Console** : Message d'avertissement

#### **Fonctionnalités Mock**
- ✅ Connexion avec n'importe quel email/password
- ✅ Génération de tokens mock
- ✅ Interface utilisateur complète
- ✅ Navigation entre les pages

#### **Désactiver le Mode Mock**
```typescript
// Dans src/services/authService.ts
// Commenter ou supprimer la section mock
```

---

## 🔐 Problèmes d'Authentification

### **Erreur : `Token invalide`**

#### **Solutions**
1. **Vider le localStorage**
```javascript
// Dans la console du navigateur
localStorage.clear();
```

2. **Redémarrer l'application**
```bash
npm start
```

3. **Vérifier les tokens**
```javascript
// Dans la console du navigateur
console.log('Token:', localStorage.getItem('authToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
```

### **Erreur : `401 Unauthorized`**

#### **Solutions**
1. **Se reconnecter**
2. **Vérifier l'expiration des tokens**
3. **Redémarrer le backend**

---

## 🌐 Problèmes CORS

### **Erreur : `CORS policy`**

```
Access to fetch at 'http://localhost:3001/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

#### **Solutions**

##### **1. Configuration Backend**
```javascript
// Dans le backend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

##### **2. Vérifier les Headers**
```javascript
// Dans le frontend
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

---

## 📱 Problèmes de Performance

### **Lenteur de l'Application**

#### **Solutions**
1. **Vérifier les requêtes réseau**
   - Ouvrir les DevTools (F12)
   - Onglet Network
   - Identifier les requêtes lentes

2. **Optimiser les images**
   - Compresser les images
   - Utiliser des formats modernes (WebP)

3. **Vérifier la mémoire**
   - Onglet Performance des DevTools
   - Identifier les fuites mémoire

---

## 🧪 Problèmes de Tests

### **Erreur : `Tests qui échouent`**

#### **Solutions**
1. **Vérifier l'environnement de test**
```bash
# Variables d'environnement pour les tests
REACT_APP_API_URL=http://localhost:3001/api
NODE_ENV=test
```

2. **Nettoyer le cache**
```bash
npm run test -- --clearCache
```

3. **Vérifier les mocks**
```typescript
// S'assurer que les mocks sont corrects
jest.mock('../services/authService');
```

---

## 🔧 Problèmes de Build

### **Erreur : `Build failed`**

#### **Solutions**
1. **Nettoyer le cache**
```bash
rm -rf node_modules
rm -rf build
npm install
```

2. **Vérifier les variables d'environnement**
```bash
# S'assurer que toutes les variables sont définies
echo $REACT_APP_API_URL
```

3. **Vérifier les imports**
```typescript
// S'assurer que tous les imports sont corrects
import { Component } from 'react';
```

---

## 📊 Problèmes de Déploiement

### **Erreur : `404 Not Found`**

#### **Solutions**
1. **Configuration du serveur**
   - SPA routing (React Router)
   - Redirection vers index.html

2. **Variables d'environnement de production**
```env
REACT_APP_API_URL=https://api.brightpath.com/api
NODE_ENV=production
```

---

## 🆘 Obtenir de l'Aide

### **Informations à Fournir**
1. **Erreur complète** : Message d'erreur et stack trace
2. **Environnement** : OS, version Node.js, navigateur
3. **Étapes de reproduction** : Comment reproduire le problème
4. **Configuration** : Variables d'environnement (sans secrets)

### **Outils de Diagnostic**
```bash
# Informations système
node --version
npm --version
npx create-react-app --version

# Vérifier les ports
netstat -an | findstr :3000
netstat -an | findstr :3001

# Logs de l'application
npm start 2>&1 | tee app.log
```

---

## ✅ Checklist de Dépannage

### **Problème de Connexion API**
- [ ] Backend démarré sur le bon port
- [ ] URL de l'API correcte dans .env.local
- [ ] Pas de pare-feu qui bloque
- [ ] CORS configuré côté backend

### **Problème d'Authentification**
- [ ] Tokens valides dans localStorage
- [ ] Backend accessible
- [ ] Variables d'environnement correctes
- [ ] Pas d'erreurs dans la console

### **Problème de Performance**
- [ ] Requêtes réseau optimisées
- [ ] Images compressées
- [ ] Pas de fuites mémoire
- [ ] Cache configuré

---

Ce guide couvre les problèmes les plus courants. Si votre problème n'est pas listé, consultez la documentation officielle ou contactez l'équipe de développement ! 🚀 