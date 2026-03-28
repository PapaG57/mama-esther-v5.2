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

## 5. Mémo pour la prochaine session (Reprise après blocage SMTP - Mars 2026)
**État actuel :**
- [x] **Correctif Page Blanche :** Import de `useEffect` et `apiClient` ajouté dans `App.jsx`.
- [x] **Restaurations V5 :**
    - Envoi d'e-mail automatique lors des dons (Remerciement + Admin) via `donationController.js`.
    - Système de **Diffusion Newsletter** (Mass Mailing) ajouté dans l'éditeur et le backend.
    - Enregistrement des messages de contact en base de données (`models/Contact.js`).
- [x] **Design & Responsivité :**
    - Admin V2 et Contact V2 100% responsive (Flexbox).
    - Nettoyage de `App.css` (suppression du max-width 1280px qui bloquait la fluidité).
    - Hero Home corrigé pour mobile (padding 150px pour libérer la Navbar).
    - Logo FG DEV (`New_Logo_FG_DEV256.png`) corrigé, agrandi et espacé dans le Footer.
- [x] **Debug SMTP :** Activation du mode `debug: true` dans le backend.

**À RÉGLER (Priorités) :**
1. **Le "Mur" SMTP (LWS) :** L'authentification `florent.gerard@mamaesther.org` échoue systématiquement (Error 535) sur ports 465/587 en local, malgré des identifiants valides dans Outlook. 
   - *Piste :* Vérifier si SPA (Secure Password Auth) est requis ou si l'IP locale est bannie.
2. **Accès Admin (401) :** Le login admin en local est refusé.
   - *Action :* Créer un script de réinitialisation de l'admin en base de données.
3. **Sync & Déploiement :** Une fois le local OK, pousser sur GitHub/Render et faire le build final pour LWS.




---
*Note : La version v5.2 est en ligne. Le moteur (Render) doit maintenant être synchronisé avec le front (LWS).*
