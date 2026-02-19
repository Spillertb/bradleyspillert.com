# bradleyspillert.com

Personal portfolio website for Bradley Spillert — mechatronics/embedded engineer, drone builder, maker.

## Quick Start

```bash
npm run dev      # Dev server → localhost:4321
npm run build    # Production build
npm run preview  # Preview production build
```

## Stack

- **Astro** — Static site generator (content-focused, minimal JS)
- **React** — Interactive components (Globe, etc.)
- **Tailwind CSS** — Utility-first styling
- **Three.js** — 3D globe on travel page
- **TypeScript** — Type safety

## Key Rules

All detailed conventions are in `.claude/rules/`:

| Rule File | Covers |
|-----------|--------|
| `design.md` | Visual style, dark mode, typography, no-go list |
| `content.md` | Tone, voice, what to include/exclude |
| `architecture.md` | Astro patterns, component structure, file organization |
| `workflow.md` | Build checks, git, deployment |

## Site Structure

```
src/
├── components/     # Reusable UI components
│   ├── Nav.astro   # Navigation bar (active page highlighting)
│   ├── Footer.astro
│   └── Globe.tsx   # Three.js interactive globe (React)
├── layouts/
│   └── BaseLayout.astro  # Shared HTML shell, meta tags, fonts
├── pages/
│   ├── index.astro       # Hero + intro
│   ├── experience.astro  # Work history
│   ├── projects.astro    # Technical projects
│   ├── adventures.astro  # Hobbies, interests, life
│   ├── travel.astro      # Interactive globe + travel pins
│   └── blog/             # Blog (future)
│       ├── index.astro
│       └── [slug].astro
└── styles/
    └── global.css        # Tailwind base + custom styles
```

## Before Committing

1. `npm run build` — must pass with zero errors
2. Check pages render correctly
3. No broken links or missing assets
