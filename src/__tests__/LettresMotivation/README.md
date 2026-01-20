# Tests Unitaires - Module Lettres de Motivation

Ce dossier contient tous les tests unitaires pour la partie Lettres de Motivation de l'application BrightPath.

## Structure des Tests

### Services Testés

1. **aiApiService.test.ts** - Tests pour le service d'intelligence artificielle
   - Génération de lettres de motivation
   - Gestion des erreurs réseau
   - Mode mock en développement
   - Validation des données

### Pages Testées

2. **LettresMotivation.test.tsx** - Tests pour la page principale de génération de lettres
   - Gestion des formulaires
   - Génération IA
   - Aperçu en temps réel
   - Exportation PDF et copie

### Utilitaires Testés

3. **pdfUtils.test.ts** - Tests pour les utilitaires de génération PDF
   - Formatage de la lettre
   - Calcul des positions
   - Validation des données
   - Gestion des erreurs

### Tests d'Intégration

4. **integration.test.tsx** - Tests d'intégration pour le flux complet
   - Création complète d'une lettre
   - Gestion des erreurs
   - Persistance des données
   - Exportation

## Couverture des Tests

### aiApiService
- ✅ Génération de lettres de motivation
- ✅ Gestion des erreurs réseau
- ✅ Mode mock en développement
- ✅ Gestion des timeouts
- ✅ Validation des réponses API
- ✅ Gestion des tokens d'authentification
- ✅ Champs optionnels (destinataire)

### LettresMotivation
- ✅ Affichage du formulaire complet
- ✅ Saisie des informations personnelles
- ✅ Saisie des informations entreprise
- ✅ Génération IA du contenu
- ✅ Validation des champs requis
- ✅ Aperçu en temps réel
- ✅ Exportation PDF
- ✅ Copie dans le presse-papiers
- ✅ Gestion des états de chargement
- ✅ Messages de succès et d'erreur

### pdfUtils
- ✅ Formatage de l'en-tête de lettre
- ✅ Formatage de la date
- ✅ Formatage de l'adresse entreprise
- ✅ Formatage du contenu long
- ✅ Gestion des paragraphes
- ✅ Calcul des positions PDF
- ✅ Validation des données personnelles
- ✅ Génération des noms de fichiers
- ✅ Gestion des erreurs PDF

### Tests d'Intégration
- ✅ Flux complet de création de lettre
- ✅ Gestion des erreurs de génération
- ✅ Validation progressive des champs
- ✅ Modification manuelle du contenu
- ✅ Gestion du destinataire optionnel
- ✅ Persistance des données
- ✅ États de chargement
- ✅ Exportation avec contenu manuel

## Exécution des Tests

### Lancer tous les tests
```bash
npm test
```

### Lancer uniquement les tests de lettres de motivation
```bash
npm test -- --testPathPattern=LettresMotivation
```

### Lancer un test spécifique
```bash
npm test -- --testNamePattern="LettresMotivation"
```

### Lancer les tests en mode watch
```bash
npm test -- --watch
```

### Générer un rapport de couverture
```bash
npm test -- --coverage --testPathPattern=LettresMotivation
```

## Bonnes Pratiques Utilisées

### 1. Organisation des Tests
- Tests groupés par fonctionnalité
- Nommage clair des tests
- Structure AAA (Arrange, Act, Assert)

### 2. Mocking
- Mock des services externes (AI API)
- Mock des dépendances PDF (jsPDF, html2canvas)
- Mock des APIs du navigateur (Clipboard, URL)
- Mock des contextes sécurisés

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
- ✅ Création complète d'une lettre de motivation
- ✅ Saisie de toutes les informations
- ✅ Génération IA du contenu
- ✅ Aperçu en temps réel
- ✅ Exportation PDF
- ✅ Copie dans le presse-papiers
- ✅ Modification manuelle du contenu

### Cas Limites
- ✅ Formulaires vides
- ✅ Champs partiellement remplis
- ✅ Contenu très long
- ✅ Destinataire optionnel
- ✅ Caractères spéciaux dans les noms

### Cas d'Erreur
- ✅ Erreurs réseau
- ✅ Erreurs API
- ✅ Timeouts
- ✅ Erreurs de génération PDF
- ✅ Erreurs de validation
- ✅ Erreurs de copie

### Cas d'Intégration
- ✅ Flux complet de création
- ✅ Persistance des données
- ✅ Gestion des états
- ✅ Synchronisation entre composants
- ✅ Exportation avec différents contenus

## Fonctionnalités Testées

### Formulaire de Saisie
- ✅ Validation des champs requis
- ✅ Formatage des données
- ✅ Gestion des champs optionnels
- ✅ Interface utilisateur responsive

### Génération IA
- ✅ Appel au service IA
- ✅ Gestion des réponses
- ✅ Gestion des erreurs
- ✅ Mode mock en développement
- ✅ États de chargement

### Aperçu en Temps Réel
- ✅ Affichage des informations personnelles
- ✅ Affichage des informations entreprise
- ✅ Affichage du contenu
- ✅ Gestion du destinataire optionnel
- ✅ Mise à jour dynamique

### Exportation
- ✅ Génération PDF
- ✅ Copie dans le presse-papiers
- ✅ Validation du contenu avant export
- ✅ Gestion des erreurs d'export
- ✅ Nommage des fichiers

### Services IA
- ✅ Génération de contenu
- ✅ Gestion des erreurs
- ✅ Mode mock
- ✅ Authentification
- ✅ Validation des données

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

## Spécificités du Module Lettres de Motivation

### Gestion des Formulaires
- Tests de validation des champs requis
- Tests de saisie des informations personnelles
- Tests de saisie des informations entreprise
- Tests de gestion du destinataire optionnel

### Génération IA
- Tests des appels à l'API de génération
- Tests de gestion des erreurs d'IA
- Tests du mode mock pour le développement
- Tests des états de chargement

### Aperçu en Temps Réel
- Tests de mise à jour dynamique de l'aperçu
- Tests d'affichage des informations
- Tests de formatage du contenu
- Tests de gestion des champs optionnels

### Exportation
- Tests de génération PDF
- Tests de copie dans le presse-papiers
- Tests de validation avant export
- Tests de gestion des erreurs d'export

### Validation des Données
- Tests de validation des informations personnelles
- Tests de validation des informations entreprise
- Tests de validation du contenu
- Tests de gestion des caractères spéciaux
