// ============================================
// Range Visualizer Utilities
// ============================================

export const HAND_MATRIX_RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;

// Generate the 13x13 hand matrix notation
export function getHandNotation(row: number, col: number): string {
  const rank1 = HAND_MATRIX_RANKS[row];
  const rank2 = HAND_MATRIX_RANKS[col];

  if (row === col) {
    return `${rank1}${rank2}`; // Pair
  } else if (row < col) {
    return `${rank1}${rank2}s`; // Suited (above diagonal)
  } else {
    return `${rank2}${rank1}o`; // Offsuit (below diagonal)
  }
}

// Calculate number of combos for a hand
export function getHandCombos(hand: string): number {
  if (hand.length === 2) return 6; // Pair: 6 combos
  if (hand.endsWith('s')) return 4; // Suited: 4 combos
  return 12; // Offsuit: 12 combos
}

// Total combos in a range
export function getRangeCombos(hands: string[]): number {
  return hands.reduce((sum, hand) => sum + getHandCombos(hand), 0);
}

// Range percentage (out of 1326 total combos)
export function getRangePercentage(hands: string[]): number {
  return (getRangeCombos(hands) / 1326) * 100;
}

// Hand strength tier for coloring
export type HandTier = 'premium' | 'strong' | 'playable' | 'marginal' | 'weak';

export function getHandTier(hand: string): HandTier {
  const premium = ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'];
  const strong = ['TT', '99', 'AQs', 'AQo', 'AJs', 'KQs', 'ATs', 'KJs', 'QJs'];
  const playable = ['88', '77', '66', 'AJo', 'KQo', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
                    'KTs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s', 'KJo', 'QJo', 'JTo'];
  const marginal = ['55', '44', '33', '22', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
                    'Q9s', 'Q8s', 'J9s', 'T8s', '97s', '86s', '75s', '65s', '54s',
                    'ATo', 'A9o', 'KTo', 'QTo', 'J9o', 'T9o', '98o'];

  if (premium.includes(hand)) return 'premium';
  if (strong.includes(hand)) return 'strong';
  if (playable.includes(hand)) return 'playable';
  if (marginal.includes(hand)) return 'marginal';
  return 'weak';
}

// Get tier color classes
export function getTierColor(tier: HandTier, isSelected: boolean): string {
  if (!isSelected) return 'bg-slate-700 text-slate-400';

  switch (tier) {
    case 'premium': return 'bg-red-600 text-white';
    case 'strong': return 'bg-orange-500 text-white';
    case 'playable': return 'bg-yellow-500 text-black';
    case 'marginal': return 'bg-green-600 text-white';
    case 'weak': return 'bg-blue-600 text-white';
  }
}

// Preset ranges by position
export interface PositionRange {
  position: string;
  name: string;
  description: string;
  hands: string[];
  action: 'open' | 'call' | '3bet';
}

export const POSITION_RANGES: PositionRange[] = [
  {
    position: 'UTG',
    name: 'Under the Gun',
    description: 'Tightest opening range (~11%)',
    action: 'open',
    hands: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'AKo', 'AQo'],
  },
  {
    position: 'MP',
    name: 'Middle Position',
    description: 'Slightly wider (~15%)',
    action: 'open',
    hands: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', 'AKo', 'AQo', 'AJo', 'KQo'],
  },
  {
    position: 'CO',
    name: 'Cutoff',
    description: 'Wide range (~25%)',
    action: 'open',
    hands: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'T8s', '98s', '87s', '76s', '65s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo', 'JTo'],
  },
  {
    position: 'BTN',
    name: 'Button',
    description: 'Widest opening range (~40%)',
    action: 'open',
    hands: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'QJs', 'QTs', 'Q9s', 'Q8s', 'JTs', 'J9s', 'J8s', 'T9s', 'T8s', 'T7s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'KQo', 'KJo', 'KTo', 'K9o', 'QJo', 'QTo', 'Q9o', 'JTo', 'J9o', 'T9o', '98o', '87o'],
  },
  {
    position: 'SB',
    name: 'Small Blind',
    description: 'Steal range (~35%)',
    action: 'open',
    hands: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'QJs', 'QTs', 'Q9s', 'Q8s', 'JTs', 'J9s', 'T9s', 'T8s', '98s', '97s', '87s', '76s', '65s', '54s', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'KQo', 'KJo', 'KTo', 'QJo', 'QTo', 'JTo'],
  },
  {
    position: 'BB',
    name: 'Big Blind Defense',
    description: 'Defend wide (~45%)',
    action: 'call',
    hands: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'JTs', 'J9s', 'J8s', 'J7s', 'T9s', 'T8s', 'T7s', '98s', '97s', '96s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '53s', '43s', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o', 'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'QJo', 'QTo', 'Q9o', 'JTo', 'J9o', 'T9o', 'T8o', '98o', '87o', '76o', '65o'],
  },
];

// Check if a hand is in a range
export function isHandInRange(hand: string, range: string[]): boolean {
  return range.includes(hand);
}
