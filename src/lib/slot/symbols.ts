import { SlotSymbol, SymbolInfo, PrizeNumber } from './types';

export const ALL_SYMBOLS: SlotSymbol[] = [
  'GOLDEN_50',
  'WILD',
  'LION',
  'CROWN',
  'DIAMOND',
  'COIN',
  'SEVEN',
  'WHITE_SEVEN',
  'BELL',
  'TRIPLE_BAR',
  'DOUBLE_BAR',
  'BAR',
  'CHERRY',
  'A',
  'K',
  'Q',
  'J',
  'TEN',
];

export const SYMBOL_CONFIGS: Record<SlotSymbol, SymbolInfo> = {
  GOLDEN_50: {
    id: 'GOLDEN_50',
    name: 'Flaming 50 Grand Crest',
    multiplier3x: 50,
    color: '#FF6B00',
    glowColor: 'rgba(255, 107, 0, 0.95)',
    description: 'Special highest-value blazing logo symbol! 3 award the GRAND JACKPOT and massive 50x line win!',
  },
  WILD: {
    id: 'WILD',
    name: 'Flaming Wild Shield',
    multiplier3x: 20,
    color: '#FFB703',
    glowColor: 'rgba(255, 183, 3, 0.9)',
    description: 'Substitutes for all symbols on any payline. 3 award 20x base line win!',
  },
  LION: {
    id: 'LION',
    name: 'Golden Lion of Fortune',
    multiplier3x: 16,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.95)',
    description: 'Majestic 24K sculpted lion head. 3 award 16x base line win!',
  },
  CROWN: {
    id: 'CROWN',
    name: 'Imperial Golden Crown',
    multiplier3x: 12,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.9)',
    description: 'Royal gem-encrusted gold crown. 3 award 12x base line win!',
  },
  DIAMOND: {
    id: 'DIAMOND',
    name: 'Brilliant Diamond',
    multiplier3x: 8.5,
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.9)',
    description: 'Radiant sparkling blue diamond. 3 award 8.5x base line win!',
  },
  COIN: {
    id: 'COIN',
    name: 'Golden Casino Bullion',
    multiplier3x: 5.5,
    color: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.9)',
    description: 'Engraved 24K gold casino bullion. 3 award 5.5x base line win!',
  },
  SEVEN: {
    id: 'SEVEN',
    name: 'Lucky Red 7',
    multiplier3x: 4.5,
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.85)',
    description: 'Crimson fiery 7. 3 Red 7s award MAJOR Jackpot (4.5x base line win)!',
  },
  WHITE_SEVEN: {
    id: 'WHITE_SEVEN',
    name: 'Platinum Silver 7',
    multiplier3x: 3.2,
    color: '#F3F4F6',
    glowColor: 'rgba(243, 244, 246, 0.9)',
    description: 'Pure platinum 7 with diamond trim. 3 White 7s award MINOR Jackpot (3.2x base line win)!',
  },
  BELL: {
    id: 'BELL',
    name: 'Golden Liberty Bell',
    multiplier3x: 2.2,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.8)',
    description: 'Polished brass bell. 3 Bells award 2.2x base line win!',
  },
  TRIPLE_BAR: {
    id: 'TRIPLE_BAR',
    name: 'Triple Sapphire BAR',
    multiplier3x: 1.5,
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.8)',
    description: 'Triple electric sapphire bullion. 3 award 1.5x base line win!',
  },
  DOUBLE_BAR: {
    id: 'DOUBLE_BAR',
    name: 'Double Ruby BAR',
    multiplier3x: 1.0,
    color: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.8)',
    description: 'Double neon magenta bullion. 3 award 1.0x base line win!',
  },
  BAR: {
    id: 'BAR',
    name: 'Single Emerald BAR',
    multiplier3x: 0.6,
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.8)',
    description: 'Emerald green bullion. 3 award 0.6x base line win!',
  },
  CHERRY: {
    id: 'CHERRY',
    name: 'Lacquered Cherries',
    multiplier3x: 0.8,
    color: '#DC2626',
    glowColor: 'rgba(220, 38, 38, 0.8)',
    description: 'Glossy twin cherries. 3 award 0.8x, 2 award 0.2x, 1 on center payline awards 0.1x.',
  },
  A: {
    id: 'A',
    name: 'Royal Ace',
    multiplier3x: 0.5,
    color: '#FDE047',
    glowColor: 'rgba(253, 224, 71, 0.7)',
    description: 'Gilded Royal Ace card emblem. 3 award 0.5x base line win!',
  },
  K: {
    id: 'K',
    name: 'Royal King',
    multiplier3x: 0.45,
    color: '#FBBF24',
    glowColor: 'rgba(251, 191, 36, 0.7)',
    description: 'Gilded Royal King emblem. 3 award 0.45x base line win!',
  },
  Q: {
    id: 'Q',
    name: 'Royal Queen',
    multiplier3x: 0.4,
    color: '#F472B6',
    glowColor: 'rgba(244, 114, 182, 0.7)',
    description: 'Gilded Royal Queen emblem. 3 award 0.4x base line win!',
  },
  J: {
    id: 'J',
    name: 'Royal Jack',
    multiplier3x: 0.35,
    color: '#60A5FA',
    glowColor: 'rgba(96, 165, 250, 0.7)',
    description: 'Gilded Royal Jack emblem. 3 award 0.35x base line win!',
  },
  TEN: {
    id: 'TEN',
    name: 'Royal Ten',
    multiplier3x: 0.3,
    color: '#A78BFA',
    glowColor: 'rgba(167, 139, 250, 0.7)',
    description: 'Gilded Royal Ten emblem. 3 award 0.3x base line win!',
  },
};

export const PRIZE_NUMBERS: PrizeNumber[] = [2, 5, 10, 20, 30, 50, 100];

// Calibrated 32-stop authentic physical casino reel strips with GOLDEN 50 & premium symbols
export const REEL_1_STRIP: SlotSymbol[] = [
  'GOLDEN_50', 'BAR', 'BELL', 'LION', 'DOUBLE_BAR', 'DIAMOND', 'BAR',
  'SEVEN', 'BELL', 'TRIPLE_BAR', 'COIN', 'WHITE_SEVEN', 'A', 'DOUBLE_BAR',
  'K', 'BELL', 'BAR', 'TRIPLE_BAR', 'Q', 'WHITE_SEVEN', 'DOUBLE_BAR',
  'J', 'BELL', 'SEVEN', 'TRIPLE_BAR', 'WILD', 'BAR', 'TEN',
  'CROWN', 'WHITE_SEVEN', 'BELL', 'CHERRY'
];

export const REEL_2_STRIP: SlotSymbol[] = [
  'SEVEN', 'BELL', 'WHITE_SEVEN', 'COIN', 'DOUBLE_BAR', 'GOLDEN_50', 'TRIPLE_BAR',
  'BAR', 'DIAMOND', 'WHITE_SEVEN', 'DOUBLE_BAR', 'WILD', 'BELL', 'A',
  'LION', 'K', 'TRIPLE_BAR', 'WHITE_SEVEN', 'BELL', 'DOUBLE_BAR', 'Q',
  'BELL', 'CHERRY', 'TRIPLE_BAR', 'CROWN', 'WHITE_SEVEN', 'J', 'TEN',
  'SEVEN', 'WHITE_SEVEN', 'BELL', 'BAR'
];

export const REEL_3_STRIP: SlotSymbol[] = [
  'WHITE_SEVEN', 'BELL', 'SEVEN', 'A', 'DOUBLE_BAR', 'BELL', 'TRIPLE_BAR',
  'WHITE_SEVEN', 'COIN', 'BAR', 'DOUBLE_BAR', 'GOLDEN_50', 'BELL', 'SEVEN',
  'WHITE_SEVEN', 'K', 'TRIPLE_BAR', 'DIAMOND', 'DOUBLE_BAR', 'LION', 'SEVEN',
  'WHITE_SEVEN', 'Q', 'CHERRY', 'TRIPLE_BAR', 'CROWN', 'DOUBLE_BAR', 'J',
  'TEN', 'WHITE_SEVEN', 'WILD', 'BAR'
];

// Weighted Prize Strip for authentic casino volatility
// 2x is standard multiplier, 5x is frequent, 10x is exciting, 20x/30x/50x are high-stakes jackpots
export const PRIZE_STRIP: PrizeNumber[] = [
  2, 2, 2, 2, 5, 2, 2, 2, 2, 5, 2, 2, 2, 10, 2, 2, 5, 2, 2, 10, 2, 20, 30, 50
];
