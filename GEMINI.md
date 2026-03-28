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

## 5. Mémo pour la prochaine session (Finalisation Déploiement - Mars 2026)
**État actuel :**
- [x] **Correctif Page Blanche :** Import de `useEffect` et `apiClient` ajouté dans `App.jsx`.
- [x] **E-mail de Contact :** Changement de `contact@` en `association@mamaesther.org`.
- [x] **Restaurations V5 :**
    - Envoi d'e-mail automatique lors des dons (Remerciement + Admin).
    - Ajout du champ Email dans l'Admin pour les dons manuels.
    - Système de **Diffusion Newsletter** (Mass Mailing) ajouté dans l'éditeur.
    - Enregistrement des messages de contact en base de données.
- [x] **Design & Responsivité :**
    - Admin V2 100% responsive.
    - Contact V2 100% responsive (Flexbox).
    - Hero Home corrigé pour mobile (décalage Navbar).
    - Logo FG DEV agrandi et lisible dans le Footer.
- [x] **Debug SMTP :** Activation du mode `debug: true` et `logger: true` dans le backend pour traquer les erreurs d'authentification.

**À FAIRE : Validation Finale**
1. **Fix .env :** Vérifier les identifiants SMTP pour corriger l'erreur `535 Auth Failed` en local.
2. **Sync GitHub :** Pousser les modifs backend pour le redéploiement Render.
3. **Build Front :** `npm run build` et déploiement du `dist` sur LWS.
4. **Nettoyage :** Supprimer `default_index.html` sur LWS.
5. **Test Réel :** Valider l'envoi d'un message et l'inscription newsletter en ligne.



---
*Note : La version v5.2 est en ligne. Le moteur (Render) doit maintenant être synchronisé avec le front (LWS).*
