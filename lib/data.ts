import { SignalNode, SignalEdge } from './types';

export const NODES: SignalNode[] = [
  // ── Stages ───────────────────────────────────────────────────────────────
  {
    id: 'palco-principal',
    name: 'Palco Principal',
    type: 'stage',
    description: 'Where the signal becomes sound. Everything flows through here.',
    metrics: [
      { label: 'Signal Strength', value: '98%' },
      { label: 'Connected Devices', value: '47' },
      { label: 'Uplink Bandwidth', value: '2.4 Gbps' },
      { label: 'Last Packet', value: '0.1s ago' },
    ],
    basePosition: [0.46, 0.42],
  },
  {
    id: 'palco-floresta',
    name: 'Palco Floresta',
    type: 'stage',
    description: 'Deep in the trees, it hums. The forest has a frequency.',
    metrics: [
      { label: 'Signal Strength', value: '94%' },
      { label: 'Connected Devices', value: '23' },
      { label: 'Uplink Bandwidth', value: '1.4 Gbps' },
      { label: 'Last Packet', value: '0.2s ago' },
    ],
    basePosition: [0.23, 0.60],
  },
  {
    id: 'palco-nascente',
    name: 'Palco Nascente',
    type: 'stage',
    description: 'First light. First signal. The east always wakes before the rest.',
    metrics: [
      { label: 'Signal Strength', value: '91%' },
      { label: 'Connected Devices', value: '18' },
      { label: 'Uplink Bandwidth', value: '1.1 Gbps' },
      { label: 'Last Packet', value: '0.4s ago' },
    ],
    basePosition: [0.74, 0.28],
  },

  // ── Access Points ─────────────────────────────────────────────────────────
  {
    id: 'ap-entrada',
    name: 'AP-ENTRADA',
    type: 'access-point',
    description: 'The first hello. Every connection begins here.',
    metrics: [
      { label: 'Clients Connected', value: '87' },
      { label: 'Channel Utilization', value: '62%' },
      { label: 'Signal / Noise', value: '−67 dBm' },
      { label: 'Uptime', value: '6d 2h' },
    ],
    basePosition: [0.13, 0.33],
  },
  {
    id: 'ap-campismo',
    name: 'AP-CAMPISMO',
    type: 'access-point',
    description: '3am in the field, someone streams a set to their tent. It holds.',
    metrics: [
      { label: 'Clients Connected', value: '134' },
      { label: 'Channel Utilization', value: '78%' },
      { label: 'Signal / Noise', value: '−69 dBm' },
      { label: 'Uptime', value: '5d 18h' },
    ],
    basePosition: [0.10, 0.54],
  },
  {
    id: 'ap-backstage',
    name: 'AP-BACKSTAGE',
    type: 'access-point',
    description: 'Invisible to the crowd. Essential to everything they feel.',
    metrics: [
      { label: 'Clients Connected', value: '31' },
      { label: 'Channel Utilization', value: '34%' },
      { label: 'Signal / Noise', value: '−64 dBm' },
      { label: 'Uptime', value: '6d 4h' },
    ],
    basePosition: [0.37, 0.22],
  },
  {
    id: 'ap-mercado',
    name: 'AP-MERCADO',
    type: 'access-point',
    description: 'Commerce and community, conducted over the air.',
    metrics: [
      { label: 'Clients Connected', value: '56' },
      { label: 'Channel Utilization', value: '48%' },
      { label: 'Signal / Noise', value: '−70 dBm' },
      { label: 'Uptime', value: '5d 22h' },
    ],
    basePosition: [0.64, 0.67],
  },
  {
    id: 'ap-arte-01',
    name: 'AP-ARTE-01',
    type: 'access-point',
    description: 'The art zone listens. It transmits back.',
    metrics: [
      { label: 'Clients Connected', value: '28' },
      { label: 'Channel Utilization', value: '41%' },
      { label: 'Signal / Noise', value: '−68 dBm' },
      { label: 'Uptime', value: '4d 11h' },
    ],
    basePosition: [0.29, 0.76],
  },
  {
    id: 'ap-arte-02',
    name: 'AP-ARTE-02',
    type: 'access-point',
    description: 'Signal reaches the edges. So does the light.',
    metrics: [
      { label: 'Clients Connected', value: '19' },
      { label: 'Channel Utilization', value: '29%' },
      { label: 'Signal / Noise', value: '−72 dBm' },
      { label: 'Uptime', value: '4d 9h' },
    ],
    basePosition: [0.77, 0.70],
  },

  // ── Payment Terminals ─────────────────────────────────────────────────────
  {
    id: 'pos-bar-principal',
    name: 'POS-BAR-PRINCIPAL',
    type: 'payment',
    description: 'Every transaction is a small act of trust in the network.',
    metrics: [
      { label: 'Transactions Today', value: '287' },
      { label: 'Avg Response Time', value: '0.9s' },
      { label: 'Last Transaction', value: '23s ago' },
      { label: 'Connectivity', value: '99.9%' },
    ],
    basePosition: [0.56, 0.49],
  },
  {
    id: 'pos-bar-floresta',
    name: 'POS-BAR-FLORESTA',
    type: 'payment',
    description: 'The forest has its own economy.',
    metrics: [
      { label: 'Transactions Today', value: '143' },
      { label: 'Avg Response Time', value: '1.1s' },
      { label: 'Last Transaction', value: '1m 12s ago' },
      { label: 'Connectivity', value: '99.4%' },
    ],
    basePosition: [0.30, 0.57],
  },
  {
    id: 'pos-mercado-01',
    name: 'POS-MERCADO-01',
    type: 'payment',
    description: 'Goods and stories exchanged at the speed of radio.',
    metrics: [
      { label: 'Transactions Today', value: '198' },
      { label: 'Avg Response Time', value: '1.0s' },
      { label: 'Last Transaction', value: '47s ago' },
      { label: 'Connectivity', value: '99.7%' },
    ],
    basePosition: [0.66, 0.75],
  },
  {
    id: 'pos-mercado-02',
    name: 'POS-MERCADO-02',
    type: 'payment',
    description: 'A redundant node. Because some things must not fail.',
    metrics: [
      { label: 'Transactions Today', value: '172' },
      { label: 'Avg Response Time', value: '0.8s' },
      { label: 'Last Transaction', value: '2m 3s ago' },
      { label: 'Connectivity', value: '99.8%' },
    ],
    basePosition: [0.74, 0.60],
  },

  // ── Crew Devices ──────────────────────────────────────────────────────────
  {
    id: 'crew-production',
    name: 'Crew: Production Lead',
    type: 'crew',
    description: 'She carries the whole signal in her head.',
    metrics: [
      { label: 'Battery', value: '84%' },
      { label: 'Signal Strength', value: '96%' },
      { label: 'Last Check-in', value: '2 min ago' },
      { label: 'Messages Today', value: '156' },
    ],
    basePosition: [0.42, 0.30],
  },
  {
    id: 'crew-stage-a',
    name: 'Crew: Stage Manager A',
    type: 'crew',
    description: 'Cue the lights. Cue the sound. Hold the line.',
    metrics: [
      { label: 'Battery', value: '91%' },
      { label: 'Signal Strength', value: '98%' },
      { label: 'Last Check-in', value: '0.5 min ago' },
      { label: 'Messages Today', value: '89' },
    ],
    basePosition: [0.52, 0.36],
  },
  {
    id: 'crew-stage-b',
    name: 'Crew: Stage Manager B',
    type: 'crew',
    description: 'Two stages, one rhythm. He finds the tempo.',
    metrics: [
      { label: 'Battery', value: '67%' },
      { label: 'Signal Strength', value: '87%' },
      { label: 'Last Check-in', value: '4 min ago' },
      { label: 'Messages Today', value: '112' },
    ],
    basePosition: [0.26, 0.46],
  },
  {
    id: 'crew-security',
    name: 'Crew: Security Lead',
    type: 'crew',
    description: 'He watches the edges so others can forget they exist.',
    metrics: [
      { label: 'Battery', value: '76%' },
      { label: 'Signal Strength', value: '93%' },
      { label: 'Last Check-in', value: '1 min ago' },
      { label: 'Messages Today', value: '43' },
    ],
    basePosition: [0.16, 0.43],
  },
  {
    id: 'crew-noc',
    name: 'Crew: Network NOC',
    type: 'crew',
    description: 'The eye that never closes. The hand that never shakes.',
    metrics: [
      { label: 'Battery', value: '94%' },
      { label: 'Signal Strength', value: '99%' },
      { label: 'Last Check-in', value: '0s ago' },
      { label: 'Messages Today', value: '234' },
    ],
    basePosition: [0.53, 0.24],
  },

  // ── Art Installations ─────────────────────────────────────────────────────
  {
    id: 'arvore-de-luz',
    name: 'Árvore de Luz',
    type: 'art',
    description: 'Rooted in the earth. Reaching into the dark. Speaking in light.',
    metrics: [
      { label: 'Sensors Active', value: '12' },
      { label: 'Interactions Today', value: '847' },
      { label: 'Power Draw', value: '1.8 kW' },
      { label: 'Last Motion', value: '0.3s ago' },
    ],
    basePosition: [0.20, 0.71],
  },
  {
    id: 'portal',
    name: 'Portal',
    type: 'art',
    description: 'Step through. The signal follows you.',
    metrics: [
      { label: 'Sensors Active', value: '8' },
      { label: 'Interactions Today', value: '1847' },
      { label: 'Power Draw', value: '0.9 kW' },
      { label: 'Last Motion', value: '1.2s ago' },
    ],
    basePosition: [0.41, 0.80],
  },
  {
    id: 'espelho-ceu',
    name: 'Espelho do Céu',
    type: 'art',
    description: 'It reflects everything above. It remembers nothing. It holds all of it.',
    metrics: [
      { label: 'Sensors Active', value: '6' },
      { label: 'Interactions Today', value: '612' },
      { label: 'Power Draw', value: '2.4 kW' },
      { label: 'Last Motion', value: '4s ago' },
    ],
    basePosition: [0.80, 0.52],
  },
  {
    id: 'o-pulso',
    name: 'O Pulso',
    type: 'art',
    description: 'It listens. It responds. It is the heartbeat you forget is not your own.',
    metrics: [
      { label: 'Sensors Active', value: '9' },
      { label: 'Interactions Today', value: '2341' },
      { label: 'Power Draw', value: '1.2 kW' },
      { label: 'Last Motion', value: '0.1s ago' },
    ],
    basePosition: [0.51, 0.64],
  },
];

export const EDGES: SignalEdge[] = [
  // Palco Principal — most connected, central hub
  { from: 'palco-principal', to: 'ap-entrada',        curvature:  0.28 },
  { from: 'palco-principal', to: 'ap-backstage',      curvature: -0.22 },
  { from: 'palco-principal', to: 'pos-bar-principal', curvature:  0.18 },
  { from: 'palco-principal', to: 'crew-stage-a',      curvature: -0.30 },
  { from: 'palco-principal', to: 'crew-production',   curvature:  0.20 },

  // Palco Floresta
  { from: 'palco-floresta', to: 'ap-arte-01',       curvature: -0.22 },
  { from: 'palco-floresta', to: 'pos-bar-floresta', curvature:  0.30 },
  { from: 'palco-floresta', to: 'crew-stage-b',     curvature: -0.18 },
  { from: 'palco-floresta', to: 'arvore-de-luz',    curvature:  0.24 },

  // Palco Nascente — peripheral, fewer but strong connections
  { from: 'palco-nascente', to: 'ap-arte-02',   curvature:  0.22 },
  { from: 'palco-nascente', to: 'espelho-ceu',  curvature: -0.28 },
  { from: 'palco-nascente', to: 'crew-stage-b', curvature:  0.16 },

  // Access point mesh
  { from: 'ap-entrada',   to: 'ap-campismo',    curvature: -0.20 },
  { from: 'ap-entrada',   to: 'crew-security',  curvature:  0.26 },
  { from: 'ap-campismo',  to: 'ap-mercado',     curvature:  0.18 },
  { from: 'ap-campismo',  to: 'crew-security',  curvature: -0.22 },
  { from: 'ap-backstage', to: 'crew-production',curvature:  0.24 },
  { from: 'ap-backstage', to: 'crew-noc',       curvature: -0.16 },
  { from: 'ap-mercado',   to: 'pos-mercado-01', curvature:  0.22 },
  { from: 'ap-mercado',   to: 'pos-mercado-02', curvature: -0.26 },
  { from: 'ap-arte-01',   to: 'portal',         curvature:  0.32 },
  { from: 'ap-arte-01',   to: 'o-pulso',        curvature: -0.20 },
  { from: 'ap-arte-02',   to: 'espelho-ceu',    curvature:  0.18 },

  // Payment terminals
  { from: 'pos-bar-principal', to: 'crew-noc',        curvature:  0.22 },
  { from: 'pos-bar-floresta',  to: 'crew-stage-b',    curvature:  0.20 },
  { from: 'pos-mercado-01',    to: 'pos-mercado-02',  curvature: -0.14 },

  // Crew network
  { from: 'crew-noc',        to: 'crew-production', curvature:  0.32 },
  { from: 'crew-stage-a',    to: 'crew-stage-b',    curvature: -0.26 },
  { from: 'crew-production', to: 'crew-stage-a',    curvature:  0.16 },

  // Art installation web
  { from: 'portal',      to: 'o-pulso',      curvature:  0.28 },
  { from: 'o-pulso',     to: 'arvore-de-luz', curvature: -0.22 },
  { from: 'espelho-ceu', to: 'crew-noc',     curvature:  0.38 },
];
