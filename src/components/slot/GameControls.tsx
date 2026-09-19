/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, Volume1, VolumeX, HelpCircle, RotateCcw, Zap, Wrench } from 'lucide-react';

interface GameControlsProps {
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
}

export const GameControls: React.FC<GameControlsProps> = ({
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
}) => {
  const handleSoundCycle = () => {
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

  const formatBalanceK = (val: number) => {
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toFixed(2);
  };

  return (
    <div
      id="casino-control-panel"
      className="relative w-full rounded-xl p-1.5 sm:p-2 bg-gradient-to-b from-[#200602] via-[#0d0201] to-[#050101] border-2 border-orange-500/90 shadow-[0_8px_24px_rgba(0,0,0,0.95),0_0_20px_rgba(255,69,0,0.25),inset_0_1px_2px_rgba(255,200,100,0.3)] select-none shrink-0"
    >
      {/* 
        =======================================================================
        LANDSCAPE BOTTOM CONTROL BAR (Matches reference photo)
        GOOD LUCK • BALANCE PILL • TOTAL BET (-/+) • MAX BET • WIN • SPIN • AUTO • AUTO SPIN
        =======================================================================
      */}
      <div className="hidden landscape:flex sm:flex items-center justify-between gap-1 sm:gap-2 w-full">
        {/* Left Section: Utilities + GOOD LUCK + BALANCE Pill */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Paytable & Sound Toggles */}
          <div className="flex items-center gap-1">
            <button
              id="paytable-btn"
              type="button"
              aria-label="View Paytable and Rules"
              onClick={onOpenPaytable}
              className="flex items-center gap-1 px-1.5 py-1 rounded-md bg-[#250803] hover:bg-[#380e05] border border-orange-500/60 text-amber-200 font-montserrat text-[9px] font-bold transition-all cursor-pointer active:scale-95 shadow"
            >
              <HelpCircle size={12} className="text-yellow-400" />
              <span className="hidden xl:inline">PAYTABLE</span>
            </button>

            <button
              id="sound-toggle-btn"
              type="button"
              aria-label="Sound Toggle"
              onClick={handleSoundCycle}
              className="p-1 rounded-md bg-[#250803] hover:bg-[#380e05] border border-orange-500/60 text-amber-200 transition-all cursor-pointer active:scale-95 shadow"
            >
              {!soundEnabled || volume === 0 ? (
                <VolumeX size={12} className="text-stone-500" />
              ) : (
                <Volume2 size={12} className="text-amber-400" />
              )}
            </button>

            {devModeEnabled && onOpenDevMode && (
              <button
                type="button"
                aria-label="Dev Mode"
                onClick={onOpenDevMode}
                className="p-1 rounded bg-[#161b22] border border-amber-500/40 text-amber-400 text-[9px]"
              >
                <Wrench size={11} />
              </button>
            )}
          </div>

          {/* Status Text (visible on wider displays) */}
          <span className="hidden lg:inline font-russo text-[9px] sm:text-[11px] font-black tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] uppercase">
            {win > 0 ? 'WINNER!' : 'GOOD LUCK'}
          </span>

          {/* Glowing Green/Emerald Balance Pill */}
          <div
            id="balance-meter"
            className="flex items-center justify-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 border border-green-300 shadow-[0_0_12px_rgba(34,197,94,0.7),inset_0_1px_2px_rgba(255,255,255,0.6)] cursor-default shrink-0"
          >
            <span className="font-orbitron font-black text-xs sm:text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-none">
              ${formatBalanceK(balance)}
            </span>
          </div>
        </div>

        {/* Center Section: TOTAL BET with Steppers, MAX BET & WIN */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-center min-w-0">
          {/* TOTAL BET with Minus/Plus Controls */}
          <div
            id="bet-meter"
            className="flex items-center gap-1 py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-lg bg-black/80 border border-orange-500/60 shrink-0"
          >
            <span className="hidden md:inline font-montserrat text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-orange-300 shrink-0">
              BET
            </span>

            <button
              id="bet-minus-btn"
              type="button"
              aria-label="Decrease Bet"
              disabled={isSpinning || bet <= 0.5}
              onClick={() => onBetChange(-1)}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-b from-stone-700 to-stone-900 hover:from-stone-600 hover:to-stone-800 disabled:opacity-30 border border-stone-500 text-white font-black text-xs flex items-center justify-center active:scale-90 shadow cursor-pointer"
            >
              -
            </button>

            <span className="font-orbitron font-black text-xs sm:text-sm text-yellow-300 min-w-[32px] sm:min-w-[36px] text-center drop-shadow-[0_0_6px_rgba(253,224,71,0.6)]">
              {bet.toFixed(2)}
            </span>

            <button
              id="bet-plus-btn"
              type="button"
              aria-label="Increase Bet"
              disabled={isSpinning || bet >= 100}
              onClick={() => onBetChange(1)}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-gradient-to-b from-stone-700 to-stone-900 hover:from-stone-600 hover:to-stone-800 disabled:opacity-30 border border-stone-500 text-white font-black text-xs flex items-center justify-center active:scale-90 shadow cursor-pointer"
            >
              +
            </button>
          </div>

          {/* MAX BET BUTTON */}
          <button
            id="max-bet-btn"
            type="button"
            aria-label="Bet Maximum Amount"
            disabled={isSpinning || bet >= 100}
            onClick={onMaxBet}
            className="flex flex-col items-center justify-center h-8 sm:h-9 px-1.5 sm:px-2 rounded-lg bg-gradient-to-b from-orange-600 via-orange-700 to-red-900 hover:from-orange-500 hover:to-red-800 disabled:opacity-30 border border-orange-400 shadow text-white transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <span className="font-russo text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none">
              MAX BET
            </span>
          </button>

          {/* WIN METER */}
          <div
            id="win-meter"
            className="flex items-center gap-1 py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-lg bg-black/80 border border-orange-500/60 min-w-[65px] sm:min-w-[75px] justify-center shrink-0"
          >
            <span className="font-montserrat text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-orange-300">
              WIN
            </span>
            <span
              className={`font-orbitron font-black text-xs sm:text-sm leading-tight ${
                win > 0
                  ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(255,215,0,1)]'
                  : 'text-stone-500'
              }`}
            >
              ${win.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right Section: Hero SPIN button + Single AUTO SPIN button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* HERO SPIN BUTTON (Disabled while spinning: machine stops automatically) */}
          <button
            id="spin-button"
            type="button"
            disabled={isSpinning || balance < bet}
            aria-label={isSpinning ? 'Spinning automatically...' : 'Spin the Reels'}
            onClick={() => {
              if (!isSpinning && balance >= bet) {
                onSpin();
              }
            }}
            style={{ touchAction: 'manipulation' }}
            className={`relative min-w-[90px] sm:min-w-[110px] md:min-w-[130px] h-9 sm:h-10 md:h-11 px-3 sm:px-5 rounded-lg flex items-center justify-center transition-all select-none overflow-hidden border-2 shrink-0 ${
              isSpinning
                ? 'bg-gradient-to-b from-[#1c0808] via-[#100303] to-[#080202] border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.35)] cursor-not-allowed opacity-90'
                : balance < bet
                ? 'bg-stone-900 border-stone-700 text-stone-600 opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-b from-[#141814] via-[#0b0e0b] to-[#040604] hover:from-[#1b221b] border-green-500/90 shadow-[0_0_18px_rgba(34,197,94,0.6)] cursor-pointer active:scale-95'
            }`}
          >
            <span
              className={`font-russo text-base sm:text-lg font-black tracking-widest leading-none ${
                isSpinning
                  ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse'
                  : balance < bet
                  ? 'text-stone-500'
                  : 'text-[#22c55e] drop-shadow-[0_0_12px_rgba(34,197,94,1)]'
              }`}
            >
              {isSpinning ? 'SPINNING' : 'SPIN'}
            </span>
          </button>

          {/* SINGLE AUTO SPIN BUTTON */}
          <button
            id="auto-spin-btn"
            type="button"
            aria-label={autoSpin ? 'Stop Auto Spin' : 'Start Auto Spin'}
            onClick={onToggleAuto}
            className={`h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg border font-russo text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow flex items-center justify-center shrink-0 ${
              autoSpin
                ? 'bg-red-600 hover:bg-red-500 border-red-300 text-white shadow-[0_0_14px_rgba(239,68,68,0.8)] animate-pulse'
                : 'bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 hover:from-white hover:to-stone-300 border-stone-300 text-stone-900 shadow-md'
            }`}
          >
            <span>{autoSpin ? 'STOP AUTO' : 'AUTO SPIN'}</span>
          </button>
        </div>
      </div>

      {/* 
        =======================================================================
        PORTRAIT FALLBACK (Mobile portrait only)
        Organized neatly into 2 accessible rows
        =======================================================================
      */}
      <div className="flex landscape:hidden sm:hidden flex-col gap-1 w-full">
        <div className="flex items-center justify-between gap-1 w-full">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenPaytable}
              className="p-1 rounded bg-[#250803] border border-orange-500/60 text-amber-200 text-[9px]"
            >
              <HelpCircle size={12} />
            </button>
            <button
              type="button"
              onClick={handleSoundCycle}
              className="p-1 rounded bg-[#250803] border border-orange-500/60 text-amber-200 text-[9px]"
            >
              {!soundEnabled || volume === 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 border border-green-300 text-white font-orbitron font-black text-xs">
            ${formatBalanceK(balance)}
          </div>

          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/90 border border-orange-500/60">
            <span className="text-[8px] font-montserrat font-bold text-orange-300">BET</span>
            <button
              type="button"
              disabled={isSpinning || bet <= 0.5}
              onClick={() => onBetChange(-1)}
              className="w-4 h-4 rounded bg-stone-700 text-white text-[10px] font-bold"
            >
              -
            </button>
            <span className="font-orbitron font-black text-xs text-yellow-300">{bet.toFixed(2)}</span>
            <button
              type="button"
              disabled={isSpinning || bet >= 100}
              onClick={() => onBetChange(1)}
              className="w-4 h-4 rounded bg-stone-700 text-white text-[10px] font-bold"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/90 border border-orange-500/60">
            <span className="text-[8px] font-montserrat font-bold text-orange-300">WIN</span>
            <span className="font-orbitron font-black text-xs text-yellow-300">${win.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 w-full">
          <button
            type="button"
            disabled={isSpinning || bet >= 100}
            onClick={onMaxBet}
            className="h-9 px-2 rounded bg-orange-700 border border-orange-400 text-white text-[9px] font-russo shrink-0"
          >
            MAX
          </button>
          <button
            type="button"
            aria-label={autoSpin ? 'Stop Auto Spin' : 'Start Auto Spin'}
            onClick={onToggleAuto}
            className={`h-9 px-2.5 rounded border text-[9px] font-russo font-bold uppercase shrink-0 transition-all ${
              autoSpin
                ? 'bg-red-600 border-red-300 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                : 'bg-stone-300 hover:bg-white text-stone-900 border-stone-400 shadow'
            }`}
          >
            {autoSpin ? 'STOP AUTO' : 'AUTO SPIN'}
          </button>
          <button
            type="button"
            disabled={isSpinning || balance < bet}
            aria-label={isSpinning ? 'Spinning automatically...' : 'Spin the Reels'}
            onClick={() => {
              if (!isSpinning && balance >= bet) {
                onSpin();
              }
            }}
            className={`flex-1 h-9 rounded border-2 font-russo text-sm font-black tracking-widest flex items-center justify-center transition-all ${
              isSpinning
                ? 'bg-[#1c0808] border-amber-500/70 text-amber-400 opacity-90 cursor-not-allowed shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : balance < bet
                ? 'bg-stone-900 border-stone-700 text-stone-600 opacity-50 cursor-not-allowed'
                : 'bg-[#101410] border-green-500 text-[#22c55e] active:scale-95 shadow-[0_0_12px_rgba(34,197,94,0.5)]'
            }`}
          >
            {isSpinning ? 'SPINNING' : 'SPIN'}
          </button>
        </div>
      </div>
    </div>
  );
};
