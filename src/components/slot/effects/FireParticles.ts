/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  life: number;
  maxLife: number;
  color: string;
  alpha: number;
  type: 'EMBER' | 'SPARK' | 'FLAME_TONGUE' | 'TRAVEL' | 'BURST';
  swayFreq?: number;
  swayAmp?: number;
  targetX?: number;
  targetY?: number;
}

/**
 * Reusable, zero-allocation object-pooled particle engine
 * Optimized for silky-smooth 60 FPS performance without garbage collection pauses.
 */
export class FireParticlePool {
  private pool: Particle[];
  private maxParticles: number;

  constructor(maxParticles = 250) {
    this.maxParticles = maxParticles;
    this.pool = new Array(maxParticles);
    for (let i = 0; i < maxParticles; i++) {
      this.pool[i] = {
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        maxSize: 0,
        life: 0,
        maxLife: 1,
        color: '#ff9800',
        alpha: 0,
        type: 'EMBER',
      };
    }
  }

  /**
   * Acquire an inactive particle from the pre-allocated pool
   */
  public spawn(): Particle | null {
    for (let i = 0; i < this.maxParticles; i++) {
      if (!this.pool[i].active) {
        this.pool[i].active = true;
        return this.pool[i];
      }
    }
    return null;
  }

  /**
   * Emit rising embers across the background canvas
   */
  public emitEmber(
    x: number,
    y: number,
    speedY = -1.5,
    size = 3,
    color = '#ff9100'
  ): Particle | null {
    const p = this.spawn();
    if (!p) return null;

    p.x = x;
    p.y = y;
    p.vx = (Math.random() - 0.5) * 0.8;
    p.vy = speedY - Math.random() * 1.5;
    p.size = size;
    p.maxSize = size;
    p.life = 0;
    p.maxLife = 2.5 + Math.random() * 3.0; // 2.5 to 5.5s
    p.color = color;
    p.alpha = 0.8 + Math.random() * 0.2;
    p.type = 'EMBER';
    p.swayFreq = 1.5 + Math.random() * 2.5;
    p.swayAmp = 15 + Math.random() * 25;
    return p;
  }

  /**
   * Emit fast energetic sparks radiating from winning symbol boundaries
   */
  public emitSymbolSpark(
    x: number,
    y: number,
    angle: number,
    speed: number,
    color: string = '#ffd700'
  ): Particle | null {
    const p = this.spawn();
    if (!p) return null;

    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - 1.2; // Slight upward bias
    p.size = 2 + Math.random() * 3.5;
    p.maxSize = p.size;
    p.life = 0;
    p.maxLife = 0.45 + Math.random() * 0.65;
    p.color = color;
    p.alpha = 1;
    p.type = 'SPARK';
    return p;
  }

  /**
   * Emit a golden trail particle that travels smoothly towards the WIN meter display
   */
  public emitTravelParticle(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    color = '#ffe082'
  ): Particle | null {
    const p = this.spawn();
    if (!p) return null;

    p.x = startX + (Math.random() - 0.5) * 20;
    p.y = startY + (Math.random() - 0.5) * 20;
    p.vx = (Math.random() - 0.5) * 1.5;
    p.vy = -2 - Math.random() * 2; // Initial upward launch arch
    p.size = 3.5 + Math.random() * 2.5;
    p.maxSize = p.size;
    p.life = 0;
    p.maxLife = 0.75 + Math.random() * 0.35;
    p.targetX = targetX;
    p.targetY = targetY;
    p.color = color;
    p.alpha = 1;
    p.type = 'TRAVEL';
    return p;
  }

  /**
   * Update all active particles
   */
  public update(dt: number, currentTime = performance.now() * 0.001) {
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      p.life += dt;
      const progress = p.life / p.maxLife;

      if (progress >= 1.0) {
        p.active = false;
        continue;
      }

      switch (p.type) {
        case 'EMBER': {
          p.y += p.vy * (dt * 60);
          p.x += (p.vx + Math.sin(currentTime * (p.swayFreq || 2)) * 0.5) * (dt * 60);
          // Embers cool down and shrink as they rise
          p.size = p.maxSize * (1 - progress * 0.5);
          p.alpha = Math.sin(progress * Math.PI) * 0.85;
          break;
        }

        case 'SPARK': {
          p.x += p.vx * (dt * 60);
          p.y += p.vy * (dt * 60);
          p.vy += 0.08 * (dt * 60); // gravity
          p.vx *= 0.96;
          p.size = p.maxSize * (1 - progress);
          p.alpha = 1 - Math.pow(progress, 2);
          break;
        }

        case 'TRAVEL': {
          // Guided homing trajectory towards target (WIN display)
          if (p.targetX !== undefined && p.targetY !== undefined) {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = 12 * (0.3 + progress * 0.7);
            if (dist > 5) {
              p.vx += (dx / dist) * speed * dt * 5;
              p.vy += (dy / dist) * speed * dt * 5;
              p.vx *= 0.88;
              p.vy *= 0.88;
            }
          }
          p.x += p.vx * (dt * 60);
          p.y += p.vy * (dt * 60);
          p.alpha = 1 - progress * 0.4;
          p.size = p.maxSize * (1 - progress * 0.6);
          break;
        }

        case 'BURST': {
          p.x += p.vx * (dt * 60);
          p.y += p.vy * (dt * 60);
          p.alpha = 1 - progress;
          p.size = p.maxSize * (1 + progress * 0.5);
          break;
        }
      }
    }
  }

  /**
   * Render all active particles on a 2D canvas
   */
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // Additive blending for realistic glowing fire/sparks

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.pool[i];
      if (!p.active || p.alpha <= 0.01) continue;

      ctx.save();
      ctx.globalAlpha = Math.min(1, Math.max(0, p.alpha));
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.type === 'TRAVEL' ? 10 : 6;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
      ctx.fill();

      // For travel and bright sparks, add a miniature core white glint
      if (p.size > 2.2 && (p.type === 'TRAVEL' || p.type === 'SPARK')) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Clear all active particles immediately
   */
  public clear() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.pool[i].active = false;
    }
  }
}
