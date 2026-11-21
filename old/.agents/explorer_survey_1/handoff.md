# Phase 0: Codebase Survey & Technical Analysis Report

**Target Project**: `/home/jonah/Github/portfolio`  
**Date**: 2026-08-17  
**Author**: Explorer 1 (Codebase Surveyor)  
**Status**: Complete

---

## 1. Observation

Direct observations and evidence collected from code inspection and filesystem analysis:

### 1.1 Project Structure & Package Configuration
- **Root Directory**: Contains Astro application files, package managers lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`), root assets, and agent workspace `.agents/`.
- **`package.json`** (`/home/jonah/Github/portfolio/package.json` lines 1–28):
  ```json
  {
    "name": "career-portfolio",
    "type": "module",
    "version": "0.1.6",
    "scripts": {
      "dev": "astro dev --host",
      "build": "astro build",
      "preview": "astro preview",
      "astro": "astro"
    },
    "dependencies": {
      "@astrojs/check": "^0.9.8",
      "@fontsource-variable/inter": "^5.2.8",
      "@fontsource-variable/space-grotesk": "^5.2.10",
      "@iconify-json/devicon-plain": "^1.2.57",
      "@iconify-json/mdi": "^1.2.3",
      "@iconify-json/skill-icons": "^1.2.3",
      "@iconify-json/vscode-icons": "^1.2.43",
      "@tailwindcss/vite": "^4.2.0",
      "@vercel/speed-insights": "^2.0.0",
      "astro": "^6.1.3",
      "astro-icon": "^1.1.5",
      "sharp": "^0.34.5",
      "tailwindcss": "^4.2.0",
      "typescript": "^5.9.3"
    }
  }
  ```
- **`astro.config.mjs`** (`/home/jonah/Github/portfolio/astro.config.mjs` lines 1–17):
  ```javascript
  import { defineConfig } from 'astro/config';
  import tailwindcss from '@tailwindcss/vite';
  import icon from 'astro-icon';

  export default defineConfig({
    vite: {
      plugins: [tailwindcss()]
    },
    integrations: [icon()]
  });
  ```
- **`tsconfig.json`** (`/home/jonah/Github/portfolio/tsconfig.json` lines 1–6):
  ```json
  {
    "extends": "astro/tsconfigs/base",
    "include": [".astro/types.d.ts", "**/*"],
    "exclude": ["dist"]
  }
  ```

### 1.2 Styling, Themes, and Font Integration
- **Tailwind CSS v4 & Fonts** (`src/styles/global.css` lines 1–38):
  - Tailwind v4 imported via `@import "tailwindcss";`.
  - Fontsource Variable packages imported directly:
    - `@import '@fontsource-variable/space-grotesk';`
    - `@import '@fontsource-variable/inter';`
  - `@theme` block maps font variables:
    - `--font-heading: "Space Grotesk Variable", sans-serif;`
    - `--font-body: "Inter Variable", sans-serif;`
  - Theme color variables defined: `--color-background`, `--color-accent`, `--color-maintext`, `--color-subtext`, `--color-textrain`.
  - Multiple multi-palette theme sets in `@layer base` (`default-dark`, `default-light`, `strategic-dark`, `strategic-light`, `innovator-dark`, `innovator-light`, `executive-dark`, `executive-light`).
- **Site Configuration** (`src/config.ts` lines 1–7):
  - `SITE_CONFIG` exports `baseTheme: 'default'`, toggling between dark and light variants via `Layout.astro` and `theme-toggle.astro`.

### 1.3 Asset Architecture & Root Anomalies
- **Assets in `src/assets/`**:
  - `astro-01.webp`
  - `astro-02.jpeg`
  - `favicon.svg`
  - `yonasgr.png`
- **Assets in `public/`**:
  - `branding-poster.png`
  - `favicon.ico`
  - `placeholder.jpeg`
  - `yonasgr-resume.pdf`
- **Root-level Asset & File Anomalies**:
  - `/home/jonah/Github/portfolio/Project-LogosPath.png` (440 KB): Stored in root directory and imported via `src/utils/images.ts:2`.
  - `/home/jonah/Github/portfolio/Y-Logo.png` (1.42 MB): Stored in root directory and imported via `src/layouts/Layout.astro:4`.
  - `/home/jonah/Github/portfolio/home.astro.backup` (6 KB): Deprecated backup file in root directory.

### 1.4 Page Architecture & Component Inventory
- **`src/pages/index.astro`** (lines 35–43):
  - Composes the single page layout:
    ```astro
    <Layout title={webpageTitle}>
      <Nav />
      <Home />
      <Career />
      <Projects />
      <Tech />
      <Contact />
    </Layout>
    ```
- **`src/layouts/Layout.astro`**:
  - Sets up `<head>` with dynamic favicon and theme script.
  - Generates falling matrix rain characters via client-side DOM interval (`setInterval(createLetter, 250)`).
  - Floating scroll-to-top button with circular SVG stroke progress and launch animation.
- **Component Breakdown (`src/components/`)**:
  - `nav.astro`: Floating pill navbar with scroll morphing (`width` shrinking on scroll) and responsive mobile bottom bar.
  - `theme-toggle.astro`: Theme toggle button switching between `-dark` and `-light` variants.
  - `home.astro`: Hero section with 44%/56% split layout, displaying `/branding-poster.png` on left, headline, bio, resume CTA, and social links on right.
  - `career.astro` & `career-card.astro`: Vertical timeline with alternating grid on desktop, single left-aligned track on mobile.
  - `projects.astro` & `project-card.astro`: Responsive 3-column project card grid with automatic image slider if `images.length > 1`.
  - `tech.astro`: Categorized grid (Programming Languages, Mobile, Frontend, Backend, Database) with 3-star proficiency ratings.
  - `contact.astro`: 4-column contact card grid and footer with Astro credit.

### 1.5 Data Content Audit
- **`src/data/home.json`**:
  - Name: "Yonas Girma", Title: "Yonasgr", photoUrl: "branding-poster.png", resumeUrl: "/yonasgr-resume.pdf".
  - Contains standard bio and 10 social links (GitHub, LinkedIn, Leetcode, Behance, Email, Whatsapp, Facebook, Messenger, Instagram, Twitter).
- **`src/data/career.json`**:
  - Contains 3 items with mismatched placeholder content (e.g. role "Student" has "Leading cross-platform mobile development using Flutter and FastAPI", "Demo Company" has "Business Research Methods", typos like "Netwroking", "PhP").
- **`src/data/projects.json`**:
  - Contains only 2 projects: "Awesome Website" (generic placeholder) and "Logos Path" (mobile app). Lacks project metrics, repo links, and full case study details.
- **`src/data/tech.json`**:
  - Contains 5 categories with icon identifiers from `skill-icons` and `vscode-icons`.

---

## 2. Logic Chain

1. **Alignment with Requirements (ORIGINAL_REQUEST.md)**:
   - **R1 (Layout Redesign)**: The layout currently uses a split hero with an oversized vertical branding poster and matrix rain that creates visual clutter. A modern minimalist editorial redesign with refined typography (Space Grotesk + Inter) and clear negative space will elevate the portfolio.
   - **R2 (Header Visual & Profile)**: Current hero (`home.astro`) displays a static poster image `/branding-poster.png` without high-resolution developer showcase art or an elevated profile avatar card with glowing depth and status badge. Custom high-res banner art and a refined avatar presentation are needed.
   - **R3 (Content Refill & Case Studies)**: Content in `career.json` has placeholder mismatches and typos; `projects.json` only has 2 entries. Refilling with 4–6 rich full-stack / creative developer projects with metrics, live links, and repository links will fulfill R3.
   - **R4 (Micro-animations & Interactivity)**: The current matrix letter DOM generation (`createLetter` every 250ms creating `<span>` tags) consumes unnecessary DOM nodes. Transitioning to lightweight CSS/ambient effects and adding card hover tilts, smooth scroll triggers, and tag transitions will improve performance and aesthetics.
   - **R5 (Code Cleanliness & Production Build)**: Cleaning up `home.astro.backup`, moving root images (`Project-LogosPath.png`, `Y-Logo.png`) into proper asset folders, and ensuring strict TypeScript type safety will make the codebase clean and maintainable.

---

## 3. Caveats

- **API Fallback**: `index.astro`, `home.astro`, and `tech.astro` contain `if (isApiLive && BASE_URL)` fetch logic with local JSON fallback. When `BASE_URL` is undefined, the app cleanly uses local JSON data in `src/data/`.
- **Icon Dependencies**: Icons rely on `@iconify-json/mdi`, `@iconify-json/skill-icons`, `@iconify-json/vscode-icons`, and `@iconify-json/devicon-plain`. Any new icons added must exist in these packages or be imported as SVGs.

---

## 4. Conclusion & Technical Recommendations

### 4.1 Recommended File Reorganization
1. **Asset Migration**:
   - Move `/home/jonah/Github/portfolio/Project-LogosPath.png` $\rightarrow$ `src/assets/Project-LogosPath.png`
   - Move `/home/jonah/Github/portfolio/Y-Logo.png` $\rightarrow$ `src/assets/Y-Logo.png`
   - Update `src/layouts/Layout.astro` and `src/utils/images.ts` imports accordingly.
2. **Cleanup**:
   - Remove `/home/jonah/Github/portfolio/home.astro.backup`.

### 4.2 UI/UX Redesign Strategy
1. **Hero & Showcase Banner**:
   - Implement an editorial hero layout featuring a high-resolution developer showcase visual banner (e.g. creative engineering motif, sleek code geometry/abstract gradient canvas).
   - Profile presentation: Crisp avatar framing, subtle accent glow, availability badge ("Available for new opportunities"), and clear role headline.
2. **Project Case Studies Grid**:
   - Expand `projects.json` to 4–6 standout projects (e.g. Full-Stack Web App, Mobile AI Application, Developer Tooling / Open Source, Interactive Web Experience).
   - Add impact metrics, live demo links, GitHub repository links, and tech badges.
3. **Career & Experience Narrative**:
   - Polish `career.json` with coherent software engineering roles, achievements, and technology stacks.
4. **Animations & Polish**:
   - Replace or refine DOM-heavy matrix intervals with clean ambient CSS backdrop lighting or canvas mesh.
   - Refine hover transitions, active nav states, and responsive viewports for mobile (<640px), tablet (768px), and desktop (>1024px).

---

## 5. Verification Method

To independently verify the codebase state and future changes:

1. **Inspect Code & Configs**:
   - Verify `package.json`, `astro.config.mjs`, `src/styles/global.css`, and `src/config.ts`.
2. **Run Build & Typecheck**:
   - `npm run build` (Executes Astro SSG build and generates output in `./dist`).
   - `npx astro check` (Verifies TypeScript and Astro component diagnostics).
3. **Run Dev Server & Viewport Check**:
   - `npm run dev` and test at:
     - Mobile: 375px / 414px
     - Tablet: 768px / 820px
     - Desktop: 1280px / 1440px+
4. **Asset Validation**:
   - Verify all project images in `src/assets/` resolve via `resolveAssetImage()` without console warnings.
