# Codebase Gap Analysis — Signal
**Stack**: Next.js 14.2.5 · React 18 · TypeScript · HTML5 Canvas · Tailwind CSS · Vercel
**Audited**: 2026-05-28

---

## Phase 1 — Critical

- [ ] **Upgrade `next` from 14.2.5 → 14.2.35** *(package.json)*
  - **Why**: `npm audit` flags `next@14.2.5` as **critical** severity, traced through `postcss`. A non-breaking semver fix (`14.2.35`) is available. Run `npm install next@14.2.35`.

---

## Phase 2 — High Priority

- [ ] **Add HTTP security headers to `next.config.mjs`**
  - **Why**: No `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, or `Referrer-Policy` are set. Without `X-Frame-Options: DENY`, the installation can be silently embedded in a hostile iframe. Add a `headers()` function in next.config.

- [ ] **Add a `.gitignore`** *(project root)*
  - **Why**: ~~No `.gitignore` existed.~~ **Fixed** — `node_modules/` was committed on first push, causing GitHub to reject the push due to a 109 MB native binary. `.gitignore` added and commit rewritten.

- [ ] **Add touch event support to the canvas** *(components/ConstellationCanvas.tsx)*
  - **Why**: The canvas handles `onMouseMove`/`onClick` but has zero `onTouchStart`/`onTouchEnd` handlers. Festival attendees with phones and tablets will get a dead canvas. Map `touch.clientX/Y` to `mouseRef` and dispatch through the same code path.

- [ ] **Add Escape key handler to close the panel** *(app/page.tsx)*
  - **Why**: No keyboard event handlers exist anywhere. Pressing Escape while a panel is open does nothing. A `useEffect` listening for `keydown` in the page component is sufficient.

---

## Phase 3 — Medium

- [ ] **Remove unused `hasSelectedRef` / `hasSelectedNode` prop** *(ConstellationCanvas.tsx:237–238, page.tsx:75)*
  - **Why**: `hasSelectedNode` is passed as a prop and synced to `hasSelectedRef`, but `hasSelectedRef.current` is never read anywhere in the animation loop or event handlers. Dead prop + dead effect.

- [ ] **Remove unused `hoveredId` local variable** *(ConstellationCanvas.tsx:575)*
  - **Why**: `const hoveredId = hoveredIdRef.current` is declared at the top of `animate()` but the loop body reads `hoveredIdRef.current` directly. The variable is never consumed. Dead assignment.

- [ ] **Derive node/edge counts from data, not a hardcoded string** *(app/page.tsx:108)*
  - **Why**: `"22 nodes · 31 active connections · all systems nominal"` is a hardcoded literal. If nodes or edges are added/removed in `lib/data.ts`, this string goes stale silently. Replace with `${NODES.length} nodes · ${EDGES.length} active connections`.

- [ ] **Add an error boundary around `ConstellationCanvas`** *(app/page.tsx)*
  - **Why**: If the canvas context fails to initialize (GPU unavailable, low-memory device), the component throws uncaught and the entire page goes blank. A React error boundary renders a fallback instead.

- [ ] **Add OG/Twitter meta tags to `app/layout.tsx`**
  - **Why**: No OG or Twitter card tags means the installation shares as a blank link preview. For a showcase piece that may be shared via URL, the preview card matters.

- [ ] **Add `aria-label` to the canvas element** *(ConstellationCanvas.tsx:681)*
  - **Why**: The canvas has no accessible label. Screen readers announce it as an unnamed interactive element. One attribute fixes it.

---

## Phase 4 — Low / Enhancements

- [ ] **Cache the `edgeNodeMap` instead of rebuilding it every frame** *(ConstellationCanvas.tsx:344, 381)*
  - **Why**: `drawEdges` and `drawPackets` each build `new Map(nodesRef.current.map(...))` at 60fps = 120 Map constructions/second. Compute once at the top of `animate()` and pass it down.

- [ ] **Call `getConnected` once per frame instead of twice** *(ConstellationCanvas.tsx:593–594)*
  - **Why**: `getConnected(dimFocusId)` and `getConnected(edgeFocusId)` are called separately. When both IDs are identical (selection active), the same Set is computed twice per frame.

- [ ] **Debounce the resize handler** *(ConstellationCanvas.tsx:648–650)*
  - **Why**: On resize, `makeAnimatedNodes` is called with new `Math.random()` drift phases, causing all nodes to jump to new positions mid-animation. Debouncing (~150ms) and preserving phase values would give smooth reflow.

- [ ] **Add a favicon** *(public/favicon.ico)*
  - **Why**: No favicon exists. Browser tabs show the Next.js default. A single amber circle or "S" lettermark makes the demo tab identifiable on a projector desktop.

- [ ] **Add a CI workflow** *(.github/workflows/ci.yml)*
  - **Why**: No automated build or type-check on push. A single `npm run build` step in GitHub Actions catches regressions before they reach Vercel.

---

**Total findings**: 1 critical · 4 high · 6 medium · 5 low
