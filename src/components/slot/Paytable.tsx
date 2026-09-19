import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { PAYLINES } from '../../lib/slot/paylines';
import { PAYTABLE_RULES } from '../../lib/slot/paytable';
import { SymbolRenderer } from './SymbolRenderer';
import { PRIZE_NUMBERS } from '../../lib/slot/symbols';

interface PaytableProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Paytable: React.FC<PaytableProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="paytable-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#250d05] via-[#120502] to-[#080201] border-[3px] border-amber-400 shadow-[0_0_60px_rgba(255,215,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={22} />
            <h2 className="font-russo text-xl sm:text-2xl text-yellow-100 tracking-wider uppercase gold-3d-text">
              PAYTABLE & GAME RULES
            </h2>
          </div>
          <button
            id="close-paytable-btn"
            type="button"
            aria-label="Close Paytable"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-gradient-to-b from-amber-700 to-amber-950 hover:from-amber-600 hover:to-amber-900 text-yellow-200 transition-all cursor-pointer border border-amber-400/80 shadow active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Section 1: 4-Tier Progressive Jackpots */}
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-b from-[#300f05] via-[#150502] to-black border-2 border-amber-400 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-russo text-sm text-yellow-300 uppercase tracking-wide flex items-center gap-1.5">
              <span>★ 4-TIER PROGRESSIVE JACKPOTS</span>
            </span>
            <span className="font-montserrat text-[10px] text-amber-300/80 font-bold uppercase">
              LAND 3 ON ACTIVE LINE
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 rounded-xl bg-black/60 border border-red-500/60 text-center shadow">
              <span className="block text-[10px] font-russo text-red-400 tracking-wider">GRAND</span>
              <span className="font-orbitron font-black text-sm text-yellow-200">$75,482+</span>
              <span className="block text-[9px] text-stone-400 font-montserrat mt-0.5">3 WILD Symbols</span>
            </div>
            <div className="p-2 rounded-xl bg-black/60 border border-amber-500/60 text-center shadow">
              <span className="block text-[10px] font-russo text-amber-400 tracking-wider">MAJOR</span>
              <span className="font-orbitron font-black text-sm text-yellow-200">$8,931+</span>
              <span className="block text-[9px] text-stone-400 font-montserrat mt-0.5">3 Red 7s</span>
            </div>
            <div className="p-2 rounded-xl bg-black/60 border border-blue-500/60 text-center shadow">
              <span className="block text-[10px] font-russo text-blue-400 tracking-wider">MINOR</span>
              <span className="font-orbitron font-black text-sm text-yellow-200">$954+</span>
              <span className="block text-[9px] text-stone-400 font-montserrat mt-0.5">3 White 7s</span>
            </div>
            <div className="p-2 rounded-xl bg-black/60 border border-emerald-500/60 text-center shadow">
              <span className="block text-[10px] font-russo text-emerald-400 tracking-wider">MINI</span>
              <span className="font-orbitron font-black text-sm text-yellow-200">$142+</span>
              <span className="block text-[9px] text-stone-400 font-montserrat mt-0.5">3 3-BARs</span>
            </div>
          </div>
        </div>

        {/* Section 2: The Multiplier Mechanic */}
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-b from-red-950/60 to-black/80 border-2 border-amber-400/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-russo text-sm text-yellow-300 uppercase tracking-wide">
              ⚡ 4TH REEL PRIZE MULTIPLIER
            </span>
            <span className="font-orbitron text-xs text-amber-300 font-black">
              UP TO 100X
            </span>
          </div>
          <p className="font-montserrat text-xs text-stone-300 leading-relaxed mb-3">
            The dedicated 4th reel spins alongside the 3 symbol reels. When any active payline matches 3 symbols, your base line win is multiplied by the landed prize number!
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRIZE_NUMBERS.map((num) => (
              <span
                key={num}
                className="px-2.5 py-1 rounded-md bg-gradient-to-b from-[#2a1006] to-[#0e0402] border border-amber-400/70 font-russo text-xs font-black text-yellow-300 shadow"
              >
                {num}X
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Symbol Payouts */}
        <h3 className="font-russo text-xs sm:text-sm text-amber-300 uppercase tracking-wider mb-2">
          ★ SYMBOL PAYOUTS (3 MATCHING ON PAYLINE) ★
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {PAYTABLE_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-b from-[#1c0803] to-[#0a0201] border border-amber-500/30 hover:border-amber-400/80 transition-colors shadow"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <SymbolRenderer symbol={rule.symbols[0]} />
                </div>
                <div>
                  <span className="block font-montserrat text-xs font-black text-yellow-100">
                    {rule.name}
                  </span>
                  <span className="text-[10px] text-amber-200/70 font-montserrat">
                    {rule.matchType === 'MIXED_BARS'
                      ? 'Distinct 1-BAR + 2-BAR + 3-BAR'
                      : rule.matchType === 'CHERRY_2'
                      ? 'Cherries on Reels 1 & 2'
                      : rule.matchType === 'CHERRY_1'
                      ? 'Cherry on Center Payline'
                      : rule.matchType === 'MIXED_SEVENS'
                      ? 'Any Mixed Red & White 7s'
                      : '3 on active payline'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-orbitron font-extrabold text-sm text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.6)]">
                  {rule.payoutMultiplier}x
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Section 3: 5 Payline Visuals */}
        <h3 className="font-russo text-xs sm:text-sm text-amber-300 uppercase tracking-wider mb-2">
          ★ THE 5 FIXED PAYLINES ★
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {PAYLINES.map((line) => (
            <div
              key={line.id}
              className="flex flex-col items-center p-2 rounded-xl bg-gradient-to-b from-[#1a0703] to-[#080201] border border-amber-500/30 shadow"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow"
                  style={{ backgroundColor: line.color }}
                />
                <span className="font-russo text-xs text-yellow-100">
                  {line.name}
                </span>
              </div>

              {/* 3x3 Mini Pattern Grid */}
              <div className="grid grid-cols-3 gap-0.5 p-1 bg-black rounded-lg border border-amber-500/40 w-16 h-16 shadow-inner">
                {[0, 1, 2].map((row) =>
                  [0, 1, 2].map((col) => {
                    const isPassed = line.rows[col] === row;
                    return (
                      <div
                        key={`${col}-${row}`}
                        className={`rounded-xs transition-colors ${
                          isPassed
                            ? 'bg-yellow-400 shadow-[0_0_6px_rgba(255,215,0,1)]'
                            : 'bg-stone-900'
                        }`}
                      />
                    );
                  })
                )}
              </div>

              <span className="font-montserrat text-[10px] text-stone-400 text-center mt-1 font-semibold">
                {line.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
