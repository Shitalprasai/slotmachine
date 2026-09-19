/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FireParticlePool } from './FireParticles';
import { SymbolGlow } from './SymbolGlow';
import { WinBurst } from './WinBurst';
import { soundEffects } from '../../../lib/slot/soundEffects';

export interface PopSymbolState {
  key: string;
  reelIndex: number;
  rowIndex: number;
  symbolType: string;
  x: number;
  y: number;
  baseWidth: number;
  baseHeight: number;
  scale: number;
  popProgress: number; // 0 to 1
  pulseCount: number; // 0, 1, 2, 3
  active: boolean;
  intensity: 'normal' | 'big' | 'huge';
  soundPlayed: boolean;
  travelEmitted: boolean;
}

/**
 * Manages the physical 3D pop forward animation, spring bounce,
 * sparks, radial bursts, and travel particles for winning slot symbols.
 */
export class WinSymbolPopManager {
  private activePops: Map<string, PopSymbolState> = new Map();
  public particlePool: FireParticlePool;
  public winBurst: WinBurst;
  private winMeterTarget: { x: number; y: number } = { x: 150, y: 700 };

  constructor(particlePool?: FireParticlePool) {
    this.particlePool = particlePool || new FireParticlePool(250);
    this.winBurst = new WinBurst(12);
  }

  public setWinMeterTarget(x: number, y: number) {
    this.winMeterTarget = { x, y };
  }

  /**
   * Activate pop effect for a winning symbol
   */
  public triggerPop(
    reelIndex: number,
    rowIndex: number,
    symbolType: string,
    x: number,
    y: number,
    width: number,
    height: number,
    intensity: 'normal' | 'big' | 'huge' = 'normal'
  ) {
    const key = `${reelIndex}_${rowIndex}`;
    const existing = this.activePops.get(key);
    if (existing && existing.active) return;

    const popState: PopSymbolState = {
      key,
      reelIndex,
      rowIndex,
      symbolType,
      x,
      y,
      baseWidth: width,
      baseHeight: height,
      scale: 1.0,
      popProgress: 0,
      pulseCount: 0,
      active: true,
      intensity,
      soundPlayed: false,
      travelEmitted: false,
    };

    this.activePops.set(key, popState);

    // Trigger radial light burst behind the symbol
    this.winBurst.trigger(x, y, Math.max(width, height), intensity);

    // Initial radial sparks burst from symbol perimeter
    const numInitialSparks = intensity === 'huge' ? 24 : intensity === 'big' ? 16 : 10;
    for (let i = 0; i < numInitialSparks; i++) {
      const angle = (Math.PI * 2 * i) / numInitialSparks + (Math.random() - 0.5) * 0.3;
      const speed = 3 + Math.random() * (intensity === 'huge' ? 9 : 6);
      const sparkX = x + (Math.cos(angle) * width) / 2;
      const sparkY = y + (Math.sin(angle) * height) / 2;
      this.particlePool.emitSymbolSpark(
        sparkX,
        sparkY,
        angle,
        speed,
        Math.random() > 0.4 ? '#ffd700' : '#ff9100'
      );
    }

    // Play synchronized symbol impact sound
    if (!popState.soundPlayed) {
      popState.soundPlayed = true;
      soundEffects.playSymbolImpact?.(intensity);
    }
  }

  /**
   * Update active pops physics, scaling, and particle emissions
   */
  public update(dt: number, currentTime = performance.now() * 0.001) {
    this.winBurst.update(dt);
    this.particlePool.update(dt, currentTime);

    for (const [, pop] of this.activePops) {
      if (!pop.active) continue;

      pop.popProgress += dt * 1.6; // ~0.65s initial cycle

      // Spring overshoot curve: 1.0 -> 1.14 (or 1.22 for huge) -> 1.05 -> 1.0 + subtle pulse
      const t = pop.popProgress;
      const peakScale = pop.intensity === 'huge' ? 1.24 : pop.intensity === 'big' ? 1.16 : 1.12;

      if (t < 0.3) {
        // Rapid forward surge 1.0 -> peakScale
        const subT = t / 0.3;
        pop.scale = 1.0 + (peakScale - 1.0) * Math.sin((subT * Math.PI) / 2);
      } else if (t < 0.6) {
        // Settle from peakScale -> 1.04
        const subT = (t - 0.3) / 0.3;
        pop.scale = peakScale - (peakScale - 1.04) * Math.sin((subT * Math.PI) / 2);
      } else {
        // Continuous gentle pulse (1.0 to 1.06) 2–3 times
        const pulseCycle = (t - 0.6) * 3.5;
        const pulseAmp = pop.intensity === 'huge' ? 0.08 : 0.05;
        pop.scale = 1.0 + Math.max(0, Math.sin(pulseCycle)) * pulseAmp;

        // Emit continuous soft sparks during pulses
        if (Math.random() < 0.35) {
          const edgeX = pop.x + (Math.random() - 0.5) * pop.baseWidth * 0.9;
          const edgeY = pop.y + (Math.random() - 0.5) * pop.baseHeight * 0.9;
          this.particlePool.emitSymbolSpark(
            edgeX,
            edgeY,
            -Math.PI / 2 + (Math.random() - 0.5),
            2 + Math.random() * 4,
            '#ffe082'
          );
        }

        // Particle stream traveling toward the WIN display (points 6 & 7 of prompt)
        if (t > 0.8 && !pop.travelEmitted) {
          pop.travelEmitted = true;
          const travelCount = pop.intensity === 'huge' ? 12 : pop.intensity === 'big' ? 8 : 5;
          for (let k = 0; k < travelCount; k++) {
            setTimeout(() => {
              this.particlePool.emitTravelParticle(
                pop.x,
                pop.y,
                this.winMeterTarget.x,
                this.winMeterTarget.y,
                k % 2 === 0 ? '#ffd700' : '#ffe082'
              );
              if (k === 0) {
                soundEffects.playSparkTravel?.();
              }
            }, k * 55);
          }
        }
      }
    }
  }

  /**
   * Render the popped symbol, radiant halo, and metallic rim on an unclipped layer
   */
  public drawPoppedSymbol(
    ctx: CanvasRenderingContext2D,
    pop: PopSymbolState,
    sprite: HTMLCanvasElement | HTMLImageElement,
    timestamp: number
  ) {
    if (!pop.active) return;

    const currentW = pop.baseWidth * pop.scale;
    const currentH = pop.baseHeight * pop.scale;

    ctx.save();

    // 1. Contact shadow expands and softens as symbol pops towards screen (3D depth simulation)
    const liftFactor = Math.max(0, (pop.scale - 1.0) / 0.15);
    ctx.save();
    ctx.translate(pop.x, pop.y);
    const shadowR = Math.max(currentW, currentH) * 0.55;
    const shadowGrad = ctx.createRadialGradient(
      0,
      12 * (1 + liftFactor),
      2,
      0,
      12 * (1 + liftFactor),
      shadowR * (1 + liftFactor * 0.3)
    );
    shadowGrad.addColorStop(0, `rgba(0, 0, 0, ${0.7 - liftFactor * 0.2})`);
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(
      0,
      12 * (1 + liftFactor),
      shadowR * (1 + liftFactor * 0.3),
      shadowR * 0.45 * (1 + liftFactor * 0.2),
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    // 2. Draw God-rays / Radial light burst behind symbol
    // (Rendered via winBurst.draw in the main pass)

    // 3. Golden Back Glow / Halo
    SymbolGlow.drawBackGlow(ctx, pop.x, pop.y, {
      width: currentW,
      height: currentH,
      intensity: pop.intensity,
      pulsePhase: timestamp * 0.008 + pop.reelIndex,
    });

    // 4. Draw the 3D Symbol with subtle rotation/depth tilt
    ctx.save();
    ctx.translate(pop.x, pop.y);
    // Subtle physical tilt (±2 degrees)
    const tilt = Math.sin(timestamp * 0.005 + pop.reelIndex * 1.5) * 0.025;
    ctx.rotate(tilt);

    // Draw the crisp pre-rendered symbol sprite
    ctx.drawImage(sprite, -currentW / 2, -currentH / 2, currentW, currentH);

    ctx.restore();

    // 5. Radiant Golden Rim Outline & Specular Glints
    SymbolGlow.drawRim(
      ctx,
      pop.x,
      pop.y,
      currentW,
      currentH,
      timestamp * 0.008 + pop.reelIndex,
      pop.intensity
    );

    ctx.restore();
  }

  /**
   * Render all popped symbols, bursts, and particles on the unclipped foreground canvas
   */
  public drawForeground(
    ctx: CanvasRenderingContext2D,
    getSprite: (type: string) => HTMLCanvasElement | HTMLImageElement,
    timestamp: number
  ) {
    // 1. Draw light bursts behind all popped symbols
    this.winBurst.draw(ctx);

    // 2. Draw each popping symbol in 3D unclipped space
    for (const [, pop] of this.activePops) {
      if (!pop.active) continue;
      const sprite = getSprite(pop.symbolType);
      if (sprite) {
        this.drawPoppedSymbol(ctx, pop, sprite, timestamp);
      }
    }

    // 3. Draw sparks and flying travel particles in front of symbols
    this.particlePool.draw(ctx);
  }

  /**
   * Check if a specific reel & row symbol is currently popping
   */
  public isSymbolPopping(reelIndex: number, rowIndex: number): boolean {
    const key = `${reelIndex}_${rowIndex}`;
    const pop = this.activePops.get(key);
    return !!(pop && pop.active);
  }

  /**
   * Clear all active pop states when a new spin begins
   */
  public clear() {
    this.activePops.clear();
    this.winBurst.clear();
    this.particlePool.clear();
  }
}
