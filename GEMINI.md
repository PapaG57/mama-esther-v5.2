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

## 5. Mémo pour la prochaine session (Reprise Déploiement - Mars 2026 - Suite)
**État actuel :**
- [x] **Correctif Emails :** Passage au port 587 + `secure: false` dans `send-email.js`.
- [x] **Config Frontend :** `public/config.js` pointe vers Render.
- [x] **Optimisation Render :** Timeout Axios augmenté à 60s + Ping de réveil (cold start) ajouté dans `App.jsx`.
- [x] **CORS :** Configuration mise à jour dans `server.js` pour accepter `localhost`, `mamaesther.org` (avec et sans www) et les requêtes sans origine (Postman).

**À FAIRE : Finalisation (Demain)**
1. **Validation Backend :** Faire un test **Postman** sur `https://mama-esther-backend.onrender.com/api/contact` pour confirmer que le serveur répond (JSON : name, email, subject, message).
2. **Sync Frontend :** Refaire `npm run build` et renvoyer le dossier `dist` sur LWS pour inclure le ping de réveil et le nouveau timeout.
3. **Nettoyage Serveur :** Renommer/Supprimer le fichier `default_index.html` (17Mo) sur LWS s'il bloque l'affichage du site.
4. **Test Réel :** Valider l'envoi d'un message de contact et une inscription newsletter depuis le site en ligne.

---
*Note : La version v5.2 est en ligne. Le moteur (Render) doit maintenant être synchronisé avec le front (LWS).*
