/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame } from 'lucide-react';

interface JackpotPayTableBannerProps {
  currentBet: number;
  highlightTier?: 'GRAND' | 'MAJOR' | 'MINOR' | 'MINI' | null;
}

export const JackpotPayTableBanner: React.FC<JackpotPayTableBannerProps> = ({
  currentBet,
  highlightTier = null,
}) => {
  // Dynamic payouts calculated precisely by bet multiplier
  const grandAmount = currentBet * 100;
  const majorAmount = currentBet * 25;
  const minorAmount = currentBet * 15;
  const miniAmount = currentBet * 7.5;

  return (
    <div
      id="jackpot-paytable-marquee"
      className="w-full select-none rounded-xl bg-gradient-to-b from-[#250702] via-[#140402] to-[#0a0201] border-2 border-orange-500/90 shadow-[0_8px_25px_rgba(0,0,0,0.95),inset_0_1px_3px_rgba(255,200,100,0.4)] p-2 sm:p-3 flex flex-col gap-2 relative overflow-hidden"
    >
      {/* Background Subtle Fire Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/25 via-transparent to-transparent pointer-events-none" />

      {/* Row 1: GRAND JACKPOT (Hero Top Tier) */}
      <div
        className={`flex items-center justify-between px-2.5 py-1.5 sm:py-2 rounded-lg border-2 transition-all duration-300 ${
          highlightTier === 'GRAND'
            ? 'bg-gradient-to-r from-red-700 via-orange-600 to-red-700 border-yellow-300 shadow-[0_0_20px_rgba(255,100,0,1)] animate-pulse scale-[1.02]'
            : 'bg-gradient-to-r from-black/80 via-[#180502] to-black/80 border-orange-500/70 shadow-md'
        }`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Flaming Icon Cluster */}
          <div className="flex items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-gradient-to-b from-red-600 via-orange-500 to-amber-400 border border-yellow-200 flex items-center justify-center shadow"
              >
                <Flame size={11} className="text-yellow-100 drop-shadow" />
              </span>
            ))}
          </div>

          <div className="flex flex-col">
            <span className="font-russo text-[11px] sm:text-[13px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 drop-shadow">
              GRAND JACKPOT
            </span>
            <span className="font-orbitron font-bold text-[8px] sm:text-[9px] text-amber-300/90 leading-none">
              3X FLAMING LOGO • 100X
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="font-orbitron font-black text-sm sm:text-lg text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.9)]">
            ${grandAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tier Grid: MAJOR, MINOR, MINI */}
      <div className="grid grid-cols-3 gap-1.5">
        {/* MAJOR */}
        <div
          className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-lg border transition-all ${
            highlightTier === 'MAJOR'
              ? 'bg-orange-950/90 border-yellow-300 shadow-[0_0_14px_rgba(251,191,36,1)] animate-pulse'
              : 'bg-black/75 border-orange-600/50 hover:border-orange-400/80'
          }`}
        >
          <span className="font-russo text-[9px] sm:text-[10px] font-bold text-orange-400 uppercase tracking-wide">
            MAJOR
          </span>
          <span className="font-orbitron text-[7px] sm:text-[8px] text-amber-300">25x</span>
          <span className="font-orbitron font-black text-xs sm:text-sm text-yellow-300 mt-0.5">
            ${majorAmount.toFixed(2)}
          </span>
        </div>

        {/* MINOR */}
        <div
          className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-lg border transition-all ${
            highlightTier === 'MINOR'
              ? 'bg-orange-950/90 border-yellow-300 shadow-[0_0_14px_rgba(251,191,36,1)] animate-pulse'
              : 'bg-black/75 border-orange-600/50 hover:border-orange-400/80'
          }`}
        >
          <span className="font-russo text-[9px] sm:text-[10px] font-bold text-sky-400 uppercase tracking-wide">
            MINOR
          </span>
          <span className="font-orbitron text-[7px] sm:text-[8px] text-sky-300">15x</span>
          <span className="font-orbitron font-black text-xs sm:text-sm text-yellow-300 mt-0.5">
            ${minorAmount.toFixed(2)}
          </span>
        </div>

        {/* MINI */}
        <div
          className={`flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-lg border transition-all ${
            highlightTier === 'MINI'
              ? 'bg-orange-950/90 border-yellow-300 shadow-[0_0_14px_rgba(251,191,36,1)] animate-pulse'
              : 'bg-black/75 border-orange-600/50 hover:border-orange-400/80'
          }`}
        >
          <span className="font-russo text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
            MINI
          </span>
          <span className="font-orbitron text-[7px] sm:text-[8px] text-emerald-300">7.5x</span>
          <span className="font-orbitron font-black text-xs sm:text-sm text-yellow-300 mt-0.5">
            ${miniAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
