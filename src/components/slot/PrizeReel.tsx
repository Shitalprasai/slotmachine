import React, { useEffect, useState, useRef } from 'react';
import { PrizeNumber } from '../../lib/slot/types';
import { PRIZE_NUMBERS } from '../../lib/slot/symbols';

interface PrizeReelProps {
  currentPrize: PrizeNumber;
  isSpinning: boolean;
  hasWin: boolean;
}

export const PrizeReel: React.FC<PrizeReelProps> = ({
  currentPrize,
  isSpinning,
  hasWin,
}) => {
  const [displayPrize, setDisplayPrize] = useState<PrizeNumber>(currentPrize);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [pulseWin, setPulseWin] = useState<boolean>(false);
  const wasSpinning = useRef(isSpinning);
  const prevPrize = useRef<PrizeNumber>(currentPrize);

  // Meter tier numbers to show in the physical power meter
  const meterTiers: PrizeNumber[] = [100, 50, 30, 20, 10, 5, 2];

  useEffect(() => {
    if (isSpinning) {
      setPulseWin(false);
      setIsFlashing(false);

      // Rapidly randomize display number during spin (NO BLUR, crisp rapid counter)
      const interval = setInterval(() => {
        const randIndex = Math.floor(Math.random() * PRIZE_NUMBERS.length);
        setDisplayPrize(PRIZE_NUMBERS[randIndex]);
      }, 55);

      return () => clearInterval(interval);
    } else if (wasSpinning.current && !isSpinning) {
      setDisplayPrize(currentPrize);
      setIsFlashing(true);
      setPulseWin(true);

      const flashTimer = setTimeout(() => {
        setIsFlashing(false);
      }, 800);

      return () => clearTimeout(flashTimer);
    } else {
      setDisplayPrize(currentPrize);
      if (prevPrize.current !== currentPrize) {
        setIsFlashing(true);
        const t = setTimeout(() => setIsFlashing(false), 500);
        prevPrize.current = currentPrize;
        return () => clearTimeout(t);
      }
    }
    wasSpinning.current = isSpinning;
  }, [isSpinning, currentPrize]);

  return (
    <div
      id="multiplier-power-meter-cabinet"
      className="relative flex flex-col items-center h-full w-[84px] sm:w-28 md:w-32 shrink-0 rounded-2xl p-1.5 sm:p-2 bg-gradient-to-b from-[#381608] via-[#140602] to-[#250d04] border-[3px] border-amber-400 shadow-[0_16px_40px_rgba(0,0,0,0.95),0_0_35px_rgba(239,68,68,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)]"
    >
      {/* Decorative Corner Rivets */}
      <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-100 to-amber-700 shadow border border-amber-900" />
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-100 to-amber-700 shadow border border-amber-900" />
      <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-100 to-amber-700 shadow border border-amber-900" />
      <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-100 to-amber-700 shadow border border-amber-900" />

      {/* Top Header Marquee */}
      <div className="w-full py-1 mb-1.5 rounded-lg bg-gradient-to-r from-[#200404] via-red-700 to-[#200404] border-2 border-amber-400 shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/20 pointer-events-none" />
        <span className="block font-russo text-[10px] sm:text-xs uppercase tracking-[0.2em] text-yellow-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          MULTIPLIER
        </span>
      </div>

      {/* Physical Illuminated Power Meter Housing */}
      <div
        id="power-meter-ladder"
        className="relative w-full flex-1 overflow-hidden rounded-xl bg-gradient-to-b from-[#080202] via-[#030101] to-[#080202] border-2 border-amber-400/90 shadow-[inset_0_8px_20px_rgba(0,0,0,0.98)] p-1 flex flex-col justify-between"
      >
        {/* Traveling light beam effect during spin / flash */}
        {(isSpinning || isFlashing) && (
          <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-yellow-300/40 to-transparent pointer-events-none z-30 animate-meter-sweep" />
        )}

        {/* Gold flash wave when locked in */}
        {isFlashing && (
          <div className="absolute inset-0 bg-yellow-400/25 pointer-events-none z-40 animate-pulse duration-300" />
        )}

        {/* Meter Tier Bars */}
        {meterTiers.map((tier) => {
          const isActive = displayPrize === tier;
          const isHighest = tier === 100;
          const isHigh = tier >= 30;

          return (
            <div
              key={tier}
              className={`relative flex items-center justify-between px-2 py-0.5 sm:py-1 rounded-md transition-all duration-200 border ${
                isActive
                  ? isHighest
                    ? 'bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 border-yellow-200 shadow-[0_0_16px_rgba(255,215,0,0.95)] scale-[1.05] z-20'
                    : 'bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 border-yellow-300 shadow-[0_0_14px_rgba(245,158,11,0.85)] scale-[1.03] z-20'
                  : 'bg-black/60 border-amber-950/60 opacity-35 hover:opacity-50'
              }`}
            >
              {/* Left LED Indicator Bulb */}
              <div
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? isHighest
                      ? 'bg-white shadow-[0_0_8px_#ffffff] animate-ping'
                      : 'bg-yellow-200 shadow-[0_0_8px_#fef08a]'
                    : isHigh
                    ? 'bg-amber-900/60'
                    : 'bg-stone-800'
                }`}
              />

              {/* Number Label */}
              <span
                className={`font-russo font-black tracking-wider text-xs sm:text-sm md:text-base leading-none transition-all ${
                  isActive
                    ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                    : 'text-stone-500'
                }`}
              >
                {tier}X
              </span>

              {/* Right LED Indicator Bulb */}
              <div
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? isHighest
                      ? 'bg-white shadow-[0_0_8px_#ffffff] animate-ping'
                      : 'bg-yellow-200 shadow-[0_0_8px_#fef08a]'
                    : isHigh
                    ? 'bg-amber-900/60'
                    : 'bg-stone-800'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Center Highlighted Value Banner */}
      <div
        className={`w-full py-1 mt-1.5 rounded-lg border-2 text-center transition-all duration-300 ${
          hasWin || pulseWin
            ? 'bg-gradient-to-r from-red-600 via-amber-400 to-red-600 border-yellow-200 shadow-[0_0_20px_rgba(255,215,0,0.9)] scale-[1.02]'
            : 'bg-gradient-to-r from-[#200b04] via-[#100502] to-[#200b04] border-amber-500/50 shadow'
        }`}
      >
        <span
          className={`block font-russo text-sm sm:text-base md:text-lg font-black tracking-wider ${
            hasWin || pulseWin ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]' : 'gold-3d-text'
          }`}
        >
          {displayPrize}X
        </span>
      </div>
    </div>
  );
};
