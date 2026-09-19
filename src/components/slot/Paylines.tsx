import React from 'react';
import { PAYLINES } from '../../lib/slot/paylines';

interface PaylinesProps {
  activeWinningLines: number[];
  hoveredLine: number | null;
  onHoverLine: (lineId: number | null) => void;
}

export const Paylines: React.FC<PaylinesProps> = ({
  activeWinningLines,
  hoveredLine,
  onHoverLine,
}) => {
  // 3 reels x 3 rows grid coordinates:
  // Reel centers horizontally: 16.66% (Col 0), 50% (Col 1), 83.33% (Col 2)
  // Row centers vertically: 16.66% (Row 0), 50% (Row 1), 83.33% (Row 2)
  const getCoordinates = (rows: [number, number, number]): string => {
    const xCoords = [16.66, 50.0, 83.33];
    const yMap = [16.66, 50.0, 83.33];
    const p0 = `${xCoords[0]}% ${yMap[rows[0]]}%`;
    const p1 = `${xCoords[1]}% ${yMap[rows[1]]}%`;
    const p2 = `${xCoords[2]}% ${yMap[rows[2]]}%`;
    return `M ${xCoords[0]},${yMap[rows[0]]} L ${xCoords[1]},${yMap[rows[1]]} L ${xCoords[2]},${yMap[rows[2]]}`;
  };

  return (
    <>
      {/* SVG Payline Path Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {PAYLINES.map((line) => {
          const isWinning = activeWinningLines.includes(line.id);
          const isHovered = hoveredLine === line.id;
          const isVisible = isWinning || isHovered;

          if (!isVisible) return null;

          const pathD = getCoordinates(line.rows);

          return (
            <g key={line.id} className={isWinning ? 'animate-payline-flash' : ''}>
              {/* Thick outer neon glow halo */}
              <path
                d={pathD}
                fill="none"
                stroke={line.color}
                strokeWidth="6"
                strokeOpacity="0.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-filter)"
              />
              {/* Core solid crisp payline */}
              <path
                d={pathD}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Secondary color stroke */}
              <path
                d={pathD}
                fill="none"
                stroke={line.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Traveling light pulse dash along the line */}
              {isWinning && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeDasharray="15 35"
                  strokeLinecap="round"
                  className="animate-pulse"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="100"
                    to="0"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </path>
              )}

              {/* Traveling Light Pulse Photon Comet along the winning payline */}
              {isWinning && (
                <g>
                  <circle r="5.5" fill="#ffffff" filter="url(#glow-filter)">
                    <animateMotion path={pathD} dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="3" fill="#fde047">
                    <animateMotion path={pathD} dur="1.2s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* Glowing anchor nodes at symbol centers */}
              {[0, 1, 2].map((col) => {
                const x = col === 0 ? 16.66 : col === 1 ? 50 : 83.33;
                const y = line.rows[col] === 0 ? 16.66 : line.rows[col] === 1 ? 50 : 83.33;
                return (
                  <circle
                    key={col}
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#ffffff"
                    stroke={line.color}
                    strokeWidth="2"
                    filter="url(#glow-filter)"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </>
  );
};

interface PaylinePillsProps {
  activeWinningLines: number[];
  hoveredLine: number | null;
  onHoverLine: (lineId: number | null) => void;
  position: 'left' | 'right';
}

export const PaylinePills: React.FC<PaylinePillsProps> = ({
  activeWinningLines,
  hoveredLine,
  onHoverLine,
  position,
}) => {
  // Order of tags vertically on left/right edges
  const linesOrder = position === 'left' ? [1, 4, 2, 5, 3] : [1, 5, 2, 4, 3];

  return (
    <div
      className={`flex flex-col justify-around h-full py-1 sm:py-2 z-30 ${
        position === 'left' ? 'pr-0.5 sm:pr-1' : 'pl-0.5 sm:pl-1'
      }`}
    >
      {linesOrder.map((lineId) => {
        const line = PAYLINES.find((l) => l.id === lineId)!;
        const isWinning = activeWinningLines.includes(lineId);
        const isHovered = hoveredLine === lineId;

        return (
          <button
            key={lineId}
            id={`payline-pill-${position}-${lineId}`}
            type="button"
            aria-label={`View Payline ${lineId}`}
            onMouseEnter={() => onHoverLine(lineId)}
            onMouseLeave={() => onHoverLine(null)}
            onClick={() => onHoverLine(hoveredLine === lineId ? null : lineId)}
            className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-russo text-[8px] xs:text-[10px] sm:text-xs font-black transition-all cursor-pointer border ${
              isWinning
                ? 'scale-110 text-white shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse'
                : isHovered
                ? 'scale-105 text-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                : 'text-neutral-300 opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: isWinning || isHovered ? line.color : '#171717',
              borderColor: line.color,
            }}
          >
            {lineId}
          </button>
        );
      })}
    </div>
  );
};
