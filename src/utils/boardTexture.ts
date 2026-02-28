import type { Card, Suit, Rank } from './poker';
import { RANK_VALUES, SUIT_SYMBOLS } from './poker';

// Board texture analysis results
export interface BoardTexture {
  // Basic properties
  isPaired: boolean;
  isTrips: boolean;
  isMonotone: boolean;      // All same suit (3 of same)
  isTwoTone: boolean;       // Two of same suit
  isRainbow: boolean;       // All different suits

  // Connectivity
  connectivity: 'disconnected' | 'gapped' | 'connected' | 'highly-connected';
  straightPossible: boolean;
  straightDrawPossible: boolean;

  // High card analysis
  highCard: Rank;
  hasAce: boolean;
  hasBroadway: boolean;     // T, J, Q, K, A
  isLowBoard: boolean;      // All cards 8 or below

  // Overall texture score
  wetness: 'dry' | 'semi-dry' | 'semi-wet' | 'wet';
  wetnessScore: number;     // 0-100

  // Descriptive tags
  tags: string[];

  // Detailed breakdown
  suitCounts: Record<Suit, number>;
  rankValues: number[];
  gaps: number[];
}

// Analyze a flop (3 cards)
export function analyzeBoard(cards: Card[]): BoardTexture {
  if (cards.length < 3) {
    throw new Error('Need at least 3 cards to analyze board');
  }

  const flop = cards.slice(0, 3);

  // Count suits
  const suitCounts: Record<Suit, number> = { s: 0, h: 0, d: 0, c: 0 };
  for (const card of flop) {
    suitCounts[card.suit]++;
  }

  // Get rank values and sort
  const rankValues = flop.map(c => RANK_VALUES[c.rank]).sort((a, b) => b - a);

  // Check for pairs/trips
  const rankCounts: Record<number, number> = {};
  for (const rv of rankValues) {
    rankCounts[rv] = (rankCounts[rv] || 0) + 1;
  }
  const maxRankCount = Math.max(...Object.values(rankCounts));
  const isPaired = maxRankCount >= 2;
  const isTrips = maxRankCount >= 3;

  // Suit analysis
  const maxSuitCount = Math.max(...Object.values(suitCounts));
  const isMonotone = maxSuitCount === 3;
  const isTwoTone = maxSuitCount === 2;
  const isRainbow = maxSuitCount === 1;

  // Connectivity analysis
  const uniqueRanks = [...new Set(rankValues)].sort((a, b) => b - a);
  const gaps: number[] = [];
  for (let i = 0; i < uniqueRanks.length - 1; i++) {
    gaps.push(uniqueRanks[i] - uniqueRanks[i + 1] - 1);
  }

  const hasAce = rankValues.includes(14);
  const maxGap = Math.max(...gaps);
  const totalGap = gaps.reduce((a, b) => a + b, 0);

  let connectivity: BoardTexture['connectivity'];
  if (uniqueRanks.length === 3 && totalGap === 0) {
    connectivity = 'highly-connected'; // e.g., 7-8-9
  } else if (uniqueRanks.length === 3 && totalGap <= 2 && maxGap <= 2) {
    connectivity = 'connected'; // e.g., 5-7-8
  } else if (maxGap <= 3) {
    connectivity = 'gapped'; // e.g., 4-7-9
  } else {
    connectivity = 'disconnected'; // e.g., 2-7-K
  }

  // Straight analysis
  const spread = uniqueRanks[0] - uniqueRanks[uniqueRanks.length - 1];
  const straightPossible = spread <= 4 && uniqueRanks.length >= 3;
  const straightDrawPossible = spread <= 6;

  // High card analysis
  const highCard = flop.reduce((high, card) =>
    RANK_VALUES[card.rank] > RANK_VALUES[high.rank] ? card : high
  ).rank;

  const broadwayRanks = [10, 11, 12, 13, 14];
  const hasBroadway = rankValues.some(r => broadwayRanks.includes(r));
  const isLowBoard = rankValues.every(r => r <= 8);

  // Calculate wetness score (0-100)
  let wetnessScore = 0;

  // Suit contribution (monotone is very wet)
  if (isMonotone) wetnessScore += 35;
  else if (isTwoTone) wetnessScore += 15;

  // Connectivity contribution
  if (connectivity === 'highly-connected') wetnessScore += 30;
  else if (connectivity === 'connected') wetnessScore += 20;
  else if (connectivity === 'gapped') wetnessScore += 10;

  // Paired boards are slightly drier
  if (isPaired) wetnessScore -= 10;
  if (isTrips) wetnessScore -= 15;

  // Straight possibilities
  if (straightPossible) wetnessScore += 15;
  else if (straightDrawPossible) wetnessScore += 8;

  // High cards make boards slightly wetter (more likely to hit ranges)
  if (hasBroadway) wetnessScore += 5;

  wetnessScore = Math.max(0, Math.min(100, wetnessScore));

  let wetness: BoardTexture['wetness'];
  if (wetnessScore >= 60) wetness = 'wet';
  else if (wetnessScore >= 40) wetness = 'semi-wet';
  else if (wetnessScore >= 20) wetness = 'semi-dry';
  else wetness = 'dry';

  // Generate descriptive tags
  const tags: string[] = [];

  // Suit tags
  if (isMonotone) {
    const suit = (Object.entries(suitCounts).find(([, count]) => count === 3)?.[0] || 's') as Suit;
    tags.push(`Monotone (${SUIT_SYMBOLS[suit]})`);
  } else if (isTwoTone) {
    const suit = (Object.entries(suitCounts).find(([, count]) => count === 2)?.[0] || 's') as Suit;
    tags.push(`Two-tone (${SUIT_SYMBOLS[suit]})`);
  } else {
    tags.push('Rainbow');
  }

  // Pairing tags
  if (isTrips) tags.push('Trips');
  else if (isPaired) tags.push('Paired');

  // Connectivity tags
  if (connectivity === 'highly-connected') tags.push('Highly Connected');
  else if (connectivity === 'connected') tags.push('Connected');
  else if (connectivity === 'disconnected') tags.push('Disconnected');

  // Height tags
  if (rankValues.every(r => r >= 10)) tags.push('Broadway');
  else if (isLowBoard) tags.push('Low Board');
  else if (hasBroadway && isLowBoard === false) tags.push('Mixed Heights');

  // Ace tag
  if (hasAce) tags.push('Ace-high');

  return {
    isPaired,
    isTrips,
    isMonotone,
    isTwoTone,
    isRainbow,
    connectivity,
    straightPossible,
    straightDrawPossible,
    highCard,
    hasAce,
    hasBroadway,
    isLowBoard,
    wetness,
    wetnessScore,
    tags,
    suitCounts,
    rankValues,
    gaps,
  };
}

// Get strategic implications
export interface StrategicImplication {
  category: string;
  title: string;
  description: string;
  tip: string;
}

export function getStrategicImplications(texture: BoardTexture): StrategicImplication[] {
  const implications: StrategicImplication[] = [];

  // Wetness implications
  if (texture.wetness === 'wet') {
    implications.push({
      category: 'Overall',
      title: 'Wet Board - Be Aggressive',
      description: 'Many draws available. Hands can change dramatically on later streets.',
      tip: 'Bet larger to deny equity to draws. Be prepared to face aggression from made hands and draws alike.',
    });
  } else if (texture.wetness === 'dry') {
    implications.push({
      category: 'Overall',
      title: 'Dry Board - Can Be More Patient',
      description: 'Few draws available. Hand values are more stable.',
      tip: 'Can use smaller bet sizes. Bluffs are more effective since opponents rarely have draws to continue with.',
    });
  }

  // Monotone implications
  if (texture.isMonotone) {
    implications.push({
      category: 'Flush',
      title: 'Flush Possible',
      description: 'Anyone with two cards of this suit has a made flush.',
      tip: 'Be cautious with non-flush hands. Check if you have the nut flush blocker (Ace of the suit).',
    });
  } else if (texture.isTwoTone) {
    implications.push({
      category: 'Flush',
      title: 'Flush Draw Available',
      description: 'Opponents may have 9 outs to hit a flush by the river.',
      tip: 'Consider opponents holding flush draws when sizing your bets. Bet larger to deny correct odds.',
    });
  }

  // Connectivity implications
  if (texture.connectivity === 'highly-connected') {
    implications.push({
      category: 'Straight',
      title: 'Highly Connected - Many Straights Possible',
      description: 'Many two-card combinations make straights or strong draws.',
      tip: 'Top pair is often vulnerable here. Be careful overvaluing one-pair hands.',
    });
  } else if (texture.straightPossible) {
    implications.push({
      category: 'Straight',
      title: 'Straight Possible',
      description: 'The board allows for made straights.',
      tip: 'Consider what two-card holdings make a straight on this board.',
    });
  } else if (texture.connectivity === 'disconnected') {
    implications.push({
      category: 'Straight',
      title: 'Disconnected - Few Straight Draws',
      description: 'Hard for opponents to have straight draws.',
      tip: 'Less worried about giving free cards. Can check more often with medium-strength hands.',
    });
  }

  // Pairing implications
  if (texture.isTrips) {
    implications.push({
      category: 'Pairing',
      title: 'Trips on Board',
      description: 'Unless someone has the case card, all players are playing the board trips.',
      tip: 'Kicker strength becomes crucial. High card hands have showdown value.',
    });
  } else if (texture.isPaired) {
    implications.push({
      category: 'Pairing',
      title: 'Paired Board',
      description: 'Full houses are possible. Less likely opponents hit the paired card.',
      tip: 'Bluffs can work well as opponents often missed. But be cautious of full houses.',
    });
  }

  // Height implications
  if (texture.hasAce) {
    implications.push({
      category: 'Height',
      title: 'Ace on Board',
      description: 'Ace-high boards favor the preflop raiser\'s range.',
      tip: 'If you raised preflop, you can continuation bet frequently. If you called, proceed with caution.',
    });
  } else if (texture.isLowBoard) {
    implications.push({
      category: 'Height',
      title: 'Low Board',
      description: 'Favors players who called preflop (they have more low cards in range).',
      tip: 'The caller often has an advantage on low boards. Consider checking more as the raiser.',
    });
  }

  return implications;
}

// Example boards for learning
export interface ExampleBoard {
  name: string;
  cards: Card[];
  description: string;
  keyPoints: string[];
}

export const EXAMPLE_BOARDS: ExampleBoard[] = [
  {
    name: 'Classic Dry',
    cards: [
      { rank: 'K', suit: 'h' },
      { rank: '7', suit: 'd' },
      { rank: '2', suit: 's' },
    ],
    description: 'Rainbow, disconnected, unpaired. This is about as dry as it gets.',
    keyPoints: [
      'No flush draws possible',
      'No straight draws',
      'Hand values are very stable',
      'Great board for bluffing - opponents rarely have draws',
    ],
  },
  {
    name: 'Monotone Wet',
    cards: [
      { rank: 'J', suit: 'h' },
      { rank: '9', suit: 'h' },
      { rank: '6', suit: 'h' },
    ],
    description: 'All hearts with connected cards. Extremely wet texture.',
    keyPoints: [
      'Any two hearts = made flush',
      'Many straight draws (T8, 87, QT)',
      'Very dynamic - hands change a lot',
      'Need strong hands to continue',
    ],
  },
  {
    name: 'Paired Dry',
    cards: [
      { rank: 'A', suit: 's' },
      { rank: 'A', suit: 'h' },
      { rank: '5', suit: 'c' },
    ],
    description: 'Paired aces, rainbow, disconnected. Dry but ace-high.',
    keyPoints: [
      'Unlikely anyone has an ace',
      'Full houses possible but rare',
      'High cards have showdown value',
      'Good spot to bluff - hard for anyone to have equity',
    ],
  },
  {
    name: 'Broadway Connected',
    cards: [
      { rank: 'Q', suit: 's' },
      { rank: 'J', suit: 'h' },
      { rank: 'T', suit: 'd' },
    ],
    description: 'All broadway cards, highly connected, rainbow.',
    keyPoints: [
      'AK, K9, 98 all make straights',
      'Many straight draws (AQ, A9, K9, 98)',
      'Hits preflop raiser\'s range hard',
      'Two pair and sets are strong but vulnerable',
    ],
  },
  {
    name: 'Low Two-Tone',
    cards: [
      { rank: '7', suit: 'd' },
      { rank: '5', suit: 'd' },
      { rank: '3', suit: 'c' },
    ],
    description: 'Low cards, two diamonds, connected. Good for callers.',
    keyPoints: [
      'Favors preflop callers who have more suited connectors',
      'Flush draw available in diamonds',
      'Straight draws with 46, 64, A2',
      'Preflop raiser should check more often',
    ],
  },
];
