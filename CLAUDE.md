# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Portfolio website for a Japanese AI & Robotics engineer, built with modern frameworks.
Legacy v1 (vanilla HTML/CSS/JS) has been removed; the repository root is now the Astro project.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro (Static Site Generation) |
| UI Library | React (Islands Architecture) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Animation | Motion (motion.dev) |
| Fluid Effect | webgl-fluid-enhanced |
| Fonts | Geist + Noto Sans JP + Geist Mono |
| Package Manager | Bun |
| Linter | ESLint (strict) |
| Formatter | Prettier |
| Deploy | GitHub Pages |

## Architecture

### Hybrid Component Architecture

Components are organized by section with shared utilities:

```
src/
├── components/
│   ├── ui/              ← shadcn/ui primitives
│   ├── common/          ← Shared components (SectionHeading, Badge, etc.)
│   ├── layout/          ← Header, Footer, Nav, ThemeToggle
│   ├── hero/            ← Section-specific components
│   ├── about/
│   └── ...
├── layouts/             ← BaseLayout.astro
├── pages/               ← File-based routing with i18n
│   ├── index.astro      ← Language detection → redirect
│   ├── en/
│   └── ja/
├── data/                ← Content data (JSON, locale-separated)
│   ├── en/
│   └── ja/
├── i18n/                ← UI text translations
├── hooks/               ← Shared React hooks
├── lib/                 ← Utilities (cn() helper, etc.)
└── styles/              ← global.css with design tokens
```

### Islands Architecture

- `.astro` files for static content (default)
- `.tsx` files only for interactive components that need client-side hydration
- Use `client:visible` for below-fold interactive components
- Use `client:load` only when immediate interactivity is required

### Data Management

All content data is managed as JSON files in `src/data/{lang}/`:
- `projects.json`, `certifications.json`, `experience.json`
- `ai-tools.json`, `skills.json`, `stats.json`

UI text translations are in `src/i18n/locales/{lang}.json`.

## Brand Design

- **Base**: Black × White (monochrome, 95%+ of surface area)
- **Accent**: OmniCore Blue `#686dff` (primary), OmniCore Purple `#b66fff` (gradient)
- **Gradient**: `#686dff → #b66fff`
- **Light BG**: `#ffffff` / `#f5f5f5`
- **Dark BG**: `#0f0f0f` / `#111111`
- **Design principle**: Less is more. Whitespace over decoration.

Full spec: `.local/brand-design-system.md`

## Development

### Commands

```bash
bun run dev          # Start dev server
bun run build        # Production build
bun run preview      # Preview production build
bun run lint         # ESLint check
bun run lint:fix     # ESLint auto-fix
bun run format       # Prettier format
bun run format:check # Prettier check
```

### Branch Strategy

- `main` — production
- `develop/v2` — development base
- `feature/*` — individual section implementations (worktree-based)

### i18n

- Path-based routing: `/en/`, `/ja/`
- Root `/` detects browser language via `navigator.language` and redirects
- User's manual language selection is stored in `localStorage`

## File Management

- `.local/` — Internal documents, specs (gitignored)
- `CLAUDE.md` — This file (gitignored, local only)
