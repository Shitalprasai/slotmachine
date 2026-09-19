import React, { useEffect, useState } from 'react';

interface JackpotDisplayProps {
  currentTierWon?: 'MINI' | 'MINOR' | 'MAJOR' | 'GRAND';
}

export const JackpotDisplay: React.FC<JackpotDisplayProps> = ({ currentTierWon }) => {
  const [jackpots, setJackpots] = useState({
    grand: 75482.45,
    major: 8931.20,
    minor: 954.80,
    mini: 142.60,
  });

  // Slowly increment progressives in real time to keep the machine alive
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpots((prev) => ({
        grand: prev.grand + 0.08,
        major: prev.major + 0.04,
        minor: prev.minor + 0.02,
        mini: prev.mini + 0.01,
      }));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const meters = [
    {
      id: 'GRAND',
      name: 'GRAND',
      val: jackpots.grand,
      border: 'border-yellow-400/90',
      badgeBg: 'bg-gradient-to-r from-red-900 via-red-600 to-red-900',
      glow: 'shadow-[0_0_18px_rgba(239,68,68,0.55)]',
      textColor: 'text-amber-200 drop-shadow-[0_0_10px_rgba(253,224,71,0.9)]',
      ledColor: 'bg-yellow-300 shadow-[0_0_8px_#fde047]',
    },
    {
      id: 'MAJOR',
      name: 'MAJOR',
      val: jackpots.major,
      border: 'border-amber-400/80',
      badgeBg: 'bg-gradient-to-r from-amber-800 via-amber-500 to-amber-800',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.45)]',
      textColor: 'text-yellow-100 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]',
      ledColor: 'bg-amber-300 shadow-[0_0_8px_#fcd34d]',
    },
    {
      id: 'MINOR',
      name: 'MINOR',
      val: jackpots.minor,
      border: 'border-amber-500/70',
      badgeBg: 'bg-gradient-to-r from-blue-950 via-blue-700 to-blue-950',
      glow: 'shadow-[0_0_12px_rgba(59,130,246,0.35)]',
      textColor: 'text-sky-100 drop-shadow-[0_0_6px_rgba(96,165,250,0.7)]',
      ledColor: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
    },
    {
      id: 'MINI',
      name: 'MINI',
      val: jackpots.mini,
      border: 'border-amber-500/60',
      badgeBg: 'bg-gradient-to-r from-emerald-950 via-emerald-700 to-emerald-950',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.35)]',
      textColor: 'text-emerald-100 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]',
      ledColor: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    },
  ];

  return (
    <div
      id="jackpot-meters-container"
      className="grid grid-cols-4 gap-1 sm:gap-1.5 md:gap-2 w-full select-none"
    >
      {meters.map((m) => {
        const isTriggered = currentTierWon === m.id;

        return (
          <div
            key={m.id}
            id={`jackpot-box-${m.id.toLowerCase()}`}
            className={`relative flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-lg bg-gradient-to-b from-[#260c04] via-[#100402] to-[#080201] border sm:border-2 ${
              m.border
            } ${m.glow} shadow-[0_4px_12px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.25)] transition-all ${
              isTriggered ? 'animate-bounce ring-2 ring-yellow-400 brightness-125 z-10' : ''
            }`}
          >
            {/* Top Badge Label */}
            <div
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full ${m.badgeBg} border border-amber-300/50 shadow mb-0.5 relative overflow-hidden`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${m.ledColor} animate-pulse shrink-0`} />
              <span className="font-russo text-[8px] sm:text-[10px] tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap">
                {m.name}
              </span>
            </div>

            {/* Inset LED Readout */}
            <div className="w-full py-0.5 px-1 rounded bg-black/95 border border-amber-500/30 text-center shadow-inner relative overflow-hidden flex items-center justify-center">
              <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/10 pointer-events-none" />
              <span
                className={`font-orbitron font-extrabold text-[9px] xs:text-[10px] sm:text-xs md:text-sm tracking-tight truncate max-w-full ${m.textColor}`}
              >
                {formatCurrency(m.val)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

