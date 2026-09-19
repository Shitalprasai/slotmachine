/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { soundEffects } from '../../lib/slot/soundEffects';

interface WinEffectsProps {
  winAmount: number;
  winTier: 'NONE' | 'NORMAL' | 'BIG_WIN' | 'MEGA_WIN' | 'JACKPOT';
  jackpotType?: 'MINI' | 'MINOR' | 'MAJOR' | 'GRAND';
  onDismiss: () => void;
}

interface CasinoCoin {
  x: number;
  y: number;
  z: number; // depth scale (0.5 to 1.6)
  vx: number;
  vy: number;
  gravity: number;
  rotX: number;
  rotY: number;
  vRotX: number;
  vRotY: number;
  radius: number;
  alpha: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const WinEffects: React.FC<WinEffectsProps> = ({
  winAmount,
  winTier,
  jackpotType,
  onDismiss,
}) => {
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [impactFlash, setImpactFlash] = useState<boolean>(true);
  const isCelebration = winTier === 'BIG_WIN' || winTier === 'MEGA_WIN' || winTier === 'JACKPOT';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const countAnimRef = useRef<number | null>(null);
  const isFastDismissing = useRef<boolean>(false);

  // Trigger brief realistic gold incandescent flash
  useEffect(() => {
    if (!isCelebration) return;
    setImpactFlash(true);
    const flashTimer = setTimeout(() => setImpactFlash(false), 240);
    return () => clearTimeout(flashTimer);
  }, [isCelebration]);

  // High-performance 3D Gold Coin & Spark Particle Physics Canvas
  useEffect(() => {
    if (!isCelebration) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const coinCount = winTier === 'JACKPOT' ? 80 : winTier === 'MEGA_WIN' ? 55 : 35;
    const sparkCount = winTier === 'JACKPOT' ? 100 : 60;

    // Realistic 3D metallic casino coins
    const coins: CasinoCoin[] = Array.from({ length: coinCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 14;
      const z = 0.5 + Math.random() * 1.1;

      return {
        x: width * 0.5 + (Math.random() - 0.5) * 140,
        y: height * 0.45 + (Math.random() - 0.5) * 60,
        z,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (9 + Math.random() * 8), // Upward burst
        gravity: 0.44,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.25,
        vRotY: (Math.random() - 0.5) * 0.25,
        radius: 16 * z,
        alpha: 1,
      };
    });

    const sparks: SparkParticle[] = Array.from({ length: sparkCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 18;
      return {
        x: width * 0.5,
        y: height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: 1.5 + Math.random() * 3,
        alpha: 1,
        color: Math.random() > 0.4 ? '#ffd700' : '#ff9100',
      };
    });

    let lastTime = performance.now();
    let running = true;

    const render = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Draw sparks
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.2;
        s.alpha -= dt * 0.8;
        if (s.alpha <= 0) continue;

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw coins
      for (let i = 0; i < coins.length; i++) {
        const c = coins[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;
        c.rotX += c.vRotX;
        c.rotY += c.vRotY;

        if (c.y > height + 50) continue;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(Math.cos(c.rotY), Math.sin(c.rotX));
        const r = c.radius;

        // Outer Metallic Rim
        const rimGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r);
        rimGrad.addColorStop(0, '#fef08a');
        rimGrad.addColorStop(0.6, '#d97706');
        rimGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#270c02';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner Recessed Face
        const innerR = r * 0.78;
        const faceGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, innerR);
        faceGrad.addColorStop(0, '#fffbeb');
        faceGrad.addColorStop(0.5, '#fbbf24');
        faceGrad.addColorStop(1, '#92400e');

        ctx.fillStyle = faceGrad;
        ctx.beginPath();
        ctx.arc(0, 0, innerR, 0, Math.PI * 2);
        ctx.fill();

        // Engraved Casino Dollar Insignia
        ctx.fillStyle = '#451a03';
        ctx.font = `bold ${innerR * 1.1}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 1);

        // Specular Glint Edge
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, innerR * 0.9, -Math.PI * 0.75, -Math.PI * 0.25);
        ctx.stroke();

        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isCelebration, winTier]);

  // Fast Roll-up Counter for Win Amount with mechanical coin hopper clinks & settlement chime
  useEffect(() => {
    if (!isCelebration || winAmount <= 0) return;

    const duration = winTier === 'JACKPOT' ? 2600 : winTier === 'MEGA_WIN' ? 2000 : 1400;
    const startTime = performance.now();
    let lastCoinTime = 0;
    let finishedChimePlayed = false;

    const update = (now: number) => {
      if (isFastDismissing.current) return;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * winAmount);
      setDisplayedCount(current);

      if (progress < 1) {
        // Rhythmic hopper coin drop sound every 70ms during counter roll-up
        if (now - lastCoinTime >= 65) {
          soundEffects.playCoinDing();
          lastCoinTime = now;
        }
        countAnimRef.current = requestAnimationFrame(update);
      } else {
        setDisplayedCount(winAmount);
        if (!finishedChimePlayed) {
          finishedChimePlayed = true;
          soundEffects.playPayoutComplete();
        }
      }
    };

    countAnimRef.current = requestAnimationFrame(update);

    // Auto-dismiss smoothly after celebration finishes (4.4 seconds)
    const autoDismiss = setTimeout(() => {
      onDismiss();
    }, 4400);

    return () => {
      clearTimeout(autoDismiss);
      if (countAnimRef.current) cancelAnimationFrame(countAnimRef.current);
    };
  }, [isCelebration, winAmount, winTier, onDismiss]);

  const handleQuickCollect = () => {
    isFastDismissing.current = true;
    setDisplayedCount(winAmount);
    soundEffects.playPayoutComplete();
    setTimeout(() => {
      onDismiss();
    }, 250);
  };

  if (!isCelebration) return null;

  const getTitle = () => {
    if (winTier === 'JACKPOT') {
      return jackpotType ? `${jackpotType} JACKPOT` : 'GRAND JACKPOT';
    }
    if (winTier === 'MEGA_WIN') return 'MEGA WIN';
    return 'BIG WIN';
  };

  return (
    <div
      id="celebration-overlay"
      className="fixed inset-0 z-40 flex flex-col items-center justify-start pt-14 sm:pt-20 px-3 select-none pointer-events-auto cursor-pointer"
      onClick={handleQuickCollect}
    >
      {/* 1. Brief Radiant Gold Flash on Hit */}
      {impactFlash && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-yellow-200/40 to-amber-400/30 z-50 pointer-events-none transition-opacity duration-200" />
      )}

      {/* 2. Fullscreen 3D Coin Shower & Sparks Canvas (Transparent - reels visible beneath) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />

      {/* 3. Subtle Atmospheric Vignette - does not obscure machine reels */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none z-10" />

      {/* 4. SLEEK UNBOXED GAMBLING POPUP (No box container, reels stay visible) */}
      <div
        className="relative z-40 flex flex-col items-center select-none pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => {
          e.stopPropagation();
          handleQuickCollect();
        }}
      >
        {/* Soft Ambient Radial Sunburst Glow (No hard border/box) */}
        <div className="absolute -inset-12 bg-radial from-amber-500/25 via-yellow-500/10 to-transparent blur-2xl pointer-events-none -z-10" />

        {/* Floating Category Tag */}
        <div className="flex items-center gap-1.5 mb-1 px-3 py-0.5 rounded-full bg-black/60 border border-amber-500/40 backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span className="font-cinzel text-[9px] sm:text-[11px] tracking-[0.25em] text-amber-300 uppercase font-black drop-shadow">
            {winTier === 'JACKPOT' ? 'CASINO JACKPOT' : 'LUCKY SPIN'}
          </span>
          <Sparkles className="w-3 h-3 text-yellow-400" />
        </div>

        {/* 3D Radiant Casino Gold Title (Floating freely in air) */}
        <h2 className="font-russo text-3xl sm:text-5xl md:text-6xl tracking-wider uppercase mb-3 select-none text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-amber-500 drop-shadow-[0_0_25px_rgba(255,215,0,0.9)] animate-pulse duration-1000">
          {getTitle()}
        </h2>

        {/* THE SMALL COIN INCREMENT POP UP */}
        <div
          id="small-coin-increment-popup"
          className="inline-flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-black/85 backdrop-blur-md border border-amber-400/90 shadow-[0_0_35px_rgba(255,215,0,0.7),inset_0_1px_3px_rgba(255,255,255,0.4)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Animated 3D Spinning Gold Coin Medallion */}
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-100 border border-yellow-200 shadow-[0_0_12px_rgba(255,215,0,0.85)] animate-[spin_3s_linear_infinite]" />
            <div className="relative z-10 font-russo font-black text-amber-950 text-sm sm:text-base select-none">
              $
            </div>
          </div>

          {/* Increment Counter Readout */}
          <div className="flex flex-col items-start leading-none pr-1">
            <span className="font-montserrat text-[9px] sm:text-[10px] font-bold text-amber-300/80 tracking-widest uppercase mb-0.5">
              WIN INCREMENT
            </span>
            <span className="font-orbitron font-black text-2xl sm:text-4xl text-yellow-300 tracking-tight drop-shadow-[0_0_14px_rgba(255,215,0,0.9)]">
              +${displayedCount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Quick-Collect Hint */}
        <div className="mt-2.5 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-[9px] sm:text-[10px] font-montserrat text-amber-300/90 uppercase tracking-widest shadow">
          <span>TAP ANYWHERE TO QUICK-COLLECT</span>
        </div>
      </div>
    </div>
  );
};
