import { SlotSymbol, PrizeNumber, SpinResult, LineWin } from './types';
import { PAYLINES } from './paylines';

const BAR_SYMBOLS: SlotSymbol[] = ['BAR', 'DOUBLE_BAR', 'TRIPLE_BAR'];
const SEVEN_SYMBOLS: SlotSymbol[] = ['SEVEN', 'WHITE_SEVEN'];

function isWildSymbol(symbol: SlotSymbol): boolean {
  return symbol === 'WILD' || symbol === 'GOLDEN_50';
}

function isBar(symbol: SlotSymbol): boolean {
  return BAR_SYMBOLS.includes(symbol) || isWildSymbol(symbol);
}

function isSeven(symbol: SlotSymbol): boolean {
  return SEVEN_SYMBOLS.includes(symbol) || isWildSymbol(symbol);
}

interface EvaluationMatch {
  matched: boolean;
  symbol: SlotSymbol;
  multiplier: number;
}

const SYMBOL_MULTIPLIERS: Record<SlotSymbol, number> = {
  GOLDEN_50: 50,
  WILD: 20,
  LION: 16,
  CROWN: 12,
  DIAMOND: 8.5,
  COIN: 5.5,
  SEVEN: 4.5,
  WHITE_SEVEN: 3.2,
  BELL: 2.2,
  TRIPLE_BAR: 1.5,
  DOUBLE_BAR: 1.0,
  BAR: 0.6,
  CHERRY: 0.8,
  A: 0.5,
  K: 0.45,
  Q: 0.4,
  J: 0.35,
  TEN: 0.3,
};

function evaluateThreeSymbols(
  s0: SlotSymbol,
  s1: SlotSymbol,
  s2: SlotSymbol,
  lineId: number
): EvaluationMatch {
  // 1. Check all 3 GOLDEN_50
  if (s0 === 'GOLDEN_50' && s1 === 'GOLDEN_50' && s2 === 'GOLDEN_50') {
    return { matched: true, symbol: 'GOLDEN_50', multiplier: 50 };
  }

  // 2. Check all 3 WILDs (or combination of WILD & GOLDEN_50)
  if (isWildSymbol(s0) && isWildSymbol(s1) && isWildSymbol(s2)) {
    const hasG50 = s0 === 'GOLDEN_50' || s1 === 'GOLDEN_50' || s2 === 'GOLDEN_50';
    return { matched: true, symbol: hasG50 ? 'GOLDEN_50' : 'WILD', multiplier: hasG50 ? 50 : 20 };
  }

  // 3. Exact 3 matching with Wild substitution
  const nonWilds = [s0, s1, s2].filter((s) => !isWildSymbol(s));

  // Case A: 2 WILDs + 1 regular symbol
  if (nonWilds.length === 1) {
    const target = nonWilds[0];
    return { matched: true, symbol: target, multiplier: SYMBOL_MULTIPLIERS[target] };
  }

  // Case B: 1 WILD + 2 regular symbols
  if (nonWilds.length === 2 && nonWilds[0] === nonWilds[1]) {
    const target = nonWilds[0];
    return { matched: true, symbol: target, multiplier: SYMBOL_MULTIPLIERS[target] };
  }

  // Case C: All 3 identical regular symbols
  if (s0 === s1 && s1 === s2) {
    return { matched: true, symbol: s0, multiplier: SYMBOL_MULTIPLIERS[s0] };
  }

  // 4. Mixed 7s (Any combination of RED 7 and WHITE 7, with or without WILD)
  if (isSeven(s0) && isSeven(s1) && isSeven(s2)) {
    const hasRed = s0 === 'SEVEN' || s1 === 'SEVEN' || s2 === 'SEVEN';
    const hasWhite = s0 === 'WHITE_SEVEN' || s1 === 'WHITE_SEVEN' || s2 === 'WHITE_SEVEN';
    if (hasRed && hasWhite) {
      return { matched: true, symbol: 'SEVEN', multiplier: 1.0 };
    }
  }

  // 5. Mixed BARs (Distinct combination of 1-BAR, 2-BAR, 3-BAR)
  if (isBar(s0) && isBar(s1) && isBar(s2)) {
    const uniqueBars = new Set([s0, s1, s2].filter((s) => !isWildSymbol(s)));
    if (uniqueBars.size === 3 || (uniqueBars.size === 2 && (isWildSymbol(s0) || isWildSymbol(s1) || isWildSymbol(s2)))) {
      return { matched: true, symbol: 'BAR', multiplier: 0.3 };
    }
  }

  // 6. Cherries: 2 cherries on first two reels
  if (s0 === 'CHERRY' && (s1 === 'CHERRY' || isWildSymbol(s1))) {
    return { matched: true, symbol: 'CHERRY', multiplier: 0.2 };
  }

  // 7. 1 Cherry on center payline (Line 2) on first reel
  if (lineId === 2 && s0 === 'CHERRY') {
    return { matched: true, symbol: 'CHERRY', multiplier: 0.1 };
  }

  return { matched: false, symbol: s0, multiplier: 0 };
}

export function evaluateSpin(
  reels: [[SlotSymbol, SlotSymbol, SlotSymbol], [SlotSymbol, SlotSymbol, SlotSymbol], [SlotSymbol, SlotSymbol, SlotSymbol]],
  prizeNumber: PrizeNumber,
  totalBet: number
): SpinResult {
  const lineBet = Math.max(0.01, Math.round((totalBet / 5) * 100) / 100);
  const winningLines: number[] = [];
  const lineWins: LineWin[] = [];
  let baseWinTotal = 0;

  PAYLINES.forEach((line) => {
    const s0 = reels[0][line.rows[0]];
    const s1 = reels[1][line.rows[1]];
    const s2 = reels[2][line.rows[2]];

    const match = evaluateThreeSymbols(s0, s1, s2, line.id);
    if (match.matched) {
      winningLines.push(line.id);
      const lineWinAmount = Math.round(lineBet * match.multiplier * 100) / 100;
      baseWinTotal += lineWinAmount;
      lineWins.push({
        lineId: line.id,
        symbol: match.symbol,
        positions: [
          [0, line.rows[0]],
          [1, line.rows[1]],
          [2, line.rows[2]],
        ],
        symbolMultiplier: match.multiplier,
        lineWinAmount: lineWinAmount,
      });
    }
  });

  // Prize Reel multiplier (2x to 100x) applies to all line wins
  let finalWin = 0;
  if (lineWins.length > 0) {
    finalWin = Math.round(baseWinTotal * prizeNumber * 100) / 100;
  }

  // Determine authentic casino jackpot triggers
  let isJackpot = false;
  let jackpotType: 'MINI' | 'MINOR' | 'MAJOR' | 'GRAND' | undefined;

  const hasGolden50Win = lineWins.some((w) => w.symbol === 'GOLDEN_50');
  const hasWildWin = lineWins.some((w) => w.symbol === 'WILD');
  const hasCrownWin = lineWins.some((w) => w.symbol === 'CROWN');
  const hasRedSevenWin = lineWins.some((w) => {
    if (w.symbol !== 'SEVEN') return false;
    const line = PAYLINES.find((p) => p.id === w.lineId);
    if (!line) return false;
    return reels[0][line.rows[0]] === 'SEVEN' && reels[1][line.rows[1]] === 'SEVEN' && reels[2][line.rows[2]] === 'SEVEN';
  });
  const hasWhiteSevenWin = lineWins.some((w) => {
    if (w.symbol !== 'WHITE_SEVEN') return false;
    const line = PAYLINES.find((p) => p.id === w.lineId);
    if (!line) return false;
    return reels[0][line.rows[0]] === 'WHITE_SEVEN' && reels[1][line.rows[1]] === 'WHITE_SEVEN' && reels[2][line.rows[2]] === 'WHITE_SEVEN';
  });
  const hasMixedSevenWin = lineWins.some((w) => w.symbol === 'SEVEN' && !hasRedSevenWin);

  if (hasGolden50Win || (hasWildWin && prizeNumber >= 20) || (hasCrownWin && prizeNumber >= 30)) {
    isJackpot = true;
    jackpotType = 'GRAND';
  } else if (hasRedSevenWin || (hasCrownWin && prizeNumber >= 10)) {
    isJackpot = true;
    jackpotType = 'MAJOR';
  } else if (hasWhiteSevenWin) {
    isJackpot = true;
    jackpotType = 'MINOR';
  } else if (hasMixedSevenWin && prizeNumber >= 10) {
    isJackpot = true;
    jackpotType = 'MINI';
  } else if (finalWin >= totalBet * 30) {
    isJackpot = true;
    jackpotType = 'GRAND';
  } else if (finalWin >= totalBet * 15) {
    jackpotType = 'MAJOR';
  } else if (finalWin >= totalBet * 8) {
    jackpotType = 'MINOR';
  } else if (finalWin >= totalBet * 4) {
    jackpotType = 'MINI';
  }

  // Win Tier
  let winTier: 'NONE' | 'NORMAL' | 'BIG_WIN' | 'MEGA_WIN' | 'JACKPOT' = 'NONE';
  if (isJackpot || jackpotType === 'GRAND' || jackpotType === 'MAJOR') {
    winTier = 'JACKPOT';
  } else if (finalWin >= totalBet * 12) {
    winTier = 'MEGA_WIN';
  } else if (finalWin >= totalBet * 5) {
    winTier = 'BIG_WIN';
  } else if (finalWin > 0) {
    winTier = 'NORMAL';
  }

  return {
    reels,
    number: prizeNumber,
    winningLines,
    lineWins,
    baseWinAmount: Math.round(baseWinTotal * 100) / 100,
    prizeMultiplier: prizeNumber,
    winAmount: finalWin,
    isJackpot,
    jackpotType,
    winTier,
  };
}
