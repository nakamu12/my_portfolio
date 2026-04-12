# Ryota Nakamura — Engineer Portfolio

A bilingual portfolio for an AI & Robotics engineer, built with Astro's Islands Architecture for near-zero JavaScript overhead and fast static delivery.

**Live:** [nakamu12.github.io/my_portfolio](https://nakamu12.github.io/my_portfolio)

---

## Tech Stack

| Layer           | Choice                                                                        |
| --------------- | ----------------------------------------------------------------------------- |
| Framework       | [Astro](https://astro.build) — Static Site Generation                         |
| UI              | [React 19](https://react.dev) — Islands Architecture                          |
| Styling         | [Tailwind CSS 4](https://tailwindcss.com)                                     |
| Components      | [shadcn/ui](https://ui.shadcn.com)                                            |
| Animation       | [Motion](https://motion.dev) (Framer Motion)                                  |
| Fluid Effect    | [webgl-fluid-enhanced](https://github.com/nickshanks347/webgl-fluid-enhanced) |
| Fonts           | Geist + Noto Sans JP + Geist Mono                                             |
| Icons           | [Lucide React](https://lucide.dev) + [Devicons](https://devicon.dev)          |
| Package Manager | [Bun](https://bun.sh)                                                         |
| Linting         | ESLint (strict + a11y) + Prettier                                             |
| Deploy          | GitHub Pages via GitHub Actions                                               |

---

## Architecture

### Islands Architecture

The site uses Astro's islands model: pages are static HTML by default, with React components hydrated only where interactivity is needed.

```
.astro files  →  Static HTML (zero JS)     ← default
.tsx  files   →  Interactive islands        ← opt-in via client:load / client:visible
```

**Interactive islands:** DockNav, MobileNav, FluidBackground, ToolGrid, SkillsGrid, MediaCarousel, ThemeLangControls, FilterTabs, BrandBeams

### Component Organization

```
src/components/
├── ui/              ← shadcn/ui primitives (Button, Dock)
├── common/          ← Shared (SectionHeading, PillBadge, TimelineTrack, TagList, ...)
├── layout/          ← Header, Footer, DockNav, MobileNav
├── hero/            ← HeroSection + FluidBackground (WebGL)
├── about/           ← AboutSection (profile, MBTI, strengths)
├── certifications/  ← CertificationsSection
├── achievements/    ← AchievementsSection
├── ai-toolkit/      ← AIToolkitSection + ToolGrid
├── skills/          ← SkillsSection + SkillsGrid
├── experience/      ← ExperienceSection (timeline)
├── projects/        ← ProjectsSection + ProjectCard + FeaturedProjectCard
├── media/           ← MediaSection + MediaCarousel
└── contact/         ← ContactSection
```

### Data Management

All content lives in JSON files under `src/data/{lang}/`:

| File                  | Content                               |
| --------------------- | ------------------------------------- |
| `about.json`          | Bio, personal info                    |
| `stats.json`          | Key numbers (years, projects, awards) |
| `skills.json`         | Tech stack by category                |
| `experience.json`     | Work & education timeline             |
| `projects.json`       | Project showcase                      |
| `certifications.json` | Certs & achievements                  |
| `ai-tools.json`       | AI tools & platforms                  |
| `media.json`          | Speaking, articles, press             |
| `social.json`         | Social links (shared)                 |

UI text translations are in `src/i18n/locales/{en,ja}.json`.

---

## Design System

### Brand Colors

The portfolio inherits the **OmniCore** product brand:

| Token    | Hex                 | Usage                                       |
| -------- | ------------------- | ------------------------------------------- |
| Blue     | `#686dff`           | Primary accent — buttons, links, indicators |
| Purple   | `#b66fff`           | Secondary accent — gradient endpoint        |
| Gradient | `#686dff → #b66fff` | CTAs, logo, highlights                      |

**Surface:** 95%+ monochrome. Accent only on interactive elements and key highlights.

### Theme Modes

|           | Background            | Text                  | Border                  |
| --------- | --------------------- | --------------------- | ----------------------- |
| **Light** | `#ffffff` / `#f5f5f5` | `#171717` / `#525252` | `#e5e5e5`               |
| **Dark**  | `#0f0f0f` / `#111111` | `#ededed` / `#a3a3a3` | `rgba(255,255,255,0.1)` |

### Typography

| Role                 | Font         | Weight  |
| -------------------- | ------------ | ------- |
| Headings & body (EN) | Geist        | 400–700 |
| Headings & body (JP) | Noto Sans JP | 400–700 |
| Code                 | Geist Mono   | 400     |

### Design Principles

1. **Less is more** — Whitespace over decoration
2. **Black & White first** — Design in monochrome, add color last
3. **Motion with purpose** — Animate only where it aids comprehension
4. **Content is king** — Design serves the content
5. **OmniCore DNA** — Consistent with personal product brand

---

## Logo — "VB: Dynamic"

A rounded square (squircle) with a split-slash motif. The mark reads **R → Bridge → N** from top to bottom:

```
 ┌─────────┐
 │  ██▓▓   │  ← R's leg — wide, diagonal (~28°)
 │   █▓    │
 │    ●    │  ← Bridge node — AI ↔ real world
 │   ▓█    │
 │   ▓█    │  ← N's stroke — narrow, vertical (~8°)
 └─────────┘
```

| Element     | Symbolism                                             |
| ----------- | ----------------------------------------------------- |
| Upper slash | The leg of **R** — bold, dynamic                      |
| Bridge node | Connection point — circuit junction / bridging worlds |
| Lower slash | Final stroke of **N** — stable, grounded              |
| Angle shift | R → N transition in angle and weight                  |

SVG variants are in `src/assets/logo/` (gradient, mono-black, mono-white, auto). See [`src/assets/logo/README.md`](src/assets/logo/README.md) for full specs and regeneration instructions.

---

## Internationalization (i18n)

- **Path-based routing:** `/en/` and `/ja/`
- **Root `/`** detects browser language and redirects
- **Language preference** persisted in `localStorage`
- **Content data** duplicated per language in `src/data/{en,ja}/`
- **UI strings** in `src/i18n/locales/{en,ja}.json` (~67 keys)

```
src/i18n/
├── utils.ts           ← getLangFromUrl(), getTranslations()
└── locales/
    ├── en.json        ← English UI strings
    └── ja.json        ← Japanese UI strings
```

---

## Project Structure

```
my_portfolio/
├── .github/workflows/     ← CI + Deploy pipelines
├── v1/                    ← Legacy (frozen at v1.0.0)
├── v2/                    ← Active development
│   ├── public/            ← Static assets (favicon, images, manifest)
│   ├── src/
│   │   ├── assets/        ← Processed assets (images, logo SVGs)
│   │   ├── components/    ← UI components by section
│   │   ├── data/          ← Content JSON (en/, ja/, social.json)
│   │   ├── hooks/         ← React hooks (useLangSwitch, useThemeState)
│   │   ├── i18n/          ← Translations and utils
│   │   ├── layouts/       ← BaseLayout.astro
│   │   ├── lib/           ← Utilities (cn, url validation, social icons)
│   │   ├── pages/         ← File-based routing (/, /en/, /ja/)
│   │   └── styles/        ← global.css (design tokens)
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   ├── eslint.config.mjs
│   └── package.json
└── worktree/              ← Feature branch worktrees (gitignored)
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.3+)
- [Node.js](https://nodejs.org) 22+

### Setup

```bash
cd v2
bun install
```

### Commands

| Command                | Action                         |
| ---------------------- | ------------------------------ |
| `bun run dev`          | Dev server at `localhost:4321` |
| `bun run build`        | Production build to `./dist/`  |
| `bun run preview`      | Preview production build       |
| `bun run lint`         | ESLint check                   |
| `bun run lint:fix`     | ESLint auto-fix                |
| `bun run format`       | Prettier format                |
| `bun run format:check` | Prettier check                 |

---

## Development Workflow

### Branch Strategy

| Branch       | Purpose                                      |
| ------------ | -------------------------------------------- |
| `main`       | Production — triggers deploy to GitHub Pages |
| `develop/v2` | Development base for v2                      |
| `feature/*`  | Individual features (worktree-based)         |

### Worktree-based Development

Each feature is developed in an isolated git worktree:

```bash
# Create worktree (from repo root)
git worktree add worktree/feature-hero -b feature/hero develop/v2

# Work in it
cd worktree/feature-hero/v2
bun install
bun run dev -- --port 4322

# After PR merge, clean up
git worktree remove worktree/feature-hero
git branch -d feature/hero
```

This enables parallel work on multiple sections without branch switching.

---

## CI/CD & Deployment

### CI Pipeline (`.github/workflows/ci.yml`)

Runs on PRs to `develop/v2` and `main`:

1. **Lint** — ESLint strict + a11y
2. **Format** — Prettier check
3. **Type check** — `astro check`
4. **Build** — Full production build

### Deploy Pipeline (`.github/workflows/deploy.yml`)

Runs on push to `main`:

1. Build Astro site from `v2/`
2. Upload artifact
3. Deploy to GitHub Pages

**Live URL:** `https://nakamu12.github.io/my_portfolio`

---

## Sections

The portfolio is composed of 11 sections:

| Section            | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| **Hero**           | Full-screen intro with WebGL fluid background, stats, CTAs   |
| **About**          | Bio, profile photo, MBTI, StrengthsFinder top 5              |
| **Certifications** | FDE Level 2, IT certs, with images                           |
| **Achievements**   | Hackathon wins — IGVC Grand Champion, Google AI 2nd place    |
| **AI Toolkit**     | AI tools mastery grid with filtering (ChatGPT, Claude, etc.) |
| **Skills**         | Tech stack by category with Devicon badges                   |
| **Experience**     | Work & education timeline                                    |
| **Projects**       | Featured + archived project cards                            |
| **Media**          | Speaking, writing, podcast appearances                       |
| **Contact**        | Contact CTA with social links                                |
| **Footer**         | Navigation, social links, back-to-top                        |

---

## Security

- URL validation with SSRF protection (`lib/url.ts`)
- Path traversal prevention for image loading (`lib/certifications.ts`)
- Language code allowlist validation (`i18n/utils.ts`)
- No user-generated content or server-side execution (static site)

---

## License

&copy; 2025–2026 Ryota Nakamura. All rights reserved.
