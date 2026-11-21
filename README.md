# Yonas Girma, portfolio

Personal portfolio of Yonas Girma, a full-stack and creative developer in Addis Ababa.
Built with **Next.js 16** (App Router, Cache Components, React Compiler), **React 19**,
**TypeScript** and **Tailwind CSS v4**. Deployed on Vercel; every push redeploys.

> The previous Astro site is preserved untouched in [`old/`](./old) for reference.
> It is excluded from linting, type-checking and Tailwind scanning.

## Highlights

- Fully static pages with a case-study route per project (`/projects/[slug]`), generated at build time
- Command palette on `Ctrl/⌘ + K`: sections, projects, résumé, email copy, theme
- Light/dark theme with no flash on load; follows the system until you choose
- Live Addis Ababa time on both the international and the Ethiopian clock, with the Ethiopian calendar date
- "On GitHub" section pulled from the GitHub API and refreshed hourly without a redeploy
- Dynamic Open Graph images per page and per project (`next/og`), favicon, sitemap, robots, web manifest, JSON-LD
- Contact form (server action, Zod validation, honeypot, Resend) that appears once configured
- Self-hosted, subset fonts; AVIF/WebP images with blur placeholders; transform-only animations; honours `prefers-reduced-motion`

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build && npm start
```

Requires Node 20.9 or newer.

## Editing content

All copy lives in `src/data/` as JSON, so most edits need no code:

| File | What it controls |
| --- | --- |
| `home.json` | name, title, headline, bio, availability, stats, social links |
| `projects.json` | projects and case-study pages |
| `career.json` | experience and education |
| `tech.json` | stack groups, skills and their tier (Daily / Advanced / Proficient) |

- **Project screenshots:** add the image to `src/assets/` and register it in the `screenshots` map in `src/lib/content.ts`. Projects without one get a generated woven cover.
- **Résumé:** replace `public/yonasgr-resume.pdf` (also reachable at `/resume`).
- **Amharic text:** `src/app/fonts/ethiopic.woff2` is a subset containing only the glyphs currently used. If you add new Amharic text, re-subset it from Noto Serif Ethiopic (see "Fonts" below).

## Environment variables

All optional; see `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and sitemap. Auto-detected on Vercel; set it for a custom domain. |
| `GITHUB_TOKEN` | Raises the GitHub API limit so the "On GitHub" section works from shared IPs. No scopes needed. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Enable the contact form. Without the first two the form is hidden. They are read at build time, so redeploy after adding them. |

## Deploying on Vercel

`vercel.json` sets the framework to Next.js. If the Vercel project was originally created for Astro,
open **Settings → Build & Development** and confirm the framework preset is **Next.js** and that no
build command or `dist` output directory override is set.

## Fonts

Bricolage Grotesque (Latin) and Noto Serif Ethiopic (Amharic) are self-hosted in `src/app/fonts/`.
To re-subset the Ethiopic font after changing Amharic text:

```bash
pip install fonttools brotli
pyftsubset noto-serif-ethiopic-ethiopic-wght-normal.woff2 \
  --text-file=amharic.txt --flavor=woff2 --layout-features='*' --output-file=ethiopic.woff2
```

The font file comes from the `@fontsource-variable/noto-serif-ethiopic` package. Also regenerate
`ethiopic-og.woff` (used by the social-card images) from the static `@fontsource/noto-serif-ethiopic` weight 700.

## Project structure

```
src/
  app/            routes, metadata files (icon, sitemap, robots, manifest, OG images), fonts
  components/     UI sections and interactive pieces
  data/           JSON content
  lib/            content loader, GitHub fetcher, Ethiopian clock, icons, OG helpers
old/              previous Astro project (reference only)
```

Brand logos come from `simple-icons` and are rendered on the server only (`src/lib/icons.tsx`
imports `server-only`) so the library never reaches the browser bundle.

## License

MIT, see [LICENSE](./LICENSE).
