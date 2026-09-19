/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame } from 'lucide-react';

export const SlotHeader: React.FC = () => {
  return (
    <header
      id="slot-game-header"
      className="relative z-10 flex items-center justify-center w-full py-0.5 select-none shrink-0"
    >
      {/* 3D Dimensional Fiery Flaming 50 Marquee */}
      <div className="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-0.5 sm:py-1 rounded-xl bg-gradient-to-b from-[#380e04] via-[#1a0502] to-[#0a0201] border-2 border-orange-500 shadow-[0_4px_16px_rgba(0,0,0,0.9),0_0_20px_rgba(255,69,0,0.45),inset_0_1px_2px_rgba(255,200,100,0.4)]">
        {/* Left Fiery Shield */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-b from-yellow-300 via-orange-500 to-red-700 p-[1px] shadow-[0_0_10px_rgba(255,100,0,0.85)] flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-[5px] bg-gradient-to-b from-red-950 via-red-800 to-red-950 flex items-center justify-center border border-amber-400">
            <Flame className="text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,1)]" size={12} />
          </div>
        </div>

        {/* 3D Flame Red-Orange Typography */}
        <div className="flex flex-col items-center leading-none">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-russo text-base sm:text-lg md:text-xl tracking-[0.16em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#fff7ed] via-[#fb923c] to-[#ea580c] drop-shadow-[0_2px_0_#7c2d12] drop-shadow-[0_0_14px_rgba(255,69,0,0.9)]">
              FLAMING
            </span>
            <span className="font-russo text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fef08a] to-[#dc2626] drop-shadow-[0_2px_0_#450a0a] drop-shadow-[0_0_18px_rgba(239,68,68,1)]">
              50
            </span>
          </div>
          <span className="font-cinzel text-[6px] sm:text-[7px] tracking-[0.3em] text-amber-300 font-black uppercase mt-0.5 drop-shadow">
            BLAZING 3-REEL • MULTIPLIER
          </span>
        </div>

        {/* Right Fiery Shield */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-b from-yellow-300 via-orange-500 to-red-700 p-[1px] shadow-[0_0_10px_rgba(255,100,0,0.85)] flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-[5px] bg-gradient-to-b from-red-950 via-red-800 to-red-950 flex items-center justify-center border border-amber-400">
            <Flame className="text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,1)]" size={12} />
          </div>
        </div>
      </div>
    </header>
  );
};
