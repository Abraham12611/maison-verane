# Maison Verane

A fictional Parisian leather-bag house, built to show the **ÉCRIN · Voyage** video player (Video.js v10) inside a real page. Dark, minimal and leather-toned to match the skin.

Live: https://maison-verane.vercel.app
Player: https://ecrin.vercel.app ([source](https://github.com/Abraham12611/ecrin))

## Sections

Every section is 1x to 1.5x of the viewport height at desktop, tablet and phone sizes.

1. Hero
2. La Maison (manifesto and figures)
3. The Voyage collection
4. The Atelier Film, with the ÉCRIN Voyage player (Mux HLS)
5. The Atelier (craft)
6. Anatomy (line illustration)
7. Leathers
8. Journal
9. Services (the one light section)
10. Footer, one viewport tall

## The player

`src/player` is the ÉCRIN skin, trimmed to Voyage. The Appearance picker is hidden because there is only one skin. The film streams from Mux (`BrandPlayer.tsx`). On phones the player switches to the ÉCRIN phone layout through a container query.

## Stack

Vite, React, TypeScript, `@videojs/react` 10, `@videojs/mux-video`, Cormorant Garamond and Jost (self-hosted through Fontsource).

```
npm install
npm run dev
npm run build
```

`scripts/` holds the asset pipeline (`process-brand.mjs` cleans the SVGs, `process-images.mjs` converts photos to WebP) and a Playwright smoke test (`check.mjs`).

See [ATTRIBUTION.md](ATTRIBUTION.md) for how every asset was made.
