import React, { useEffect, useState, useRef } from 'react';
import { SlotSymbol } from '../../lib/slot/types';
import { SymbolRenderer } from './SymbolRenderer';
import { REEL_1_STRIP } from '../../lib/slot/symbols';

interface SymbolReelProps {
  reelIndex: number;
  currentSymbols: [SlotSymbol, SlotSymbol, SlotSymbol];
  isSpinning: boolean;
  winningRows: number[]; // row indices (0, 1, 2) that are part of winning paylines
  onStop?: () => void;
}

export const SymbolReel: React.FC<SymbolReelProps> = ({
  reelIndex,
  currentSymbols,
  isSpinning,
  winningRows,
}) => {
  const safeInitial = currentSymbols && currentSymbols.length === 3
    ? currentSymbols
    : (['SEVEN', 'WILD', 'SEVEN'] as [SlotSymbol, SlotSymbol, SlotSymbol]);

  const [displaySymbols, setDisplaySymbols] = useState<[SlotSymbol, SlotSymbol, SlotSymbol]>(safeInitial);
  const [spinningVisual, setSpinningVisual] = useState<boolean>(false);
  const [landingBounce, setLandingBounce] = useState<boolean>(false);
  const wasSpinning = useRef(isSpinning);

  useEffect(() => {
    if (isSpinning) {
      setSpinningVisual(true);
      setLandingBounce(false);
      // Rapidly randomize intermediate symbols for realistic mechanical blur
      const len = REEL_1_STRIP.length;
      const interval = setInterval(() => {
        const r = Math.floor(Math.random() * len);
        const s0 = REEL_1_STRIP[r % len] || 'SEVEN';
        const s1 = REEL_1_STRIP[(r + 1) % len] || 'WILD';
        const s2 = REEL_1_STRIP[(r + 2) % len] || 'SEVEN';
        setDisplaySymbols([s0, s1, s2]);
      }, 50);

      return () => clearInterval(interval);
    } else if (wasSpinning.current && !isSpinning) {
      // Mechanical deceleration stop with overshoot bounce
      const s0 = currentSymbols?.[0] || 'SEVEN';
      const s1 = currentSymbols?.[1] || 'WILD';
      const s2 = currentSymbols?.[2] || 'SEVEN';
      setDisplaySymbols([s0, s1, s2]);
      setSpinningVisual(false);
      setLandingBounce(true);
      const timer = setTimeout(() => {
        setLandingBounce(false);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      const s0 = currentSymbols?.[0] || 'SEVEN';
      const s1 = currentSymbols?.[1] || 'WILD';
      const s2 = currentSymbols?.[2] || 'SEVEN';
      setDisplaySymbols([s0, s1, s2]);
      setSpinningVisual(false);
    }
    wasSpinning.current = isSpinning;
  }, [isSpinning, currentSymbols]);

  const hasAnyWin = Array.isArray(winningRows) && winningRows.length > 0;

  return (
    <div
      id={`symbol-reel-${reelIndex}`}
      className="relative flex-1 h-full overflow-hidden bg-gradient-to-b from-[#dfd7cc] via-[#ffffff] to-[#dfd7cc] border-x border-amber-950/20 shadow-inner"
    >
      {/* 3D Curved Cylindrical Horizon Shadows */}
      <div className="absolute inset-0 pointer-events-none z-20 reel-cylinder-white-shading" />

      {/* Center Payline Tracking Guide (Subtle gold laser watermark) */}
      <div className="absolute top-[33.33%] left-0 right-0 h-[33.33%] pointer-events-none z-10 bg-amber-400/[0.06] border-y border-amber-500/25" />

      {/* Reel Strips Drum Container */}
      <div
        className={`w-full h-full flex flex-col justify-around py-0.5 transition-transform duration-300 ${
          spinningVisual ? 'animate-spin-blur scale-y-105' : ''
        } ${landingBounce ? 'translate-y-2 duration-150 ease-out' : 'translate-y-0 duration-200'}`}
      >
        {[0, 1, 2].map((rowIndex) => {
          const sym: SlotSymbol = isSpinning
            ? (displaySymbols[rowIndex] || 'SEVEN')
            : (currentSymbols?.[rowIndex] || displaySymbols[rowIndex] || 'SEVEN');
          const isWinning = !isSpinning && winningRows.includes(rowIndex);
          const isDimmed = !isSpinning && hasAnyWin && !isWinning;

          return (
            <div
              key={rowIndex}
              id={`reel-${reelIndex}-row-${rowIndex}`}
              className={`relative w-full h-[33.33%] flex items-center justify-center p-1 sm:p-2 transition-all duration-300 border-b border-stone-300/40 last:border-b-0 ${
                isDimmed ? 'opacity-40 grayscale-[25%]' : 'opacity-100'
              }`}
            >
              {/* Winning Row Radiant Gold Backlight */}
              {isWinning && (
                <div className="absolute inset-1 rounded-lg bg-gradient-to-r from-amber-400/25 via-yellow-300/40 to-amber-400/25 border-2 border-yellow-400 shadow-[0_0_25px_rgba(255,215,0,0.9)] animate-pulse z-0" />
              )}

              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <SymbolRenderer symbol={sym} isWinning={isWinning} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
