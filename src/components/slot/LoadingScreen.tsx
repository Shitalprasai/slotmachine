/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { preloadAllSymbolSprites } from './SymbolSpriteCache';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Igniting Flaming 50 Engine...');

  useEffect(() => {
    let isMounted = true;

    async function loadAssets() {
      // Step 1: Preload symbol sprites into high-res offscreen canvas cache
      if (isMounted) {
        setProgress(20);
        setStatusText('Forging HD Vector Symbols...');
      }
      preloadAllSymbolSprites();

      // Step 2: Ensure web fonts are rendered
      if (typeof document !== 'undefined' && 'fonts' in document) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore font load errors
        }
      }
      if (isMounted) {
        setProgress(50);
        setStatusText('Tuning 5-Payline Math Matrix...');
      }

      // Step 3: Brief interval to simulate GPU pipeline compilation
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (isMounted) {
        setProgress(80);
        setStatusText('Initializing Fire Shader & Audio...');
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      if (isMounted) {
        setProgress(100);
        setStatusText('Flaming 50 Ready!');
      }

      await new Promise((resolve) => setTimeout(resolve, 250));
      if (isMounted) {
        onComplete();
      }
    }

    loadAssets();

    return () => {
      isMounted = false;
    };
  }, [onComplete]);

  return (
    <div
      id="slot-loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#180602] via-black to-[#120401] text-white select-none px-4"
    >
      {/* Background Subtle Fire Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent pointer-events-none" />

      {/* Center Branding Logo */}
      <div className="relative flex flex-col items-center gap-3 z-10 max-w-sm w-full">
        {/* Blazing Flame Badge */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-yellow-300 via-amber-500 to-red-700 p-[2px] shadow-[0_0_35px_rgba(255,100,0,0.85)] flex items-center justify-center animate-flame-flicker">
          <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-red-950 via-red-800 to-black flex items-center justify-center border border-amber-400">
            <Flame className="text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,1)]" size={40} />
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-yellow-200 animate-spin" size={18} />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center text-center mt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-russo text-2xl sm:text-3xl tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-400 to-orange-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              FLAMING
            </span>
            <span className="font-russo text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-red-500 drop-shadow-[0_0_20px_rgba(255,100,0,0.9)]">
              50
            </span>
          </div>
          <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] text-amber-300 font-bold uppercase mt-1">
            3-REEL • MULTIPLIER • CASINO
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full mt-4 flex flex-col items-center gap-2">
          <div className="w-full h-3 rounded-full bg-black/80 border border-amber-500/70 p-0.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-orange-500 shadow-[0_0_12px_rgba(255,160,0,0.9)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status Text */}
          <div className="flex items-center justify-between w-full px-1 text-[11px] font-montserrat text-amber-300/80">
            <span>{statusText}</span>
            <span className="font-orbitron font-bold text-yellow-300">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
