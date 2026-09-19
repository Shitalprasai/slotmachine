export type SlotSymbol =
  | 'GOLDEN_50'
  | 'WILD'
  | 'LION'
  | 'CROWN'
  | 'DIAMOND'
  | 'COIN'
  | 'SEVEN'
  | 'WHITE_SEVEN'
  | 'BELL'
  | 'TRIPLE_BAR'
  | 'DOUBLE_BAR'
  | 'BAR'
  | 'CHERRY'
  | 'A'
  | 'K'
  | 'Q'
  | 'J'
  | 'TEN';

export type PrizeNumber = 2 | 5 | 10 | 20 | 30 | 50 | 100;

export interface SymbolInfo {
  id: SlotSymbol;
  name: string;
  multiplier3x: number;
  color: string;
  glowColor: string;
  description: string;
}

export interface PaylineDefinition {
  id: number;
  name: string;
  color: string;
  // Row index for col 0, col 1, col 2 (0 = top, 1 = middle, 2 = bottom)
  rows: [number, number, number];
  description: string;
}

export interface LineWin {
  lineId: number;
  symbol: SlotSymbol;
  positions: [number, number][]; // [reelIndex, rowIndex]
  symbolMultiplier: number;
  lineWinAmount: number;
}

export interface SpinResult {
  reels: [
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol]
  ];
  number: PrizeNumber;
  winningLines: number[];
  lineWins: LineWin[];
  baseWinAmount: number;
  prizeMultiplier: PrizeNumber;
  winAmount: number;
  isJackpot: boolean;
  jackpotType?: 'MINI' | 'MINOR' | 'MAJOR' | 'GRAND';
  winTier: 'NONE' | 'NORMAL' | 'BIG_WIN' | 'MEGA_WIN' | 'JACKPOT';
}

export interface JackpotPools {
  mini: number;
  minor: number;
  major: number;
  grand: number;
}

export type SlotGameState =
  | 'IDLE'
  | 'SPINNING'
  | 'STOPPING_REEL_1'
  | 'STOPPING_REEL_2'
  | 'STOPPING_REEL_3'
  | 'REELS_SETTLED'
  | 'WIN_REVEAL'
  | 'WIN_ANIMATION'
  | 'COMPLETE';
