import { SlotSymbol } from './types';

export interface PaytableRule {
  symbols: SlotSymbol[];
  matchType: 'EXACT_3' | 'MIXED_SEVENS' | 'MIXED_BARS' | 'CHERRY_2' | 'CHERRY_1';
  name: string;
  payoutMultiplier: number;
}

export const PAYTABLE_RULES: PaytableRule[] = [
  {
    symbols: ['GOLDEN_50', 'GOLDEN_50', 'GOLDEN_50'],
    matchType: 'EXACT_3',
    name: '3x FLAMING 50 Crest',
    payoutMultiplier: 50,
  },
  {
    symbols: ['WILD', 'WILD', 'WILD'],
    matchType: 'EXACT_3',
    name: '3x Flaming Wild Shield',
    payoutMultiplier: 20,
  },
  {
    symbols: ['LION', 'LION', 'LION'],
    matchType: 'EXACT_3',
    name: '3x Golden Lion of Fortune',
    payoutMultiplier: 16,
  },
  {
    symbols: ['CROWN', 'CROWN', 'CROWN'],
    matchType: 'EXACT_3',
    name: '3x Imperial Golden Crown',
    payoutMultiplier: 12,
  },
  {
    symbols: ['DIAMOND', 'DIAMOND', 'DIAMOND'],
    matchType: 'EXACT_3',
    name: '3x Brilliant Diamond',
    payoutMultiplier: 8.5,
  },
  {
    symbols: ['COIN', 'COIN', 'COIN'],
    matchType: 'EXACT_3',
    name: '3x Golden Bullion Coin',
    payoutMultiplier: 5.5,
  },
  {
    symbols: ['SEVEN', 'SEVEN', 'SEVEN'],
    matchType: 'EXACT_3',
    name: '3x Lucky Red 7',
    payoutMultiplier: 4.5,
  },
  {
    symbols: ['WHITE_SEVEN', 'WHITE_SEVEN', 'WHITE_SEVEN'],
    matchType: 'EXACT_3',
    name: '3x Platinum Silver 7',
    payoutMultiplier: 3.2,
  },
  {
    symbols: ['SEVEN', 'WHITE_SEVEN', 'SEVEN'],
    matchType: 'MIXED_SEVENS',
    name: 'Any 3 Mixed 7s',
    payoutMultiplier: 1.0,
  },
  {
    symbols: ['BELL', 'BELL', 'BELL'],
    matchType: 'EXACT_3',
    name: '3x Golden Liberty Bell',
    payoutMultiplier: 2.2,
  },
  {
    symbols: ['TRIPLE_BAR', 'TRIPLE_BAR', 'TRIPLE_BAR'],
    matchType: 'EXACT_3',
    name: '3x Triple Sapphire BAR',
    payoutMultiplier: 1.5,
  },
  {
    symbols: ['DOUBLE_BAR', 'DOUBLE_BAR', 'DOUBLE_BAR'],
    matchType: 'EXACT_3',
    name: '3x Double Ruby BAR',
    payoutMultiplier: 1.0,
  },
  {
    symbols: ['BAR', 'BAR', 'BAR'],
    matchType: 'EXACT_3',
    name: '3x Single Emerald BAR',
    payoutMultiplier: 0.6,
  },
  {
    symbols: ['CHERRY', 'CHERRY', 'CHERRY'],
    matchType: 'EXACT_3',
    name: '3x Lacquered Cherries',
    payoutMultiplier: 0.8,
  },
  {
    symbols: ['BAR', 'DOUBLE_BAR', 'TRIPLE_BAR'],
    matchType: 'MIXED_BARS',
    name: 'Any 3 Mixed BARs',
    payoutMultiplier: 0.3,
  },
  {
    symbols: ['A', 'A', 'A'],
    matchType: 'EXACT_3',
    name: '3x Royal Ace',
    payoutMultiplier: 0.5,
  },
  {
    symbols: ['K', 'K', 'K'],
    matchType: 'EXACT_3',
    name: '3x Royal King',
    payoutMultiplier: 0.45,
  },
  {
    symbols: ['Q', 'Q', 'Q'],
    matchType: 'EXACT_3',
    name: '3x Royal Queen',
    payoutMultiplier: 0.4,
  },
  {
    symbols: ['J', 'J', 'J'],
    matchType: 'EXACT_3',
    name: '3x Royal Jack',
    payoutMultiplier: 0.35,
  },
  {
    symbols: ['TEN', 'TEN', 'TEN'],
    matchType: 'EXACT_3',
    name: '3x Royal Ten',
    payoutMultiplier: 0.3,
  },
  {
    symbols: ['CHERRY', 'CHERRY'],
    matchType: 'CHERRY_2',
    name: '2 Cherries (Reels 1 & 2)',
    payoutMultiplier: 0.2,
  },
  {
    symbols: ['CHERRY'],
    matchType: 'CHERRY_1',
    name: '1 Cherry (Center Payline)',
    payoutMultiplier: 0.1,
  },
];
