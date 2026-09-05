# ServiceHub

## Project Overview

ServiceHub is a frontend-only Smart Services Dashboard that allows users to browse available services, view service details, manage a personal selection of services, and create their own custom services. The application demonstrates a complete React single-page application with client-side routing, shared state management, and responsive accessible design — all without a backend.

## Technology Stack

- **React** — UI library (functional components, hooks)
- **JavaScript** — ES modules
- **Vite** — Build tool and development server
- **React Router** — Client-side navigation (HashRouter for GitHub Pages)
- **CSS** — Custom design system with CSS custom properties
- **JSON mock data** — Local service catalogue served from `public/data/`
- **ESLint** — Code quality (flat config)

## Installation Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm (bundled with Node.js)

### Setup

```bash
# Clone the repository
git clone https://github.com/dpes-uni/ICT930.git
cd ICT930

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/ICT930/` (Vite base path).

### Build for Production

```bash
npm run build
```

Output is generated in the `dist/` directory, ready for static hosting.

## Key Features

- **Dashboard** — Overview showing count of selected services and quick navigation
- **Service Browsing** — Catalogue of 8 pre-defined services loaded from JSON
- **Search & Category Filtering** — Real-time search by name and filter by category (Internet, Utilities, Entertainment)
- **Service Details** — Dedicated page showing full description, category, and price
- **Add Existing Services** — One-click add from catalogue to My Services
- **Add Your Own Service** — Form to create custom services (name, category, description, price) with validation
- **Remove Services** — Remove any service from My Services
- **Profile Form** — Editable profile with validation (name, email, phone) and success feedback
- **Responsive Design** — Works on desktop, tablet, and mobile with fluid grids and flexible navigation
- **Accessibility** — Semantic HTML, keyboard navigation, focus-visible styles, skip link, `aria-describedby` on error fields, `noValidate` forms

## Design Decisions

- **React functional components & hooks** — Modern, concise component model
- **React Router (HashRouter)** — Client-side routing compatible with GitHub Pages (no server config needed)
- **AppContext** — Single shared state for selected services across pages; avoids prop drilling
- **JSON mock data** — Frontend-only delivery; no backend, database, authentication, or persistent storage required
- **Reusable `ServiceCard` component** — DRY rendering of service entries across pages
- **Simple CSS design system** — CSS custom properties for colors, spacing, radii, shadows; consistent theming
- **Session-only user-created services** — Custom services added via "Add Your Own Service" persist only during the browser session (stored in React state)
- **Responsive & accessible** — Mobile-first media queries, focus-visible outlines, labelled form fields, error announcements

## Deployed Application

**Public URL:** https://dpes-uni.github.io/ICT930/

> **Note:** The repository must be public and GitHub Pages enabled (Source: `gh-pages` branch, root) for the URL to serve the application. Private repositories require GitHub Enterprise Cloud for public Pages.