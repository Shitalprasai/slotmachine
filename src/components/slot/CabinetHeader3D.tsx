/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';

interface CabinetHeader3DProps {
  hasWin?: boolean;
}

/**
 * Authentic 3D Casino Cabinet Topper & Marquee.
 * Inspired directly by physical Las Vegas slot cabinets:
 * - Top Crown: Sloped metallic depth plate with ventilation slots and chasing casino bulbs
 * - Grand Jackpot Banner: High-visibility rolling digital LED meter ($999,899,135)
 * - Main 3D Signage: Embossed golden-orange "FLAMING 50" with animated flames and 50X multiplier badge
 */
export const CabinetHeader3D: React.FC<CabinetHeader3DProps> = ({ hasWin = false }) => {
  // Animated progressive Grand Jackpot counter that slowly ticks up
  const [jackpotAmount, setJackpotAmount] = useState(999899135);

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpotAmount((prev) => prev + Math.floor(Math.random() * 12) + 3);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const formatJackpot = (num: number) => {
    return '$' + num.toLocaleString('en-US');
  };

  return (
    <div
      id="cabinet-top-header-3d"
      className="relative w-full z-20 flex flex-col items-center select-none"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 
        1. TOP CROWN DEPTH ARCH:
        Sloped backward in 3D perspective to establish the top of the physical machine.
      */}
      <div
        className="w-[96%] h-2 sm:h-3 bg-gradient-to-b from-[#0e1015] via-[#1a1d26] to-[#252a36] rounded-t-xl border-t border-x border-amber-600/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-between px-4 sm:px-8"
        style={{
          transform: 'translateZ(-8px) rotateX(22deg)',
          transformOrigin: 'bottom center',
        }}
      >
        {/* Left Crown Bolts */}
        <div className="flex gap-1 sm:gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-stone-700 shadow-inner hidden sm:block" />
        </div>

        {/* Center Chrome Trim Line */}
        <div className="h-[1.5px] w-28 sm:w-48 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

        {/* Right Crown Bolts */}
        <div className="flex gap-1 sm:gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-stone-700 shadow-inner hidden sm:block" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
        </div>
      </div>

      {/* 
        2. MAIN 3D EXTRUDED MARQUEE CASING:
        Multi-layered metallic sign box with Grand Jackpot board and Flaming 50 title.
      */}
      <div
        className={`relative w-full rounded-xl p-1 sm:p-1.5 bg-gradient-to-b from-[#222733] via-[#141720] to-[#0a0c10] border-2 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.95),inset_0_1px_3px_rgba(255,255,255,0.3)] ${
          hasWin
            ? 'border-yellow-400 shadow-[0_0_35px_rgba(255,190,0,0.85),inset_0_0_15px_rgba(255,215,0,0.35)]'
            : 'border-[#8f6629] shadow-[0_10px_25px_rgba(0,0,0,0.9),0_0_20px_rgba(255,100,0,0.25)]'
        }`}
        style={{
          transform: 'translateZ(12px)',
        }}
      >
        {/* Golden Chamfered Inner Chamber */}
        <div className="relative flex flex-col items-center justify-between px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-gradient-to-b from-[#3d0803] via-[#1a0402] to-[#0d0201] border border-amber-500/90 shadow-[inset_0_2px_8px_rgba(0,0,0,0.95),0_0_15px_rgba(255,69,0,0.3)] overflow-hidden">
          {/* Internal Diffused Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,140,0,0.35)_0%,transparent_75%)] pointer-events-none" />

          {/* Golden Corner Hex Studs */}
          <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-b from-yellow-200 to-amber-700 shadow border border-amber-950" />
          <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-b from-yellow-200 to-amber-700 shadow border border-amber-950" />
          <div className="absolute bottom-1 left-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-b from-yellow-200 to-amber-700 shadow border border-amber-950" />
          <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-b from-yellow-200 to-amber-700 shadow border border-amber-950" />

          {/* TOP ROW: GRAND JACKPOT DIGITAL COUNTER (Directly inspired by reference casino topper) */}
          <div className="relative w-full flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 py-0.5 px-2 rounded-md bg-gradient-to-r from-red-950/80 via-black/90 to-red-950/80 border border-amber-500/50 shadow-inner">
            <span className="font-russo text-[8px] sm:text-[10px] uppercase tracking-wider text-amber-300 flex items-center gap-1 shrink-0">
              <Sparkles size={10} className="text-yellow-400 animate-spin-slow" />
              GRAND JACKPOT
            </span>
            <span className="font-orbitron font-black text-[10px] sm:text-xs md:text-sm text-yellow-300 tracking-wider drop-shadow-[0_0_8px_rgba(253,224,71,1)]">
              {formatJackpot(jackpotAmount)}
            </span>
          </div>

          {/* BOTTOM ROW: GAME TITLE & FIERY EMBLEMS */}
          <div className="relative w-full flex items-center justify-between gap-2">
            {/* Left Fiery Shield */}
            <div className="relative w-5 h-5 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-b from-yellow-300 via-orange-500 to-red-800 p-[1px] shadow-[0_0_10px_rgba(255,100,0,0.85)] flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[5px] bg-gradient-to-b from-red-950 via-red-900 to-[#180202] flex items-center justify-center border border-amber-400/90 shadow-inner">
                <Flame
                  className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,1)] animate-flame-flicker"
                  size={14}
                />
              </div>
            </div>

            {/* Center 3D Illuminated FLAMING 50 Signage */}
            <div className="flex flex-col items-center leading-none z-10">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="font-russo text-base sm:text-xl md:text-2xl tracking-[0.14em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fed7aa] to-[#f97316] drop-shadow-[0_2px_0_#7c2d12] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] drop-shadow-[0_0_14px_rgba(255,100,0,0.9)]">
                  FLAMING
                </span>
                <span className="font-russo text-lg sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fef08a] to-[#dc2626] drop-shadow-[0_2px_0_#450a0a] drop-shadow-[0_3px_6px_rgba(0,0,0,0.95)] drop-shadow-[0_0_18px_rgba(239,68,68,1)]">
                  50
                </span>
              </div>

              {/* Sub-header Multiplier Badge */}
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,1)]" />
                <span className="font-cinzel text-[6.5px] sm:text-[8px] tracking-[0.25em] text-amber-200 font-bold uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  50X MULTIPLIER • 5 PAYLINES
                </span>
                <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,1)]" />
              </div>
            </div>

            {/* Right Fiery Shield */}
            <div className="relative w-5 h-5 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-b from-yellow-300 via-orange-500 to-red-800 p-[1px] shadow-[0_0_10px_rgba(255,100,0,0.85)] flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[5px] bg-gradient-to-b from-red-950 via-red-900 to-[#180202] flex items-center justify-center border border-amber-400/90 shadow-inner">
                <Flame
                  className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,1)] animate-flame-flicker"
                  size={14}
                />
              </div>
            </div>
          </div>

          {/* Glass Specular Glare across Marquee Face */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none" />
        </div>

        {/* Ambient Downward Warm Light Cast onto Display Hood */}
        <div className="absolute -bottom-2 left-6 right-6 h-3 bg-gradient-to-b from-amber-500/35 to-transparent blur-sm pointer-events-none" />
      </div>
    </div>
  );
};
