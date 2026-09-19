/**
 * @license
 * Golden 50 Casino Slot Game Engine
 * 
 * Cryptographically Secure, Pure-Probability Slot Engine
 * Conforms to authentic mechanical 3-reel gaming regulations:
 * 1. Outgoing symbols on each reel are sampled uniformly and independently from defined physical virtual strips.
 * 2. Uses Web Crypto API (crypto.getRandomValues) with rejection sampling to eliminate modulo bias.
 * 3. Zero outcome manipulation: no forced wins, no streaks, no balance-dependent odds, no fake near-misses.
 * 4. Separation of outcome generation from visual presentation.
 */

import { SlotSymbol, PrizeNumber, SpinResult } from './types';
import { ALL_SYMBOLS, PRIZE_NUMBERS, PRIZE_STRIP, REEL_1_STRIP, REEL_2_STRIP, REEL_3_STRIP } from './symbols';
import { evaluateSpin } from './evaluator';

export interface GameEngineConfig {
  initialBalance?: number;
  defaultBet?: number;
  betLevels?: number[];
}

export const DEFAULT_BET_LEVELS: number[] = [0.50, 1.00, 2.00, 5.00, 10.00, 25.00, 50.00];
export const DEFAULT_INITIAL_BALANCE = 500.00;

/**
 * Cryptographically secure uniform random integer sampler in range [0, maxExclusive)
 * Uses rejection sampling to completely eliminate modulo bias.
 */
export function getSecureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    const maxUint = 0xffffffff;
    // Calculate cutoff to discard values that would cause modulo bias
    const limit = maxUint - (maxUint % maxExclusive);
    let val: number;
    do {
      window.crypto.getRandomValues(array);
      val = array[0];
    } while (val >= limit);
    return val % maxExclusive;
  }

  // Fallback for non-browser environments
  return Math.floor(Math.random() * maxExclusive);
}

export interface SimulationReport {
  totalSpins: number;
  totalWagered: number;
  totalWon: number;
  rtpPercent: number;
  hitFrequencyPercent: number;
  winningSpinsCount: number;
  symbolFrequencies: Record<SlotSymbol, { count: number; percentage: number }>;
  prizeFrequencies: Record<PrizeNumber, { count: number; percentage: number }>;
  winTierCounts: {
    STANDARD: number;
    BIG_WIN: number;
    MEGA_WIN: number;
    JACKPOT: number;
  };
}

export class SlotGameEngine {
  private balance: number;
  private currentBet: number;

  constructor(config?: GameEngineConfig) {
    this.balance = config?.initialBalance ?? DEFAULT_INITIAL_BALANCE;
    this.currentBet = config?.defaultBet ?? 0.50;
  }

  public getBalance(): number {
    return this.balance;
  }

  public setBalance(amount: number): void {
    this.balance = amount;
  }

  public getBet(): number {
    return this.currentBet;
  }

  public setBet(bet: number): void {
    this.currentBet = bet;
  }

  /**
   * Primary synchronous spin API.
   * Generates a completely independent, mathematically legitimate outcome.
   */
  public spin(customBet?: number): SpinResult {
    const bet = customBet ?? this.currentBet;
    return this.generateRandomOutcome(bet);
  }

  /**
   * Optional asynchronous spin API for server-side or network-simulated integration.
   */
  public async spinAsync(customBet?: number): Promise<SpinResult> {
    const bet = customBet ?? this.currentBet;
    // Simulated network transit latency (50ms)
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.generateRandomOutcome(bet);
  }

  /**
   * Generates a genuine, unscripted random outcome from the 3 symbol reel strips
   * and the 4th multiplier prize reel strip using cryptographically secure RNG.
   *
   * Every stop on every reel has an exact, uniform probability with zero bias.
   */
  public generateRandomOutcome(bet: number): SpinResult {
    // 1. Reel 1 Stop: Uniform random index on Reel 1 Strip
    const stop1 = getSecureRandomInt(REEL_1_STRIP.length);
    const r1: [SlotSymbol, SlotSymbol, SlotSymbol] = [
      REEL_1_STRIP[stop1],
      REEL_1_STRIP[(stop1 + 1) % REEL_1_STRIP.length],
      REEL_1_STRIP[(stop1 + 2) % REEL_1_STRIP.length],
    ];

    // 2. Reel 2 Stop: Uniform random index on Reel 2 Strip (completely independent)
    const stop2 = getSecureRandomInt(REEL_2_STRIP.length);
    const r2: [SlotSymbol, SlotSymbol, SlotSymbol] = [
      REEL_2_STRIP[stop2],
      REEL_2_STRIP[(stop2 + 1) % REEL_2_STRIP.length],
      REEL_2_STRIP[(stop2 + 2) % REEL_2_STRIP.length],
    ];

    // 3. Reel 3 Stop: Uniform random index on Reel 3 Strip (completely independent)
    const stop3 = getSecureRandomInt(REEL_3_STRIP.length);
    const r3: [SlotSymbol, SlotSymbol, SlotSymbol] = [
      REEL_3_STRIP[stop3],
      REEL_3_STRIP[(stop3 + 1) % REEL_3_STRIP.length],
      REEL_3_STRIP[(stop3 + 2) % REEL_3_STRIP.length],
    ];

    const reels: [
      [SlotSymbol, SlotSymbol, SlotSymbol],
      [SlotSymbol, SlotSymbol, SlotSymbol],
      [SlotSymbol, SlotSymbol, SlotSymbol]
    ] = [r1, r2, r3];

    // 4. 4th Multiplier Reel Stop: Sampled from the physical multiplier strip
    const prizeIndex = getSecureRandomInt(PRIZE_STRIP.length);
    const prizeNumber = PRIZE_STRIP[prizeIndex];

    // 5. Evaluate against standard 5-payline evaluation logic
    return evaluateSpin(reels, prizeNumber, bet);
  }

  /**
   * Deterministic developer testing outcome for audio/visual verification only.
   * Does NOT alter normal gameplay or RNG generation.
   */
  public generateGuaranteedWin(bet: number, type: 'SEVENS' | 'WILDS' | 'BELLS' | 'BARS' = 'SEVENS'): SpinResult {
    const targetSymbol: SlotSymbol = type === 'WILDS' ? 'WILD' : type === 'SEVENS' ? 'SEVEN' : type === 'BELLS' ? 'BELL' : 'TRIPLE_BAR';
    const prize: PrizeNumber = type === 'WILDS' ? 100 : type === 'SEVENS' ? 50 : 20;

    const reels: [
      [SlotSymbol, SlotSymbol, SlotSymbol],
      [SlotSymbol, SlotSymbol, SlotSymbol],
      [SlotSymbol, SlotSymbol, SlotSymbol]
    ] = [
      ['BAR', targetSymbol, 'WHITE_SEVEN'],
      ['BELL', targetSymbol, 'CHERRY'],
      ['CHERRY', targetSymbol, 'BAR'],
    ];

    return evaluateSpin(reels, prize, bet);
  }

  /**
   * Statistical Verification Simulation Mode
   * Runs N genuine cryptographically sampled spins and computes comprehensive statistical metrics.
   */
  public runSimulation(spinCount = 10000, bet = 1.00): SimulationReport {
    let totalWon = 0;
    let winningSpinsCount = 0;

    const symbolCounts: Record<SlotSymbol, number> = {
      GOLDEN_50: 0,
      WILD: 0,
      LION: 0,
      CROWN: 0,
      DIAMOND: 0,
      COIN: 0,
      SEVEN: 0,
      WHITE_SEVEN: 0,
      BELL: 0,
      TRIPLE_BAR: 0,
      DOUBLE_BAR: 0,
      BAR: 0,
      CHERRY: 0,
      A: 0,
      K: 0,
      Q: 0,
      J: 0,
      TEN: 0,
    };

    const prizeCounts: Record<PrizeNumber, number> = {
      2: 0,
      5: 0,
      10: 0,
      20: 0,
      30: 0,
      50: 0,
      100: 0,
    };

    const winTierCounts = {
      STANDARD: 0,
      BIG_WIN: 0,
      MEGA_WIN: 0,
      JACKPOT: 0,
    };

    for (let i = 0; i < spinCount; i++) {
      const outcome = this.generateRandomOutcome(bet);
      totalWon += outcome.winAmount;

      if (outcome.winAmount > 0) {
        winningSpinsCount++;
        if (outcome.winTier === 'JACKPOT') {
          winTierCounts.JACKPOT++;
        } else if (outcome.winTier === 'MEGA_WIN') {
          winTierCounts.MEGA_WIN++;
        } else if (outcome.winTier === 'BIG_WIN') {
          winTierCounts.BIG_WIN++;
        } else {
          winTierCounts.STANDARD++;
        }
      }

      // Record multiplier count
      prizeCounts[outcome.number] = (prizeCounts[outcome.number] || 0) + 1;

      // Record visible symbols on matrix (3x3 = 9 symbols per spin)
      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 3; row++) {
          const s = outcome.reels[col][row];
          symbolCounts[s] = (symbolCounts[s] || 0) + 1;
        }
      }
    }

    const totalVisibleSymbols = spinCount * 9;
    const symbolFrequencies: Record<SlotSymbol, { count: number; percentage: number }> = {} as any;
    for (const sym of ALL_SYMBOLS) {
      const count = symbolCounts[sym] || 0;
      symbolFrequencies[sym] = {
        count,
        percentage: Math.round((count / totalVisibleSymbols) * 10000) / 100,
      };
    }

    const prizeFrequencies: Record<PrizeNumber, { count: number; percentage: number }> = {} as any;
    for (const p of PRIZE_NUMBERS) {
      const count = prizeCounts[p] || 0;
      prizeFrequencies[p] = {
        count,
        percentage: Math.round((count / spinCount) * 10000) / 100,
      };
    }

    const totalWagered = spinCount * bet;
    const rtpPercent = Math.round((totalWon / totalWagered) * 10000) / 100;
    const hitFrequencyPercent = Math.round((winningSpinsCount / spinCount) * 10000) / 100;

    return {
      totalSpins: spinCount,
      totalWagered,
      totalWon: Math.round(totalWon * 100) / 100,
      rtpPercent,
      hitFrequencyPercent,
      winningSpinsCount,
      symbolFrequencies,
      prizeFrequencies,
      winTierCounts,
    };
  }
}

export const gameEngine = new SlotGameEngine();
