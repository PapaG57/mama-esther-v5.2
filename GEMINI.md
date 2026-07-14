# 📜 Guide de Développement - Mama Esther v5.2 (ONG Moderne)

Ce fichier contient les directives architecturales et visuelles pour la nouvelle version "ONG Moderne" de l'association.

## 1. Vision du Design (v5.2)
- **Style Institutionnel :** Le site adopte les codes des grandes ONG (espacements larges, typographie massive, Storytelling).
- **Charte Graphique (Cameroun) :**
    - **Vert (#007a5e) :** Structure, confiance, sérénité.
    - **Rouge (#ce1126) :** Urgence, appel au don (CTA), tags importants.
    - **Jaune (#fcd116) :** Accents, lumière, badges de réussite.
- **Formes :** Utiliser des arrondis généreux (**24px à 40px**) pour un aspect chaleureux et humain.
- **Ombres :** Uniquement des ombres douces et diffuses (0 20px 40px rgba(0,0,0,0.05)). Éviter le noir pur.

## 2. Structure des Pages
- **Home :** Structure "Hero > Stats > Missions > Actu > CTA" implémentée.
- **Modales :** Toujours centrées, format "Fiche Portrait", hauteur max 90vh avec scroll interne et bouton close sticky.
- **Responsive :** Priorité absolue. Vérifier chaque section sur mobile (empilement vertical, réduction des photos).

## 3. Technique
- **Projet :** React (Vite)
- **Routes :** Définies dans src/App.jsx.
- **I18n :** Les traductions sont centralisées dans src/locales/. Toujours utiliser le hook useTranslation.
- **Backend :** API Express située dans /backend-newsletter.

## 4. État d'avancement (Mise à jour Finale V5.2)
- [x] **Global Styles :** Variables CSS standardisées dans `src/index.css` (couleurs, arrondis, ombres, boutons v2).
- [x] **Home Page :** Structure V2 finalisée avec styles unifiés (`src/pages/HomeV2.css`).
- [x] **Composants Shared :** Navbar, Footer et ScrollToTopButton mis à jour avec le nouveau design system.
- [x] **Pages V2 :** TOUTES les pages (About, Actuality, Contact, Don, Travaux, Missions, Admin, MentionsLegales, Unsubscribe, 404) sont désormais en V2.
- [x] **Ménage :** Suppression de tous les anciens fichiers CSS et composants obsolètes pour un projet propre.
- [x] **Fixes :** Correction des imports relatifs, du parsing package.json et des scories de traduction.

## 5. Mémo pour la prochaine session (Reprise après migration PostgreSQL - Avril 2026)
**État actuel :**
- [x] **Correctif Page Blanche :** Import de `useEffect` et `apiClient` ajouté dans `App.jsx`.
- [x] **Restaurations V5 :**
    - Envoi d'e-mail automatique lors des dons (Remerciement + Admin) via `donationController.js`.
    - Système de **Diffusion Newsletter** (Mass Mailing) ajouté dans l'éditeur et le backend.
    - **Page Contact :** ✅ Enregistrement des messages fonctionnel en local et sur le serveur web.
- [x] **Inscription Newsletter :** ✅ RÉSOLU. Inscription rendue non-bloquante vis-à-vis du SMTP (évite les erreurs 500).
- [x] **Migration PostgreSQL :** ✅ RÉSOLU. Abandon de MongoDB/SQLite au profit de **PostgreSQL (Supabase)**.
- [x] **Connexion PostgreSQL en local (Supavisor) :** ✅ RÉSOLU. Passage par le pooler Supavisor (port 6543) pour contourner le problème des adresses IPv6-only de Supabase incompatibles avec certains réseaux locaux / Node.
- [x] **Correctif Page Blanche (Clarity) :** ✅ RÉSOLU. Correction de l'import de la bibliothèque `@microsoft/clarity` dans `src/main.jsx` (import par défaut à la place d'un export nommé inexistant).
- [x] **Nettoyage Favicon :** ✅ RÉSOLU. Correction du chemin d'accès dans `index.html` pour supprimer l'avertissement de Vite.
- [x] **Design & Responsivité :**
    - Admin V2 et Contact V2 100% responsive (Flexbox).
    - Nettoyage de `App.css` (suppression du max-width 1280px qui bloquait la fluidité).
    - Hero Home corrigé pour mobile (padding 150px pour libérer la Navbar).
    - Logo FG DEV (`New_Logo_FG_DEV256.png`) corrigé, agrandi et espacé dans le Footer.
- [x] **Debug SMTP :** Activation du mode `debug: true` dans le backend.

**À RÉGLER (Priorités) :**
1. **Validation Finale :** 🔍 Re-tester tous les formulaires sur le site (Newsletter, Contact, Dons) pour confirmer la liaison avec PostgreSQL.
2. **Récupération des données :** 📥 Vérifier si toutes les données critiques ont été migrées depuis l'ancienne base.
3. **Sync & Déploiement :** 🚀 Finaliser le déploiement sur Render avec les variables d'environnement PostgreSQL.
4. **Optimisation :** ⚡ Améliorer les temps de réponse si nécessaire (Render Free Tier "cold start").

---
*Note : Tout le travail sur les e-mails personnalisés et les corrections frontend a été sauvegardé.*

## 6. Guide de Déploiement Hybride (LWS / Render)
Cette configuration sépare le Frontend statique (LWS) du Backend dynamique (Render).

### A. Backend (Render)
1. **Dashboard Render :** Créer un "Web Service" lié au dossier `backend-newsletter/`.
2. **Variables d'env :** Ajouter `POSTGRES_URI`, `JWT_SECRET`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SENDER`, `EMAIL_PASSWORD`, `ADMIN_EMAIL`.
3. **Commandes :** 
   - Build : `npm install`
   - Start : `node server.js`
4. **URL :** Récupérer l'URL générée (ex: `https://mama-esther-api.onrender.com`).

### B. Frontend (LWS)
Le frontend doit être "buildé" localement avant l'envoi FTP sur LWS pour intégrer l'URL de l'API Render.
1. **Fichier `.env.production` :** Créer ce fichier à la racine (front) avec :
   `VITE_API_URL=https://[TON-URL-RENDER].onrender.com/api`
2. **Build :** Lancer `npm run build`. Vite injectera l'URL dans les fichiers minifiés.
3. **Déploiement :** Envoyer le contenu du dossier `dist/` sur le FTP LWS.
4. **Config Dynamique (Optionnel) :** Si besoin de changer l'URL sans rebuild, modifier `public/config.js` sur le FTP :
   ```javascript
   window.APP_CONFIG = { API_URL: "https://[NOUVELLE-URL].onrender.com/api" };
   ```

---
*Note : La version v5.2 est prête pour la mise en production. La stabilité SMTP et le suivi Clarity sont opérationnels.*
