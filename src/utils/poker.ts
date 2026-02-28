// Card suits and ranks
export const SUITS = ['s', 'h', 'd', 'c'] as const; // spades, hearts, diamonds, clubs
export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;

export type Suit = typeof SUITS[number];
export type Rank = typeof RANKS[number];

export interface Card {
  rank: Rank;
  suit: Suit;
}

export const SUIT_SYMBOLS: Record<Suit, string> = {
  s: '♠',
  h: '♥',
  d: '♦',
  c: '♣',
};

export const SUIT_COLORS: Record<Suit, string> = {
  s: 'text-gray-900',
  h: 'text-red-600',
  d: 'text-red-600',
  c: 'text-gray-900',
};

export const RANK_VALUES: Record<Rank, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10,
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2,
};

// Create a full deck of 52 cards
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

// Card string representation (e.g., "As" for Ace of spades)
export function cardToString(card: Card): string {
  return `${card.rank}${card.suit}`;
}

export function stringToCard(str: string): Card | null {
  if (str.length !== 2) return null;
  const rank = str[0] as Rank;
  const suit = str[1] as Suit;
  if (!RANKS.includes(rank) || !SUITS.includes(suit)) return null;
  return { rank, suit };
}

// Hand evaluation types
export const HandRank = {
  HighCard: 0,
  Pair: 1,
  TwoPair: 2,
  ThreeOfAKind: 3,
  Straight: 4,
  Flush: 5,
  FullHouse: 6,
  FourOfAKind: 7,
  StraightFlush: 8,
  RoyalFlush: 9,
} as const;

export type HandRankType = typeof HandRank[keyof typeof HandRank];

export const HAND_NAMES: Record<HandRankType, string> = {
  [HandRank.HighCard]: 'High Card',
  [HandRank.Pair]: 'Pair',
  [HandRank.TwoPair]: 'Two Pair',
  [HandRank.ThreeOfAKind]: 'Three of a Kind',
  [HandRank.Straight]: 'Straight',
  [HandRank.Flush]: 'Flush',
  [HandRank.FullHouse]: 'Full House',
  [HandRank.FourOfAKind]: 'Four of a Kind',
  [HandRank.StraightFlush]: 'Straight Flush',
  [HandRank.RoyalFlush]: 'Royal Flush',
};

// Evaluate 5-card hand and return [handRank, ...tiebreakers]
function evaluate5Cards(cards: Card[]): number[] {
  const ranks = cards.map(c => RANK_VALUES[c.rank]).sort((a, b) => b - a);
  const suits = cards.map(c => c.suit);

  const isFlush = suits.every(s => s === suits[0]);

  // Check for straight (including A-2-3-4-5 wheel)
  let isStraight = false;
  let straightHigh = 0;

  const uniqueRanks = [...new Set(ranks)].sort((a, b) => b - a);
  if (uniqueRanks.length === 5) {
    if (uniqueRanks[0] - uniqueRanks[4] === 4) {
      isStraight = true;
      straightHigh = uniqueRanks[0];
    } else if (uniqueRanks[0] === 14 && uniqueRanks[1] === 5) {
      // Wheel: A-2-3-4-5
      isStraight = true;
      straightHigh = 5;
    }
  }

  // Count rank occurrences
  const rankCounts: Record<number, number> = {};
  for (const r of ranks) {
    rankCounts[r] = (rankCounts[r] || 0) + 1;
  }

  const counts = Object.entries(rankCounts)
    .map(([rank, count]) => ({ rank: parseInt(rank), count }))
    .sort((a, b) => b.count - a.count || b.rank - a.rank);

  // Determine hand rank
  if (isStraight && isFlush) {
    if (straightHigh === 14) {
      return [HandRank.RoyalFlush];
    }
    return [HandRank.StraightFlush, straightHigh];
  }

  if (counts[0].count === 4) {
    return [HandRank.FourOfAKind, counts[0].rank, counts[1].rank];
  }

  if (counts[0].count === 3 && counts[1].count === 2) {
    return [HandRank.FullHouse, counts[0].rank, counts[1].rank];
  }

  if (isFlush) {
    return [HandRank.Flush, ...ranks];
  }

  if (isStraight) {
    return [HandRank.Straight, straightHigh];
  }

  if (counts[0].count === 3) {
    const kickers = counts.slice(1).map(c => c.rank);
    return [HandRank.ThreeOfAKind, counts[0].rank, ...kickers];
  }

  if (counts[0].count === 2 && counts[1].count === 2) {
    const kicker = counts[2].rank;
    return [HandRank.TwoPair, counts[0].rank, counts[1].rank, kicker];
  }

  if (counts[0].count === 2) {
    const kickers = counts.slice(1).map(c => c.rank);
    return [HandRank.Pair, counts[0].rank, ...kickers];
  }

  return [HandRank.HighCard, ...ranks];
}

// Get all 5-card combinations from 7 cards
function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];

  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map(c => [first, ...c]);
  const withoutFirst = combinations(rest, k);

  return [...withFirst, ...withoutFirst];
}

// Evaluate best 5-card hand from 7 cards
export function evaluateBestHand(cards: Card[]): number[] {
  if (cards.length < 5) return [HandRank.HighCard, 0, 0, 0, 0, 0];

  const allCombos = combinations(cards, 5);
  let bestHand = evaluate5Cards(allCombos[0]);

  for (let i = 1; i < allCombos.length; i++) {
    const hand = evaluate5Cards(allCombos[i]);
    if (compareHands(hand, bestHand) > 0) {
      bestHand = hand;
    }
  }

  return bestHand;
}

// Compare two hands: returns positive if hand1 wins, negative if hand2 wins, 0 for tie
function compareHands(hand1: number[], hand2: number[]): number {
  for (let i = 0; i < Math.max(hand1.length, hand2.length); i++) {
    const v1 = hand1[i] ?? 0;
    const v2 = hand2[i] ?? 0;
    if (v1 !== v2) return v1 - v2;
  }
  return 0;
}

// Shuffle array in place
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Monte Carlo equity calculation
export interface EquityResult {
  wins: number;
  ties: number;
  losses: number;
  total: number;
  equity: number;
  winPct: number;
  tiePct: number;
  lossPct: number;
}

export function calculateEquity(
  heroCards: Card[],
  villainCards: Card[] | null, // null = random hand
  boardCards: Card[],
  iterations: number = 10000
): EquityResult {
  let wins = 0;
  let ties = 0;
  let losses = 0;

  const usedCards = new Set([
    ...heroCards.map(cardToString),
    ...boardCards.map(cardToString),
    ...(villainCards ? villainCards.map(cardToString) : []),
  ]);

  const remainingDeck = createDeck().filter(c => !usedCards.has(cardToString(c)));
  const needVillainCards = !villainCards;

  for (let i = 0; i < iterations; i++) {
    const shuffled = shuffleArray(remainingDeck);
    let idx = 0;

    // Deal villain cards if needed
    const vCards = villainCards || [shuffled[idx++], shuffled[idx++]];

    // Complete the board
    const fullBoard = [...boardCards];
    while (fullBoard.length < 5) {
      fullBoard.push(shuffled[idx++]);
    }

    // Evaluate hands
    const heroHand = evaluateBestHand([...heroCards, ...fullBoard]);
    const villainHand = evaluateBestHand([...(needVillainCards ? vCards : villainCards!), ...fullBoard]);

    const result = compareHands(heroHand, villainHand);
    if (result > 0) wins++;
    else if (result < 0) losses++;
    else ties++;
  }

  const total = wins + ties + losses;
  return {
    wins,
    ties,
    losses,
    total,
    equity: (wins + ties / 2) / total,
    winPct: (wins / total) * 100,
    tiePct: (ties / total) * 100,
    lossPct: (losses / total) * 100,
  };
}

// Common starting hand ranges
export interface HandRange {
  name: string;
  description: string;
  hands: string[]; // e.g., ['AA', 'KK', 'QQ', 'AKs', 'AKo']
}

export const COMMON_RANGES: HandRange[] = [
  {
    name: 'Premium',
    description: 'Top ~2.5% of hands',
    hands: ['AA', 'KK', 'QQ', 'AKs'],
  },
  {
    name: 'Strong',
    description: 'Top ~8% of hands',
    hands: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AKo', 'AJs', 'KQs'],
  },
  {
    name: 'Playable',
    description: 'Top ~20% of hands',
    hands: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'AKo', 'AQo', 'AJo', 'KQo'],
  },
];

// Calculate hand rankings for display
export function getHandStrength(card1: Card, card2: Card): string {
  const r1 = RANK_VALUES[card1.rank];
  const r2 = RANK_VALUES[card2.rank];
  const suited = card1.suit === card2.suit;

  const highRank = r1 >= r2 ? card1.rank : card2.rank;
  const lowRank = r1 >= r2 ? card2.rank : card1.rank;

  if (highRank === lowRank) {
    return `${highRank}${highRank}`; // Pair
  }

  return `${highRank}${lowRank}${suited ? 's' : 'o'}`;
}

// Draw types for outs calculation
export interface DrawInfo {
  type: string;
  description: string;
  outs: Card[];
  count: number;
}

// Identify all draws and their outs
export function identifyDraws(holeCards: Card[], boardCards: Card[]): DrawInfo[] {
  const allCards = [...holeCards, ...boardCards];
  const draws: DrawInfo[] = [];

  // Get all cards that are already used
  const usedCards = new Set(allCards.map(cardToString));
  const deck = createDeck().filter(c => !usedCards.has(cardToString(c)));

  // Check for flush draw
  const suitCounts: Record<Suit, Card[]> = { s: [], h: [], d: [], c: [] };
  for (const card of allCards) {
    suitCounts[card.suit].push(card);
  }

  for (const suit of SUITS) {
    const count = suitCounts[suit].length;
    if (count === 4) {
      // Flush draw - 9 outs
      const flushOuts = deck.filter(c => c.suit === suit);
      draws.push({
        type: 'Flush Draw',
        description: `Four ${SUIT_SYMBOLS[suit]} cards, need one more for a flush`,
        outs: flushOuts,
        count: flushOuts.length,
      });
    }
  }

  // Check for straight draws
  const rankValues = allCards.map(c => RANK_VALUES[c.rank]);
  const uniqueRanks = [...new Set(rankValues)].sort((a, b) => a - b);

  // Add ace as 1 for wheel straight checking
  if (uniqueRanks.includes(14)) {
    uniqueRanks.unshift(1);
  }

  // Find straight draws (open-ended and gutshot)
  const straightOuts: Card[] = [];

  // Check each possible 5-card straight
  for (let high = 5; high <= 14; high++) {
    const needed = [high, high - 1, high - 2, high - 3, high - 4];
    // Adjust for wheel (A-2-3-4-5)
    const adjustedNeeded = needed.map(r => r === 0 ? 14 : r === -1 ? 13 : r === -2 ? 12 : r === -3 ? 11 : r);

    const have = adjustedNeeded.filter(r => uniqueRanks.includes(r === 14 && high === 5 ? 1 : r) || uniqueRanks.includes(r));
    const missing = adjustedNeeded.filter(r => !uniqueRanks.includes(r === 14 && high === 5 ? 1 : r) && !uniqueRanks.includes(r));

    if (have.length === 4 && missing.length === 1) {
      // One card away from straight
      const missingRank = missing[0];

      // Find outs for this straight
      const outsForThis = deck.filter(c => RANK_VALUES[c.rank] === missingRank);
      for (const out of outsForThis) {
        if (!straightOuts.some(o => cardToString(o) === cardToString(out))) {
          straightOuts.push(out);
        }
      }
    }
  }

  if (straightOuts.length > 0) {
    // Determine if open-ended or gutshot based on pattern
    const isOpenEnded = straightOuts.length >= 8;
    draws.push({
      type: isOpenEnded ? 'Open-Ended Straight Draw' : 'Gutshot Straight Draw',
      description: isOpenEnded
        ? 'Four consecutive cards, can hit on either end'
        : 'Four to a straight with one gap inside',
      outs: straightOuts,
      count: straightOuts.length,
    });
  }

  // Check for pair outs (to make two pair or trips)
  const holePairOuts: Card[] = [];
  for (const holeCard of holeCards) {
    const outs = deck.filter(c => c.rank === holeCard.rank);
    holePairOuts.push(...outs);
  }

  if (holePairOuts.length > 0 && draws.length > 0) {
    // Only show if we have other draws (for combo draws)
    draws.push({
      type: 'Pair Outs',
      description: 'Cards to pair your hole cards',
      outs: holePairOuts,
      count: holePairOuts.length,
    });
  }

  // Check for overcards
  if (boardCards.length >= 3) {
    const maxBoardRank = Math.max(...boardCards.map(c => RANK_VALUES[c.rank]));
    const overcardOuts: Card[] = [];

    for (const holeCard of holeCards) {
      if (RANK_VALUES[holeCard.rank] > maxBoardRank) {
        const outs = deck.filter(c => c.rank === holeCard.rank);
        overcardOuts.push(...outs);
      }
    }

    if (overcardOuts.length > 0) {
      draws.push({
        type: 'Overcard Outs',
        description: 'Cards to make top pair with your high cards',
        outs: overcardOuts,
        count: overcardOuts.length,
      });
    }
  }

  return draws;
}

// Calculate total unique outs from multiple draws
export function getTotalOuts(draws: DrawInfo[]): { outs: Card[]; count: number } {
  const uniqueOuts = new Map<string, Card>();

  for (const draw of draws) {
    for (const out of draw.outs) {
      const key = cardToString(out);
      if (!uniqueOuts.has(key)) {
        uniqueOuts.set(key, out);
      }
    }
  }

  return {
    outs: Array.from(uniqueOuts.values()),
    count: uniqueOuts.size,
  };
}

// Rule of 2 and 4 calculation
export function calculateDrawOdds(outs: number, street: 'flop' | 'turn'): {
  ruleOf2And4: number;
  exact: number;
  cardsRemaining: number;
} {
  // After flop: 47 cards remain (52 - 2 hole - 3 board)
  // After turn: 46 cards remain (52 - 2 hole - 4 board)
  const cardsRemaining = street === 'flop' ? 47 : 46;

  // Rule of 2 and 4
  const multiplier = street === 'flop' ? 4 : 2;
  const ruleOf2And4 = Math.min(outs * multiplier, 100);

  // Exact calculation
  let exact: number;
  if (street === 'flop') {
    // P(hit by river) = 1 - P(miss turn) * P(miss river)
    const missProb = ((cardsRemaining - outs) / cardsRemaining) * ((cardsRemaining - 1 - outs) / (cardsRemaining - 1));
    exact = (1 - missProb) * 100;
  } else {
    // P(hit river) = outs / cards remaining
    exact = (outs / cardsRemaining) * 100;
  }

  return {
    ruleOf2And4,
    exact,
    cardsRemaining,
  };
}

// Common draw scenarios for training
export interface DrawScenario {
  name: string;
  holeCards: [Card, Card];
  board: Card[];
  expectedOuts: number;
  description: string;
}

export const COMMON_DRAW_SCENARIOS: DrawScenario[] = [
  {
    name: 'Flush Draw',
    holeCards: [{ rank: 'A', suit: 'h' }, { rank: 'K', suit: 'h' }],
    board: [{ rank: '7', suit: 'h' }, { rank: '2', suit: 'h' }, { rank: 'J', suit: 's' }],
    expectedOuts: 9,
    description: 'Four hearts, need one more for the flush',
  },
  {
    name: 'Open-Ended Straight Draw',
    holeCards: [{ rank: '9', suit: 's' }, { rank: '8', suit: 'h' }],
    board: [{ rank: '7', suit: 'd' }, { rank: '6', suit: 'c' }, { rank: 'K', suit: 's' }],
    expectedOuts: 8,
    description: '6-7-8-9, can hit 5 or T for the straight',
  },
  {
    name: 'Gutshot Straight Draw',
    holeCards: [{ rank: 'J', suit: 's' }, { rank: 'T', suit: 'h' }],
    board: [{ rank: '8', suit: 'd' }, { rank: '7', suit: 'c' }, { rank: 'A', suit: 's' }],
    expectedOuts: 4,
    description: '7-8-?-T-J, need a 9 to complete',
  },
  {
    name: 'Flush Draw + Overcards',
    holeCards: [{ rank: 'A', suit: 'd' }, { rank: 'K', suit: 'd' }],
    board: [{ rank: '5', suit: 'd' }, { rank: '9', suit: 'd' }, { rank: '3', suit: 'c' }],
    expectedOuts: 15,
    description: 'Flush draw (9) + two overcards (6 more)',
  },
  {
    name: 'Combo Draw: Flush + Straight',
    holeCards: [{ rank: '7', suit: 'h' }, { rank: '8', suit: 'h' }],
    board: [{ rank: '6', suit: 'h' }, { rank: '9', suit: 'h' }, { rank: 'K', suit: 's' }],
    expectedOuts: 15,
    description: 'Flush draw + open-ended straight draw',
  },
];

// EV Calculation types and functions
export interface EVCalculation {
  potOdds: number;        // Percentage needed to call
  equity: number;         // Your winning percentage
  ev: number;             // Expected value of calling
  isPositiveEV: boolean;  // Whether call is +EV
  potSize: number;
  betToCall: number;
  potAfterCall: number;
}

export function calculateEV(
  potSize: number,
  betToCall: number,
  equityPercent: number
): EVCalculation {
  const potAfterCall = potSize + betToCall;
  const potOdds = (betToCall / potAfterCall) * 100;
  const equity = equityPercent;

  // EV = (Equity * Pot Won) - ((1 - Equity) * Amount Lost)
  // When calling: Pot Won = potSize (what's already there), Amount Lost = betToCall
  const ev = (equity / 100) * potSize - ((100 - equity) / 100) * betToCall;

  return {
    potOdds,
    equity,
    ev,
    isPositiveEV: equity > potOdds,
    potSize,
    betToCall,
    potAfterCall,
  };
}

// EV Decision Scenario
export interface EVScenario {
  id: string;
  name: string;
  description: string;
  potSize: number;
  betToCall: number;
  outs: number;
  street: 'flop' | 'turn';
  holeCards: [Card, Card];
  board: Card[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// Generate random EV scenarios
export function generateEVScenario(difficulty: 'easy' | 'medium' | 'hard'): EVScenario {
  const scenarios: EVScenario[] = [];

  // Easy scenarios - clear +EV or -EV decisions
  if (difficulty === 'easy') {
    scenarios.push(
      {
        id: 'easy-1',
        name: 'Clear Fold',
        description: 'Gutshot facing a pot-sized bet',
        potSize: 100,
        betToCall: 100,
        outs: 4,
        street: 'turn',
        holeCards: [{ rank: 'J', suit: 's' }, { rank: 'T', suit: 'h' }],
        board: [{ rank: '8', suit: 'd' }, { rank: '5', suit: 'c' }, { rank: '2', suit: 's' }, { rank: 'K', suit: 'h' }],
        difficulty: 'easy',
      },
      {
        id: 'easy-2',
        name: 'Easy Call',
        description: 'Flush draw facing a small bet',
        potSize: 100,
        betToCall: 20,
        outs: 9,
        street: 'flop',
        holeCards: [{ rank: 'A', suit: 'h' }, { rank: 'K', suit: 'h' }],
        board: [{ rank: '7', suit: 'h' }, { rank: '2', suit: 'h' }, { rank: 'J', suit: 's' }],
        difficulty: 'easy',
      },
      {
        id: 'easy-3',
        name: 'Monster Draw Call',
        description: 'Combo draw facing half pot',
        potSize: 100,
        betToCall: 50,
        outs: 15,
        street: 'flop',
        holeCards: [{ rank: '8', suit: 'd' }, { rank: '9', suit: 'd' }],
        board: [{ rank: '7', suit: 'd' }, { rank: 'T', suit: 'd' }, { rank: 'K', suit: 's' }],
        difficulty: 'easy',
      },
    );
  }

  // Medium scenarios - closer decisions
  if (difficulty === 'medium') {
    scenarios.push(
      {
        id: 'med-1',
        name: 'Borderline Flush Draw',
        description: 'Flush draw facing 3/4 pot bet',
        potSize: 100,
        betToCall: 75,
        outs: 9,
        street: 'turn',
        holeCards: [{ rank: 'Q', suit: 's' }, { rank: 'J', suit: 's' }],
        board: [{ rank: '5', suit: 's' }, { rank: '8', suit: 's' }, { rank: 'K', suit: 'h' }, { rank: '2', suit: 'd' }],
        difficulty: 'medium',
      },
      {
        id: 'med-2',
        name: 'OESD Decision',
        description: 'Open-ended straight draw facing 2/3 pot',
        potSize: 120,
        betToCall: 80,
        outs: 8,
        street: 'flop',
        holeCards: [{ rank: '9', suit: 'h' }, { rank: 'T', suit: 'c' }],
        board: [{ rank: 'J', suit: 's' }, { rank: 'Q', suit: 'd' }, { rank: '3', suit: 'h' }],
        difficulty: 'medium',
      },
      {
        id: 'med-3',
        name: 'Overcards Plus Gutshot',
        description: 'Two overs + gutshot on turn',
        potSize: 80,
        betToCall: 40,
        outs: 10,
        street: 'turn',
        holeCards: [{ rank: 'A', suit: 'c' }, { rank: 'K', suit: 'd' }],
        board: [{ rank: 'Q', suit: 's' }, { rank: '9', suit: 'h' }, { rank: '5', suit: 'd' }, { rank: '2', suit: 'c' }],
        difficulty: 'medium',
      },
    );
  }

  // Hard scenarios - very close decisions
  if (difficulty === 'hard') {
    scenarios.push(
      {
        id: 'hard-1',
        name: 'Thin Value',
        description: 'Flush draw facing overbet',
        potSize: 100,
        betToCall: 130,
        outs: 9,
        street: 'flop',
        holeCards: [{ rank: 'K', suit: 'c' }, { rank: 'Q', suit: 'c' }],
        board: [{ rank: '4', suit: 'c' }, { rank: '8', suit: 'c' }, { rank: 'J', suit: 'h' }],
        difficulty: 'hard',
      },
      {
        id: 'hard-2',
        name: 'Close Turn Decision',
        description: 'OESD facing pot bet on turn',
        potSize: 150,
        betToCall: 150,
        outs: 8,
        street: 'turn',
        holeCards: [{ rank: '6', suit: 's' }, { rank: '7', suit: 'h' }],
        board: [{ rank: '4', suit: 'd' }, { rank: '5', suit: 'c' }, { rank: 'K', suit: 's' }, { rank: 'A', suit: 'h' }],
        difficulty: 'hard',
      },
      {
        id: 'hard-3',
        name: 'Combo Draw vs Big Bet',
        description: 'Flush + gutshot facing overbet',
        potSize: 200,
        betToCall: 280,
        outs: 12,
        street: 'flop',
        holeCards: [{ rank: 'T', suit: 'h' }, { rank: 'J', suit: 'h' }],
        board: [{ rank: '8', suit: 'h' }, { rank: '9', suit: 'c' }, { rank: 'K', suit: 'h' }],
        difficulty: 'hard',
      },
    );
  }

  // Return a random scenario from the difficulty level
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

// Get all scenarios for a difficulty
export function getAllScenariosForDifficulty(difficulty: 'easy' | 'medium' | 'hard'): EVScenario[] {
  const easy: EVScenario[] = [
    {
      id: 'easy-1',
      name: 'Clear Fold',
      description: 'Gutshot facing a pot-sized bet',
      potSize: 100,
      betToCall: 100,
      outs: 4,
      street: 'turn',
      holeCards: [{ rank: 'J', suit: 's' }, { rank: 'T', suit: 'h' }],
      board: [{ rank: '8', suit: 'd' }, { rank: '5', suit: 'c' }, { rank: '2', suit: 's' }, { rank: 'K', suit: 'h' }],
      difficulty: 'easy',
    },
    {
      id: 'easy-2',
      name: 'Easy Call',
      description: 'Flush draw facing a small bet',
      potSize: 100,
      betToCall: 20,
      outs: 9,
      street: 'flop',
      holeCards: [{ rank: 'A', suit: 'h' }, { rank: 'K', suit: 'h' }],
      board: [{ rank: '7', suit: 'h' }, { rank: '2', suit: 'h' }, { rank: 'J', suit: 's' }],
      difficulty: 'easy',
    },
    {
      id: 'easy-3',
      name: 'Monster Draw Call',
      description: 'Combo draw facing half pot',
      potSize: 100,
      betToCall: 50,
      outs: 15,
      street: 'flop',
      holeCards: [{ rank: '8', suit: 'd' }, { rank: '9', suit: 'd' }],
      board: [{ rank: '7', suit: 'd' }, { rank: 'T', suit: 'd' }, { rank: 'K', suit: 's' }],
      difficulty: 'easy',
    },
    {
      id: 'easy-4',
      name: 'Weak Draw Fold',
      description: 'Gutshot facing 3/4 pot on turn',
      potSize: 80,
      betToCall: 60,
      outs: 4,
      street: 'turn',
      holeCards: [{ rank: 'Q', suit: 'c' }, { rank: 'J', suit: 'd' }],
      board: [{ rank: '9', suit: 's' }, { rank: '8', suit: 'h' }, { rank: '3', suit: 'c' }, { rank: 'K', suit: 's' }],
      difficulty: 'easy',
    },
  ];

  const medium: EVScenario[] = [
    {
      id: 'med-1',
      name: 'Borderline Flush Draw',
      description: 'Flush draw facing 3/4 pot bet on turn',
      potSize: 100,
      betToCall: 75,
      outs: 9,
      street: 'turn',
      holeCards: [{ rank: 'Q', suit: 's' }, { rank: 'J', suit: 's' }],
      board: [{ rank: '5', suit: 's' }, { rank: '8', suit: 's' }, { rank: 'K', suit: 'h' }, { rank: '2', suit: 'd' }],
      difficulty: 'medium',
    },
    {
      id: 'med-2',
      name: 'OESD Decision',
      description: 'Open-ended straight draw facing 2/3 pot',
      potSize: 120,
      betToCall: 80,
      outs: 8,
      street: 'flop',
      holeCards: [{ rank: '9', suit: 'h' }, { rank: 'T', suit: 'c' }],
      board: [{ rank: 'J', suit: 's' }, { rank: 'Q', suit: 'd' }, { rank: '3', suit: 'h' }],
      difficulty: 'medium',
    },
    {
      id: 'med-3',
      name: 'Overcards Decision',
      description: 'Two overs + backdoor flush',
      potSize: 60,
      betToCall: 30,
      outs: 6,
      street: 'flop',
      holeCards: [{ rank: 'A', suit: 'c' }, { rank: 'K', suit: 'c' }],
      board: [{ rank: '7', suit: 's' }, { rank: '4', suit: 'h' }, { rank: '2', suit: 'd' }],
      difficulty: 'medium',
    },
  ];

  const hard: EVScenario[] = [
    {
      id: 'hard-1',
      name: 'Flush Draw vs Overbet',
      description: 'Flush draw facing 1.3x pot bet',
      potSize: 100,
      betToCall: 130,
      outs: 9,
      street: 'flop',
      holeCards: [{ rank: 'K', suit: 'c' }, { rank: 'Q', suit: 'c' }],
      board: [{ rank: '4', suit: 'c' }, { rank: '8', suit: 'c' }, { rank: 'J', suit: 'h' }],
      difficulty: 'hard',
    },
    {
      id: 'hard-2',
      name: 'OESD vs Pot Bet',
      description: 'Open-ended straight facing pot bet on turn',
      potSize: 150,
      betToCall: 150,
      outs: 8,
      street: 'turn',
      holeCards: [{ rank: '6', suit: 's' }, { rank: '7', suit: 'h' }],
      board: [{ rank: '4', suit: 'd' }, { rank: '5', suit: 'c' }, { rank: 'K', suit: 's' }, { rank: 'A', suit: 'h' }],
      difficulty: 'hard',
    },
    {
      id: 'hard-3',
      name: 'Break-Even Spot',
      description: 'Flush draw facing exact break-even bet',
      potSize: 100,
      betToCall: 56,
      outs: 9,
      street: 'turn',
      holeCards: [{ rank: '9', suit: 'd' }, { rank: 'T', suit: 'd' }],
      board: [{ rank: '2', suit: 'd' }, { rank: '6', suit: 'd' }, { rank: 'K', suit: 'h' }, { rank: 'A', suit: 's' }],
      difficulty: 'hard',
    },
  ];

  if (difficulty === 'easy') return easy;
  if (difficulty === 'medium') return medium;
  return hard;
}
