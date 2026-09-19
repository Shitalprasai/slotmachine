/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface MonitorRedFireProps {
  hasWin?: boolean;
  isSpinning?: boolean;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

/**
 * Animated Real-Time Reddish Fire & Embers glowing constantly inside the slot monitor.
 * Employs procedural harmonic flame curves, incandescent ruby/crimson gradients,
 * and upward-drifting hot fire sparks.
 */
export const MonitorRedFire: React.FC<MonitorRedFireProps> = ({
  hasWin = false,
  isSpinning = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const embersRef = useRef<Ember[]>([]);
  const stateRef = useRef({ hasWin, isSpinning });

  useEffect(() => {
    stateRef.current = { hasWin, isSpinning };
  }, [hasWin, isSpinning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.floor(rect.width * dpr);
      height = Math.floor(rect.height * dpr);
      canvas.width = width;
      canvas.height = height;

      // Seed initial embers
      if (embersRef.current.length === 0 && width > 0) {
        embersRef.current = Array.from({ length: 45 }, () => createEmber(width, height, true));
      }
    };

    const emberColors = [
      'rgba(254, 202, 202, ', // White-red hot
      'rgba(248, 113, 113, ', // Bright coral red
      'rgba(239, 68, 68, ',   // Ruby red
      'rgba(220, 38, 38, ',   // Deep red
      'rgba(249, 115, 22, ',  // Fiery orange-red
      'rgba(185, 28, 28, ',   // Crimson
    ];

    function createEmber(w: number, h: number, randomizeY = false): Ember {
      const maxLife = 50 + Math.random() * 80;
      return {
        x: Math.random() * w,
        y: randomizeY ? Math.random() * h : h + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.9 * dpr,
        vy: -(1.2 + Math.random() * 2.2) * dpr,
        size: (1.5 + Math.random() * 3.0) * dpr,
        alpha: 0.3 + Math.random() * 0.7,
        life: randomizeY ? Math.random() * maxLife : 0,
        maxLife,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
      };
    }

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) * 0.001;
      const { hasWin: curWin, isSpinning: curSpin } = stateRef.current;

      ctx.clearRect(0, 0, width, height);

      if (width === 0 || height === 0) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // -----------------------------------------------------------------------
      // 1. CONSTANT REDDISH FURNACE BASE GLOW (Inside the bottom of the monitor)
      // -----------------------------------------------------------------------
      const basePulse = 0.85 + 0.15 * Math.sin(elapsed * 4.2) + 0.08 * Math.cos(elapsed * 7.1);
      const intensityMult = curWin ? 1.45 : curSpin ? 1.25 : 1.0;

      // Bottom horizontal radiant red glow
      const baseGrad = ctx.createLinearGradient(0, height, 0, height * 0.55);
      baseGrad.addColorStop(0, `rgba(220, 38, 38, ${0.42 * basePulse * intensityMult})`);
      baseGrad.addColorStop(0.35, `rgba(185, 28, 28, ${0.28 * basePulse * intensityMult})`);
      baseGrad.addColorStop(0.7, `rgba(153, 27, 27, ${0.12 * basePulse * intensityMult})`);
      baseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, height * 0.45, width, height * 0.55);

      // Central deep red fiery core
      const coreX = width * 0.5;
      const coreY = height * 0.92;
      const coreRadius = width * 0.52;
      const radialGrad = ctx.createRadialGradient(coreX, coreY, 5 * dpr, coreX, coreY, coreRadius);
      radialGrad.addColorStop(0, `rgba(255, 100, 70, ${0.45 * basePulse * intensityMult})`);
      radialGrad.addColorStop(0.3, `rgba(239, 68, 68, ${0.35 * basePulse * intensityMult})`);
      radialGrad.addColorStop(0.65, `rgba(185, 28, 28, ${0.18 * basePulse * intensityMult})`);
      radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Side perimeter red glows (Left & Right monitor inner edges)
      const leftGrad = ctx.createLinearGradient(0, 0, width * 0.16, 0);
      leftGrad.addColorStop(0, `rgba(220, 38, 38, ${0.35 * basePulse * intensityMult})`);
      leftGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, width * 0.16, height);

      const rightGrad = ctx.createLinearGradient(width, 0, width * 0.84, 0);
      rightGrad.addColorStop(0, `rgba(220, 38, 38, ${0.35 * basePulse * intensityMult})`);
      rightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rightGrad;
      ctx.fillRect(width * 0.84, 0, width * 0.16, height);

      // -----------------------------------------------------------------------
      // 2. DANCING RED FLAME TONGUES LICKING UPWARD FROM BOTTOM
      // Multiple wave-modulated flaming peaks flickering in ruby red & hot scarlet
      // -----------------------------------------------------------------------
      const numFlames = 9;
      for (let i = 0; i < numFlames; i++) {
        const u = (i + 0.5) / numFlames;
        const fx = u * width;
        const flameSpeed = 3.5 + (i % 3) * 1.2;
        const flameOffset = i * 1.35;
        const wave1 = Math.sin(elapsed * flameSpeed + flameOffset);
        const wave2 = Math.cos(elapsed * (flameSpeed * 1.4) + flameOffset * 1.8);
        const flicker = 0.75 + 0.25 * wave1 + 0.15 * wave2;

        const flameHeight = height * (0.28 + (i % 2 === 0 ? 0.14 : 0.08)) * flicker * (curWin ? 1.4 : 1.0);
        const flameWidth = (width / numFlames) * (1.6 + 0.3 * wave2);

        const flameGrad = ctx.createRadialGradient(
          fx + wave1 * 6 * dpr,
          height - flameHeight * 0.35,
          2 * dpr,
          fx,
          height,
          flameWidth
        );
        flameGrad.addColorStop(0, `rgba(255, 160, 120, ${0.55 * flicker * intensityMult})`);
        flameGrad.addColorStop(0.25, `rgba(239, 68, 68, ${0.45 * flicker * intensityMult})`);
        flameGrad.addColorStop(0.65, `rgba(185, 28, 28, ${0.25 * flicker * intensityMult})`);
        flameGrad.addColorStop(1, 'rgba(127, 29, 29, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(fx - flameWidth * 0.6, height);
        ctx.quadraticCurveTo(
          fx + wave1 * 12 * dpr,
          height - flameHeight,
          fx + flameWidth * 0.6,
          height
        );
        ctx.closePath();
        ctx.fill();
      }

      // -----------------------------------------------------------------------
      // 3. RISING RED EMBERS & SPARKS (Drifting upward inside the monitor)
      // -----------------------------------------------------------------------
      const embers = embersRef.current;
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += 1;
        if (e.life >= e.maxLife || e.y < -10) {
          embers[i] = createEmber(width, height);
          continue;
        }

        const progress = e.life / e.maxLife;
        // Fade in quickly, then gentle fade out
        const fadeAlpha = progress < 0.2
          ? (progress / 0.2)
          : Math.pow(1 - (progress - 0.2) / 0.8, 1.4);

        const currentAlpha = e.alpha * fadeAlpha * (curWin ? 1.3 : 1.0);

        // Sine sway in horizontal drift
        const sway = Math.sin(elapsed * 4 + i) * 0.8 * dpr;
        e.x += e.vx + sway;
        e.y += e.vy;

        ctx.fillStyle = `${e.color}${Math.min(1, currentAlpha).toFixed(3)})`;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
        ctx.shadowBlur = 6 * dpr;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  return (
    <div
      id="monitor-red-fire-container"
      className="absolute inset-0 pointer-events-none z-15 overflow-hidden rounded-xl"
      aria-hidden="true"
    >
      {/* 
        Continuous 60FPS Reddish Fire & Ember Canvas 
        Blended smoothly over the reels and background 
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen pointer-events-none"
      />

      {/* Pulsating Ruby Red Perimeter Inner Rim Glow */}
      <div
        className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ${
          hasWin
            ? 'shadow-[inset_0_0_40px_rgba(239,68,68,0.7),inset_0_-25px_30px_rgba(220,38,38,0.85)]'
            : isSpinning
            ? 'shadow-[inset_0_0_30px_rgba(220,38,38,0.55),inset_0_-18px_25px_rgba(185,28,28,0.7)]'
            : 'shadow-[inset_0_0_24px_rgba(220,38,38,0.42),inset_0_-14px_20px_rgba(185,28,28,0.55)]'
        }`}
      />

      {/* Constant Red Ambient Breathing Light on the monitor interior */}
      <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-red-600/25 via-red-900/15 to-transparent pointer-events-none animate-flame-flicker" />
    </div>
  );
};
