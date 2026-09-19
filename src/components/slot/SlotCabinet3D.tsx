/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlotSymbol, PrizeNumber } from '../../lib/slot/types';
import { CabinetHeader3D } from './CabinetHeader3D';
import { CurvedReelDisplay3D } from './CurvedReelDisplay3D';
import { ControlDeck3D } from './ControlDeck3D';
import { SideFlames } from './SideFlames';

interface SlotCabinet3DProps {
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
  currentBet: number;
  hasWin: boolean;
  onHoverPayline: (lineId: number | null) => void;
  onAllReelsSettled?: () => void;
  // Control Deck Props
  balance: number;
  win: number;
  isSpinning: boolean;
  autoSpin: boolean;
  soundEnabled: boolean;
  volume?: number;
  onVolumeChange?: (newVolume: number) => void;
  onSpin: () => void;
  onFastStop?: () => void;
  onBetChange: (delta: number) => void;
  onMaxBet: () => void;
  onToggleAuto: () => void;
  onToggleSound: () => void;
  onOpenPaytable: () => void;
  devModeEnabled?: boolean;
  onOpenDevMode?: () => void;
}

/**
 * Authentic 3D Casino Slot Machine Cabinet.
 * Directly inspired by physical Vegas casino cabinets:
 * - Symmetrical, commanding front-perspective chassis with realistic extruded depth
 * - Chasing cabochon jewel casino lights running along outer curved pillars
 * - Neon tubular edge piping (vibrant electric blue & magenta underglow)
 * - Molded gold corner brackets with brass rivets
 * - Recessed 3D reel chamber with outward convex glass and cylindrical drums
 * - Sloped 3D tactile control console with extruded pushbuttons & massive green SPIN hero
 * - 100% responsive for landscape mode with zero reel clipping or distortion
 */
export const SlotCabinet3D: React.FC<SlotCabinet3DProps> = ({
  reels,
  spinningReels,
  winningLines,
  hoveredPayline,
  winTier,
  prizeNumber,
  prizeSpinning,
  currentBet,
  hasWin,
  onHoverPayline,
  onAllReelsSettled,
  balance,
  win,
  isSpinning,
  autoSpin,
  soundEnabled,
  volume = 0.8,
  onVolumeChange,
  onSpin,
  onFastStop,
  onBetChange,
  onMaxBet,
  onToggleAuto,
  onToggleSound,
  onOpenPaytable,
  devModeEnabled = false,
  onOpenDevMode,
}) => {
  return (
    <div
      id="slot-machine-3d-scene"
      className="relative flex items-center justify-center w-full max-w-[min(100%,calc((100dvh-14px)*1.38))] lg:max-w-[min(100%,calc((100dvh-18px)*1.46))] h-full max-h-full my-auto select-none px-1 sm:px-3"
      style={{
        perspective: '1400px',
        perspectiveOrigin: '50% 48%',
      }}
    >
      {/* Ambient Flanking Fire Columns */}
      <SideFlames position="left" intensity={hasWin ? 'high' : 'normal'} />
      <SideFlames position="right" intensity={hasWin ? 'high' : 'normal'} />

      {/* 
        ========================================================================
        THE COMMANDING 3D CASINO CABINET CHASSIS
        Structured with authentic physical depth, beveled outer pillars,
        chasing cabochon casino lights, and rounded shoulders.
        ========================================================================
      */}
      <div
        id="physical-3d-cabinet"
        className="relative flex flex-col items-center justify-between w-full h-full max-h-full transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 1. OUTER NEON CASING GLOW (Cyan/Magenta edge underglow inspired by reference) */}
        <div
          className={`absolute -inset-2 sm:-inset-3 rounded-[28px] pointer-events-none transition-all duration-500 blur-xl ${
            hasWin
              ? 'opacity-90 bg-gradient-to-r from-amber-500/40 via-yellow-400/50 to-red-500/40'
              : 'opacity-50 bg-gradient-to-r from-cyan-600/30 via-indigo-600/20 to-purple-600/30'
          }`}
          aria-hidden="true"
        />

        {/* 
          2. LEFT AND RIGHT CURVED CASINO PILLARS WITH CHASING JEWEL BULBS
          Directly matches authentic casino cabinets with vertical light columns!
        */}
        {/* LEFT PILLAR */}
        <div
          className="absolute -left-3 sm:-left-5 top-8 bottom-12 w-3 sm:w-5 rounded-l-2xl bg-gradient-to-r from-[#0d1017] via-[#1a202c] to-[#2d3748] border-y border-l border-amber-500/60 shadow-[0_10px_25px_rgba(0,0,0,0.95)] flex flex-col justify-around items-center py-4 pointer-events-none z-10"
          style={{
            transform: 'rotateY(30deg)',
            transformOrigin: 'right center',
          }}
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={`left-bulb-${i}`}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-amber-900 transition-all duration-300 ${
                (i + (isSpinning ? 1 : 0)) % 2 === 0
                  ? 'bg-gradient-to-b from-yellow-200 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                  : 'bg-gradient-to-b from-cyan-200 to-cyan-500 shadow-[0_0_6px_rgba(34,211,238,0.7)]'
              }`}
            />
          ))}
        </div>

        {/* RIGHT PILLAR */}
        <div
          className="absolute -right-3 sm:-right-5 top-8 bottom-12 w-3 sm:w-5 rounded-r-2xl bg-gradient-to-l from-[#0d1017] via-[#1a202c] to-[#2d3748] border-y border-r border-amber-500/60 shadow-[0_10px_25px_rgba(0,0,0,0.95)] flex flex-col justify-around items-center py-4 pointer-events-none z-10"
          style={{
            transform: 'rotateY(-30deg)',
            transformOrigin: 'left center',
          }}
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={`right-bulb-${i}`}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-amber-900 transition-all duration-300 ${
                (i + (isSpinning ? 1 : 0)) % 2 === 0
                  ? 'bg-gradient-to-b from-cyan-200 to-cyan-500 shadow-[0_0_6px_rgba(34,211,238,0.7)]'
                  : 'bg-gradient-to-b from-yellow-200 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
              }`}
            />
          ))}
        </div>

        {/* 
          3. COMPONENT A: TOP 3D MARQUEE TOPPER (GRAND JACKPOT + FLAMING 50 SIGN)
        */}
        <div className="w-full shrink-0 mb-1 sm:mb-1.5">
          <CabinetHeader3D hasWin={hasWin} />
        </div>

        {/* 
          4. COMPONENT B: CURVED CYLINDRICAL REEL DISPLAY HOUSING
          Recessed chamber with cylindrical drums, paylines, and multiplier box.
        */}
        <div className="w-full flex-1 min-h-0 flex flex-col my-0.5">
          <CurvedReelDisplay3D
            reels={reels}
            spinningReels={spinningReels}
            winningLines={winningLines}
            hoveredPayline={hoveredPayline}
            winTier={winTier}
            prizeNumber={prizeNumber}
            prizeSpinning={prizeSpinning}
            hasWin={hasWin}
            onHoverPayline={onHoverPayline}
            onAllReelsSettled={onAllReelsSettled}
          />
        </div>

        {/* 
          5. COMPONENT C: 3D SLOPED LOWER CONTROL DECK & TACTILE BUTTONS
          Recessed LED meters, tactile white steppers, and hero emerald green SPIN button!
        */}
        <div className="w-full shrink-0 mt-0.5">
          <ControlDeck3D
            balance={balance}
            bet={currentBet}
            win={win}
            isSpinning={isSpinning}
            autoSpin={autoSpin}
            soundEnabled={soundEnabled}
            volume={volume}
            onVolumeChange={onVolumeChange}
            onSpin={onSpin}
            onFastStop={onFastStop}
            onBetChange={onBetChange}
            onMaxBet={onMaxBet}
            onToggleAuto={onToggleAuto}
            onToggleSound={onToggleSound}
            onOpenPaytable={onOpenPaytable}
            devModeEnabled={devModeEnabled}
            onOpenDevMode={onOpenDevMode}
            hasWin={hasWin}
          />
        </div>
      </div>
    </div>
  );
};
