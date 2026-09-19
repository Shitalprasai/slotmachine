/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { PrizeNumber } from '../../lib/slot/types';
import { PRIZE_NUMBERS } from '../../lib/slot/symbols';

interface MultiplierBoxProps {
  currentPrize: PrizeNumber;
  isSpinning: boolean;
  hasWin: boolean;
}

/**
 * High-Impact Horizontal Multiplier Bar spanning across the top of the 3D Slots.
 * Positioned directly above the 3D slots as specified in the user's sketch.
 * Features illuminated progressive multiplier ladder (2X, 5X, 10X, 25X, 50X),
 * active multiplier neon badge, and animated fiery accents.
 */
export const MultiplierBox: React.FC<MultiplierBoxProps> = ({
  currentPrize,
  isSpinning,
  hasWin,
}) => {
  const [displayPrize, setDisplayPrize] = useState<PrizeNumber>(currentPrize);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const wasSpinning = useRef(isSpinning);

  const multiplierTiers: PrizeNumber[] = [2, 5, 10, 20, 50];

  useEffect(() => {
    if (isSpinning) {
      setIsFlashing(false);
      const interval = setInterval(() => {
        const randIndex = Math.floor(Math.random() * PRIZE_NUMBERS.length);
        setDisplayPrize(PRIZE_NUMBERS[randIndex]);
      }, 50);
      return () => clearInterval(interval);
    } else if (wasSpinning.current && !isSpinning) {
      setDisplayPrize(currentPrize);
      setIsFlashing(true);
      const t = setTimeout(() => setIsFlashing(false), 900);
      return () => clearTimeout(t);
    } else {
      setDisplayPrize(currentPrize);
    }
    wasSpinning.current = isSpinning;
  }, [isSpinning, currentPrize]);

  return (
    <div
      id="top-multiplier-module"
      className={`relative w-full flex items-center justify-between px-2 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-[#200502] via-[#0d0201] to-[#200502] border transition-all duration-300 shadow-[0_6px_16px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,200,100,0.4)] select-none shrink-0 overflow-hidden ${
        hasWin || isFlashing
          ? 'border-yellow-400 shadow-[0_0_25px_rgba(255,140,0,0.8),inset_0_0_15px_rgba(255,200,0,0.4)]'
          : 'border-orange-500/80 shadow-[0_4px_12px_rgba(0,0,0,0.9)]'
      }`}
    >
      {/* Background Subtle Fire Sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,100,0,0.18)_0%,transparent_75%)] pointer-events-none" />

      {/* LEFT ACCENT: Fiery Flame Icon */}
      <div className="flex items-center gap-1 shrink-0 z-10">
        <Flame
          size={14}
          className="text-amber-400 animate-flame-flicker drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]"
        />
        <span className="font-russo text-[9px] sm:text-[11px] md:text-xs font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 drop-shadow">
          MULTIPLIER
        </span>
      </div>

      {/* CENTER: Multiplier Ladder (2X • 5X • 10X • 25X • 50X) */}
      <div className="flex items-center gap-1 sm:gap-1.5 z-10">
        {multiplierTiers.map((tier) => {
          const isActive = displayPrize === tier;
          return (
            <div
              key={`multiplier-tier-${tier}`}
              className={`px-1.5 sm:px-2.5 py-0.5 rounded flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 border border-yellow-200 shadow-[0_0_14px_rgba(255,140,0,1)] scale-110'
                  : 'bg-black/60 border border-orange-950/80 opacity-60'
              }`}
            >
              <span
                className={`font-orbitron font-black text-[9px] sm:text-xs md:text-sm leading-none ${
                  isActive
                    ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                    : 'text-amber-500/80'
                }`}
              >
                {tier}X
              </span>
            </div>
          );
        })}
      </div>

      {/* RIGHT ACCENT: Active Hero Badge */}
      <div className="flex items-center gap-1 shrink-0 z-10">
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all ${
            hasWin || isFlashing
              ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 border-yellow-200 shadow-[0_0_18px_rgba(255,100,0,1)] animate-pulse'
              : 'bg-gradient-to-b from-[#180402] to-[#0a0201] border-amber-500/60'
          }`}
        >
          <Sparkles size={11} className="text-yellow-300 animate-spin-slow" />
          <span className="font-orbitron font-black text-xs sm:text-sm md:text-base text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.9)]">
            {displayPrize}X
          </span>
        </div>
      </div>
    </div>
  );
};
