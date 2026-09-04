# Mémoire & Structure - Association Mama Esther

## 1. Informations Générales & Stack Technique

- **Projet** : Application Web & Panneau d'Administration de l'Association "Mama Esther"
- **Développeur** : FG DEV / FG DEVELOPPEMENT
- **Frontend** : React (Vite), Tailwind CSS, i18next (support multilingue : FR/EN/etc.)
- **Backend** : Node.js, Express, Sequelize ORM (`/backend-newsletter`)
- **Base de données** : PostgreSQL hébergée sur Supabase
- **Environnement** : Windows, VS Code

---

## 2. Cartographie des Dossiers

### Frontend (`/src`)

- `src/pages/` : Pages de l'application (`Don.jsx`, `AdminNewsletterEditor.jsx`, etc.)
- `src/components/` : Composants UI réutilisables
- `src/locales/` : Fichiers de traduction (`fr/translation.json`, `en/translation.json`)

### Backend (`/backend-newsletter`)

- `backend-newsletter/routes/` : Endpoints Express (`admin.js`, etc.)
- `backend-newsletter/models/` : Modèles Sequelize (Utilisateurs, Newsletters, Dons)
- `backend-newsletter/config/` : Configuration Sequelize et connexion Supabase

---

## 3. Consignes Strictes & Inviolables pour l'IA

1. **Aucun agent autonome** : Ne jamais exécuter de commandes PowerShell, de scripts ou de recherches autonomes dans le terminal.
2. **Mode Édition Directe** : Fournir du code directement intégrable via `Ctrl + I` ou à copier-coller proprement.
3. **Indexation désactivée** : Ne pas chercher à scanner l'intégralité du disque dur. Se référer exclusivement aux fichiers mentionnés ou ciblés par `@folder` / `@PROJECT.md`.
4. **Encodage JSON** : Toujours préserver l'encodage **UTF-8 sans BOM** pour les fichiers de langue (`translation.json`).
5. **Économie de tokens** : Être direct, concis et ne pas proposer de refactorisations massives non demandées.

---

## 4. Historique des Développements & Mémoire du Projet

- **Juillet 2026** :
  - Lancement des initiatives d'aide et de suivi pour la structure de l'orphelinat au Cameroun.
- **Août 2026** :
  - Intégration du service centralisé d'inscription à la newsletter via Supabase (`/backend-newsletter`).
  - Sécurisation des clés API dans un volume chiffré dédié.
- **Septembre 2026** :
  - **Nettoyage du dépôt Git** : Suppression des fichiers de suivi obsolètes (`AGY.md`, `DEEPSEEK.md`, `CONTINUE.md`, `GEMINI.md`).
  - **Optimisation du workflow IA** : Désactivation du mode agent/indexation lourde de Continue pour stopper la surconsommation de crédits et les gels de VS Code.
  - **Centralisation de la documentation** : Création du présent `PROJECT.md` pour unifier la mémoire du projet.

---

## 5. Tâche Active & Prochaines Étapes

- [ ] **Priorité immédiate** : Débogage et validation de la route backend `PUT /change-credentials` (`/backend-newsletter/routes/admin.js`).
