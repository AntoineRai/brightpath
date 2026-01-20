# Accessibilité (a11y) — BrightPath

## 🎯 Objectif

BrightPath vise une expérience **accessible à toutes et tous**, y compris :
- navigation **au clavier** (sans souris),
- utilisation avec **lecteurs d’écran**,
- besoins liés à la **vision** (contrastes, zoom), à la **motricité**, ou à la **cognition**.

Référence cible : **WCAG 2.2 niveau AA** (bonnes pratiques web largement reconnues).

---

## 📌 Principes à respecter (résumé)

- **Perceptible** : contenu lisible, contrastes suffisants, alternatives textuelles.
- **Utilisable** : tout est faisable au clavier, focus visible, pas de pièges.
- **Compréhensible** : libellés clairs, erreurs explicites, langage cohérent.
- **Robuste** : HTML sémantique, ARIA seulement si nécessaire, compatibilité AT (assistive tech).

---

## ⌨️ Navigation clavier

### Exigences
- **Tout** ce qui est interactif doit être atteignable via `Tab` / `Shift+Tab`.
- L’ordre de tabulation doit suivre une logique **visuelle et fonctionnelle**.
- Le **focus doit être visible** en toutes circonstances (ne pas le supprimer).
- Aucun “piège clavier” (ex. un composant qui bloque le focus).

### Points d’attention dans BrightPath
- Le menu mobile (“hamburger”) doit avoir un nom accessible via `aria-label` et/ou du texte visible.
- Les éléments décoratifs ne doivent pas polluer la navigation clavier.

---

## 🧱 Structure sémantique & titres

### Exigences
- Utiliser des éléments sémantiques : `header`, `nav`, `main`, `footer`, `section`, `form`, `button`.
- Un seul **`h1`** principal par page, puis hiérarchie (`h2`, `h3`, …) sans sauts illogiques.
- Les liens doivent décrire leur destination (éviter “Cliquez ici”).

### Recommandation
Ajouter un lien “**Aller au contenu principal**” (skip link) en haut de page pour accélérer la navigation clavier/lecteur d’écran.

---

## 🧾 Formulaires (labels, aide, erreurs)

### Exigences
- Chaque champ doit avoir un **`label`** associé (`htmlFor`/`id`) ou un nom accessible équivalent.
- Les champs requis doivent être indiqués clairement (visuellement + accessible).
- Les erreurs doivent :
  - expliquer **quoi** corriger et **où**,
  - être **annoncées** aux lecteurs d’écran (ex. zone avec `role="alert"`),
  - idéalement donner le focus au premier champ en erreur.

### Exemples déjà présents
- Les pages comme `Login` et des formulaires comme `ApplicationForm` utilisent déjà des `label`.

### À éviter
- `alert(...)` pour les erreurs de validation : cela peut être brutal, difficile à relire, et peu contrôlable.

---

## 🎨 Couleurs, contrastes, thèmes

### Exigences
- Contraste texte/fond conforme AA (en pratique : viser **≥ 4.5:1** pour texte normal, **≥ 3:1** pour gros texte).
- Ne jamais transmettre une information **uniquement par la couleur** (ajouter texte/icone/forme).
- Assurer le support du **zoom navigateur** (jusqu’à 200%) et des tailles de texte.

### Points d’attention
- Les nuances “gris sur gris” et certains bleus/cyans peuvent tomber sous le seuil de contraste selon les fonds.

---

## 🔊 Icônes & SVG

### Exigences
- Icônes décoratives : `aria-hidden="true"` (ou `focusable="false"` selon besoin) et ne doivent pas être lues.
- Icônes porteuses de sens (ex. bouton “Déconnexion” sans texte) : fournir un **nom accessible** (`aria-label`) et/ou du texte visible.

---

## 🧭 Composants dynamiques (menus, modales, notifications)

### Menu mobile
Pour un menu ouvrable/fermable :
- le bouton doit exposer `aria-expanded` et `aria-controls`,
- le panneau doit être identifiable,
- le focus ne doit pas “se perdre” à l’ouverture/fermeture.

### Modales / overlays (si ajoutés)
- piéger le focus **dans** la modale,
- fermer via `Esc`,
- rendre l’arrière-plan inactif (aria/inert), et
- rendre le focus à l’élément déclencheur à la fermeture.

### Messages d’état (chargement, succès, erreurs)
- charger/“spinner” : annoncer un état (`aria-busy`, texte “Chargement…”),
- erreurs globales : zone persistante `role="alert"` (ou `aria-live="assertive"`),
- confirmations : `aria-live="polite"`.

---

## 🎞️ Animations & préférences utilisateur

### Exigences
- Respecter `prefers-reduced-motion` (réduire/retirer les animations non essentielles).
- Éviter clignotements/animations agressives.

---

## 🧪 Tests & contrôle qualité a11y

### Tests manuels (à chaque feature UI)
- **Clavier uniquement** : parcours complet d’une page (navigation + actions principales).
- **Zoom 200%** : vérifier que tout reste utilisable (pas de contenu coupé).
- **Mode contraste élevé** (Windows) : vérifier lisibilité et focus.

### Tests automatisés (recommandé)
- Audit Lighthouse “Accessibilité”.
- Intégrer des tests a11y (ex. `axe-core` / `jest-axe`) sur les composants critiques.

---

## ✅ Checklist rapide (avant PR)

- **Navigation** : tout est accessible au clavier, focus visible, ordre logique.
- **Noms accessibles** : boutons/icônes ont un libellé pertinent.
- **Formulaires** : labels présents, erreurs compréhensibles et annoncées.
- **Couleurs** : contrastes OK, pas d’info uniquement par la couleur.
- **Structure** : titres hiérarchisés, landmarks (`nav`, `main`…).
- **Dynamique** : menus/modales gèrent focus + `aria-expanded`/`aria-controls`.

