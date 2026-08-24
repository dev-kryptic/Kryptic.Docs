# Kryptic Docs

Documentation site for [Kryptic](https://kryptic.dev), built with [Next.js](https://nextjs.org/) and MDX.
The production URL is [docs.kryptic.dev](https://docs.kryptic.dev).
Source: [github.com/dev-kryptic/Kryptic.Docs](https://github.com/dev-kryptic/Kryptic.Docs).

## GitHub secrets

Image-push credentials live in the GitHub **Environment** named `production`.

| Secret | Used for |
| --- | --- |
| `DOCKER_REGISTRY` | Registry host |
| `DOCKER_REGISTRY_USER` | Registry username |
| `DOCKER_REGISTRY_PASSWORD` | Registry password / token |

## Local

```bash
npm install
npm run dev                  # http://localhost:3000
```

Page feedback uses `NEXT_PUBLIC_PUBLIC_API_URL` from the environment at build time. Local default is `http://localhost:5240`.

The image listens on port `3000`.

## Project structure

| Path | Purpose |
|------|---------|
| `src/pages/` | MDX documentation pages |
| `src/components/` | Layout, navigation, and MDX components |
| `scripts/` | Build-time generators (sitemap, LLM docs, etc.) |
| `public/` | Static assets (logo, favicon) |

## Adding pages

1. Create an `.mdx` file under `src/pages/`.
2. Add the route to `src/components/NavigationDocs.jsx`.
3. Run `npm run build` to verify.
