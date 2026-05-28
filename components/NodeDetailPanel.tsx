'use client';

import { SignalNode, NodeType } from '@/lib/types';

// Human-readable node type labels
const TYPE_LABELS: Record<NodeType, string> = {
  stage:          'Stage',
  'access-point': 'Access Point',
  payment:        'Payment Terminal',
  crew:           'Crew Device',
  art:            'Art Installation',
};

// Accent color per node type — matches canvas palette
const TYPE_COLORS: Record<NodeType, string> = {
  stage:          '#f5a623',
  'access-point': '#00d4ff',
  payment:        '#e8890c',
  crew:           '#8b00ff',
  art:            '#cc00ff',
};

interface NodeDetailPanelProps {
  node: SignalNode | null;
  onClose: () => void;
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  const isOpen = node !== null;
  const color = node ? TYPE_COLORS[node.type] : '#f5a623';

  return (
    <>
      {/* Click-outside backdrop — only the empty area, panel itself handles its own clicks */}
      {isOpen && (
        <div
          className="absolute inset-0 z-30"
          onClick={onClose}
          aria-label="Close panel"
        />
      )}

      {/* Slide-in panel */}
      <div
        className="absolute right-0 top-0 h-full z-40 flex flex-col"
        style={{
          width: '360px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'rgba(8, 5, 3, 0.96)',
          borderLeft: '1px solid rgba(245, 166, 35, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        // Stop click-on-panel from closing it
        onClick={(e) => e.stopPropagation()}
      >
        {node && (
          <div className="flex flex-col h-full panel-animate">
            {/* Header */}
            <div
              className="px-8 pt-10 pb-6"
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')
                }
                aria-label="Close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <line x1="1" y1="1" x2="13" y2="13" />
                  <line x1="13" y1="1" x2="1" y2="13" />
                </svg>
              </button>

              {/* Type badge */}
              <div className="flex items-center gap-2.5 mb-3">
                {/* Colored dot */}
                <div
                  className="w-2 h-2 rounded-full status-pulse"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                <span
                  className="text-xs tracking-[0.25em] uppercase font-mono"
                  style={{ color: `${color}99` }}
                >
                  {TYPE_LABELS[node.type]}
                </span>
              </div>

              {/* Node name */}
              <h2
                className="text-2xl font-light tracking-wide leading-tight"
                style={{ color: 'rgba(255, 245, 225, 0.92)' }}
              >
                {node.name}
              </h2>

              {/* Status */}
              <div className="flex items-center gap-2 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
                <span className="text-xs font-mono tracking-[0.2em]" style={{ color: '#4ade8088' }}>
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="px-8 py-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-5">
                {node.metrics.map((metric) => (
                  <div key={metric.label}>
                    <p
                      className="text-xs tracking-[0.18em] uppercase font-mono mb-1.5"
                      style={{ color: 'rgba(255, 255, 255, 0.28)' }}
                    >
                      {metric.label}
                    </p>
                    <p
                      className="text-xl font-light tracking-wide"
                      style={{ color: 'rgba(255, 235, 200, 0.85)' }}
                    >
                      {metric.value}
                    </p>
                    {/* Subtle rule */}
                    <div
                      className="mt-3 h-px"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description footer */}
            <div
              className="px-8 py-8"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
            >
              {/* Decorative line in node color */}
              <div
                className="w-6 h-px mb-4"
                style={{ background: color, opacity: 0.5 }}
              />
              <p
                className="text-sm leading-relaxed font-light italic"
                style={{ color: 'rgba(255, 255, 255, 0.38)' }}
              >
                {node.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
