### Modifications apportées à `src/pages/AdminNewsletterEditor.jsx`

**1. Ajout d'un bouton pour la modale Gemini 2.5 Flash**

- Un nouveau bouton a été ajouté dans la barre latérale gauche (actions principales) avec l'icône Gemini. Ce bouton permet d'ouvrir la modale "Gemini 2.5 Flash".

**2. Intégration de la modale "Gemini 2.5 Flash"**

- Une nouvelle modale a été créée et intégrée au composant `AdminNewsletterEditor`. Elle est conditionnellement rendue (`showGeminiModal`).
- Cette modale comprend :
  - Un titre "Gemini 2.5 Flash" avec le logo Gemini.
  - Une première zone de texte (`textarea`) pour la saisie du prompt utilisateur (`geminiPrompt`).
  - Un bouton "Générer" qui, une fois cliqué, déclenche la fonction `handleGenerateInModal` pour effectuer un appel direct à l'API Gemini de Google (front-end) en utilisant `import.meta.env.VITE_GEMINI_API_KEY`, et met à jour `geminiGeneratedText`.
  - Une deuxième zone de texte (`textarea`, en lecture seule) pour afficher le texte généré (`geminiGeneratedText`).
  - Un bouton "Copier" qui copie le texte généré dans le presse-papiers avec un retour visuel rapide (`copySuccess`).
  - Un bouton "Fermer" qui ferme la modale et réinitialise les champs.

### Modifications apportées à `src/pages/AdminNewsletterEditor.jsx`

**1. Ajout d'un bouton pour la modale Gemini 2.5 Flash**

- Un nouveau bouton a été ajouté dans la barre latérale gauche (actions principales) avec l'icône Gemini. Ce bouton permet d'ouvrir la modale "Gemini 2.5 Flash".

**2. Intégration de la modale "Gemini 2.5 Flash"**

- Une nouvelle modale a été créée et intégrée au composant `AdminNewsletterEditor`. Elle est conditionnellement rendue (`showGeminiModal`).
- Cette modale comprend :
  - Un titre "Gemini 2.5 Flash" avec le logo Gemini.
  - Une première zone de texte (`textarea`) pour la saisie du prompt utilisateur (`geminiPrompt`).
  - Un bouton "Générer" qui, une fois cliqué, déclenche la fonction `handleGenerateInModal` pour effectuer un appel direct à l'API Gemini de Google (front-end) en utilisant `import.meta.env.VITE_GEMINI_API_KEY`, et met à jour `geminiGeneratedText`.
  - Une deuxième zone de texte (`textarea`, en lecture seule) pour afficher le texte généré (`geminiGeneratedText`).
  - Un bouton "Copier" qui copie le texte généré dans le presse-papiers avec un retour visuel rapide (`copySuccess`).
  - Un bouton "Fermer" qui ferme la modale et réinitialise les champs.

**3. Modification du bouton "Aide Gemini" pour les blocs d'articles**

- Le bouton "Aide Gemini" situé dans chaque bloc d'article a été modifié. Son `onClick` déclenche désormais `handleOpenGeminiModalForBlock(block.id)`, ce qui ouvre la modale Gemini et pré-remplit le champ du prompt avec le contenu existant du bloc. La fonction de génération backend (`newsletterService.aiGenerate`) est maintenant uniquement appelée via le bouton "Générer" à l'intérieur de la modale.

**4. Remplacement des emojis par des icônes SVG dans la barre d'outils IA**

- Les emojis "✨" (Texte), "🔍" (Photo) et "🎨" (Générer IA) dans les boutons de la barre d'outils `ia-toolbar` ont été remplacés par des icônes SVG modernes et épurées.
- Le fichier `src/styles/AdminNewsletterEditor.css` a été mis à jour pour s'assurer que les icônes SVG dans `.btn-ia-compact` ont une taille fixe (16px x 16px) et sont parfaitement alignées verticalement avec le texte.

**5. Gestion des états React (`useState`)**

- Plusieurs nouveaux états ont été introduits pour gérer le comportement de la modale Gemini :
  - `showGeminiModal`: (boolean) Contrôle l'ouverture et la fermeture de la modale.
  - `geminiPrompt`: (string) Stocke le texte saisi par l'utilisateur dans la zone de prompt.
  - `geminiGeneratedText`: (string) Stocke le texte généré par l'IA.
  - `geminiLoading`: (boolean) Indique si la génération de texte est en cours, affichant un spinner et désactivant le bouton "Générer" si vrai.
  - `copySuccess`: (boolean) Gère le retour visuel après la copie du texte dans le presse-papiers.
  - `currentBlockIdForGemini`: (string | null) Stocke l'ID du bloc d'article à partir duquel la modale Gemini a été ouverte, permettant de contextuliser le prompt.

**6. Ajout et structuration du CSS de la modale**

- Tous les styles relatifs à la modale "Gemini 2.5 Flash" (positionnement overlay, flexbox/grid, boutons, textareas) ont été déplacés et ajoutés au fichier `src/styles/AdminNewsletterEditor.css`. Cela inclut le style de l'overlay, du conteneur de la modale, de son en-tête, du corps, des zones de texte et des boutons d'action, ainsi que des ajustements responsifs.

- Le bouton "Aide Gemini" situé dans chaque bloc d'article a été modifié. Son `onClick` déclenche désormais `handleOpenGeminiModalForBlock(block.id)`, ce qui ouvre la modale Gemini et pré-remplit le champ du prompt avec le contenu existant du bloc. La fonction de génération backend (`newsletterService.aiGenerate`) est maintenant uniquement appelée via le bouton "Générer" à l'intérieur de la modale.

  **4. Gestion des états React (`useState`)**

- Plusieurs nouveaux états ont été introduits pour gérer le comportement de la modale Gemini :
  - `showGeminiModal`: (boolean) Contrôle l'ouverture et la fermeture de la modale.
  - `geminiPrompt`: (string) Stocke le texte saisi par l'utilisateur dans la zone de prompt.
  - `geminiGeneratedText`: (string) Stocke le texte généré par l'IA.
  - `geminiLoading`: (boolean) Indique si la génération de texte est en cours, affichant un spinner et désactivant le bouton "Générer" si vrai.
  - `copySuccess`: (boolean) Gère le retour visuel après la copie du texte dans le presse-papiers.
  - `currentBlockIdForGemini`: (string | null) Stocke l'ID du bloc d'article à partir duquel la modale Gemini a été ouverte, permettant de contextuliser le prompt.

**5. Ajout et structuration du CSS de la modale**

- Tous les styles relatifs à la modale "Gemini 2.5 Flash" (positionnement overlay, flexbox/grid, boutons, textareas) ont été déplacés et ajoutés au fichier `src/styles/AdminNewsletterEditor.css`. Cela inclut le style de l'overlay, du conteneur de la modale, de son en-tête, du corps, des zones de texte et des boutons d'action, ainsi que des ajustements responsifs.
