# Données personnelles, RGPD et droit à l’oubli — BrightPath

## 📋 Contexte

BrightPath traite des informations liées à la **recherche d’emploi** (candidatures, CV, lettres de motivation, descriptions de poste, etc.).
Certaines fonctionnalités (optimisation de texte, génération de contenus) s’appuient sur une **API d’IA externe (ChatGPT / OpenAI)**.

Ce document explique :
- quels types de données peuvent transiter par l’API,
- ce que cela implique au regard du **RGPD** et du **droit à l’oubli**,
- les **bonnes pratiques** à respecter pour limiter les risques.

---

## 🧾 Types de données concernés

Suivant l’usage de l’application, les données suivantes peuvent être envoyées à l’API d’IA :
- **Contenus de CV** : expériences, missions, réalisations, intitulés de poste,
- **Lettres de motivation** : textes complets, arguments, contexte du poste,
- **Descriptions de poste** et **notes** sur une candidature,
- Potentiellement des **données personnelles** si l’utilisateur les saisit dans les zones de texte (nom, coordonnées, informations de tiers, etc.).

🔎 BrightPath **ne force pas** l’utilisateur à envoyer des données personnelles à l’IA, mais ne peut pas empêcher qu’elles soient saisies dans les champs libres.

---

## ☁️ Données envoyées à l’API ChatGPT / OpenAI

Lorsque vous utilisez les fonctionnalités “IA” :
- le texte saisi est **envoyé au serveur de l’API d’IA**,
- le traitement a lieu **en dehors** de BrightPath (infrastructure OpenAI ou fournisseur équivalent),
- la réponse est ensuite renvoyée à l’application.

Cela signifie que :
- les données **transitent** par un tiers (OpenAI),
- ce tiers **peut avoir accès** au contenu transmis (conformément à ses propres CGU et politique de confidentialité),
- BrightPath **ne contrôle pas** techniquement la façon dont ces données sont ultérieurement traitées ou conservées par ce tiers.

👉 Pour plus de détails sur ces traitements, consultez directement la documentation et la politique de confidentialité du fournisseur (OpenAI/ChatGPT).

---

## ⚖️ RGPD et droit à l’oubli

### Côté BrightPath

Pour les données stockées par BrightPath (dans sa propre base / stockage) :
- vous pouvez **demander la suppression** de vos données de compte et des données associées,
- vous pouvez **arrêter d’utiliser** l’application et/ou supprimer votre compte (si la fonctionnalité est proposée côté backend),
- BrightPath peut supprimer ou anonymiser les données qu’il contrôle.

### Côté API d’IA (ChatGPT / OpenAI)

Pour les données qui ont déjà été **envoyées** à l’API :
- elles ont été traitées par un **prestataire tiers** (OpenAI),
- le droit à l’oubli **au sens strict** ne peut pas être exercé **via BrightPath** pour ces données,
- toute demande de suppression/accès/modification concernant ces données doit passer par le **fournisseur de l’API** et ses propres procédures (si disponibles).

En pratique :
- BrightPath **ne peut pas garantir** la suppression rétroactive, côté OpenAI, des textes déjà envoyés,
- BrightPath **ne peut pas techniquement prouver** ni forcer l’effacement complet des données au sein des systèmes de ce tiers.

---

## 🔐 Responsabilités et limites

- **Responsabilité de BrightPath** :
  - limiter la collecte aux données nécessaires au fonctionnement de l’app,
  - documenter clairement l’usage de l’API d’IA et ses implications,
  - mettre en place des protections raisonnables côté frontend/backend (sécurité, chiffrement en transit, etc.).

- **Limites** :
  - BrightPath ne contrôle pas l’infrastructure ni les politiques internes d’OpenAI,
  - BrightPath ne peut ni auditer, ni certifier le comportement interne de cet acteur tiers.

---

## ✅ Bonnes pratiques recommandées aux utilisateurs

Pour réduire les risques et respecter au mieux le RGPD, il est fortement recommandé de :

- **Ne pas saisir** dans les champs traités par l’IA :
  - des **données sensibles** (santé, opinions politiques, religion, syndicat, orientation sexuelle, etc.),
  - des **données très personnelles** (numéro de sécurité sociale, coordonnées complètes, identifiant administratif, etc.),
  - des **informations sur des tiers** (collègues, managers, personnes citées dans les missions).

- **Anonymiser au maximum** :
  - utiliser des intitulés génériques (“Grande entreprise du secteur bancaire” plutôt que le nom exact),
  - éviter de citer des personnes ou des clients nommément.

- **Limiter la portée** :
  - n’envoyer à l’IA que le texte strictement nécessaire à l’optimisation ou à la génération,
  - retirer du texte toute information qui n’est pas utile à la tâche demandée.

---

## 📣 Résumé important

- Les fonctionnalités d’IA de BrightPath s’appuient sur une **API externe (ChatGPT / OpenAI)**.
- Les textes envoyés à l’IA peuvent contenir des données personnelles **si vous les saisissez** dans les champs concernés.
- Ces données sont alors **accessibles** au fournisseur de l’API, selon ses propres conditions d’utilisation.
- **BrightPath ne peut pas assurer ni gérer le droit à l’oubli pour les données déjà transmises à cette API**.
- Pour minimiser les risques, **évitez d’envoyer des données sensibles ou inutilement identifiantes** à l’IA et anonymisez au maximum vos contenus.

