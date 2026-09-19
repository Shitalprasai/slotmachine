/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Wrench, Minus, Plus } from 'lucide-react';
import { soundEffects } from '../../lib/slot/soundEffects';

interface ControlDeck3DProps {
  balance: number;
  bet: number;
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
  hasWin?: boolean;
}

/**
 * Authentic 3D Physical Casino Slot Machine Control Deck.
 * Faithfully inspired by physical casino cabinets and the reference design:
 * - Top Tier: Recessed LCD/LED digital meters (TOTAL BET, WIN, BALANCE) with glowing segment displays
 * - Bottom Tier: Heavy 3D tactile pushbuttons with beveled chrome collars, high-gloss pearlescent/white
 *   pill caps, glass specular reflections, and an iconic radiant 3D emerald green HERO SPIN button!
 */
export const ControlDeck3D: React.FC<ControlDeck3DProps> = ({
  balance,
  bet,
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
  hasWin = false,
}) => {
  const [spinPressed, setSpinPressed] = useState(false);

  const handleSoundCycle = () => {
    soundEffects.playButtonClick('default');
    if (onVolumeChange) {
      if (!soundEnabled || volume === 0) {
        onVolumeChange(1.0);
      } else if (volume > 0.7) {
        onVolumeChange(0.5);
      } else if (volume > 0.25) {
        onVolumeChange(0.2);
      } else {
        onVolumeChange(0);
      }
    } else {
      onToggleSound();
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(2) + 'M';
    }
    if (val >= 10000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toFixed(2);
  };

  // Dynamic Marquee Message based on state
  const getCenterMarqueeMessage = () => {
    if (win > 0) {
      if (win >= bet * 20) return `JACKPOT! +$${formatCurrency(win)}`;
      if (win >= bet * 5) return `BIG WIN! +$${formatCurrency(win)}`;
      return `WINNER! +$${formatCurrency(win)}`;
    }
    if (isSpinning) return 'GOOD LUCK!';
    if (autoSpin) return 'AUTO PLAYING';
    return 'BEST OF LUCK!';
  };

  return (
    <div
      id="physical-3d-control-deck"
      className="relative w-full z-20 flex flex-col select-none"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 
        ========================================================================
        1. 3D CONSOLE DECK BODY:
        Matches user sketch "\ 3d slot button /"
        Sloped forward in dramatic 3D perspective with trapezoidal outward flare
        like an authentic physical slot machine table.
        Features dark graphite/titanium brushed surface with polished gold/brass trims.
        ========================================================================
      */}
      <div
        className={`relative w-[102%] -mx-[1%] sm:w-[103.5%] sm:-mx-[1.75%] rounded-b-2xl p-1.5 sm:p-2.5 bg-gradient-to-b from-[#1c202a] via-[#12141c] to-[#08090d] border-t-2 border-x-2 transition-all duration-300 shadow-[0_24px_45px_rgba(0,0,0,0.99),inset_0_2px_4px_rgba(255,255,255,0.18)] ${
          hasWin
            ? 'border-t-yellow-400/90 border-x-[#8a6227]'
            : 'border-t-[#9a6f2d] border-x-[#4f381a]'
        }`}
        style={{
          transform: 'rotateX(20deg) translateZ(14px)',
          transformOrigin: 'top center',
        }}
      >
        {/* Machine Trim Top Bevel Highlight */}
        <div className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

        {/* Perimeter Structural Brass Hex Fasteners */}
        <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-800 shadow" />
        <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-800 shadow" />
        <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-800 shadow" />
        <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-800 shadow" />

        {/* 
          ========================================================================
          TIER 1: RECESSED DIGITAL METERS (TOTAL BET • WIN • BALANCE)
          Styled directly like the reference image: dark inset chamfered boxes
          with neon-accented borders and high-visibility glowing LED segments.
          ========================================================================
        */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 w-full mb-1.5 sm:mb-2">
          {/* TOTAL BET METER */}
          <div
            id="deck-meter-bet"
            className="flex items-center justify-between px-2 sm:px-3 py-1 rounded-lg bg-gradient-to-b from-[#080c14] via-[#04060b] to-[#020306] border border-cyan-800/70 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95),0_1px_2px_rgba(255,255,255,0.08)] overflow-hidden"
          >
            <span className="font-montserrat text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-cyan-300 drop-shadow">
              TOTAL BET
            </span>
            <span className="font-orbitron text-[11px] sm:text-sm md:text-base font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
              ${formatCurrency(bet)}
            </span>
          </div>

          {/* WIN METER */}
          <div
            id="deck-meter-win"
            className={`flex items-center justify-between px-2 sm:px-3 py-1 rounded-lg bg-gradient-to-b from-[#080c14] via-[#04060b] to-[#020306] border transition-all duration-300 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95),0_1px_2px_rgba(255,255,255,0.08)] overflow-hidden ${
              hasWin || win > 0
                ? 'border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.5),inset_0_2px_6px_rgba(0,0,0,0.95)]'
                : 'border-cyan-800/70'
            }`}
          >
            <span className="font-montserrat text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300 drop-shadow">
              WIN
            </span>
            <span
              className={`font-orbitron text-[11px] sm:text-sm md:text-base font-black ${
                win > 0
                  ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,1)] animate-pulse'
                  : 'text-stone-500'
              }`}
            >
              ${formatCurrency(win)}
            </span>
          </div>

          {/* BALANCE METER */}
          <div
            id="deck-meter-balance"
            className="flex items-center justify-between px-2 sm:px-3 py-1 rounded-lg bg-gradient-to-b from-[#080c14] via-[#04060b] to-[#020306] border border-cyan-800/70 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95),0_1px_2px_rgba(255,255,255,0.08)] overflow-hidden"
          >
            <span className="font-montserrat text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-300 drop-shadow">
              BALANCE
            </span>
            <span className="font-orbitron text-[11px] sm:text-sm md:text-base font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]">
              ${formatCurrency(balance)}
            </span>
          </div>
        </div>

        {/* 
          ========================================================================
          TIER 2: TRUE 3D EXTRUDED PUSHBUTTONS & CENTRAL MARQUEE
          Inspired directly by the reference casino image:
          - Every button sits inside a sunken socket bezel
          - Each white button has a 4-5px physical extruded 3D base bevel and gloss dome
          - ( i ) : 3D glossy white pill button
          - ( - ) : 3D glossy white pill button
          - [ MAX BET ] : 3D glossy white button with 2 lines of bold text
          - ( + ) : 3D glossy white pill button
          - [ BEST OF LUCK! ] : Central recessed fluorescent cyan display
          - [ AUTO ] : 3D glossy white pill button
          - [ SPIN ] : Iconic massive 3D green illuminated pill button with 8px extruded base
          ========================================================================
        */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 w-full">
          {/* LEFT GROUP: SERVICE (i, sound, dev) + BET STEPPERS (-, MAX BET, +) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* 3D Glossy White Info / Paytable Button */}
            <div className="p-0.5 rounded-xl bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0b111e] shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
              <button
                id="btn-deck-paytable"
                type="button"
                aria-label="Rules and Paytable"
                onClick={() => {
                  soundEffects.playButtonClick('modal');
                  onOpenPaytable();
                }}
                className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] active:translate-y-1 border-t-2 border-x border-white text-slate-900 shadow-[0_4px_0_#94a3b8,0_6px_0_#475569,0_8px_12px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,1)] active:shadow-[0_1px_0_#475569,0_2px_4px_rgba(0,0,0,0.8)] transition-all cursor-pointer select-none"
              >
                {/* Specular gloss arc */}
                <div className="absolute top-0.5 inset-x-1 h-2 rounded-t-sm bg-gradient-to-b from-white/95 to-transparent pointer-events-none" />
                <span className="font-serif font-black italic text-xs sm:text-sm text-slate-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                  i
                </span>
              </button>
            </div>

            {/* 3D Glossy White Sound Toggle Button */}
            <div className="p-0.5 rounded-xl bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0b111e] shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
              <button
                id="btn-deck-sound"
                type="button"
                aria-label="Sound Settings"
                onClick={handleSoundCycle}
                className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] active:translate-y-1 border-t-2 border-x border-white text-slate-900 shadow-[0_4px_0_#94a3b8,0_6px_0_#475569,0_8px_12px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,1)] active:shadow-[0_1px_0_#475569,0_2px_4px_rgba(0,0,0,0.8)] transition-all cursor-pointer select-none"
              >
                <div className="absolute top-0.5 inset-x-1 h-2 rounded-t-sm bg-gradient-to-b from-white/95 to-transparent pointer-events-none" />
                {!soundEnabled || volume === 0 ? (
                  <VolumeX size={13} className="text-slate-500" />
                ) : (
                  <Volume2 size={13} className="text-slate-800" />
                )}
              </button>
            </div>

            {/* Optional Dev Mode Wrench Button */}
            {devModeEnabled && onOpenDevMode && (
              <div className="p-0.5 rounded-xl bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0b111e] shadow-[0_4px_8px_rgba(0,0,0,0.9)] hidden sm:block">
                <button
                  id="btn-deck-dev"
                  type="button"
                  aria-label="Developer Suite"
                  onClick={() => {
                    soundEffects.playButtonClick('default');
                    onOpenDevMode();
                  }}
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] active:translate-y-1 border-t-2 border-x border-white text-slate-800 shadow-[0_4px_0_#94a3b8,0_6px_0_#475569,0_8px_12px_rgba(0,0,0,0.85)] cursor-pointer"
                >
                  <Wrench size={12} className="text-slate-700" />
                </button>
              </div>
            )}

            {/* 3D BET ADJUSTMENT CLUSTER: (-) [MAX BET] (+) */}
            <div className="flex items-center gap-1 sm:gap-1.5 ml-0.5 p-0.5 rounded-xl bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0b111e] shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
              {/* 3D Glossy White Minus (-) Button */}
              <button
                id="deck-bet-minus-btn"
                type="button"
                aria-label="Decrease Bet"
                disabled={isSpinning || bet <= 0.1}
                onClick={() => onBetChange(-1)}
                className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] active:translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed border-t-2 border-x border-white text-slate-900 shadow-[0_4px_0_#94a3b8,0_6px_0_#475569,0_8px_12px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,1)] active:shadow-[0_1px_0_#475569,0_2px_4px_rgba(0,0,0,0.8)] transition-all cursor-pointer select-none"
              >
                <div className="absolute top-0.5 inset-x-1 h-2 rounded-t-sm bg-gradient-to-b from-white/95 to-transparent pointer-events-none" />
                <Minus size={14} className="text-slate-900 stroke-[3.5]" />
              </button>

              {/* 3D Glossy White MAX BET Button (2-line bold label as in reference) */}
              <button
                id="deck-max-bet-btn"
                type="button"
                aria-label="Bet Maximum Amount"
                disabled={isSpinning || bet >= 100}
                onClick={() => {
                  soundEffects.playButtonClick('max_bet');
                  onMaxBet();
                }}
                className="relative px-2 sm:px-3 h-7 sm:h-8 rounded-lg flex flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] active:translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed border-t-2 border-x border-white text-slate-900 shadow-[0_4px_0_#94a3b8,0_6px_0_#475569,0_8px_12px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,1)] active:shadow-[0_1px_0_#475569,0_2px_4px_rgba(0,0,0,0.8)] transition-all cursor-pointer select-none"
              >
                <div className="absolute top-0.5 inset-x-1 h-2 rounded-t-sm bg-gradient-to-b from-white/95 to-transparent pointer-events-none" />
                <span className="font-russo text-[8px] sm:text-[9px] font-black uppercase leading-none tracking-tight text-slate-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                  MAX
                </span>
                <span className="font-russo text-[8px] sm:text-[9px] font-black uppercase leading-none tracking-tight text-slate-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                  BET
                </span>
              </button>

              {/* 3D Glossy White Plus (+) Button */}
              <button
                id="deck-bet-plus-btn"
                type="button"
                aria-label="Increase Bet"
                disabled={isSpinning || bet >= 100}
                onClick={() => onBetChange(1)}
                className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] active:translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed border-t-2 border-x border-white text-slate-900 shadow-[0_4px_0_#94a3b8,0_6px_0_#475569,0_8px_12px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,1)] active:shadow-[0_1px_0_#475569,0_2px_4px_rgba(0,0,0,0.8)] transition-all cursor-pointer select-none"
              >
                <div className="absolute top-0.5 inset-x-1 h-2 rounded-t-sm bg-gradient-to-b from-white/95 to-transparent pointer-events-none" />
                <Plus size={14} className="text-slate-900 stroke-[3.5]" />
              </button>
            </div>
          </div>

          {/* CENTER DIGITAL STATUS MARQUEE (e.g. BEST OF LUCK!) */}
          <div
            id="deck-marquee-screen"
            className="flex-1 min-w-[70px] sm:min-w-[110px] max-w-[190px] h-7 sm:h-8 mx-1 px-2 rounded-lg bg-gradient-to-b from-[#060a14] to-[#020408] border border-cyan-700/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.98),0_1px_2px_rgba(255,255,255,0.08)] flex items-center justify-center overflow-hidden"
          >
            <span className="font-orbitron font-black text-[9px] sm:text-[11px] uppercase tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.95)] truncate text-center">
              {getCenterMarqueeMessage()}
            </span>
          </div>

          {/* RIGHT GROUP: 3D AUTO SPIN + ICONIC 3D GREEN HERO SPIN BUTTON */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* 3D Glossy White AUTO SPIN Button */}
            <div className="p-0.5 rounded-xl bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0b111e] shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
              <button
                id="deck-auto-spin-btn"
                type="button"
                aria-label={autoSpin ? 'Stop Auto Spin' : 'Start Auto Spin'}
                onClick={() => {
                  soundEffects.playButtonClick('default');
                  onToggleAuto();
                }}
                className={`relative px-2 sm:px-3 h-7 sm:h-8 rounded-lg flex items-center justify-center font-russo text-[9px] sm:text-[11px] font-black uppercase tracking-wider transition-all active:translate-y-1 cursor-pointer select-none border-t-2 border-x ${
                  autoSpin
                    ? 'bg-gradient-to-b from-red-500 via-red-600 to-red-800 border-red-200 text-white shadow-[0_4px_0_#7f1d1d,0_6px_0_#450a0a,0_8px_14px_rgba(239,68,68,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.6)] active:shadow-[0_1px_0_#450a0a,0_2px_4px_rgba(0,0,0,0.8)] animate-pulse'
                    : 'bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border-white text-slate-900 shadow-[0_4px_0_#94a3b8,0_6px_0_#475569,0_8px_12px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,1)] active:shadow-[0_1px_0_#475569,0_2px_4px_rgba(0,0,0,0.8)]'
                }`}
              >
                <div className="absolute top-0.5 inset-x-1 h-2 rounded-t-sm bg-gradient-to-b from-white/95 to-transparent pointer-events-none" />
                <span className="drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                  {autoSpin ? 'STOP' : 'AUTO'}
                </span>
              </button>
            </div>

            {/* 
              THE ICONIC 3D GREEN HERO SPIN BUTTON:
              Directly matches the reference image:
              - Huge radiant emerald & lime green illuminated pill button
              - Raised on an authentic multi-tier 8px 3D extruded base
              - Curved specular gloss sheen across upper contour
              - Pure white bold italic "SPIN" display typography with deep drop shadow
              - Authentic tactile downward compression (plunges 6px) into its socket!
            */}
            <div className="relative p-1 rounded-full bg-gradient-to-b from-[#94a3b8] via-[#475569] to-[#0f172a] border border-[#cbd5e1] shadow-[0_8px_20px_rgba(0,0,0,0.98),inset_0_1px_3px_rgba(255,255,255,0.6)]">
              {/* Recessed Inner Socket Bezel */}
              <div className="p-0.5 rounded-full bg-[#07090e] shadow-[inset_0_4px_8px_rgba(0,0,0,0.98)]">
                <button
                  id="btn-deck-hero-spin"
                  type="button"
                  disabled={isSpinning && !onFastStop}
                  aria-label={isSpinning ? 'Stop Reels' : 'Spin the Reels'}
                  onMouseDown={() => setSpinPressed(true)}
                  onMouseUp={() => setSpinPressed(false)}
                  onMouseLeave={() => setSpinPressed(false)}
                  onTouchStart={() => setSpinPressed(true)}
                  onTouchEnd={() => setSpinPressed(false)}
                  onClick={() => {
                    if (isSpinning) {
                      onFastStop?.();
                    } else if (balance >= bet) {
                      onSpin();
                    }
                  }}
                  className={`relative min-w-[78px] sm:min-w-[105px] md:min-w-[125px] h-8 sm:h-10 md:h-11 px-3 sm:px-5 rounded-full flex items-center justify-center transition-all duration-75 select-none overflow-hidden cursor-pointer ${
                    spinPressed || isSpinning
                      ? 'translate-y-1.5 shadow-[0_1px_0_#14532d,0_2px_0_#052e16,0_4px_8px_rgba(0,0,0,0.95),0_0_15px_rgba(34,197,94,0.4),inset_0_2px_4px_rgba(0,0,0,0.6)]'
                      : 'shadow-[0_6px_0_#15803d,0_8px_0_#14532d,0_10px_0_#052e16,0_14px_22px_rgba(0,0,0,0.95),0_0_28px_rgba(34,197,94,0.7),inset_0_2px_4px_rgba(255,255,255,0.75)]'
                  } ${
                    isSpinning
                      ? 'bg-gradient-to-b from-[#22c55e] via-[#16a34a] to-[#14532d] border border-emerald-300'
                      : balance < bet
                      ? 'bg-stone-800 border border-stone-600 text-stone-500 opacity-50 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-b from-[#86efac] via-[#22c55e] to-[#15803d] hover:from-[#a7f3d0] hover:via-[#22c55e] hover:to-[#16a34a] border-t-2 border-x border-[#bbf7d0]'
                  }`}
                >
                  {/* High Specular Curved Gloss Lens across upper half */}
                  <div className="absolute top-0.5 inset-x-2 h-3 sm:h-3.5 rounded-full bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none" />

                  <span
                    className={`font-russo italic tracking-wider leading-none text-xs sm:text-base md:text-xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                      isSpinning
                        ? 'text-white animate-pulse'
                        : balance < bet
                        ? 'text-stone-500'
                        : 'text-white'
                    }`}
                  >
                    {isSpinning ? 'STOP' : 'SPIN'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        2. THICK EXTRUDED METALLIC BUMPER / HAND REST RAIL:
        The protruding front edge of the slot machine where the player rests their hands.
        Gives authentic physical weight, grounding, and perspective bevel.
      */}
      <div
        className="w-[98%] mx-auto h-2.5 sm:h-3.5 bg-gradient-to-b from-[#333a48] via-[#1c1f28] to-[#0a0c10] rounded-b-xl border-b border-x border-amber-700/80 shadow-[0_12px_24px_rgba(0,0,0,0.98)] flex items-center justify-between px-8"
        style={{
          transform: 'rotateX(-25deg) translateZ(8px)',
          transformOrigin: 'top center',
        }}
      >
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      </div>

      {/* Heavy Ambient Floor Contact Shadow under the Control Deck */}
      <div className="w-[92%] mx-auto h-2.5 bg-black/85 blur-md rounded-full mt-0.5 pointer-events-none" />
    </div>
  );
};
