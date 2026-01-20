# Tests Unitaires - Module Génération de CV

Ce dossier contient tous les tests unitaires pour la partie Génération de CV de l'application BrightPath.

## Structure des Tests

### Services Testés

1. **aiApiService.test.ts** - Tests pour le service d'intelligence artificielle
   - Génération de lettres de motivation
   - Professionnalisation de textes
   - Gestion des erreurs réseau
   - Mode mock en développement

### Pages Testées

2. **CVGenerator.test.tsx** - Tests pour la page principale de génération de CV
   - Navigation entre les étapes
   - Gestion des formulaires
   - Optimisation IA
   - Personnalisation des modèles

### Utilitaires Testés

3. **pdfUtils.test.ts** - Tests pour les utilitaires de génération PDF
   - Formatage de texte
   - Calcul des positions
   - Gestion des couleurs
   - Validation des données

### Tests d'Intégration

4. **integration.test.tsx** - Tests d'intégration pour le flux complet
   - Création complète d'un CV
   - Gestion de plusieurs expériences
   - Optimisation IA multiple
   - Persistance des données

## Couverture des Tests

### aiApiService
- ✅ Génération de lettres de motivation
- ✅ Professionnalisation de textes
- ✅ Gestion des erreurs réseau
- ✅ Mode mock en développement
- ✅ Gestion des timeouts
- ✅ Validation des réponses API
- ✅ Gestion des tokens d'authentification

### CVGenerator
- ✅ Navigation entre les 4 étapes
- ✅ Validation des champs requis
- ✅ Gestion des informations personnelles
- ✅ Gestion des expériences professionnelles
- ✅ Gestion des compétences et formations
- ✅ Personnalisation des modèles et couleurs
- ✅ Optimisation IA des descriptions
- ✅ Aperçu en temps réel
- ✅ Téléchargement PDF

### pdfUtils
- ✅ Formatage de texte long
- ✅ Calcul des positions PDF
- ✅ Formatage des dates françaises
- ✅ Validation des couleurs hexadécimales
- ✅ Gestion des modèles de CV
- ✅ Validation des données
- ✅ Gestion des erreurs PDF

### Tests d'Intégration
- ✅ Flux complet de création de CV
- ✅ Gestion de plusieurs expériences
- ✅ Optimisation IA multiple
- ✅ Changement de modèles
- ✅ Persistance des données
- ✅ Gestion des erreurs

## Exécution des Tests

### Lancer tous les tests
```bash
npm test
```

### Lancer uniquement les tests de génération de CV
```bash
npm test -- --testPathPattern=CVGeneration
```

### Lancer un test spécifique
```bash
npm test -- --testNamePattern="CVGenerator"
```

### Lancer les tests en mode watch
```bash
npm test -- --watch
```

### Générer un rapport de couverture
```bash
npm test -- --coverage --testPathPattern=CVGeneration
```

## Bonnes Pratiques Utilisées

### 1. Organisation des Tests
- Tests groupés par fonctionnalité
- Nommage clair des tests
- Structure AAA (Arrange, Act, Assert)

### 2. Mocking
- Mock des services externes (AI API)
- Mock des dépendances PDF (jsPDF, html2canvas)
- Mock des APIs du navigateur (URL, localStorage)

### 3. Données de Test
- Données de test réalistes
- Cas de test variés
- Gestion des cas limites

### 4. Assertions
- Assertions spécifiques et précises
- Vérification des appels de fonctions
- Test des états d'erreur

### 5. Interactions Utilisateur
- Utilisation de `userEvent` pour les interactions
- Tests des événements clavier/souris
- Simulation des comportements utilisateur

## Cas de Test Couverts

### Cas Normaux
- ✅ Création complète d'un CV
- ✅ Navigation entre les étapes
- ✅ Ajout/suppression d'expériences
- ✅ Gestion des compétences
- ✅ Optimisation IA
- ✅ Changement de modèles
- ✅ Téléchargement PDF

### Cas Limites
- ✅ Formulaires vides
- ✅ Textes très longs
- ✅ Dates invalides
- ✅ Couleurs invalides
- ✅ Modèles inexistants

### Cas d'Erreur
- ✅ Erreurs réseau
- ✅ Erreurs API
- ✅ Timeouts
- ✅ Erreurs de génération PDF
- ✅ Erreurs de validation

### Cas d'Intégration
- ✅ Flux complet de création
- ✅ Persistance des données
- ✅ Optimisation IA multiple
- ✅ Gestion des états
- ✅ Synchronisation entre composants

## Fonctionnalités Testées

### Étape 1: Informations Personnelles
- ✅ Validation des champs requis
- ✅ Formatage des données
- ✅ Navigation vers l'étape suivante

### Étape 2: Expérience Professionnelle
- ✅ Ajout/suppression d'expériences
- ✅ Validation des dates
- ✅ Optimisation IA des descriptions
- ✅ Gestion de plusieurs expériences

### Étape 3: Compétences et Formation
- ✅ Ajout/suppression de compétences
- ✅ Gestion des formations
- ✅ Validation des champs
- ✅ Interface utilisateur

### Étape 4: Personnalisation
- ✅ Sélection des modèles
- ✅ Personnalisation des couleurs
- ✅ Aperçu en temps réel
- ✅ Téléchargement PDF

### Services IA
- ✅ Génération de contenu
- ✅ Professionnalisation de textes
- ✅ Gestion des erreurs
- ✅ Mode mock
- ✅ Authentification

## Maintenance des Tests

### Ajout de Nouveaux Tests
1. Identifier la fonctionnalité à tester
2. Créer le fichier de test approprié
3. Suivre la structure existante
4. Ajouter les cas de test manquants

### Mise à Jour des Tests
1. Vérifier que les tests passent après les modifications
2. Mettre à jour les mocks si nécessaire
3. Ajouter des tests pour les nouvelles fonctionnalités
4. Maintenir la couverture de code

### Debugging des Tests
1. Utiliser `console.log` dans les tests
2. Lancer les tests en mode debug
3. Vérifier les mocks et les données de test
4. Utiliser les outils de développement Jest

## Métriques de Qualité

- **Couverture de Code** : Objectif > 90%
- **Temps d'Exécution** : < 30 secondes pour tous les tests
- **Fiabilité** : Tests non-flaky (pas d'échecs intermittents)
- **Maintenabilité** : Code de test lisible et bien documenté

## Dépendances

- `@testing-library/react` : Tests des composants React
- `@testing-library/user-event` : Simulation des interactions utilisateur
- `@testing-library/jest-dom` : Matchers DOM pour Jest
- `jest` : Framework de test
- `jspdf` : Mock pour la génération PDF
- `html2canvas` : Mock pour la conversion HTML vers image

## Notes Importantes

1. **Isolation** : Chaque test est indépendant
2. **Nettoyage** : Les mocks sont réinitialisés entre les tests
3. **Performance** : Les tests sont optimisés pour la vitesse
4. **Lisibilité** : Les tests sont auto-documentés
5. **Maintenabilité** : Structure modulaire et réutilisable

## Spécificités du Module CV

### Gestion des Étapes
- Tests de navigation entre les 4 étapes
- Validation des champs requis à chaque étape
- Persistance des données entre les étapes

### Optimisation IA
- Tests des appels à l'API d'optimisation
- Gestion des erreurs d'optimisation
- Mode mock pour le développement

### Génération PDF
- Tests des utilitaires de formatage
- Validation des paramètres PDF
- Gestion des erreurs de génération

### Personnalisation
- Tests des modèles de CV
- Validation des couleurs personnalisées
- Aperçu en temps réel
