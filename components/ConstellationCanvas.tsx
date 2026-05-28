'use client';

import { useEffect, useRef, useCallback } from 'react';
import { NODES, EDGES } from '@/lib/data';
import { SignalNode } from '@/lib/types';

// ─── Visual constants ─────────────────────────────────────────────────────────

const NODE_COLORS: Record<string, string> = {
  stage:           '#f5a623',
  'access-point':  '#00d4ff',
  payment:         '#00e676',
  crew:            '#8b00ff',
  art:             '#ff0099',
};

const NODE_RADII: Record<string, number> = {
  stage:           28,
  'access-point':  18,
  payment:         13,
  crew:            10,
  art:             20,
};

// Max pixels each node drifts from its base position
const DRIFT_AMPLITUDE = 24;

// Ambient dust motes
const PARTICLE_COUNT = 110;

// Average data packets spawned per second per edge
const PACKET_SPAWN_RATE = 0.35;

// ─── Internal animation types ─────────────────────────────────────────────────

interface AnimatedNode {
  id: string;
  type: string;
  // Layout: base in [0,1] space, current in canvas pixels
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  radius: number;
  color: string;
  // Independent Lissajous drift for each node
  driftFreqX: number;
  driftFreqY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  // Breathing oscillation (art nodes have a second harmonic)
  breathFreq: number;
  breathPhase: number;
  breathFreq2: number;
  breathPhase2: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface DataPacket {
  edgeIndex: number;
  // 0–1 progress along the bezier curve
  t: number;
  speed: number;
  color: string;
}

// ─── Pure math helpers ────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

// Quadratic bezier: position at parameter t
function bezierAt(
  ax: number, ay: number,
  cx: number, cy: number,
  bx: number, by: number,
  t: number
): [number, number] {
  const mt = 1 - t;
  return [
    mt * mt * ax + 2 * mt * t * cx + t * t * bx,
    mt * mt * ay + 2 * mt * t * cy + t * t * by,
  ];
}

// Compute a bezier control point that bends perpendicular to the edge midpoint
function controlPoint(
  ax: number, ay: number,
  bx: number, by: number,
  curvature: number
): [number, number] {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const len = Math.hypot(bx - ax, by - ay) || 1;
  // Unit perpendicular
  const px = -(by - ay) / len;
  const py =  (bx - ax) / len;
  const offset = len * curvature * 0.28;
  return [mx + px * offset, my + py * offset];
}

// ─── Initialization helpers ───────────────────────────────────────────────────

function makeAnimatedNodes(w: number, h: number): AnimatedNode[] {
  return NODES.map((node) => ({
    id: node.id,
    type: node.type,
    baseX: node.basePosition[0],
    baseY: node.basePosition[1],
    currentX: node.basePosition[0] * w,
    currentY: node.basePosition[1] * h,
    radius: NODE_RADII[node.type] ?? 14,
    color: NODE_COLORS[node.type] ?? '#ffffff',
    driftFreqX: 0.00013 + Math.random() * 0.00010,
    driftFreqY: 0.00011 + Math.random() * 0.00009,
    driftPhaseX: Math.random() * Math.PI * 2,
    driftPhaseY: Math.random() * Math.PI * 2,
    breathFreq:  0.00090 + Math.random() * 0.00060,
    breathPhase: Math.random() * Math.PI * 2,
    breathFreq2: 0.00140 + Math.random() * 0.00050,
    breathPhase2: Math.random() * Math.PI * 2,
  }));
}

function makeParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.38) * 7,
    vy: -(Math.random() * 14 + 4),
    size: Math.random() * 1.4 + 0.4,
    alpha: Math.random() * 0.22 + 0.04,
  };
}

// Pre-render sacred geometry to an offscreen canvas once, then composite it each frame
function buildGeometryCanvas(size: number): HTMLCanvasElement {
  const off = document.createElement('canvas');
  off.width = size;
  off.height = size;
  const ctx = off.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.165; // petal circle radius

  // All 7 circle centers (center + 6 petals)
  const centers: [number, number][] = [[cx, cy]];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    centers.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
  }

  // Six outer circles (second ring of Flower of Life)
  const outerCenters: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    outerCenters.push([cx + R * 2 * Math.cos(a), cy + R * 2 * Math.sin(a)]);
  }

  ctx.strokeStyle = 'rgba(255, 215, 80, 1)';

  // Draw all 13 circles
  ctx.lineWidth = 1.2;
  [...centers, ...outerCenters].forEach(([ox, oy]) => {
    ctx.beginPath();
    ctx.arc(ox, oy, R, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Metatron's Cube: connect all 7 inner centers to each other
  ctx.lineWidth = 0.7;
  for (let i = 0; i < centers.length; i++) {
    for (let j = i + 1; j < centers.length; j++) {
      ctx.beginPath();
      ctx.moveTo(centers[i][0], centers[i][1]);
      ctx.lineTo(centers[j][0], centers[j][1]);
      ctx.stroke();
    }
  }

  return off;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ConstellationCanvasProps {
  onNodeSelect: (node: SignalNode | null) => void;
  onNodeHover: (node: SignalNode | null, x: number, y: number) => void;
  // The currently selected node id, kept in sync with React state so the
  // canvas can clear its own ref when the panel is closed externally.
  selectedNodeId: string | null;
}

export function ConstellationCanvas({
  onNodeSelect,
  onNodeHover,
  selectedNodeId,
}: ConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  // Animation state — all in refs so the rAF loop never triggers React re-renders
  const nodesRef         = useRef<AnimatedNode[]>([]);
  const particlesRef     = useRef<Particle[]>([]);
  const packetsRef       = useRef<DataPacket[]>([]);
  const hoveredIdRef     = useRef<string | null>(null);
  const selectedIdRef    = useRef<string | null>(null);
  const mouseRef         = useRef({ x: -9999, y: -9999 });
  const geometryRef      = useRef<HTMLCanvasElement | null>(null);
  const lastSpawnTimeRef = useRef<number[]>(EDGES.map(() => Math.random() * 3000));
  const logicalSizeRef   = useRef({ w: 0, h: 0 });
  const prevHoveredRef   = useRef<string | null>(null);
  const prevTimestampRef = useRef<number>(0);

  // When the parent clears the selected node (panel closed externally), clear the canvas ref too
  useEffect(() => { selectedIdRef.current = selectedNodeId; }, [selectedNodeId]);

  // ─── Connected-node set for dimming ────────────────────────────────────────

  const getConnected = useCallback((nodeId: string | null): Set<string> => {
    if (!nodeId) return new Set();
    const s = new Set<string>([nodeId]);
    EDGES.forEach(({ from, to }) => {
      if (from === nodeId) s.add(to);
      if (to   === nodeId) s.add(from);
    });
    return s;
  }, []);

  // ─── Hit-test under mouse ───────────────────────────────────────────────────

  const nodeUnderMouse = useCallback((): string | null => {
    const { x, y } = mouseRef.current;
    for (const n of nodesRef.current) {
      if (Math.hypot(n.currentX - x, n.currentY - y) <= n.radius * 2.4) return n.id;
    }
    return null;
  }, []);

  // ─── Update node positions (drift) ─────────────────────────────────────────

  const updatePositions = useCallback((t: number) => {
    const { w, h } = logicalSizeRef.current;
    for (const n of nodesRef.current) {
      n.currentX = n.baseX * w + Math.sin(t * n.driftFreqX + n.driftPhaseX) * DRIFT_AMPLITUDE;
      n.currentY = n.baseY * h + Math.cos(t * n.driftFreqY + n.driftPhaseY) * DRIFT_AMPLITUDE;
    }
  }, []);

  // ─── Draw: background + vignette ───────────────────────────────────────────

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    const { w, h } = logicalSizeRef.current;
    ctx.fillStyle = '#0a0705';
    ctx.fillRect(0, 0, w, h);

    // Radial vignette to deepen the corners
    const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.18, w / 2, h / 2, h * 0.9);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(4, 2, 1, 0.72)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
  }, []);

  // ─── Draw: sacred geometry ──────────────────────────────────────────────────

  const drawGeometry = useCallback((ctx: CanvasRenderingContext2D, t: number) => {
    if (!geometryRef.current) return;
    const { w, h } = logicalSizeRef.current;
    const size = Math.max(w, h) * 0.88;

    // Full hue cycle every ~5 minutes
    const hue = (t * 0.0012) % 360;

    ctx.save();
    ctx.globalAlpha = 0.09;
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = `hue-rotate(${hue.toFixed(1)}deg)`;
    ctx.translate(w / 2, h / 2);
    ctx.rotate(t * 0.000016); // completes one rotation in ~109 minutes
    ctx.drawImage(geometryRef.current, -size / 2, -size / 2, size, size);
    ctx.restore();
  }, []);

  // ─── Draw: ambient particles ────────────────────────────────────────────────

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, dt: number) => {
    const { w, h } = logicalSizeRef.current;
    ctx.save();
    for (const p of particlesRef.current) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Wrap to a fresh random position when a particle leaves the top
      if (p.y < -6) {
        const fresh = makeParticle(w, h);
        p.x    = fresh.x;
        p.y    = h + 4;
        p.vx   = fresh.vx;
        p.vy   = fresh.vy;
        p.size = fresh.size;
        p.alpha = fresh.alpha;
      }
      if (p.x < -6)  p.x = w + 4;
      if (p.x > w + 6) p.x = -4;

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = '#f5a623';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }, []);

  // ─── Draw: edges ────────────────────────────────────────────────────────────

  const drawEdges = useCallback((
    ctx: CanvasRenderingContext2D,
    focusedId: string | null,
    connected: Set<string>,
    map: Map<string, AnimatedNode>
  ) => {
    const hasFocus = focusedId !== null;

    EDGES.forEach(({ from, to, curvature }) => {
      const a = map.get(from);
      const b = map.get(to);
      if (!a || !b) return;

      const isActive  = hasFocus && connected.has(from) && connected.has(to);
      const isDimmed  = hasFocus && !isActive;

      const [cpx, cpy] = controlPoint(a.currentX, a.currentY, b.currentX, b.currentY, curvature);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(a.currentX, a.currentY);
      ctx.quadraticCurveTo(cpx, cpy, b.currentX, b.currentY);
      ctx.strokeStyle = isDimmed
        ? 'rgba(200, 200, 210, 0.022)'
        : isActive
          ? 'rgba(245, 190, 90, 0.52)'
          : 'rgba(210, 205, 200, 0.11)';
      ctx.lineWidth = isActive ? 1.4 : 0.55;
      ctx.stroke();
      ctx.restore();
    });
  }, []);

  // ─── Draw: data packets travelling along edges ──────────────────────────────

  const drawPackets = useCallback((
    ctx: CanvasRenderingContext2D,
    t: number,
    dt: number,
    focusedId: string | null,
    connected: Set<string>,
    map: Map<string, AnimatedNode>
  ) => {
    const hasFocus = focusedId !== null;

    // Spawn new packets
    EDGES.forEach(({ from, to }, i) => {
      const elapsed = t - lastSpawnTimeRef.current[i];
      const interval = (1 / PACKET_SPAWN_RATE) * 1000 * (0.5 + Math.random() * 1.2);
      if (elapsed > interval && packetsRef.current.length < 90) {
        const srcNode = map.get(from);
        packetsRef.current.push({
          edgeIndex: i,
          t: 0,
          speed: 0.22 + Math.random() * 0.38,
          color: srcNode?.color ?? '#f5a623',
        });
        lastSpawnTimeRef.current[i] = t;
      }
    });

    // Advance and render each packet
    packetsRef.current = packetsRef.current.filter((pkt) => {
      pkt.t += pkt.speed * dt;
      if (pkt.t >= 1) return false;

      const edge = EDGES[pkt.edgeIndex];
      if (!edge) return false;
      const a = map.get(edge.from);
      const b = map.get(edge.to);
      if (!a || !b) return false;

      // Dim packets on non-focused edges
      const onActiveEdge = !hasFocus || (connected.has(edge.from) && connected.has(edge.to));
      if (!onActiveEdge) return true; // keep alive, just skip drawing

      const [cpx, cpy] = controlPoint(a.currentX, a.currentY, b.currentX, b.currentY, edge.curvature);
      const [px, py]   = bezierAt(a.currentX, a.currentY, cpx, cpy, b.currentX, b.currentY, pkt.t);
      const [r, g, bl] = hexToRgb(pkt.color);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      const grd = ctx.createRadialGradient(px, py, 0, px, py, 6);
      grd.addColorStop(0,   `rgba(${r},${g},${bl},0.95)`);
      grd.addColorStop(0.4, `rgba(${r},${g},${bl},0.28)`);
      grd.addColorStop(1,   'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      return true;
    });
  }, []);

  // ─── Draw: single node with layered glow ────────────────────────────────────

  const drawNode = useCallback((
    ctx: CanvasRenderingContext2D,
    node: AnimatedNode,
    t: number,
    isHovered: boolean,
    isDimmed: boolean
  ) => {
    const { currentX: x, currentY: y, radius, color, type } = node;

    // Breathing scale — art nodes have a second harmonic for organic irregularity
    let breath = 1 + Math.sin(t * node.breathFreq + node.breathPhase) * 0.08;
    if (type === 'art') {
      breath += Math.sin(t * node.breathFreq2 + node.breathPhase2) * 0.04;
    }
    if (isHovered) breath = Math.min(breath * 1.10, 1.18);
    const r = radius * breath;
    const [ri, gi, bi] = hexToRgb(color);

    const masterAlpha = isDimmed ? 0.10 : 1.0;

    ctx.save();
    ctx.globalAlpha = masterAlpha;
    ctx.globalCompositeOperation = 'lighter';

    // Wide outer halo — sets the ambient glow field around the node
    const haloR = r * (type === 'stage' ? 5.5 : type === 'art' ? 4.5 : 4.0);
    const halo  = ctx.createRadialGradient(x, y, 0, x, y, haloR);
    halo.addColorStop(0,   `rgba(${ri},${gi},${bi},0.10)`);
    halo.addColorStop(0.45,`rgba(${ri},${gi},${bi},0.04)`);
    halo.addColorStop(1,   'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, haloR, 0, Math.PI * 2);
    ctx.fill();

    // Mid glow — the visible bloom around the core
    const midR = r * 2.4;
    const mid  = ctx.createRadialGradient(x, y, 0, x, y, midR);
    mid.addColorStop(0,   `rgba(${ri},${gi},${bi},0.38)`);
    mid.addColorStop(0.55,`rgba(${ri},${gi},${bi},0.14)`);
    mid.addColorStop(1,   'transparent');
    ctx.fillStyle = mid;
    ctx.beginPath();
    ctx.arc(x, y, midR, 0, Math.PI * 2);
    ctx.fill();

    // Bright core — small and intense, white at center
    const core = ctx.createRadialGradient(x, y, 0, x, y, r);
    core.addColorStop(0,    'rgba(255,255,255,0.96)');
    core.addColorStop(0.22, `rgba(${ri},${gi},${bi},0.92)`);
    core.addColorStop(0.65, `rgba(${ri},${gi},${bi},0.48)`);
    core.addColorStop(1,    'transparent');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.save();
    ctx.globalAlpha = masterAlpha;

    // ── Type-specific rings ──────────────────────────────────────────────────

    if (type === 'stage') {
      // Two slow static halos — the "sun" rings
      ctx.strokeStyle = rgba(color, isHovered ? 0.52 : 0.24);
      ctx.lineWidth   = 1.0;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = rgba(color, isHovered ? 0.28 : 0.11);
      ctx.lineWidth   = 0.55;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (type === 'access-point') {
      // Two expanding sonar-ping rings at offset phases
      for (let i = 0; i < 2; i++) {
        const phase   = ((t * 0.00042) + i * 0.5) % 1;
        const ringR   = r + phase * r * 3.2;
        const ringAlpha = (1 - phase) * (isHovered ? 0.65 : 0.38);
        ctx.strokeStyle = rgba(color, ringAlpha);
        ctx.lineWidth   = 0.7;
        ctx.beginPath();
        ctx.arc(x, y, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (type === 'crew') {
      // Single fast pulse ring — feels alive and mobile
      const phase     = ((t * 0.0020 + node.breathPhase) % (Math.PI * 2)) / (Math.PI * 2);
      const ringR     = r + phase * r * 2.4;
      const ringAlpha = (1 - phase) * (isHovered ? 0.72 : 0.44);
      ctx.strokeStyle = rgba(color, ringAlpha);
      ctx.lineWidth   = 0.6;
      ctx.beginPath();
      ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (type === 'art') {
      // Soft irregular outer glow ring — most organic
      const wobble    = 1 + Math.sin(t * node.breathFreq * 0.7 + node.breathPhase2) * 0.12;
      const ringR     = r * 1.8 * wobble;
      const ringAlpha = (0.15 + Math.sin(t * node.breathFreq2 + node.breathPhase) * 0.08) * (isHovered ? 1.8 : 1);
      ctx.strokeStyle = rgba(color, Math.max(0, Math.min(1, ringAlpha)));
      ctx.lineWidth   = 0.8;
      ctx.beginPath();
      ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  // ─── Main animation loop ─────────────────────────────────────────────────────

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dt = prevTimestampRef.current > 0
      ? Math.min((timestamp - prevTimestampRef.current) / 1000, 0.05)
      : 0.016;
    prevTimestampRef.current = timestamp;

    const t = timestamp; // use raw ms for oscillations — consistent and frame-rate independent

    // Update drifting node positions
    updatePositions(t);

    const selectedId = selectedIdRef.current;

    // Check hover state — update React only when it changes
    const nowHovered = nodeUnderMouse();
    if (nowHovered !== prevHoveredRef.current) {
      hoveredIdRef.current   = nowHovered;
      prevHoveredRef.current = nowHovered;
      const dataNode = nowHovered ? NODES.find((n) => n.id === nowHovered) ?? null : null;
      const aNode    = nowHovered ? nodesRef.current.find((n) => n.id === nowHovered) : null;
      onNodeHover(dataNode, aNode?.currentX ?? 0, aNode?.currentY ?? 0);
    }

    // Selection controls full dimming of nodes + edges.
    // Hover-only brightens edges without dimming anything — keeps the full
    // constellation visible when no node is selected.
    const dimFocusId  = selectedId;                        // node dimming: selection only
    const edgeFocusId = selectedId ?? hoveredIdRef.current; // edge brightening: hover or selection

    // When a selection is active both IDs are identical, so compute the set once.
    const edgeConnected = getConnected(edgeFocusId);
    const dimConnected  = dimFocusId === edgeFocusId ? edgeConnected : getConnected(dimFocusId);

    // Build the id→node lookup once per frame and share it with the edge/packet passes.
    const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]));

    // Render frame
    drawBackground(ctx);
    drawGeometry(ctx, t);
    drawParticles(ctx, dt);
    drawEdges(ctx, edgeFocusId, edgeConnected, nodeMap);
    drawPackets(ctx, t, dt, edgeFocusId, edgeConnected, nodeMap);

    for (const node of nodesRef.current) {
      const isHovered  = hoveredIdRef.current === node.id;
      const isDimmed   = dimFocusId !== null && !dimConnected.has(node.id);
      drawNode(ctx, node, t, isHovered, isDimmed);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [
    updatePositions, getConnected, nodeUnderMouse,
    drawBackground, drawGeometry, drawParticles, drawEdges, drawPackets, drawNode,
    onNodeHover,
  ]);

  // ─── Canvas setup and resize ─────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize the canvas backing store to the current viewport. Nodes use
    // normalized [0,1] base positions scaled by w/h each frame, so they reflow
    // automatically — no need to regenerate (which would reset drift phases).
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const lw  = window.innerWidth;
      const lh  = window.innerHeight;

      canvas.width       = lw * dpr;
      canvas.height      = lh * dpr;
      canvas.style.width  = `${lw}px`;
      canvas.style.height = `${lh}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);

      logicalSizeRef.current = { w: lw, h: lh };
    };

    // First-time init: size the canvas and seed nodes + particles.
    resizeCanvas();
    const { w, h } = logicalSizeRef.current;
    nodesRef.current     = makeAnimatedNodes(w, h);
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(w, h));

    // Build the sacred geometry offscreen canvas once
    geometryRef.current = buildGeometryCanvas(2400);

    // Start the loop
    rafRef.current = requestAnimationFrame(animate);

    // Debounce resize so a drag-resize doesn't thrash the backing store, and
    // preserve drift phases by only resizing (never regenerating) the nodes.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [animate]);

  // ─── Mouse handlers ───────────────────────────────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const id = nodeUnderMouse();
    selectedIdRef.current = id;
    onNodeSelect(id ? (NODES.find((n) => n.id === id) ?? null) : null);
  }, [nodeUnderMouse, onNodeSelect]);

  // ─── Touch handlers ─────────────────────────────────────────────────────────
  // Map touches onto the same mouseRef code path so phones/tablets are interactive.

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (!rect || !touch) return;
    mouseRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (!rect || !touch) return;
    mouseRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const touch = e.changedTouches[0];
    if (rect && touch) {
      mouseRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }

    // A tap acts as a click: select the node under the touch, then clear hover.
    const id = nodeUnderMouse();
    selectedIdRef.current = id;
    onNodeSelect(id ? (NODES.find((n) => n.id === id) ?? null) : null);
    mouseRef.current = { x: -9999, y: -9999 };
  }, [nodeUnderMouse, onNodeSelect]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full touch-none"
      style={{ cursor: 'crosshair' }}
      aria-label="Interactive constellation map of the Waking Life festival network. Tap or click a node to view its details."
      role="img"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
}
