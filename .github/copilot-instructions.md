# Copilot Instructions for Mama Esther v5.2

## Build, Test & Lint

### Development & Build
- **Start dev server (frontend):** `npm run dev` (runs on http://localhost:5173)
- **Start backend:** `cd backend-newsletter && npm run dev` (runs on http://localhost:5000)
- **Build for production:** `npm run build` (outputs to `/dist`)
- **Preview production build:** `npm run preview`

### Testing & Linting
- **Run tests:** `npm test` (Vitest)
- **Run linter:** `npm run lint` (ESLint with React hooks rules)
- **Lint check:** Use ESLint rules: `no-unused-vars` (ignores uppercase), `react-refresh/only-export-components`

### Backend
- Backend API uses Express with Mongoose (MongoDB)
- **Backend package:** `/backend-newsletter/package.json`
- **Main backend file:** `/backend-newsletter/server.js`
- Backend runs independently and is proxied via Vite config (`/api` → `http://localhost:5000`)

## Architecture & Project Structure

### Frontend (React + Vite)
- **Root:** `/src`
  - **Pages:** `/src/pages/` - Lazy-loaded route components (Home, About, Actuality, Travaux, Don, Contact, Missions, Admin, Sponsor, FundraisingMaterials, Volunteer, MentionsLegales, Unsubscribe, 404)
  - **Components:** `/src/components/` - Reusable components (Navbar, Footer, AdminAccessGate, DonationCounter, NewsletterGallery, etc.)
  - **Styles:** `/src/styles/` + `/src/pages/*.css` for page-specific styles
  - **API calls:** `/src/api/` - Centralized API client logic
  - **Data:** `/src/data/` - Static data and constants
  - **Utils:** `/src/utils/` - Helper functions (ScrollToTop, logging, etc.)
  - **Tests:** `/src/test/` - Test setup and utilities
  - **i18n:** `/src/locales/` - Translation files (en, fr)

### Internationalization (i18n)
- **Setup:** `/src/i18n.js` - i18next + react-i18next initialization
- **Translation files:** `/src/locales/{en,fr}/translation.json`
- **Default language:** French (fr), stored in localStorage
- **Hook usage:** Always use `const { t } = useTranslation()` in components
- **Language switching:** Handled by Navbar component; persists in localStorage

### Routes (React Router v7)
- **Defined in:** `/src/App.jsx`
- **Router setup:** BrowserRouter with lazy-loaded pages
- **Lazy loading:** All pages use `lazy(() => import(...))` for code splitting
- **Fallback loading:** HandSpinner component during chunk loading

### Global Styles & Design System
- **CSS variables:** `/src/index.css` - All colors, spacing, shadows, typography defined
- **Color palette (Cameroon):**
  - `--color-green: #007a5e` (structure, trust, serenity)
  - `--color-red: #ce1126` (urgency, CTA, important tags)
  - `--color-yellow: #fcd116` (accents, light, success badges)
  - Neutrals: dark, light, white, text variants
- **Border radius:** `--radius-sm` (8px), `--radius-md` (16px), `--radius-lg` (24px), `--radius-xl` (40px)
- **Shadows:** Only soft, diffuse shadows: `--shadow-sm`, `--shadow-soft`, `--shadow-hover`
- **Typography:** Bahnschrift as primary font, massive headings (h1: 3rem, h2: 2.5rem, h3: 1.75rem)
- **Container:** Max width `--container-width: 1300px`

### Design Principles (v5.2 - "ONG Moderne")
- **Institutional style:** Large spacing, massive typography, storytelling approach
- **Generosity in design:** Use 24px–40px border radii for warm, human feel
- **Modals:** Always centered, "Fiche Portrait" format, max 90vh height with internal scroll and sticky close button
- **Responsive first:** Absolute priority—vertical stacking on mobile, reduced images

### Page Structure Pattern
Home page follows: **Hero > Stats > Missions > Actuality > CTA**
All pages use **v2 unified styling** (see `src/pages/*.css` and `src/index.css`)

### Backend (Express API)
- **Main server:** `/backend-newsletter/server.js`
- **Routes:** `/backend-newsletter/routes/` (Subscription, Contact, unsubscribe, Don, Donations, helloasso, admin)
- **Controllers:** `/backend-newsletter/Controllers/` - Business logic
- **Models:** `/backend-newsletter/models/` - Mongoose schemas
- **Middleware:** `/backend-newsletter/middlewares/` - Auth, validation, error handling
- **Utils:** `/backend-newsletter/utils/` - Email, logging, sanitization
- **Database:** MongoDB with Mongoose ODM
- **Security:** Helmet, CORS, rate limiting, input sanitization
- **Environment:** Uses `.env` (copy from `.env.example`)
- **DNS fix:** Vite config sets Cloudflare/Google DNS for MongoDB Atlas connectivity

## Key Conventions

### Naming & File Structure
- **Page components:** PascalCase (e.g., `Home.jsx`, `About.jsx`)
- **Reusable components:** PascalCase in `/src/components/`
- **CSS modules:** `ComponentName.css` alongside component
- **Utility functions:** camelCase in `/src/utils/`
- **API routes:** RESTful, namespaced by resource (e.g., `/api/subscriptions`, `/api/contact`, `/api/donations`)

### Component Patterns
- **Lazy loading:** Use `React.lazy()` for route components; `<Suspense>` wraps routes with `<HandSpinner />` fallback
- **Reusability:** Common UI patterns in `/src/components/` (Navbar, Footer, modals)
- **State management:** React hooks (useState, useContext, useEffect); no Redux
- **Translations:** Always destructure `useTranslation()` at component top; use `t('key')` for all user-facing text
- **Styling:** CSS variables from `:root` (index.css); component-scoped CSS files

### Backend Patterns
- **Route structure:** `/routes/*.js` files export Express Router instances
- **Controller separation:** Logic in `/Controllers/` for cleaner routes
- **Error handling:** Centralized logger in `/utils/logger.js`; email alerts for errors
- **Validation:** Use Joi for request schema validation
- **Security headers:** Helmet enabled; rate limiting on sensitive endpoints
- **Email notifications:** `/utils/send-email.js` for transactional emails

### Responsive Design
- **Mobile first:** Always design for mobile, then enhance for desktop
- **Breakpoints:** Using CSS media queries (no framework-specific breakpoints hard-coded)
- **Images:** Scaled/hidden on smaller viewports
- **Spacing:** Generous on desktop, reduced on mobile

### Database (MongoDB via Mongoose)
- **Models location:** `/backend-newsletter/models/`
- **Schema conventions:** Use Mongoose built-in validation, timestamps, and lean() for read-only queries
- **Indexing:** Index frequently queried fields (e.g., email, subscription status)

### Testing
- **Test framework:** Vitest (similar to Jest)
- **Test setup:** `/src/test/setup.js` - Global test utilities
- **Location:** Tests co-located with components or in `/src/test/`
- **Mocking:** Use vitest mocking; mock API calls to avoid live requests

### Version & Maintenance
- **Current version:** v5.2 (final, stable, "ONG Moderne" design system)
- **All pages updated:** Every route component uses v2 unified styling
- **Legacy cleanup:** No old CSS files or deprecated components remain
- **Design reference:** See `GEMINI.md` for architectural decisions and style guidance

### Important Notes
- **No unused variables:** ESLint enforces `no-unused-vars`; uppercase-named variables (e.g., `CONST`) are exempt
- **React Refresh:** Only export components from component files (ESLint rule: `react-refresh/only-export-components`)
- **Environment variables:** Frontend uses `VITE_*` prefix for client-side env vars; backend uses `.env`
- **Language persistence:** i18next saves selected language in localStorage; defaults to French
- **API proxy:** Vite proxies `/api/*` calls to backend during dev; adjust `vite.config.js` if backend port changes
