## 2026-08-17T19:13:01Z

Worker 3 for Milestone 3 (M3: Hero Showcase, Navigation & Header Redesign).
Tasks:
1. Redesign Hero Section (`src/components/home.astro`):
   - Replace the unbalanced 44%/56% split and oversized standalone poster with a modern minimalist, editorial hero presentation:
     - Header Showcase Visual Banner: Sleek creative developer showcase banner (high-resolution, subtle gradient/grid/abstract code aesthetic with dark glassmorphism).
     - Elevated Profile Avatar: Render `src/assets/yonasgr.png` with crisp squircle/circular framing, ambient accent glow (`box-shadow: 0 0 40px rgba(var(--color-accent-rgb), 0.25)`), and an integrated pulsing availability pill badge (`"● Available for Opportunities"` / `"Available for Q3/Q4 Projects"`).
     - Editorial Typography: Refined kicker (`"Full-Stack Software Engineer & Creative Developer"`), bold title with subtle gradient accent, authentic narrative/bio, and location indicator.
     - Quick Stats / Social Proof Strip: Render the stats metrics (`3+ Years Exp`, `8+ Production Apps`, `25k+ Users`, `15+ Core Tech`) cleanly.
     - Action CTAs: Primary magnetic button (`"Explore Projects"`) linking to `#projects`, Secondary button (`"View Resume"`) linking to resume with PDF icon, and a polished row of social links (`mdi:github`, `mdi:linkedin`, `mdi:email`, `mdi:twitter`, etc.).
2. Refactor Navigation & Theme Toggle (`src/components/nav.astro` & `src/components/theme-toggle.astro`):
   - Unify navigation: Merge the floating theme toggle into the main floating navigation bar.
   - Design: Floating pill with brand monogram ("YG" or "Yonas"), section links (`#home`, `#career`, `#projects`, `#tech`, `#contact`), and theme toggle with dark/light icon animation.
   - Performance: Eliminate the layout-reflowing `nav.style.width` morph script in favor of smooth hardware-accelerated CSS transforms (`backdrop-blur-lg bg-background/80 border border-white/10 shadow-lg`).
   - Active Section Tracking: Update `IntersectionObserver` with `rootMargin: "-20% 0px -60% 0px"` and `threshold: 0` so active section indicator updates reliably regardless of section length.
   - Mobile Support: Ergonomic responsive design (bottom dock or clean compact bar) without layout shift.
3. Build Verification:
   - Run `npx astro check` and `npm run build` to verify zero errors.
