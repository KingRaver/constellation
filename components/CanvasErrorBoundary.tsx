'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Catches render/runtime failures from the canvas (e.g. GPU unavailable or
// 2D context allocation failure on low-memory devices) so the whole page does
// not go blank — a quiet fallback message is shown instead.
export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ConstellationCanvas failed to render:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <p
            className="text-xs tracking-[0.22em] font-mono text-center px-6"
            style={{ color: 'rgba(245, 166, 35, 0.45)' }}
          >
            The constellation could not be rendered on this device.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
