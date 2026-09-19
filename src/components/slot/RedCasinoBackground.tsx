/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import redCasinoImage from '../../assets/images/red_casino_bg_1789727751647.jpg';

interface RedCasinoBackgroundProps {
  isSpinning?: boolean;
  winTier?: 'NONE' | 'NORMAL' | 'BIG_WIN' | 'MEGA_WIN' | 'JACKPOT' | null;
  className?: string;
}

const RED_CASINO_URL = redCasinoImage || '/assets/background/red_casino.jpg';

/**
 * RedCasinoBackground (Red-Themed Casino Background):
 *
 * Clean, high-end luxury red casino environment:
 * - Rich crimson & ruby-red luxury casino interior with subtle velvet damask pattern
 * - Warm golden brass wall sconces and soft ambient casino lighting
 * - Clean empty VIP lounge setting (no people, no crowds, no tables or props)
 * - Warm floor reflections and subtle atmospheric casino glow
 * - Dynamic lighting pulse on spin and big win celebrations
 * - 100% pointer-events-none and GPU-accelerated
 */
export const RedCasinoBackground: React.FC<RedCasinoBackgroundProps> = ({
  isSpinning = false,
  winTier = null,
  className = '',
}) => {
  const [imgLoaded, setImgLoaded] = useState(true);
  const isJackpot = winTier === 'JACKPOT';
  const isBigWin = winTier === 'MEGA_WIN' || winTier === 'BIG_WIN';

  return (
    <div
      id="red-casino-environment"
      aria-hidden="true"
      className={`fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 bg-[#32040a] ${className}`}
    >
      <style>{`
        @keyframes redAmbientBreathe {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 0.92;
            transform: scale(1.02);
          }
        }

        @keyframes sconceGlow {
          0%, 100% {
            opacity: 0.55;
          }
          50% {
            opacity: 0.85;
          }
        }

        .red-ambient-pulse {
          animation: redAmbientBreathe 5s ease-in-out infinite;
        }

        .sconce-warmth {
          animation: sconceGlow 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Deep Crimson Velvet Foundation Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a0610] via-[#2d0309] to-[#150104]" />

      {/* 2. High-End Red-Themed Casino Interior (No people, no props, pure red luxury casino room) */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={RED_CASINO_URL}
          alt="Luxury Red Casino"
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/background/red_casino.jpg';
          }}
          className={`w-full h-full object-cover object-center transition-all duration-700 filter ${
            imgLoaded ? 'opacity-95' : 'opacity-70'
          } ${
            isJackpot
              ? 'brightness-110 saturate-130'
              : isBigWin
              ? 'brightness-105 saturate-120'
              : isSpinning
              ? 'brightness-100 saturate-110'
              : 'brightness-95 saturate-105'
          }`}
        />
      </div>

      {/* 3. Rich Red Casino Velvet Atmosphere Tint */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-700 mix-blend-color ${
          isJackpot
            ? 'bg-[#850e1b]/30'
            : isBigWin
            ? 'bg-[#6d0915]/25'
            : 'bg-[#550610]/20'
        }`}
      />

      {/* 4. Warm Golden Sconce Ambient Glow on Red Walls */}
      <div className="absolute top-0 inset-x-0 h-44 sm:h-60 bg-gradient-to-b from-amber-500/18 via-red-600/8 to-transparent sconce-warmth pointer-events-none" />

      {/* 5. Rich Red Casino Floor Ambient Glow */}
      <div
        className={`absolute bottom-0 inset-x-0 h-1/2 red-ambient-pulse pointer-events-none transition-opacity duration-700 ${
          isJackpot
            ? 'bg-radial from-amber-500/25 via-red-600/20 to-transparent'
            : isBigWin
            ? 'bg-radial from-amber-600/20 via-red-700/15 to-transparent'
            : isSpinning
            ? 'bg-radial from-red-600/15 via-red-900/10 to-transparent'
            : 'bg-radial from-red-800/10 via-transparent to-transparent'
        }`}
      />

      {/* 6. Subtle Casino Lounge Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 92% 88% at 50% 50%, transparent 50%, rgba(35, 3, 7, 0.4) 75%, rgba(15, 1, 3, 0.75) 100%)',
        }}
      />
    </div>
  );
};
