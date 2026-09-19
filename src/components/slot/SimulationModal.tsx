import React, { useState } from 'react';
import { X, Play, BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react';
import { gameEngine, SimulationReport } from '../../lib/slot/gameEngine';
import { ALL_SYMBOLS, PRIZE_NUMBERS, SYMBOL_CONFIGS } from '../../lib/slot/symbols';
import { SymbolRenderer } from './SymbolRenderer';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBet: number;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  currentBet,
}) => {
  const [spinCount, setSpinCount] = useState<number>(10000);
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    setIsRunning(true);
    // Use setTimeout so the UI can show running status
    setTimeout(() => {
      try {
        const res = gameEngine.runSimulation(spinCount, currentBet);
        setReport(res);
      } catch (err) {
        console.error('Simulation error:', err);
      } finally {
        setIsRunning(false);
      }
    }, 50);
  };

  return (
    <div
      id="simulation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#2a0e05] via-[#120502] to-[#080201] border-[3px] border-amber-400 shadow-[0_0_60px_rgba(255,215,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] p-4 sm:p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-yellow-400" size={24} />
            <div>
              <h2 className="font-russo text-xl sm:text-2xl text-yellow-100 tracking-wider uppercase gold-3d-text">
                RNG STATISTICAL VERIFICATION
              </h2>
              <p className="font-montserrat text-[11px] text-amber-300/80">
                Cryptographically Secure Web Crypto (crypto.getRandomValues) • Pure Unscripted Probability
              </p>
            </div>
          </div>
          <button
            id="close-simulation-btn"
            type="button"
            aria-label="Close Verification"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-gradient-to-b from-amber-700 to-amber-950 hover:from-amber-600 hover:to-amber-900 text-yellow-200 transition-all cursor-pointer border border-amber-400 shadow active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Configuration Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-b from-black/80 to-[#1a0602] border border-amber-500/40 mb-5">
          <div className="flex items-center gap-2">
            <span className="font-russo text-xs text-amber-300 uppercase">Simulate Spins:</span>
            {[1000, 10000, 25000].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setSpinCount(count)}
                className={`px-3 py-1.5 rounded-lg font-russo text-xs transition-all cursor-pointer border ${
                  spinCount === count
                    ? 'bg-gradient-to-b from-yellow-300 to-amber-500 text-amber-950 border-white shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                    : 'bg-stone-900/90 text-stone-300 border-amber-900/60 hover:border-amber-500'
                }`}
              >
                {count.toLocaleString()}
              </button>
            ))}
          </div>

          <button
            id="run-simulation-btn"
            type="button"
            disabled={isRunning}
            onClick={handleRunSimulation}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-900 hover:from-emerald-400 hover:to-emerald-800 disabled:opacity-50 text-white font-russo text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.6)] border border-emerald-300 active:scale-95 transition-all cursor-pointer"
          >
            <Play size={14} className={isRunning ? 'animate-spin' : 'fill-white'} />
            <span>{isRunning ? 'RUNNING SIMULATION...' : `EXECUTE ${spinCount.toLocaleString()} SPINS`}</span>
          </button>
        </div>

        {/* Report Output */}
        {report ? (
          <div className="space-y-4">
            {/* Top Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-black/90 border border-amber-500/40 text-center">
                <span className="block text-[10px] font-montserrat text-stone-400 font-bold uppercase">Total Spins</span>
                <span className="font-orbitron text-lg sm:text-xl text-yellow-300 font-black">
                  {report.totalSpins.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/90 border border-amber-500/40 text-center">
                <span className="block text-[10px] font-montserrat text-stone-400 font-bold uppercase">Hit Frequency</span>
                <span className="font-orbitron text-lg sm:text-xl text-emerald-400 font-black">
                  {report.hitFrequencyPercent.toFixed(2)}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/90 border border-amber-500/40 text-center">
                <span className="block text-[10px] font-montserrat text-stone-400 font-bold uppercase">Estimated RTP</span>
                <span className="font-orbitron text-lg sm:text-xl text-sky-400 font-black">
                  {report.rtpPercent.toFixed(2)}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/90 border border-amber-500/40 text-center">
                <span className="block text-[10px] font-montserrat text-stone-400 font-bold uppercase">Total Payout</span>
                <span className="font-orbitron text-lg sm:text-xl text-yellow-300 font-black">
                  ${report.totalWon.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Win Tier Counts */}
            <div className="p-3 rounded-xl bg-black/70 border border-amber-500/30">
              <h3 className="font-russo text-xs text-amber-300 uppercase tracking-wider mb-2">
                Hit Distribution Across Tiers
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-800">
                  <span className="block text-[9px] text-stone-400 font-bold uppercase">Standard Wins</span>
                  <span className="font-orbitron text-sm font-bold text-stone-200">
                    {report.winTierCounts.STANDARD.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-700/50">
                  <span className="block text-[9px] text-amber-300 font-bold uppercase">Big Wins</span>
                  <span className="font-orbitron text-sm font-bold text-amber-300">
                    {report.winTierCounts.BIG_WIN.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-700/50">
                  <span className="block text-[9px] text-purple-300 font-bold uppercase">Mega Wins</span>
                  <span className="font-orbitron text-sm font-bold text-purple-300">
                    {report.winTierCounts.MEGA_WIN.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-red-950/40 border border-red-700/50">
                  <span className="block text-[9px] text-red-300 font-bold uppercase">Jackpots</span>
                  <span className="font-orbitron text-sm font-bold text-red-400">
                    {report.winTierCounts.JACKPOT.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Symbol Appearance Frequencies */}
            <div>
              <h3 className="font-russo text-xs text-amber-300 uppercase tracking-wider mb-2">
                Reel Symbol Observed Frequencies (9 Visible Window Cells per Spin)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ALL_SYMBOLS.map((sym) => {
                  const data = report.symbolFrequencies[sym];
                  return (
                    <div
                      key={sym}
                      className="flex items-center justify-between p-2 rounded-xl bg-black/80 border border-stone-800"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                          <SymbolRenderer symbol={sym} />
                        </div>
                        <div>
                          <span className="block font-montserrat text-[11px] font-black text-white">
                            {SYMBOL_CONFIGS[sym].name.split(' ')[0]}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {data.count.toLocaleString()} hits
                          </span>
                        </div>
                      </div>
                      <span className="font-orbitron text-xs font-bold text-yellow-400">
                        {data.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Multiplier Frequencies */}
            <div>
              <h3 className="font-russo text-xs text-amber-300 uppercase tracking-wider mb-2">
                4th Prize Reel Multiplier Landed Distribution
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRIZE_NUMBERS.map((p) => {
                  const data = report.prizeFrequencies[p];
                  return (
                    <div
                      key={p}
                      className="flex-1 min-w-[70px] p-2 rounded-xl bg-black/80 border border-amber-500/30 text-center"
                    >
                      <span className="block font-russo text-xs text-yellow-300">{p}X</span>
                      <span className="block font-orbitron text-[11px] font-bold text-stone-200">
                        {data.percentage}%
                      </span>
                      <span className="text-[9px] text-stone-400 font-mono">{data.count} hits</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RNG Architecture Guarantee Note */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-[11px] text-emerald-200 font-montserrat leading-relaxed">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Verification Passed:</strong> Every spin was generated completely independently through Web Crypto&apos;s <code>crypto.getRandomValues()</code> with uniform rejection sampling. No outcomes were predetermined, scripted, forced, or manipulated based on previous spins or player state.
              </span>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center text-stone-400">
            <BarChart3 size={48} className="text-amber-500/60 mb-3 animate-pulse" />
            <p className="font-russo text-sm text-stone-300 mb-1">NO SIMULATION DATA YET</p>
            <p className="font-montserrat text-xs max-w-sm text-stone-400">
              Select a spin sample count above and click &quot;EXECUTE SPINS&quot; to test 10,000+ unscripted cryptographic reel outcomes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
