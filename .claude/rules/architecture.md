# Architecture

## Astro Patterns

- **Static by default** — pages are `.astro` files, zero JS unless needed
- **React only for interactivity** — Globe component uses `client:only="react"` directive
- **Tailwind for styling** — utility classes in templates, `global.css` for base styles only
- **No CSS-in-JS** — use Tailwind utilities or scoped `<style>` in Astro components

## Component Guidelines

### Astro Components (`.astro`)
- Used for: layouts, pages, static UI sections
- No client-side JS — purely server-rendered HTML
- Props via `Astro.props` with TypeScript interfaces

### React Components (`.tsx`)
- Used for: interactive elements (Globe, future interactive widgets)
- Must use `client:only="react"` or `client:load` in Astro templates
- Keep React components minimal — don't over-engineer

## File Organization

```
src/
├── components/     # Reusable across pages
├── layouts/        # Page shells (BaseLayout wraps everything)
├── pages/          # Each file = a route
├── styles/         # Global CSS only
└── assets/         # Images, fonts (if any)
```

### Rules
- One component per file
- Component name matches filename
- Pages are flat (no deep nesting except blog/[slug])
- Shared content data (projects list, experience list) can live in `src/data/` as TypeScript files
- Static assets (images, textures) go in `public/`

## Layout

- `BaseLayout.astro` wraps every page with `<html>`, `<head>`, nav, footer
- Pages only define their unique content inside the layout slot
- Meta tags (OG, Twitter) set via layout props

## Dependencies

- Keep dependencies minimal — Astro + React + Tailwind + Three.js is the stack
- Don't add UI libraries (no MUI, no Chakra) — Tailwind handles everything
- Don't add state management — site is mostly static
- New dependencies need justification
