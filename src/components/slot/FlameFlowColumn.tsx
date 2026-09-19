/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { PAYLINES } from '../../lib/slot/paylines';

interface FlameFlowColumnProps {
  side: 'left' | 'right';
  intensity?: 'normal' | 'high';
  winningLines: number[];
  hoveredPayline: number | null;
  onHoverPayline: (lineId: number | null) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  hue: number;
}

/**
 * Vertical Flame Flow Column flanking the 3D Slots.
 * Matches the user's sketch: "flame flow" vertical channels on the left and right of the 3D slots.
 * Features procedural upward flowing flame tongues, glowing thermal plasma,
 * rising incandescent sparks, and integrated glowing payline pill badges.
 */
export const FlameFlowColumn: React.FC<FlameFlowColumnProps> = ({
  side,
  intensity = 'normal',
  winningLines,
  hoveredPayline,
  onHoverPayline,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const isHigh = intensity === 'high';

  const linesOrder = side === 'left' ? [1, 4, 2, 5, 3] : [1, 5, 2, 4, 3];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isRunning = true;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.floor(rect.width * dpr);
      height = Math.floor(rect.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Helper to spawn fire particles
    const spawnParticle = (w: number, h: number, randomY = false): Particle => {
      return {
        x: (Math.random() * 0.7 + 0.15) * w,
        y: randomY ? Math.random() * h : h + Math.random() * 15,
        vx: (Math.random() - 0.5) * (w * 0.015),
        vy: -(Math.random() * 2.8 + 1.8) * (h / 260) * (isHigh ? 1.6 : 1.0),
        size: (Math.random() * 3.5 + 2.0) * dpr * (isHigh ? 1.4 : 1.0),
        alpha: Math.random() * 0.6 + 0.4,
        maxLife: Math.random() * 55 + 35,
        life: 0,
        hue: Math.random() * 35 + 15, // 15 (deep orange/red) to 50 (bright golden yellow)
      };
    };

    // Pre-populate particles
    particlesRef.current = Array.from({ length: 32 }, () => spawnParticle(width, height, true));

    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += isHigh ? 0.065 : 0.04;

      if (width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        // 1. BASE VERTICAL THERMAL GLOW (Soft warm gradient along the column)
        const baseGrad = ctx.createLinearGradient(0, height, 0, 0);
        baseGrad.addColorStop(0, isHigh ? 'rgba(239, 68, 68, 0.45)' : 'rgba(185, 28, 28, 0.28)');
        baseGrad.addColorStop(0.35, isHigh ? 'rgba(249, 115, 22, 0.35)' : 'rgba(234, 88, 12, 0.2)');
        baseGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
        baseGrad.addColorStop(1, 'rgba(251, 191, 36, 0.02)');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. PROCEDURAL FLAME WAVE TONGUES (flowing sine curves)
        const numTongues = 4;
        for (let i = 0; i < numTongues; i++) {
          const tOffset = time + i * 1.6;
          const flameWidth = width * (0.45 + 0.15 * Math.sin(tOffset * 0.9));
          const centerX = side === 'left' ? width * 0.65 : width * 0.35;

          ctx.beginPath();
          ctx.moveTo(centerX - flameWidth * 0.5, height);

          // Build rising tongue shape
          const segments = 12;
          for (let s = 1; s <= segments; s++) {
            const progress = s / segments;
            const y = height * (1 - progress);
            const sway =
              Math.sin(progress * 4.2 - tOffset * 2.2 + i) * (width * 0.22) +
              Math.cos(progress * 7.5 + tOffset * 1.5) * (width * 0.1);
            const wCurrent = flameWidth * (1 - progress * 0.92);
            const x = centerX + sway;

            if (s === 1) {
              ctx.lineTo(x - wCurrent * 0.5, y);
            } else {
              ctx.lineTo(x - wCurrent * 0.5, y);
            }
          }

          // Tip of flame
          const tipY = height * (0.05 + 0.2 * Math.sin(tOffset * 1.2 + i));
          const tipX = centerX + Math.sin(tOffset * 2.5 + i) * (width * 0.25);
          ctx.lineTo(tipX, tipY);

          // Right side back down
          for (let s = segments; s >= 1; s--) {
            const progress = s / segments;
            const y = height * (1 - progress);
            const sway =
              Math.sin(progress * 4.2 - tOffset * 2.2 + i) * (width * 0.22) +
              Math.cos(progress * 7.5 + tOffset * 1.5) * (width * 0.1);
            const wCurrent = flameWidth * (1 - progress * 0.92);
            const x = centerX + sway;
            ctx.lineTo(x + wCurrent * 0.5, y);
          }

          ctx.closePath();

          // Gradient color of the flame tongue
          const tongueGrad = ctx.createLinearGradient(0, height, 0, tipY);
          tongueGrad.addColorStop(0, `rgba(220, 38, 38, ${0.45 + i * 0.08})`);
          tongueGrad.addColorStop(0.4, `rgba(249, 115, 22, ${0.4 + i * 0.06})`);
          tongueGrad.addColorStop(0.75, `rgba(253, 224, 71, ${0.35 + i * 0.05})`);
          tongueGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = tongueGrad;
          ctx.globalCompositeOperation = 'screen';
          ctx.fill();
        }

        // 3. RISING INCANDESCENT SPARK PARTICLES
        ctx.globalCompositeOperation = 'lighter';
        for (let idx = 0; idx < particlesRef.current.length; idx++) {
          const p = particlesRef.current[idx];
          p.x += p.vx + Math.sin(p.life * 0.1 + p.y * 0.05) * 0.4;
          p.y += p.vy;
          p.life += 1;

          const lifeRatio = p.life / p.maxLife;
          const currentAlpha = p.alpha * (1 - lifeRatio);
          const currentSize = p.size * (1 - lifeRatio * 0.45);

          if (lifeRatio >= 1 || p.y < 0) {
            particlesRef.current[idx] = spawnParticle(width, height);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 100%, ${60 + (1 - lifeRatio) * 35}%, ${currentAlpha})`;
          ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [side, isHigh]);

  return (
    <div
      id={`flame-flow-column-${side}`}
      className={`relative flex flex-col items-center justify-between py-1.5 sm:py-2 px-1 sm:px-1.5 w-9 sm:w-12 md:w-14 h-full rounded-xl bg-gradient-to-b from-[#1c0402] via-[#0d0201] to-[#1c0402] border border-orange-600/70 shadow-[inset_0_0_15px_rgba(255,60,0,0.4),0_0_12px_rgba(255,100,0,0.3)] overflow-hidden shrink-0 select-none z-10`}
    >
      {/* 1. Canvas with Procedural Rising Fire Tongues & Sparks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 2. Sleek Vertical Header: "FLAME FLOW" label from the user's sketch */}
      <div className="relative z-10 flex flex-col items-center leading-tight mb-0.5 text-center">
        <span className="font-russo text-[6.5px] sm:text-[8px] font-black uppercase tracking-tighter text-amber-300 drop-shadow-[0_0_5px_rgba(251,191,36,0.9)]">
          FLAME
        </span>
        <span className="font-russo text-[6.5px] sm:text-[8px] font-black uppercase tracking-tighter text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.9)]">
          FLOW
        </span>
      </div>

      {/* 3. Floating Interactive Payline Badges (1 through 5) */}
      <div className="relative z-10 flex flex-col justify-around items-center flex-1 w-full my-0.5">
        {linesOrder.map((lineId) => {
          const line = PAYLINES.find((l) => l.id === lineId)!;
          const isWinning = winningLines.includes(lineId);
          const isHovered = hoveredPayline === lineId;

          return (
            <button
              key={`${side}-payline-btn-${lineId}`}
              id={`flame-payline-btn-${side}-${lineId}`}
              type="button"
              aria-label={`Payline ${lineId}`}
              onMouseEnter={() => onHoverPayline(lineId)}
              onMouseLeave={() => onHoverPayline(null)}
              onClick={() => onHoverPayline(hoveredPayline === lineId ? null : lineId)}
              className={`relative w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-russo text-[8px] sm:text-[10px] md:text-xs font-black transition-all duration-150 cursor-pointer border shadow-md ${
                isWinning
                  ? 'scale-115 text-white border-white shadow-[0_0_15px_rgba(255,255,255,1),0_0_25px_rgba(255,100,0,1)] animate-bounce'
                  : isHovered
                  ? 'scale-110 text-white border-white shadow-[0_0_10px_rgba(255,255,255,0.9)]'
                  : 'text-stone-100 opacity-85 hover:opacity-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]'
              }`}
              style={{
                backgroundColor: isWinning || isHovered ? line.color : '#1f0805',
                borderColor: isWinning || isHovered ? '#ffffff' : line.color,
                boxShadow:
                  isWinning || isHovered
                    ? `0 0 12px ${line.color}, inset 0 1px 3px rgba(255,255,255,0.8)`
                    : `0 0 5px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,150,0,0.3)`,
              }}
            >
              {lineId}
            </button>
          );
        })}
      </div>

      {/* 4. Bottom Thermal Core Indicator */}
      <div className="relative z-10 w-2.5 sm:w-3.5 h-1 rounded-full bg-gradient-to-r from-red-500 via-yellow-300 to-red-500 shadow-[0_0_8px_rgba(253,224,71,0.9)] mt-0.5" />
    </div>
  );
};
