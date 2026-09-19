import React, { useEffect, useState } from 'react';
import { PrizeNumber } from '../../lib/slot/types';
import { Zap } from 'lucide-react';

interface CompactMultiplierProps {
  currentMultiplier: PrizeNumber;
  isSpinning: boolean;
  hasWin: boolean;
}

const MULTIPLIER_TIERS: PrizeNumber[] = [2, 5, 10, 20, 30, 50, 100];

export const CompactMultiplier: React.FC<CompactMultiplierProps> = ({
  currentMultiplier,
  isSpinning,
  hasWin,
}) => {
  const [activeCycleIndex, setActiveCycleIndex] = useState<number>(0);
  const [isChanging, setIsChanging] = useState<boolean>(false);

  // Cycling sweep light animation during spin
  useEffect(() => {
    if (!isSpinning) {
      setIsChanging(true);
      const timer = setTimeout(() => setIsChanging(false), 900);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setActiveCycleIndex((prev) => (prev + 1) % MULTIPLIER_TIERS.length);
    }, 90);

    return () => clearInterval(interval);
  }, [isSpinning, currentMultiplier]);

  return (
    <div
      id="compact-multiplier-bar"
      className="relative flex items-center justify-between w-full px-2 sm:px-3 py-1 my-0.5 rounded-lg bg-gradient-to-r from-[#200703] via-[#100301] to-[#200703] border border-amber-500/60 shadow-[0_2px_8px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.15)] select-none overflow-hidden"
    >
      {/* Left Badge: 4TH REEL MULTIPLIER */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pr-1.5 border-r border-amber-800/60">
        <Zap
          size={12}
          className={`text-yellow-400 ${
            isSpinning
              ? 'animate-bounce'
              : hasWin
              ? 'text-yellow-300 fill-yellow-300 drop-shadow-[0_0_8px_#fde047]'
              : 'fill-yellow-400/30'
          }`}
        />
        <span className="font-russo text-[9px] sm:text-[10px] tracking-wider text-amber-200 uppercase whitespace-nowrap">
          MULTIPLIER
        </span>
      </div>

      {/* Multiplier Pills: 2X • 5X • 10X • 20X • 30X • 50X • 100X */}
      <div className="flex items-center justify-around flex-1 gap-1 sm:gap-1.5 px-1 sm:px-2">
        {MULTIPLIER_TIERS.map((tier, idx) => {
          const isLanded = !isSpinning && currentMultiplier === tier;
          const isCycling = isSpinning && activeCycleIndex === idx;

          let pillStyle =
            'bg-black/70 border-stone-800/80 text-stone-500 opacity-60 scale-95';

          if (isLanded) {
            pillStyle = hasWin
              ? 'bg-gradient-to-b from-yellow-300 via-amber-500 to-amber-700 border-yellow-200 text-yellow-950 font-black shadow-[0_0_15px_rgba(255,215,0,0.9)] scale-110 z-10 animate-pulse'
              : 'bg-gradient-to-b from-[#451a05] to-[#1a0802] border-amber-400 text-yellow-300 font-extrabold shadow-[0_0_8px_rgba(245,158,11,0.6)] scale-105 z-10';
          } else if (isCycling) {
            pillStyle =
              'bg-gradient-to-b from-amber-700 to-amber-900 border-yellow-300 text-yellow-200 shadow-[0_0_10px_#f59e0b] scale-105';
          }

          return (
            <div
              key={tier}
              className={`relative flex items-center justify-center px-1.5 sm:px-2.5 py-0.5 rounded-md border text-[10px] sm:text-xs font-orbitron transition-all duration-150 whitespace-nowrap ${pillStyle} ${
                isLanded && isChanging ? 'animate-bounce' : ''
              }`}
            >
              <span>{tier}X</span>
              {isLanded && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_#fde047] animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* Right Hero Badge: Landed Value */}
      <div className="shrink-0 pl-1.5 border-l border-amber-800/60 hidden xs:flex items-center gap-1">
        <span className="text-[8px] font-montserrat text-stone-400 uppercase font-bold">
          ACTIVE
        </span>
        <span
          className={`font-orbitron text-xs sm:text-sm font-black transition-all ${
            isSpinning
              ? 'text-stone-400 animate-pulse'
              : hasWin
              ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,1)] scale-105'
              : 'text-amber-300'
          }`}
        >
          {isSpinning ? '...' : `${currentMultiplier}X`}
        </span>
      </div>
    </div>
  );
};
