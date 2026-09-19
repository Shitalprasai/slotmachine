import React, { useId } from 'react';
import { SlotSymbol } from '../../lib/slot/types';

interface SymbolRendererProps {
  symbol: SlotSymbol;
  isWinning?: boolean;
  isDimmed?: boolean;
  className?: string;
}

export const SymbolRenderer: React.FC<SymbolRendererProps> = ({
  symbol,
  isWinning = false,
  isDimmed = false,
  className = 'w-full h-full',
}) => {
  const uid = useId().replace(/:/g, '');

  return (
    <div
      className={`relative flex items-center justify-center select-none transition-all duration-300 ${className} ${
        isWinning ? 'scale-105 z-20' : isDimmed ? 'opacity-35 filter grayscale-[30%] scale-[0.97]' : 'hover:scale-[1.02]'
      }`}
    >
      {/* Dynamic Winning Symbol Fire Aura and Radiant Highlight */}
      {isWinning && (
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
          {/* Pulsing Fiery Gold Aura */}
          <div className="absolute w-[95%] h-[95%] rounded-xl bg-gradient-to-r from-amber-500/40 via-yellow-300/50 to-amber-500/40 blur-md animate-pulse" />
          {/* Radiant Gold Ring with Inset Glow */}
          <div className="absolute w-[92%] h-[92%] rounded-lg border-2 border-yellow-300 shadow-[0_0_20px_rgba(255,215,0,0.95),inset_0_0_12px_rgba(255,215,0,0.7)]" />
          {/* Subtle Corner Sparkles */}
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] animate-ping" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_8px_#fde047] animate-ping [animation-delay:0.5s]" />
        </div>
      )}

      {/* ========================================================
          1. FLAGSHIP SPECIAL: GOLDEN 50 LOGO SYMBOL (GOLDEN_50)
      ======================================================== */}
      {symbol === 'GOLDEN_50' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[96%] h-[96%] drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-g50Gold`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="18%" stopColor="#fff275" />
              <stop offset="42%" stopColor="#ffd700" />
              <stop offset="70%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id={`${uid}-g50Ruby`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="35%" stopColor="#b91c1c" />
              <stop offset="75%" stopColor="#7f1d1d" />
              <stop offset="100%" stopColor="#2c0606" />
            </linearGradient>
            <linearGradient id={`${uid}-g50FireText`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>

          {/* 3D Shield Backing Shadow */}
          <polygon
            points="50,6 94,26 84,78 50,96 16,78 6,26"
            fill="#180402"
            opacity="0.9"
          />

          {/* Outer Heavy 24K Gold Beveled Shield Rim */}
          <polygon
            points="50,4 92,24 82,76 50,94 18,76 8,24"
            fill={`url(#${uid}-g50Gold)`}
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Recessed Lacquered Crimson Core */}
          <polygon
            points="50,11 84,28 76,71 50,87 24,71 16,28"
            fill={`url(#${uid}-g50Ruby)`}
            stroke="#fbbf24"
            strokeWidth="1.5"
          />

          {/* Radiant Sunburst Flares inside Shield */}
          <g stroke="rgba(255,215,0,0.45)" strokeWidth="1.2">
            <line x1="50" y1="50" x2="50" y2="15" />
            <line x1="50" y1="50" x2="78" y2="30" />
            <line x1="50" y1="50" x2="72" y2="70" />
            <line x1="50" y1="50" x2="28" y2="70" />
            <line x1="50" y1="50" x2="22" y2="30" />
          </g>

          {/* Arc Laurels */}
          <path
            d="M26 42 Q23 60 36 72"
            fill="none"
            stroke={`url(#${uid}-g50Gold)`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M74 42 Q77 60 64 72"
            fill="none"
            stroke={`url(#${uid}-g50Gold)`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Mini Gold Imperial Crown on Top */}
          <polygon
            points="42,27 45,18 50,22 55,18 58,27"
            fill={`url(#${uid}-g50Gold)`}
            stroke="#5f2905"
            strokeWidth="0.8"
          />
          <circle cx="50" cy="17" r="1.5" fill="#fef08a" />

          {/* "GOLDEN" Curved Arc Banner Plaque */}
          <rect
            x="18"
            y="28"
            width="64"
            height="18"
            rx="4"
            fill="#170603"
            stroke={`url(#${uid}-g50Gold)`}
            strokeWidth="1.8"
          />
          <text
            x="50"
            y="41.5"
            textAnchor="middle"
            fontFamily="'Russo One', sans-serif"
            fontWeight="900"
            fontSize="11"
            letterSpacing="2.5"
            fill="#fffde7"
            stroke="#451a03"
            strokeWidth="0.8"
          >
            GOLDEN
          </text>

          {/* Massive 3D Beveled "50" */}
          <text
            x="50"
            y="76"
            textAnchor="middle"
            fontFamily="'Russo One', sans-serif"
            fontWeight="900"
            fontSize="34"
            letterSpacing="1"
            fill={`url(#${uid}-g50FireText)`}
            stroke="#2e0505"
            strokeWidth="2"
          >
            50
          </text>

          {/* Specular Star Glint */}
          <polygon
            points="50,47 52,53 58,55 52,57 50,63 48,57 42,55 48,53"
            fill="#ffffff"
            opacity="0.9"
          />
        </svg>
      )}

      {/* ========================================================
          2. IMPERIAL GOLDEN CROWN (CROWN)
      ======================================================== */}
      {symbol === 'CROWN' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[92%] h-[92%] drop-shadow-[0_8px_14px_rgba(0,0,0,0.85)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-crownGold`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#fff59d" />
              <stop offset="45%" stopColor="#ffd700" />
              <stop offset="75%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id={`${uid}-velvetCap`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
          </defs>

          {/* Crimson Velvet Inner Cap */}
          <path
            d="M26 62 Q50 32 74 62 Z"
            fill={`url(#${uid}-velvetCap)`}
            stroke="#7f1d1d"
            strokeWidth="1.5"
          />

          {/* Crown Base Band */}
          <rect
            x="14"
            y="66"
            width="72"
            height="14"
            rx="4"
            fill={`url(#${uid}-crownGold)`}
            stroke="#5f2905"
            strokeWidth="2.2"
          />

          {/* Gems on Base Band */}
          <ellipse cx="24" cy="73" rx="4" ry="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          <ellipse cx="37" cy="73" rx="3.5" ry="3.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          <ellipse cx="50" cy="73" rx="4.5" ry="4" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
          <ellipse cx="63" cy="73" rx="3.5" ry="3.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          <ellipse cx="76" cy="73" rx="4" ry="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />

          {/* Crown Spikes / Arches */}
          <path
            d="M16 66 L22 36 L36 52 L50 24 L64 52 L78 36 L84 66 Z"
            fill={`url(#${uid}-crownGold)`}
            stroke="#5f2905"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Pearl / Gem Finials on Spikes */}
          <circle cx="22" cy="35" r="4" fill="#fef08a" stroke="#78350f" strokeWidth="1.2" />
          <circle cx="50" cy="22" r="5.5" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="78" cy="35" r="4" fill="#fef08a" stroke="#78350f" strokeWidth="1.2" />

          {/* Imperial Cross Finial on Center Peak */}
          <path
            d="M50 12 V22 M46 16 H54"
            stroke="#ffd700"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Center Faceted Diamond on Main Peak */}
          <polygon
            points="50,38 56,47 50,56 44,47"
            fill="#e0f2fe"
            stroke="#0284c7"
            strokeWidth="1.2"
          />

          {/* Specular Star Glint */}
          <polygon
            points="50,22 51.5,25 55,26 51.5,27 50,30 48.5,27 45,26 48.5,25"
            fill="#ffffff"
          />
        </svg>
      )}

      {/* ========================================================
          3. BRILLIANT CUT DIAMOND (DIAMOND)
      ======================================================== */}
      {symbol === 'DIAMOND' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[92%] h-[92%] drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-diaMain`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#bae6fd" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id={`${uid}-diaDark`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id={`${uid}-diaLight`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
          </defs>

          {/* Diamond Outline Shadow */}
          <polygon
            points="50,88 12,38 28,16 72,16 88,38"
            fill="#082f49"
            opacity="0.8"
          />

          {/* Table Face (Top) */}
          <polygon
            points="32,20 68,20 62,38 38,38"
            fill={`url(#${uid}-diaLight)`}
            stroke="#0284c7"
            strokeWidth="1.2"
          />

          {/* Crown Upper Facets */}
          <polygon
            points="16,38 28,20 32,20 38,38"
            fill={`url(#${uid}-diaMain)`}
            stroke="#0284c7"
            strokeWidth="1.2"
          />
          <polygon
            points="84,38 72,20 68,20 62,38"
            fill={`url(#${uid}-diaDark)`}
            stroke="#0284c7"
            strokeWidth="1.2"
          />

          {/* Pavilion Center Triangle Facet */}
          <polygon
            points="38,38 62,38 50,84"
            fill={`url(#${uid}-diaLight)`}
            stroke="#0284c7"
            strokeWidth="1.5"
          />

          {/* Pavilion Left Facet */}
          <polygon
            points="16,38 38,38 50,84"
            fill={`url(#${uid}-diaMain)`}
            stroke="#0284c7"
            strokeWidth="1.5"
          />

          {/* Pavilion Right Facet */}
          <polygon
            points="62,38 84,38 50,84"
            fill={`url(#${uid}-diaDark)`}
            stroke="#0284c7"
            strokeWidth="1.5"
          />

          {/* Specular Prism Refraction Star on Culet */}
          <polygon
            points="50,26 53,33 61,35 53,37 50,44 47,37 39,35 47,33"
            fill="#ffffff"
            opacity="0.95"
          />
          <polygon
            points="28,22 30,26 35,27 30,28 28,32 26,28 21,27 26,26"
            fill="#ffffff"
            opacity="0.8"
          />
        </svg>
      )}

      {/* ========================================================
          4. 24K GOLD BULLION COIN (COIN)
      ======================================================== */}
      {symbol === 'COIN' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[90%] h-[90%] drop-shadow-[0_8px_14px_rgba(0,0,0,0.85)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-coinRim`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="22%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="78%" stopColor="#854d0e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <radialGradient id={`${uid}-coinFace`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="35%" stopColor="#fde047" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>

          {/* Deep Shadow */}
          <circle cx="50" cy="54" r="42" fill="#1f0a02" opacity="0.8" />

          {/* Outer Gold Milled Rim */}
          <circle cx="50" cy="50" r="42" fill={`url(#${uid}-coinRim)`} stroke="#451a03" strokeWidth="2.5" />

          {/* Milled Ribs along rim */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + Math.cos(rad) * 38;
            const y1 = 50 + Math.sin(rad) * 38;
            const x2 = 50 + Math.cos(rad) * 41;
            const y2 = 50 + Math.sin(rad) * 41;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#78350f"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Recessed Inner Coin Face */}
          <circle cx="50" cy="50" r="34" fill={`url(#${uid}-coinFace)`} stroke="#854d0e" strokeWidth="1.8" />

          {/* Inner Beaded Border */}
          <circle cx="50" cy="50" r="29" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 3" />

          {/* Engraved High-Relief Dollar Insignia */}
          <text
            x="50"
            y="61"
            textAnchor="middle"
            fontFamily="'Russo One', sans-serif"
            fontWeight="900"
            fontSize="34"
            fill="#fffde7"
            stroke="#78350f"
            strokeWidth="1.8"
          >
            $
          </text>

          {/* Curved Specular Highlight Arc */}
          <path
            d="M24 38 A32 32 0 0 1 68 22"
            fill="none"
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* ========================================================
          5. FLAMING RED 7 (SEVEN)
      ======================================================== */}
      {symbol === 'SEVEN' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[90%] h-[90%] drop-shadow-[0_6px_10px_rgba(0,0,0,0.8)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-sevenGoldBorder`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffde7" />
              <stop offset="25%" stopColor="#ffd700" />
              <stop offset="55%" stopColor="#d97706" />
              <stop offset="80%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id={`${uid}-sevenRedEnamel`} x1="0%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#ff5252" />
              <stop offset="30%" stopColor="#dc2626" />
              <stop offset="70%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#3f0000" />
            </linearGradient>
            <linearGradient id={`${uid}-sevenGloss`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Deep 3D Extrusion Shadow */}
          <path
            d="M23 21 H83 L55 89 H35 L61 35 H23 Z"
            fill="#1f0202"
            opacity="0.9"
          />

          {/* Outer Multi-Tiered Gold Bezel */}
          <path
            d="M20 18 H81 L53 86 H33 L59 32 H20 Z"
            fill={`url(#${uid}-sevenGoldBorder)`}
            stroke="#5f2905"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Chamfered Inset Shadow */}
          <path
            d="M23 21 H77 L51 83 H37 L61 35 H23 Z"
            fill="#450a0a"
          />

          {/* Main Lacquered Ruby Red Enamel Face */}
          <path
            d="M25 23 H75 L49 81 H37 L61 37 H25 Z"
            fill={`url(#${uid}-sevenRedEnamel)`}
            stroke="#7f1d1d"
            strokeWidth="1"
          />

          {/* Top Beveled Specular Glaze */}
          <path
            d="M26 24 H73 L66 36 H26 Z"
            fill={`url(#${uid}-sevenGloss)`}
          />

          {/* Diagonal Glass Reflection Ray */}
          <line
            x1="70"
            y1="36"
            x2="46"
            y2="77"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Sharp Specular Core Star */}
          <polygon
            points="70,25 72,30 77,32 72,34 70,39 68,34 63,32 68,30"
            fill="#ffffff"
            opacity="0.9"
          />
        </svg>
      )}

      {/* ========================================================
          6. PLATINUM / DIAMOND SEVEN (WHITE_SEVEN)
      ======================================================== */}
      {symbol === 'WHITE_SEVEN' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[90%] h-[90%] drop-shadow-[0_6px_10px_rgba(0,0,0,0.8)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-whiteGoldBezel`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id={`${uid}-platinumBody`} x1="0%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#f1f5f9" />
              <stop offset="65%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* 3D Drop Shadow */}
          <path
            d="M23 21 H83 L55 89 H35 L61 35 H23 Z"
            fill="#0f172a"
            opacity="0.8"
          />

          {/* Platinum Gold Trim Edge */}
          <path
            d="M20 18 H81 L53 86 H33 L59 32 H20 Z"
            fill={`url(#${uid}-whiteGoldBezel)`}
            stroke="#334155"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Platinum Mirror Face */}
          <path
            d="M24 22 H76 L50 82 H36 L60 36 H24 Z"
            fill={`url(#${uid}-platinumBody)`}
            stroke="#64748b"
            strokeWidth="1.2"
          />

          {/* Crystalline Glass Ray */}
          <line
            x1="68"
            y1="34"
            x2="45"
            y2="76"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Diamond Flare Star */}
          <polygon
            points="32,26 34,30 38,31 34,32 32,36 30,32 26,31 30,30"
            fill="#ffffff"
            opacity="0.95"
          />
        </svg>
      )}

      {/* ========================================================
          7. FLAMING WILD SHIELD (WILD)
      ======================================================== */}
      {symbol === 'WILD' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[94%] h-[94%] drop-shadow-[0_8px_14px_rgba(0,0,0,0.85)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-wildGold`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffde7" />
              <stop offset="25%" stopColor="#fde047" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id={`${uid}-wildCrimson`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id={`${uid}-wildPlaque`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#262626" />
              <stop offset="50%" stopColor="#171717" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
          </defs>

          {/* 3D Shield Shadow */}
          <polygon
            points="50,8 94,32 86,78 50,96 14,78 6,32"
            fill="#1c0702"
            opacity="0.75"
          />

          {/* Outer Heavy Gold Beveled Shield */}
          <polygon
            points="50,6 92,30 84,76 50,94 16,76 8,30"
            fill={`url(#${uid}-wildGold)`}
            stroke="#5f2905"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Rich Lacquered Crimson Shield Core */}
          <polygon
            points="50,13 85,33 79,71 50,87 21,71 15,33"
            fill={`url(#${uid}-wildCrimson)`}
            stroke="#fbbf24"
            strokeWidth="1.5"
          />

          {/* Golden Imperial Crown */}
          <polygon
            points="31,43 35,23 44,32 50,18 56,32 65,23 69,43"
            fill={`url(#${uid}-wildGold)`}
            stroke="#78350f"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="18" r="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
          <circle cx="35" cy="23" r="2.2" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
          <circle cx="65" cy="23" r="2.2" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" />

          {/* Inset Plaque for WILD */}
          <rect
            x="14"
            y="47"
            width="72"
            height="28"
            rx="5"
            fill={`url(#${uid}-wildPlaque)`}
            stroke={`url(#${uid}-wildGold)`}
            strokeWidth="2.2"
          />
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fontFamily="'Russo One', sans-serif"
            fontWeight="900"
            fontSize="18.5"
            letterSpacing="2.5"
            fill="#ffd700"
            stroke="#78350f"
            strokeWidth="1"
          >
            WILD
          </text>
        </svg>
      )}

      {/* ========================================================
          8. GOLDEN LIBERTY BELL (BELL)
      ======================================================== */}
      {symbol === 'BELL' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[88%] h-[88%] drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-bellGold`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffde7" />
              <stop offset="20%" stopColor="#fde047" />
              <stop offset="45%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#a16207" />
              <stop offset="100%" stopColor="#582903" />
            </linearGradient>
            <linearGradient id={`${uid}-bellGloss`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Top Cast Iron Suspension Hanger */}
          <ellipse cx="50" cy="17" rx="10" ry="7" fill="none" stroke={`url(#${uid}-bellGold)`} strokeWidth="4.5" />

          {/* 3D Bell Clapper with Shadow */}
          <ellipse cx="50" cy="81" rx="8.5" ry="7.5" fill="#451a03" stroke="#854d0e" strokeWidth="2" />

          {/* Heavy Bell Flared Body */}
          <path
            d="M33 32 C33 21, 67 21, 67 32 C67 48, 77 66, 86 73 H14 C23 66, 33 48, 33 32 Z"
            fill={`url(#${uid}-bellGold)`}
            stroke="#5f2c05"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />

          {/* Flanged Lip / Rim Bottom */}
          <ellipse cx="50" cy="73" rx="36" ry="8" fill={`url(#${uid}-bellGold)`} stroke="#5f2c05" strokeWidth="2.8" />

          {/* Decorative Relief Grooves */}
          <path
            d="M24 65 Q50 71 76 65"
            fill="none"
            stroke="#78350f"
            strokeWidth="2"
          />

          {/* Curved Specular Sheen */}
          <path
            d="M36 34 C36 28, 48 26, 52 26 C44 32, 42 50, 36 68 C32 68, 30 65, 36 34 Z"
            fill={`url(#${uid}-bellGloss)`}
          />
        </svg>
      )}

      {/* ========================================================
          9. TRIPLE SAPPHIRE BULLION BAR (TRIPLE_BAR)
      ======================================================== */}
      {symbol === 'TRIPLE_BAR' && (
        <div className="flex flex-col items-center justify-between w-[92%] h-[82%] py-0.5 relative z-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-full h-[29%] rounded-sm bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-600 p-[1.5px] shadow-[0_3px_6px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.7)]"
            >
              <div className="w-full h-full rounded-[2px] bg-gradient-to-b from-blue-900 via-blue-950 to-indigo-950 flex items-center justify-center relative overflow-hidden border border-blue-400/40">
                <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
                <span className="font-russo text-[11px] sm:text-xs font-black tracking-[0.2em] text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] relative z-10">
                  BAR
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          10. DOUBLE RUBY BULLION BAR (DOUBLE_BAR)
      ======================================================== */}
      {symbol === 'DOUBLE_BAR' && (
        <div className="flex flex-col items-center justify-between w-[92%] h-[78%] py-1 relative z-10">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="w-full h-[45%] rounded-sm bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-600 p-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.8)]"
            >
              <div className="w-full h-full rounded-[2px] bg-gradient-to-b from-pink-900 via-purple-950 to-neutral-950 flex items-center justify-center relative overflow-hidden border border-pink-400/50">
                <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                <span className="font-russo text-sm sm:text-base font-black tracking-[0.25em] text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] relative z-10">
                  BAR
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          11. SINGLE EMERALD BULLION BAR (BAR)
      ======================================================== */}
      {symbol === 'BAR' && (
        <div className="w-[92%] h-[52%] rounded-sm bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-600 p-[2.5px] shadow-[0_5px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.9)] relative z-10">
          <div className="w-full h-full rounded-[2px] bg-gradient-to-b from-emerald-900 via-teal-950 to-neutral-950 flex items-center justify-center relative overflow-hidden border border-emerald-400/50">
            <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/45 to-transparent pointer-events-none" />
            <span className="font-russo text-xl sm:text-2xl font-black tracking-[0.3em] text-amber-100 drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)] relative z-10">
              BAR
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          12. LACQUERED CHERRIES (CHERRY)
      ======================================================== */}
      {symbol === 'CHERRY' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[88%] h-[88%] drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)] relative z-10"
        >
          <defs>
            <radialGradient id={`${uid}-cherryOrb1`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ff859d" />
              <stop offset="25%" stopColor="#f43f5e" />
              <stop offset="60%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>
            <radialGradient id={`${uid}-cherryOrb2`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffa3b7" />
              <stop offset="25%" stopColor="#e11d48" />
              <stop offset="60%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>
          </defs>

          {/* Stems */}
          <path
            d="M52 18 Q58 38 36 62"
            fill="none"
            stroke="#15803d"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M52 18 Q64 42 66 65"
            fill="none"
            stroke="#15803d"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Emerald Leaf */}
          <path
            d="M52 18 C66 8, 80 18, 77 30 C65 32, 57 23, 52 18 Z"
            fill="#22c55e"
            stroke="#14532d"
            strokeWidth="1.5"
          />
          <circle cx="52" cy="18" r="3.5" fill="#14532d" />

          {/* Left Cherry Sphere */}
          <circle cx="34" cy="67" r="18" fill={`url(#${uid}-cherryOrb1)`} stroke="#4c0519" strokeWidth="2" />
          <ellipse
            cx="28"
            cy="59"
            rx="6.5"
            ry="4"
            transform="rotate(-30 28 59)"
            fill="rgba(255,255,255,0.85)"
          />

          {/* Right Cherry Sphere */}
          <circle cx="68" cy="70" r="17" fill={`url(#${uid}-cherryOrb2)`} stroke="#4c0519" strokeWidth="2" />
          <ellipse
            cx="62"
            cy="62"
            rx="6"
            ry="3.5"
            transform="rotate(-30 62 62)"
            fill="rgba(255,255,255,0.85)"
          />
        </svg>
      )}

      {/* ========================================================
          13. ROYAL ACE (A)
      ======================================================== */}
      {symbol === 'A' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[88%] h-[88%] drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-goldAce`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="42" fill="#120402" stroke={`url(#${uid}-goldAce)`} strokeWidth="2.5" />
          <circle cx="50" cy="50" r="36" fill="#1f0904" stroke="#d97706" strokeWidth="1" strokeDasharray="3 2" />
          <text
            x="50"
            y="65"
            textAnchor="middle"
            fontFamily="'Cinzel Decorative', serif"
            fontWeight="900"
            fontSize="46"
            fill={`url(#${uid}-goldAce)`}
            stroke="#451a03"
            strokeWidth="1.5"
          >
            A
          </text>
        </svg>
      )}

      {/* ========================================================
          14. ROYAL KING (K)
      ======================================================== */}
      {symbol === 'K' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[88%] h-[88%] drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-goldK`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          <polygon points="50,8 88,28 88,72 50,92 12,72 12,28" fill="#120402" stroke={`url(#${uid}-goldK)`} strokeWidth="2.5" />
          <text
            x="50"
            y="66"
            textAnchor="middle"
            fontFamily="'Cinzel Decorative', serif"
            fontWeight="900"
            fontSize="46"
            fill={`url(#${uid}-goldK)`}
            stroke="#451a03"
            strokeWidth="1.5"
          >
            K
          </text>
        </svg>
      )}

      {/* ========================================================
          15. ROYAL QUEEN (Q)
      ======================================================== */}
      {symbol === 'Q' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[88%] h-[88%] drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-goldQ`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fce7f3" />
              <stop offset="60%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="42" fill="#1a040d" stroke={`url(#${uid}-goldQ)`} strokeWidth="2.5" />
          <text
            x="50"
            y="65"
            textAnchor="middle"
            fontFamily="'Cinzel Decorative', serif"
            fontWeight="900"
            fontSize="46"
            fill={`url(#${uid}-goldQ)`}
            stroke="#500724"
            strokeWidth="1.5"
          >
            Q
          </text>
        </svg>
      )}

      {/* ========================================================
          16. ROYAL JACK (J)
      ======================================================== */}
      {symbol === 'J' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[88%] h-[88%] drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-goldJ`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#e0f2fe" />
              <stop offset="60%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <rect x="14" y="14" width="72" height="72" rx="14" fill="#040e1f" stroke={`url(#${uid}-goldJ)`} strokeWidth="2.5" />
          <text
            x="50"
            y="67"
            textAnchor="middle"
            fontFamily="'Cinzel Decorative', serif"
            fontWeight="900"
            fontSize="48"
            fill={`url(#${uid}-goldJ)`}
            stroke="#172554"
            strokeWidth="1.5"
          >
            J
          </text>
        </svg>
      )}

      {/* ========================================================
          17. ROYAL TEN (10)
      ======================================================== */}
      {symbol === 'TEN' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[88%] h-[88%] drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-goldTen`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#f3e8ff" />
              <stop offset="60%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
          </defs>
          <rect x="12" y="14" width="76" height="72" rx="14" fill="#1e0538" stroke={`url(#${uid}-goldTen)`} strokeWidth="2.5" />
          <text
            x="50"
            y="66"
            textAnchor="middle"
            fontFamily="'Cinzel Decorative', serif"
            fontWeight="900"
            fontSize="42"
            fill={`url(#${uid}-goldTen)`}
            stroke="#3b0764"
            strokeWidth="1.5"
          >
            10
          </text>
        </svg>
      )}

      {/* ========================================================
          18. GOLDEN LION OF FORTUNE (LION)
      ======================================================== */}
      {symbol === 'LION' && (
        <svg
          viewBox="0 0 100 100"
          className="w-[94%] h-[94%] drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] relative z-10"
        >
          <defs>
            <linearGradient id={`${uid}-lionGold`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id={`${uid}-lionRuby`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
          </defs>
          {/* Outer Sun Medallion Rim */}
          <circle cx="50" cy="50" r="46" fill="#1a0802" stroke={`url(#${uid}-lionGold)`} strokeWidth="3" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
          {/* Sculpted Lion Mane Petals */}
          <path
            d="M 50 12 C 58 12 64 18 68 24 C 76 22 84 28 84 38 C 88 44 88 56 84 62 C 84 72 76 78 68 76 C 64 82 56 86 50 86 C 44 86 36 82 32 76 C 24 78 16 72 16 62 C 12 56 12 44 16 38 C 16 28 24 22 32 24 C 36 18 42 12 50 12 Z"
            fill={`url(#${uid}-lionGold)`}
            stroke="#451a03"
            strokeWidth="1.5"
          />
          {/* Inner Lion Face Mask */}
          <path
            d="M 50 24 C 62 24 68 34 66 48 C 65 60 58 72 50 74 C 42 72 35 60 34 48 C 32 34 38 24 50 24 Z"
            fill="#2c0c04"
            stroke={`url(#${uid}-lionGold)`}
            strokeWidth="2"
          />
          {/* Crown on Lion Head */}
          <path d="M 38 24 L 42 16 L 50 20 L 58 16 L 62 24 Z" fill={`url(#${uid}-lionGold)`} stroke="#451a03" strokeWidth="1" />
          <circle cx="50" cy="19" r="1.5" fill="#ef4444" />
          {/* Piercing Diamond Eyes */}
          <ellipse cx="43" cy="42" rx="3.5" ry="2.2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
          <ellipse cx="57" cy="42" rx="3.5" ry="2.2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
          <circle cx="43.5" cy="41.5" r="1" fill="#ffffff" />
          <circle cx="57.5" cy="41.5" r="1" fill="#ffffff" />
          {/* 3D Snout & Whiskers */}
          <polygon points="50,48 45,55 55,55" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          <path d="M 45 55 C 47 58 50 58 50 58 C 50 58 53 58 55 55" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="42" y1="56" x2="33" y2="54" stroke="#fde047" strokeWidth="1" />
          <line x1="42" y1="58" x2="34" y2="60" stroke="#fde047" strokeWidth="1" />
          <line x1="58" y1="56" x2="67" y2="54" stroke="#fde047" strokeWidth="1" />
          <line x1="58" y1="58" x2="66" y2="60" stroke="#fde047" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
};
