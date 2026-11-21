# Project: Portfolio Redesign and Enhancement

## Architecture
- **Framework**: Astro v6.1.3 (SSG) with `@tailwindcss/vite` v4.2.0, `astro-icon`, Fontsource Space Grotesk & Inter Variable.
- **Data Flow**: Static JSON data in `src/data/` (`home.json`, `projects.json`, `tech.json`, `career.json`) imported at build time into Astro components.
- **Visual Design**: Modern Minimalist & Editorial theme, refined typography (`Space Grotesk Variable` for headings, `Inter Variable` for body/UI, mono accents), ambient background mesh/subtle glow, frosted glass cards with theme-adaptive tokens.
- **Component Structure**:
  - `src/layouts/Layout.astro`: Base HTML shell, SEO metadata, theme script, ambient background, scroll progress & back-to-top.
  - `src/components/nav.astro`: Unified floating navigation pill with brand mark, nav items, and theme toggle.
  - `src/components/home.astro`: Hero section with custom showcase banner art, elevated avatar with glow & availability badge, editorial headline, bio, CTAs.
  - `src/components/career.astro` & `career-card.astro`: Clean linear vertical timeline with theme-adaptive nodes and rich achievements.
  - `src/components/projects.astro` & `project-card.astro`: Responsive project card grid with 6 case studies, impact metrics, dual Live/Code buttons, and GPU-accelerated micro-interactions (3D card tilt, spotlight glare).
  - `src/components/tech.astro`: Clutter-free tech domain clusters with brand icons and clean pill chips.
  - `src/components/contact.astro`: 1-click email copy with toast feedback, direct social cards, and colophon footer.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Asset & Root Cleanup | Move root images (`Project-LogosPath.png`, `Y-Logo.png`) to `src/assets/`, remove `home.astro.backup`, fix import paths | M1 | Survey / R5 |
| 2 | Design System & Styling Foundation | Fix CSS variables (`--accent-rgb`, `--color-accent-60`, `bg-container`), ambient background mesh, theme persistence, accessibility rules | M1 | Survey / R1, R5 |
| 3 | Content Refill & Case Studies | Overhaul `home.json`, `projects.json` (6 projects with metrics & links), `tech.json` (de-duplicated), `career.json` (authentic history) | M2 | Survey / R3 |
| 4 | Hero Showcase & Profile Presentation | Custom high-res header showcase visual, elevated avatar with glow & availability badge, editorial typography, action buttons | M3 | Survey / R1, R2 |
| 5 | Unified Floating Navigation | Consolidated nav pill with brand monogram YG, navigation links, and theme toggle with smooth composited transitions | M3 | Survey / R1, R4 |
| 6 | Projects Section & Micro-Interactions | 6 case studies grid, impact metrics, live & github links, 3D card tilt & spotlight hover effects | M4 | Survey / R3, R4 |
| 7 | Career Timeline Redesign | Clean linear vertical timeline, light/dark theme adaptive node borders, structured achievement bullets | M4 | Survey / R1, R3 |
| 8 | Tech Stack & Contact/Footer Overhaul | Clutter-free tech clusters (no 90+ star icons), 1-click copy email with toast feedback, social cards, colophon footer | M4 | Survey / R1, R3, R4 |
| 9 | Production Build & E2E Verification | Clean `npx astro check`, zero console errors, zero horizontal overflow (mobile/tablet/desktop), `npm run build` verification | M5 | Survey / R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Architecture, Asset Organization & Styling Foundation | Assets move, root cleanup, CSS tokens, ambient background, Layout.astro | none | DONE |
| M2 | Content Refill & Data Layer Overhaul | `home.json`, `projects.json`, `tech.json`, `career.json` | M1 | DONE |
| M3 | Hero Showcase, Navigation & Header Redesign | `home.astro`, `nav.astro`, `theme-toggle.astro`, showcase banner, avatar styling | M1, M2 | DONE |
| M4 | Section Components & Micro-Interactions | `projects.astro`, `project-card.astro`, `career.astro`, `career-card.astro`, `tech.astro`, `contact.astro` | M1, M2, M3 | DONE |
| M5 | E2E Verification, Responsive Polish & Production Build | Build validation (`npm run build`), typecheck (`astro check`), responsive checks, review & audit | M1, M2, M3, M4 | DONE |

## Interface Contracts
### Data Schemas ↔ Components
- `src/data/home.json`: `{ name, title, headline, location, availability: { status, badgeText, openTo }, stats: [{label, value}], bio, photoUrl, webpageTitle, resumeUrl, socials: [{name, url, handle, icon, showInContact, showInHero}] }`
- `src/data/projects.json`: `Array<{ id, title, tagline, description, category, featured, year, impact, metrics: [{label, value}], highlights: string[], tech: string[], platforms: string[], link, github, images: string[] }>`
- `src/data/tech.json`: `{ categories: Array<{ id, title, description, skills: Array<{ name, tier, icon, level? }> }> }`
- `src/data/career.json`: `Array<{ company, role, period, type, location, description, achievements: string[], skills: string[] }>`

## Code Layout
- `src/assets/`: Static local images (`yonasgr.png`, `Project-LogosPath.png`, `Y-Logo.png`, `astro-01.webp`, `astro-02.jpeg`, `favicon.svg`)
- `public/`: Public static files (`yonasgr-resume.pdf`, `favicon.ico`, `branding-poster.png`)
- `src/styles/`: `global.css` (Tailwind CSS v4, theme variables, utility classes, typography scale, reduced-motion guards)
- `src/data/`: `home.json`, `projects.json`, `tech.json`, `career.json`
- `src/layouts/`: `Layout.astro`
- `src/components/`: `nav.astro`, `theme-toggle.astro`, `home.astro`, `career.astro`, `career-card.astro`, `projects.astro`, `project-card.astro`, `tech.astro`, `contact.astro`
- `src/utils/`: `images.ts`, `animations.ts` (if needed)
- `src/pages/`: `index.astro`
