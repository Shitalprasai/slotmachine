/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlotSymbol, PrizeNumber } from '../../lib/slot/types';
import { CylindricalReelCanvas } from './CylindricalReelCanvas';
import { MultiplierBox } from './MultiplierBox';
import { FlameFlowColumn } from './FlameFlowColumn';
import { MonitorRedFire } from './MonitorRedFire';

interface CurvedReelDisplay3DProps {
  reels: [
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol]
  ];
  spinningReels: [boolean, boolean, boolean];
  winningLines: number[];
  hoveredPayline: number | null;
  winTier?: 'NONE' | 'NORMAL' | 'BIG_WIN' | 'MEGA_WIN' | 'JACKPOT' | null;
  prizeNumber: PrizeNumber;
  prizeSpinning: boolean;
  hasWin: boolean;
  onHoverPayline: (lineId: number | null) => void;
  onAllReelsSettled?: () => void;
}

/**
 * 3D Physical Slot Monitor Assembly.
 * Faithfully matches the user's sketch diagram:
 * - TOP: Horizontal MULTIPLIER bar spanning directly across the top of the monitor
 * - LEFT: FLAME FLOW vertical column with procedural animated fire and payline indicators
 * - CENTER: 3D SLOTS (3x3 cylindrical reels wrapped around physics drums with convex glass and internal fire)
 * - RIGHT: FLAME FLOW vertical column with procedural animated fire and payline indicators
 */
export const CurvedReelDisplay3D: React.FC<CurvedReelDisplay3DProps> = ({
  reels,
  spinningReels,
  winningLines,
  hoveredPayline,
  winTier,
  prizeNumber,
  prizeSpinning,
  hasWin,
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

  return (
    <div
      id="curved-display-3d-housing"
      className={`relative w-full flex-1 min-h-0 flex flex-col p-1 sm:p-2 rounded-2xl bg-gradient-to-b from-[#1c1f26] via-[#101217] to-[#0a0c0f] border-2 transition-all duration-300 shadow-[0_20px_45px_rgba(0,0,0,0.95),inset_0_2px_4px_rgba(255,255,255,0.18)] ${
        hasWin
          ? 'border-yellow-400/90 shadow-[0_0_35px_rgba(255,190,0,0.65),inset_0_0_20px_rgba(255,215,0,0.25)]'
          : 'border-[#6f4e1f]'
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 1. PHYSICAL BRASS BEZEL RIVETS & CORNER BRACKETS */}
      <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-200 to-amber-700 shadow border border-amber-950" />
      <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-200 to-amber-700 shadow border border-amber-950" />
      <div className="absolute bottom-1 left-2 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-200 to-amber-700 shadow border border-amber-950" />
      <div className="absolute bottom-1 right-2 w-2 h-2 rounded-full bg-gradient-to-b from-yellow-200 to-amber-700 shadow border border-amber-950" />

      {/* 
        ========================================================================
        TOP: MULTIPLIER BAR (Directly from User Sketch)
        Positioned horizontally across the top, directly above the 3D slots.
        ========================================================================
      */}
      <div className="w-full mb-1 sm:mb-1.5 shrink-0 z-20">
        <MultiplierBox
          currentPrize={prizeNumber}
          isSpinning={prizeSpinning}
          hasWin={hasWin}
        />
      </div>

      {/* 
        ========================================================================
        MIDDLE ROW: [FLAME FLOW] - [3D SLOTS (3x3)] - [FLAME FLOW]
        Directly matches the user's sketch!
        ========================================================================
      */}
      <div className="relative flex items-stretch w-full flex-1 min-h-0 gap-1 sm:gap-1.5">
        {/* LEFT: FLAME FLOW COLUMN */}
        <FlameFlowColumn
          side="left"
          intensity={hasWin ? 'high' : 'normal'}
          winningLines={winningLines}
          hoveredPayline={hoveredPayline}
          onHoverPayline={onHoverPayline}
        />

        {/* 
          CENTER: 3D SLOTS CYLINDRICAL REEL WINDOW
          Contains the 3x3 reel grid with 60 FPS cylindrical drums,
          internal glowing fire embers, and 3D convex glass reflections.
        */}
        <div
          id="curved-reels-screen-window"
          className={`relative flex-1 h-full min-h-0 overflow-hidden rounded-xl bg-[#040609] border-2 transition-all duration-300 ${
            hasWin
              ? 'border-red-500/90 shadow-[inset_0_0_45px_rgba(239,68,68,0.7),inset_0_12px_30px_rgba(0,0,0,0.99),0_0_35px_rgba(255,50,0,0.6)]'
              : 'border-[#871a1a]/90 shadow-[inset_0_0_35px_rgba(220,38,38,0.5),inset_0_12px_30px_rgba(0,0,0,0.99),0_0_25px_rgba(239,68,68,0.35)]'
          }`}
        >
          {/* Main 60 FPS Cylindrical Reel Canvas */}
          <CylindricalReelCanvas
            reels={safeReels}
            spinningReels={spinningReels}
            winningLines={winningLines}
            hoveredPayline={hoveredPayline}
            winTier={winTier}
            onAllReelsSettled={onAllReelsSettled}
          />

          {/* Constant Glowing Reddish Fire & Rising Hot Embers inside the Monitor */}
          <MonitorRedFire
            hasWin={hasWin}
            isSpinning={spinningReels.some(Boolean)}
          />

          {/* 
            3D CONVEX GLASS DISPLAY EFFECTS:
            - Outward curved specular reflection ribbon
            - Cylindrical lens vignette
            - Top and bottom curved glass bezel rims
          */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            aria-hidden="true"
          >
            {/* 1. Curved Glass Specular Highlight Streak */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent pointer-events-none" />

            {/* 2. Top Curving Hood Cast Shadow */}
            <div className="absolute top-0 left-0 right-0 h-5 sm:h-7 bg-gradient-to-b from-black/85 via-black/35 to-transparent pointer-events-none" />

            {/* 3. Bottom Curving Hood Cast Shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-5 sm:h-7 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

            {/* 4. Top Glass Beveled Lip Refraction */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* 5. Left & Right Curved Drum Edge Shadows */}
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* RIGHT: FLAME FLOW COLUMN */}
        <FlameFlowColumn
          side="right"
          intensity={hasWin ? 'high' : 'normal'}
          winningLines={winningLines}
          hoveredPayline={hoveredPayline}
          onHoverPayline={onHoverPayline}
        />
      </div>
    </div>
  );
};
