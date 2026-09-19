/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlotSymbol } from '../../lib/slot/types';
import { CylindricalReelCanvas } from './CylindricalReelCanvas';
import { PaylinePills } from './Paylines';

interface SymbolReelsProps {
  reels: [
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol]
  ];
  spinningReels: [boolean, boolean, boolean];
  winningLines: number[];
  hoveredPayline: number | null;
  winTier?: 'NONE' | 'NORMAL' | 'BIG_WIN' | 'MEGA_WIN' | 'JACKPOT' | null;
  onHoverPayline: (lineId: number | null) => void;
  onAllReelsSettled?: () => void;
}

export const SymbolReels: React.FC<SymbolReelsProps> = ({
  reels,
  spinningReels,
  winningLines,
  hoveredPayline,
  winTier,
  onHoverPayline,
  onAllReelsSettled,
}) => {
  const fallbackReel: [SlotSymbol, SlotSymbol, SlotSymbol] = ['SEVEN', 'WILD', 'SEVEN'];
  const safeReels: [
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol]
  ] = [
    reels?.[0] ?? fallbackReel,
    reels?.[1] ?? fallbackReel,
    reels?.[2] ?? fallbackReel,
  ];

  const hasCenterWin = winningLines.includes(2);

  return (
    <div
      id="symbol-reels-container"
      className="relative flex flex-col items-center h-full flex-1 min-w-0 rounded-xl p-1 bg-gradient-to-b from-[#180502] via-[#0d0201] to-[#120402] border-2 border-orange-500/90 shadow-[0_12px_30px_rgba(0,0,0,0.95),0_0_20px_rgba(255,69,0,0.25),inset_0_1px_2px_rgba(255,200,100,0.3)]"
    >
      {/* Decorative Corner Metallic Rivets */}
      <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-200 to-orange-700 shadow border border-red-950" />
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-200 to-orange-700 shadow border border-red-950" />
      <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-200 to-orange-700 shadow border border-red-950" />
      <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-200 to-orange-700 shadow border border-red-950" />

      {/* Reel Chamber Housing with Left/Right Payline Selectors */}
      <div className="relative flex items-center w-full flex-1 min-h-0">
        {/* Left Payline Marker Pills */}
        <PaylinePills
          position="left"
          activeWinningLines={winningLines}
          hoveredLine={hoveredPayline}
          onHoverLine={onHoverPayline}
        />

        {/* 3D Cylindrical Reels Window */}
        <div
          id="symbol-reels-window"
          className="relative flex-1 h-full overflow-hidden rounded-lg bg-[#060202] border-2 border-orange-500/80 shadow-[inset_0_10px_25px_rgba(0,0,0,0.98),0_0_15px_rgba(0,0,0,0.8)]"
        >
          {/* Main 3D Cylindrical Canvas */}
          <CylindricalReelCanvas
            reels={safeReels}
            spinningReels={spinningReels}
            winningLines={winningLines}
            hoveredPayline={hoveredPayline}
            winTier={winTier}
            onAllReelsSettled={onAllReelsSettled}
          />

          {/* Center Winning Match Payline Overlay Indicator (Matches Reference Photo) */}
          <div
            className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 flex items-center justify-between px-2 ${
              hasCenterWin
                ? 'opacity-100 scale-100'
                : winningLines.length > 0
                ? 'opacity-40'
                : 'opacity-25 hover:opacity-50'
            }`}
          >
            {/* Left Tag */}
            <span className="font-orbitron text-[7px] sm:text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded bg-black/80 border border-emerald-500 text-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]">
              LINE 2
            </span>

            {/* Glowing Center Line with "WINNING MATCH" badge if center line hits */}
            {hasCenterWin && (
              <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 border border-green-200 shadow-[0_0_12px_rgba(34,197,94,1)] animate-bounce">
                <span className="font-russo text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white drop-shadow">
                  WINNING MATCH
                </span>
              </div>
            )}

            {/* Right Tag */}
            <span className="font-orbitron text-[7px] sm:text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded bg-black/80 border border-emerald-500 text-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]">
              LINE 2
            </span>
          </div>
        </div>

        {/* Right Payline Marker Pills */}
        <PaylinePills
          position="right"
          activeWinningLines={winningLines}
          hoveredLine={hoveredPayline}
          onHoverLine={onHoverPayline}
        />
      </div>
    </div>
  );
};
