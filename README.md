# Hunter Evanoff — Portfolio

Personal portfolio site for Hunter Evanoff, built with [React](https://react.dev/) and [Vite](https://vite.dev/) (powered by [Rolldown](https://rolldown.rs/)).

## Tech stack

- **Vite** (`rolldown-vite`) — dev server & bundler
- **React 18**
- **Sass** — styling (built-in Vite support)
- **vite-imagetools** — build-time responsive/WebP image generation
- **GSAP** — animations
- **react-modal**, **react-spinners**

## Local development

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # start dev server
```

## Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server                    |
| `npm run build`   | Production build to `dist/`                  |
| `npm run preview` | Preview the production build locally         |
| `npm run deploy`  | Build and publish `dist/` to the `master` branch via `gh-pages` |
| `npm run format`  | Format files with Prettier                   |

## Deployment

Pushing to the `code` branch triggers the GitHub Actions workflow
(`.github/workflows/node.js.yml`), which builds the site and deploys `dist/`
to the `master` branch (served by GitHub Pages at [evanoff.dev](https://evanoff.dev)).

## Project structure

- `index.html` — app entry & static SEO meta tags
- `src/main.jsx` — React mount point
- `src/pages/index.jsx` — top-level page
- `src/components/` — UI components
- `src/data/portfolioData.json` — portfolio project data
- `src/images/` — source images (optimized at build time)
- `public/` — static assets copied verbatim (resume, manifest, CNAME, favicon)
