// Position definitions for a standard 6-max and 9-max table

export interface Position {
  id: string;
  name: string;
  shortName: string;
  category: 'early' | 'middle' | 'late' | 'blinds';
  order: number; // Action order preflop (1 = first to act after blinds)
  description: string;
  strategy: string;
  rangeWidth: string; // Approximate % of hands to open
  angle?: number; // For visual positioning around table
}

// 6-max positions (most common online format)
export const POSITIONS_6MAX: Position[] = [
  {
    id: 'utg',
    name: 'Under the Gun',
    shortName: 'UTG',
    category: 'early',
    order: 1,
    description: 'First to act preflop. Called "Under the Gun" because you\'re under pressure from all players behind.',
    strategy: 'Play very tight. Only premium hands. You have 5 players left to act who could have strong hands.',
    rangeWidth: '~12%',
    angle: 210,
  },
  {
    id: 'hj',
    name: 'Hijack',
    shortName: 'HJ',
    category: 'middle',
    order: 2,
    description: 'Two seats before the button. Named because you can "hijack" the button\'s position with a raise.',
    strategy: 'Slightly wider than UTG. Can start adding some suited connectors.',
    rangeWidth: '~18%',
    angle: 160,
  },
  {
    id: 'co',
    name: 'Cutoff',
    shortName: 'CO',
    category: 'late',
    order: 3,
    description: 'One seat before the button. Very profitable position. Can "cut off" the button.',
    strategy: 'Open wide. Attempt to steal blinds. Great position for bluffing.',
    rangeWidth: '~27%',
    angle: 110,
  },
  {
    id: 'btn',
    name: 'Button',
    shortName: 'BTN',
    category: 'late',
    order: 4,
    description: 'The dealer position. Best seat at the table - you act LAST on every postflop street.',
    strategy: 'Widest opening range. Steal blinds frequently. Use position to outplay opponents.',
    rangeWidth: '~45%',
    angle: 60,
  },
  {
    id: 'sb',
    name: 'Small Blind',
    shortName: 'SB',
    category: 'blinds',
    order: 5,
    description: 'Posts half the big blind. Worst postflop position - always acts first.',
    strategy: 'Tight when facing raises. Can complete or raise vs limpers. Attack BB when folded to.',
    rangeWidth: '~35% (vs fold)',
    angle: 10,
  },
  {
    id: 'bb',
    name: 'Big Blind',
    shortName: 'BB',
    category: 'blinds',
    order: 6,
    description: 'Posts the full blind. Gets a discount to see flops. Closes the action preflop.',
    strategy: 'Defend wide due to pot odds. Already have money invested. Close action preflop.',
    rangeWidth: 'Defend ~40%+',
    angle: 320,
  },
];

// 9-max positions (full ring, live poker standard)
export const POSITIONS_9MAX: Position[] = [
  {
    id: 'utg',
    name: 'Under the Gun',
    shortName: 'UTG',
    category: 'early',
    order: 1,
    description: 'First to act preflop. Maximum pressure with 8 players behind.',
    strategy: 'Extremely tight. Only top ~8% of hands.',
    rangeWidth: '~8%',
    angle: 240,
  },
  {
    id: 'utg1',
    name: 'Under the Gun +1',
    shortName: 'UTG+1',
    category: 'early',
    order: 2,
    description: 'Second earliest position. Still very early with many players to act.',
    strategy: 'Very tight. Similar to UTG, maybe slightly wider.',
    rangeWidth: '~9%',
    angle: 210,
  },
  {
    id: 'utg2',
    name: 'Under the Gun +2',
    shortName: 'UTG+2',
    category: 'early',
    order: 3,
    description: 'Third earliest position. Last of the early positions.',
    strategy: 'Still tight, but can add a few more hands.',
    rangeWidth: '~11%',
    angle: 180,
  },
  {
    id: 'lj',
    name: 'Lojack',
    shortName: 'LJ',
    category: 'middle',
    order: 4,
    description: 'First middle position. Starts the transition to looser play.',
    strategy: 'Moderate range. Can start adding suited connectors and smaller pairs.',
    rangeWidth: '~14%',
    angle: 150,
  },
  {
    id: 'hj',
    name: 'Hijack',
    shortName: 'HJ',
    category: 'middle',
    order: 5,
    description: 'Second middle position. Can start making moves.',
    strategy: 'Wider than LJ. Good spot for isolation raises.',
    rangeWidth: '~18%',
    angle: 120,
  },
  {
    id: 'co',
    name: 'Cutoff',
    shortName: 'CO',
    category: 'late',
    order: 6,
    description: 'First late position. One of the most profitable seats.',
    strategy: 'Open wide. Frequent steal attempts. Apply pressure.',
    rangeWidth: '~27%',
    angle: 90,
  },
  {
    id: 'btn',
    name: 'Button',
    shortName: 'BTN',
    category: 'late',
    order: 7,
    description: 'Best seat at the table. Position advantage on every street.',
    strategy: 'Very wide opens. Can play almost any two cards profitably.',
    rangeWidth: '~45%',
    angle: 50,
  },
  {
    id: 'sb',
    name: 'Small Blind',
    shortName: 'SB',
    category: 'blinds',
    order: 8,
    description: 'Posts half blind. Worst postflop position.',
    strategy: 'Tight vs raises. Attack BB when folded to.',
    rangeWidth: '~35% (vs fold)',
    angle: 10,
  },
  {
    id: 'bb',
    name: 'Big Blind',
    shortName: 'BB',
    category: 'blinds',
    order: 9,
    description: 'Posts full blind. Closes preflop action.',
    strategy: 'Defend wide. Already invested, good pot odds.',
    rangeWidth: 'Defend ~40%+',
    angle: 330,
  },
];

// Position categories info
export interface PositionCategory {
  id: 'early' | 'middle' | 'late' | 'blinds';
  name: string;
  color: string;
  bgColor: string;
  description: string;
  keyPoints: string[];
}

export const POSITION_CATEGORIES: PositionCategory[] = [
  {
    id: 'early',
    name: 'Early Position',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    description: 'First players to act preflop. Most players behind means highest risk.',
    keyPoints: [
      'Play only premium hands',
      'Avoid marginal hands',
      'Sets up strong table image',
      'Worst positional disadvantage',
    ],
  },
  {
    id: 'middle',
    name: 'Middle Position',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    description: 'Between early and late. Moderate range, watching for early position raises.',
    keyPoints: [
      'Wider than early position',
      'Still cautious of players behind',
      'Good for isolation raises',
      'Transition zone',
    ],
  },
  {
    id: 'late',
    name: 'Late Position',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Button and Cutoff. Most profitable seats due to positional advantage.',
    keyPoints: [
      'Wide opening ranges',
      'Steal blinds frequently',
      'Information advantage',
      'Can play more hands profitably',
    ],
  },
  {
    id: 'blinds',
    name: 'Blinds',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    description: 'Forced to post blinds. Already have money invested but worst postflop position.',
    keyPoints: [
      'SB: Worst postflop position',
      'BB: Get discount to see flops',
      'Defend based on pot odds',
      'Attack from SB when folded to',
    ],
  },
];

// Why position matters - educational content
export const POSITION_CONCEPTS = [
  {
    title: 'Information Advantage',
    description: 'Acting last means you see what everyone else does before making your decision.',
    example: 'On the button, if everyone checks to you, you know they\'re likely weak.',
  },
  {
    title: 'Pot Control',
    description: 'Position lets you control the size of the pot by betting or checking behind.',
    example: 'With a medium-strength hand, you can check back to keep the pot small.',
  },
  {
    title: 'Bluffing Opportunities',
    description: 'It\'s easier to bluff when you act last and others show weakness.',
    example: 'When checked to on the river, you can bet as a bluff knowing they\'re likely folding.',
  },
  {
    title: 'Value Extraction',
    description: 'Position helps you get more value from strong hands.',
    example: 'You can size your bets based on opponent reactions throughout the hand.',
  },
  {
    title: 'Range Advantage',
    description: 'Late position players have stronger perceived ranges after raising.',
    example: 'A button raise is taken less seriously than an UTG raise.',
  },
];

// Quiz questions
export interface PositionQuiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'basics' | 'strategy' | 'ranges';
}

export const POSITION_QUIZZES: PositionQuiz[] = [
  {
    id: 'q1',
    question: 'Which position acts LAST on every postflop street?',
    options: ['Big Blind', 'Small Blind', 'Button', 'Cutoff'],
    correctIndex: 2,
    explanation: 'The Button always acts last postflop (unless they folded). This is why it\'s the most valuable seat.',
    category: 'basics',
  },
  {
    id: 'q2',
    question: 'Which position has the TIGHTEST recommended opening range?',
    options: ['Button', 'Cutoff', 'Under the Gun', 'Big Blind'],
    correctIndex: 2,
    explanation: 'UTG (Under the Gun) has the tightest range because all other players act after, increasing the chance of facing a strong hand.',
    category: 'ranges',
  },
  {
    id: 'q3',
    question: 'Why is the Small Blind considered the worst position?',
    options: [
      'Has to post money before seeing cards',
      'Acts first on every postflop street',
      'Both A and B',
      'Neither - SB is actually good',
    ],
    correctIndex: 2,
    explanation: 'The SB is worst because you post money blind AND act first postflop, giving you the least information.',
    category: 'basics',
  },
  {
    id: 'q4',
    question: 'What does "stealing the blinds" mean?',
    options: [
      'Taking chips from the blind positions illegally',
      'Raising from late position to win the blinds uncontested',
      'Defending your blind with a reraise',
      'Folding your blind',
    ],
    correctIndex: 1,
    explanation: 'Stealing means raising from late position (usually BTN or CO) hoping everyone folds so you win the blinds.',
    category: 'strategy',
  },
  {
    id: 'q5',
    question: 'In a 6-max game, how many positions are considered "early"?',
    options: ['1 (UTG only)', '2 (UTG and HJ)', '3 (UTG, UTG+1, UTG+2)', '0 (no early in 6-max)'],
    correctIndex: 0,
    explanation: 'In 6-max, only UTG is considered early position. This is different from 9-max where UTG through UTG+2 are early.',
    category: 'basics',
  },
  {
    id: 'q6',
    question: 'Why can you open more hands from the Button than from UTG?',
    options: [
      'Button gets better cards dealt',
      'Fewer players left to act, plus postflop position advantage',
      'UTG has to post a blind',
      'The dealer shuffles better for the Button',
    ],
    correctIndex: 1,
    explanation: 'From the Button, only the blinds act after you preflop, and you\'ll have position postflop. From UTG, 5 players could wake up with a monster.',
    category: 'strategy',
  },
  {
    id: 'q7',
    question: 'What is "positional awareness"?',
    options: [
      'Knowing where you sit at the table',
      'Adjusting your play based on your position and others\' positions',
      'Always sitting in the same seat',
      'Counting your chip stack',
    ],
    correctIndex: 1,
    explanation: 'Positional awareness means adjusting strategy based on position - playing tighter in early position and looser in late position.',
    category: 'strategy',
  },
  {
    id: 'q8',
    question: 'The "Hijack" position got its name because:',
    options: [
      'Players there often steal pots',
      'You can "hijack" the Button\'s steal attempts',
      'It\'s named after a famous player',
      'Cards are often stolen there',
    ],
    correctIndex: 1,
    explanation: 'The Hijack can raise and "hijack" the Button\'s opportunity to steal the blinds, taking that aggressive line first.',
    category: 'basics',
  },
];

// Get category color for a position
export function getPositionColor(position: Position): { text: string; bg: string } {
  const category = POSITION_CATEGORIES.find(c => c.id === position.category);
  return {
    text: category?.color || 'text-gray-700',
    bg: category?.bgColor || 'bg-gray-100',
  };
}
