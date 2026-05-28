# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

Resolves every finding from the `docs/GAPS.md` audit (1 critical, 4 high, 6 medium, 5 low).

### Security

- **Upgrade `next` 14.2.5 → 14.2.35** to clear the critical-severity advisory flagged by `npm audit` (traced through `postcss`).
- **Add HTTP security headers** in `next.config.mjs`: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`. `frame-ancestors 'none'` / `X-Frame-Options: DENY` prevent the installation from being embedded in a hostile iframe.

### Added

- **Touch support** on the constellation canvas (`onTouchStart`/`onTouchMove`/`onTouchEnd`) so phones and tablets can hover and select nodes through the same code path as the mouse.
- **Escape key handler** on the page to close the open detail panel.
- **Error boundary** (`CanvasErrorBoundary`) around `ConstellationCanvas` so a canvas/context failure shows a fallback message instead of a blank page.
- **OG/Twitter meta tags** in `app/layout.tsx` for rich link previews.
- **`aria-label`** and `role="img"` on the canvas element for screen-reader accessibility.
- **Favicon** (`app/icon.svg`) — an amber lettermark matching the installation aesthetic.
- **CI workflow** (`.github/workflows/ci.yml`) running `npm ci` + `npm run build` (which lints and type-checks) on push and pull requests.

### Changed

- **Derive the status-line counts** from `NODES.length` / `EDGES.length` instead of the hardcoded `"22 nodes · 31 active connections"` string, so the line can never go stale.
- **Cache the id→node map once per frame** and share it with the edge and packet draw passes (was rebuilt twice per frame).
- **Compute the connected-node set once per frame** when selection and hover focus the same node (was computed twice).
- **Debounce the resize handler** (~150ms) and reflow nodes without regenerating them, preserving drift phases so nodes no longer jump mid-animation on resize.

### Removed

- Dead `hasSelectedRef` ref / `hasSelectedNode` prop and its sync effect (never read).
- Dead `hoveredId` local variable in the animation loop (never consumed).
