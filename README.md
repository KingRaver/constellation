# Signal

Signal is a living constellation — a generative art installation that renders the invisible nervous system of Waking Life as something beautiful, breathing, and alive. Twenty-two nodes float in deep space: stages glow like distant suns, access points pulse with slow sonar rings, crew devices flicker with urgent life, and art installations breathe in rhythms that feel almost biological. Between them, bezier threads carry data packets like fireflies crossing a dark field. This is not a dashboard. It is the infrastructure of a festival reimagined as sacred geometry — the same signals that carry music to a crowd and transactions to a terminal, made visible as light.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Interaction

- **Hover** a node to see its name and live status. Connected edges brighten.
- **Click** a node to open a detail panel with metrics and a description of what it does.
- **Click outside** the panel (or the × button) to close it and return to the full constellation.

## Deployment

Zero-configuration Vercel deployment. Push to a connected repo or use `vercel deploy`.

## Technical notes

Rendered entirely on an HTML5 Canvas with `requestAnimationFrame` at 60fps. No charting libraries, no D3, no SVG. All data is hardcoded mock data — no backend, no API calls. Built with Next.js 14 App Router and TypeScript.
