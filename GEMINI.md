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

## 5. Mémo pour la prochaine session (Reprise Newsletters)
**État actuel :**
- Le "Studio Newsletter" (`AdminNewsletterEditor.jsx`) est prêt et fonctionnel.
- L'upload d'images via l'explorateur Windows est configuré.
- Le backend est prêt.

**À FAIRE : Créer la Newsletter n°3**
Utiliser ces textes extraits du PDF `newsletter3-octobre-2025.pdf` :

**🇫🇷 Version Française**
- **Titre :** Newsletter n°3 - Les murs s'élèvent !
- **Résumé :** Une édition spéciale retraçant les étapes majeures du chantier : de la pose symbolique de la première pierre à la fabrication spectaculaire du porche d'entrée et des terrasses. Découvrez comment votre soutien fait sortir de terre la maison de l'association.
- **Tags :** chantier, fondations, murs, porche, avancées

**🇬🇧 English Version**
- **Title:** Newsletter #3 - The walls are rising!
- **Summary:** A special edition retracing the major stages of the construction: from the symbolic laying of the first stone to the spectacular creation of the entrance porch and terraces. Discover how your support is bringing the association's house to life.
- **Tags:** construction, foundations, walls, porch, progress

**Paramètres :**
- **Date :** Octobre 2025
- **PDF :** `/assets/newsletter-pdf/pdf/newsletter3-octobre-2025.pdf`

---
*Note : Cette version v5.2 est la version officielle de référence. Le projet est désormais totalement harmonisé sur le nouveau design system.*
