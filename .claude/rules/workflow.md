# Development Workflow

## Build First

**ALWAYS run `npm run build` before committing.** Zero tolerance for broken builds.

```bash
npm run build    # Must pass clean
```

## Git Conventions

- Commit messages: short, imperative ("Add projects page", "Fix globe texture loading")
- No WIP commits on main
- Use feature branches for significant changes

## Deployment

- Hosted on **Vercel** — auto-deploys from main branch
- Every push to main triggers a build
- Broken builds = broken site = unacceptable

## Dev Server

```bash
npm run dev      # http://localhost:4321
```

- Hot reload is automatic
- Check multiple viewport sizes (mobile, tablet, desktop)
- Test the globe on the travel page — it's the most fragile component

## Asset Management

- Images go in `public/` directory
- Use optimized formats (WebP preferred, PNG for transparency)
- Earth texture for globe: `public/earth-blue-marble.jpg` (NASA Blue Marble)
- Keep image sizes reasonable (< 500KB per image ideally)

## Adding New Pages

1. Create `src/pages/pagename.astro`
2. Use `BaseLayout` as the wrapper
3. Add nav link in `src/components/Nav.astro`
4. Build and verify

## Adding Blog Posts (Future)

1. Create `src/pages/blog/post-slug.astro` (or .mdx when configured)
2. Follow content rules in `content.md`
3. Build and verify
