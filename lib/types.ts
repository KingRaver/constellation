export type NodeType = 'stage' | 'access-point' | 'payment' | 'crew' | 'art';

export interface Metric {
  label: string;
  value: string;
}

export interface SignalNode {
  id: string;
  name: string;
  type: NodeType;
  // One poetic line about what this node is
  description: string;
  metrics: Metric[];
  // Normalized canvas position [x, y] in 0–1 space
  basePosition: [number, number];
}

export interface SignalEdge {
  from: string;
  to: string;
  // Controls bezier bend: positive curves one way, negative the other
  curvature: number;
}
