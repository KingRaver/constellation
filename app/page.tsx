'use client';

import { useState, useCallback, useEffect } from 'react';
import { ConstellationCanvas } from '@/components/ConstellationCanvas';
import { NodeDetailPanel } from '@/components/NodeDetailPanel';
import { CanvasErrorBoundary } from '@/components/CanvasErrorBoundary';
import { NODES, EDGES } from '@/lib/data';
import { SignalNode } from '@/lib/types';
import { SlotText } from '@/components/SlotText';

interface HoveredNodeState {
  node: SignalNode;
  canvasX: number;
  canvasY: number;
}

function Tooltip({ node, canvasX, canvasY }: HoveredNodeState) {
  // Keep tooltip on screen: if node is in right 30%, flip it left
  const flipLeft = canvasX > window.innerWidth * 0.68;

  return (
    <div
      className="absolute z-20 pointer-events-none tooltip-animate"
      style={{
        left: flipLeft ? canvasX - 24 : canvasX + 24,
        top: canvasY - 14,
        transform: flipLeft ? 'translateX(-100%)' : undefined,
      }}
    >
      <div
        className="rounded-sm px-3 py-2"
        style={{
          background: 'rgba(10, 7, 5, 0.82)',
          border: '1px solid rgba(245, 166, 35, 0.18)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <p className="text-white/90 text-sm font-light tracking-wide whitespace-nowrap">
          {node.name}
        </p>
        <p className="text-amber-400/60 text-xs mt-0.5 font-mono tracking-wider whitespace-nowrap">
          {node.metrics[0].label}: {node.metrics[0].value}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<SignalNode | null>(null);
  const [hoveredState, setHoveredState] = useState<HoveredNodeState | null>(null);

  const handleNodeHover = useCallback(
    (node: SignalNode | null, canvasX: number, canvasY: number) => {
      setHoveredState(node ? { node, canvasX, canvasY } : null);
    },
    []
  );

  const handleNodeSelect = useCallback((node: SignalNode | null) => {
    setSelectedNode(node);
    // Clear hover tooltip when a node is selected
    if (node) setHoveredState(null);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Close the detail panel when Escape is pressed.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedNode(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0705' }}>
      {/* Canvas — full viewport */}
      <div className="absolute inset-0">
        <CanvasErrorBoundary>
          <ConstellationCanvas
            onNodeSelect={handleNodeSelect}
            onNodeHover={handleNodeHover}
            selectedNodeId={selectedNode?.id ?? null}
          />
        </CanvasErrorBoundary>
      </div>

      {/* Hover tooltip — only visible when nothing is selected */}
      {hoveredState && !selectedNode && <Tooltip {...hoveredState} />}

      {/* Node detail panel */}
      <NodeDetailPanel node={selectedNode} onClose={handleClose} />

      {/* Installation title — top left, minimal */}
      <div className="absolute top-8 left-8 pointer-events-none select-none">
        <p className="iridescent-text text-xs tracking-[0.3em] uppercase font-mono">
          Waking Life Festival · Crato, Portugal
        </p>
        <h1
          className="text-3xl font-extralight tracking-[0.18em] mt-1"
          style={{ color: 'rgba(245, 220, 150, 0.18)' }}
        >
          <SlotText text="signal" />
        </h1>
      </div>

      {/* Status line — bottom left */}
      <div className="absolute bottom-7 left-8 pointer-events-none select-none">
        <p
          className="text-xs tracking-[0.22em] font-mono"
          style={{ color: 'rgba(200, 210, 220, 0.8)', textShadow: '0 0 10px rgba(100, 140, 180, 0.6)' }}
        >
          {NODES.length} nodes · {EDGES.length} active connections · all systems nominal
        </p>
      </div>
    </main>
  );
}
