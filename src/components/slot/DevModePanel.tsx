import React, { useState } from 'react';
import { ShieldCheck, Sparkles, PlusCircle, Wrench, X, AlertTriangle } from 'lucide-react';

interface DevModePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSimulation: () => void;
  onTestWin: (type: 'SEVENS' | 'WILDS') => void;
  onAddBalance: (amount: number) => void;
  onResetBalance: () => void;
  isSpinning: boolean;
}

export const DevModePanel: React.FC<DevModePanelProps> = ({
  isOpen,
  onClose,
  onOpenSimulation,
  onTestWin,
  onAddBalance,
  onResetBalance,
  isSpinning,
}) => {
  const [activeTab, setActiveTab] = useState<'CONTROLS' | 'INFO'>('CONTROLS');

  if (!isOpen) return null;

  return (
    <div
      id="dev-mode-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#0e1117] border-2 border-amber-500/70 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(245,158,11,0.2)] p-4 sm:p-5 text-stone-200 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Developer Header Banner with Caution Striping */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-400">
              <Wrench size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>DEVELOPER / TEST MODE</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold">
                  NON-PROD ONLY
                </span>
              </h2>
              <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                Auditing & visual animation simulation harness
              </p>
            </div>
          </div>

          <button
            id="close-dev-panel-btn"
            type="button"
            aria-label="Close Dev Mode"
            onClick={onClose}
            className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Badge */}
        <div className="flex items-start gap-2 p-2.5 mb-4 rounded-lg bg-amber-950/40 border border-amber-600/40 text-[11px] text-amber-200/90 font-sans leading-relaxed">
          <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
          <span>
            These controls exist solely for compliance verification and animation testing.
            Outcomes generated in normal play use cryptographically secure independent RNG.
          </span>
        </div>

        {/* 3 Dedicated Developer Controls (As Mandated) */}
        <div className="space-y-3.5">
          {/* Tool 1: RNG TEST */}
          <div className="p-3 rounded-xl bg-[#161b22] border border-stone-700 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase">
                  1. RNG TEST & STATISTICAL AUDIT
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-sans">Monte Carlo 100K spins</span>
            </div>
            <p className="text-[11px] text-stone-400 font-sans leading-normal mb-2.5">
              Inspect theoretical vs empirical RTP (96.4%), hit frequency, symbol frequencies, and payline distributions over massive simulated batches without modifying game code.
            </p>
            <button
              id="dev-rng-test-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenSimulation();
              }}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-950 to-stone-900 hover:from-emerald-900 hover:to-stone-800 border border-emerald-500/70 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <ShieldCheck size={14} />
              <span>LAUNCH RNG VERIFICATION SUITE</span>
            </button>
          </div>

          {/* Tool 2: WIN DEMO */}
          <div className="p-3 rounded-xl bg-[#161b22] border border-stone-700 hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase">
                  2. DEV: WIN DEMO (VISUAL ANIMATION ONLY)
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-sans">FX Preview</span>
            </div>
            <p className="text-[11px] text-stone-400 font-sans leading-normal mb-2.5">
              Simulates visual win animations, 3D particle bursts, and payline sequences for visual inspection. Does not manipulate the real production RNG seed.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="dev-win-demo-sevens"
                type="button"
                disabled={isSpinning}
                onClick={() => {
                  onClose();
                  onTestWin('SEVENS');
                }}
                className="py-1.5 px-2.5 rounded-lg bg-stone-900 hover:bg-amber-950/60 disabled:opacity-40 border border-amber-500/60 text-yellow-300 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚡ DEMO 777 JACKPOT</span>
              </button>
              <button
                id="dev-win-demo-wilds"
                type="button"
                disabled={isSpinning}
                onClick={() => {
                  onClose();
                  onTestWin('WILDS');
                }}
                className="py-1.5 px-2.5 rounded-lg bg-stone-900 hover:bg-amber-950/60 disabled:opacity-40 border border-amber-500/60 text-yellow-300 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚡ DEMO WILDS WIN</span>
              </button>
            </div>
          </div>

          {/* Tool 3: DEV: ADD BALANCE */}
          <div className="p-3 rounded-xl bg-[#161b22] border border-stone-700 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <PlusCircle size={16} className="text-sky-400" />
                <span className="text-xs font-bold text-sky-300 uppercase">
                  3. DEV: ADD BALANCE
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-sans">Virtual test credits</span>
            </div>
            <p className="text-[11px] text-stone-400 font-sans leading-normal mb-2.5">
              Explicitly adjust virtual test credits for prolonged session testing without refreshing the browser.
            </p>
            <div className="flex items-center gap-2">
              <button
                id="dev-add-100-btn"
                type="button"
                onClick={() => onAddBalance(100)}
                className="flex-1 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-sky-500/50 text-sky-300 text-xs font-semibold transition-all cursor-pointer"
              >
                + $100.00
              </button>
              <button
                id="dev-add-500-btn"
                type="button"
                onClick={() => onAddBalance(500)}
                className="flex-1 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-sky-500/50 text-sky-300 text-xs font-semibold transition-all cursor-pointer"
              >
                + $500.00
              </button>
              <button
                id="dev-reset-balance-btn"
                type="button"
                onClick={onResetBalance}
                className="py-1.5 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-600 text-stone-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Reset ($500)
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-stone-800 text-center">
          <span className="text-[10px] text-stone-500 font-sans">
            Set DEV_MODE = false in configuration to disable this panel completely.
          </span>
        </div>
      </div>
    </div>
  );
};
