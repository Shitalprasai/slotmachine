/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BurstState {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  numRays: number;
  active: boolean;
  intensity: 'normal' | 'big' | 'huge';
}

/**
 * Renders short, radiant light bursts and rotating sunburst God-rays behind popping winning symbols
 */
export class WinBurst {
  private bursts: BurstState[] = [];

  constructor(maxBursts = 12) {
    this.bursts = Array.from({ length: maxBursts }, () => ({
      x: 0,
      y: 0,
      radius: 0,
      maxRadius: 100,
      rotation: 0,
      rotationSpeed: 0.8,
      life: 0,
      maxLife: 1.0,
      numRays: 12,
      active: false,
      intensity: 'normal',
    }));
  }

  /**
   * Trigger a burst behind a winning symbol
   */
  public trigger(
    x: number,
    y: number,
    baseSize: number,
    intensity: 'normal' | 'big' | 'huge' = 'normal'
  ) {
    const b = this.bursts.find((item) => !item.active);
    if (!b) return;

    b.active = true;
    b.x = x;
    b.y = y;
    b.radius = baseSize * 0.3;
    b.maxRadius = baseSize * (intensity === 'huge' ? 1.6 : intensity === 'big' ? 1.35 : 1.15);
    b.rotation = Math.random() * Math.PI * 2;
    b.rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8);
    b.life = 0;
    b.maxLife = intensity === 'huge' ? 1.8 : intensity === 'big' ? 1.4 : 1.0;
    b.numRays = intensity === 'huge' ? 18 : intensity === 'big' ? 14 : 10;
    b.intensity = intensity;
  }

  /**
   * Update burst lifecycle and rotation
   */
  public update(dt: number) {
    for (let i = 0; i < this.bursts.length; i++) {
      const b = this.bursts[i];
      if (!b.active) continue;

      b.life += dt;
      if (b.life >= b.maxLife) {
        b.active = false;
        continue;
      }

      b.rotation += b.rotationSpeed * dt;
      const progress = b.life / b.maxLife;
      // Exponential outward bloom
      b.radius = b.maxRadius * Math.min(1, Math.sin(progress * Math.PI * 0.75));
    }
  }

  /**
   * Draw active bursts
   */
  public draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.bursts.length; i++) {
      const b = this.bursts[i];
      if (!b.active) continue;

      const progress = b.life / b.maxLife;
      const alpha = Math.sin(progress * Math.PI) * (b.intensity === 'huge' ? 0.75 : 0.5);
      if (alpha <= 0.01) continue;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);
      ctx.globalCompositeOperation = 'lighter';

      const rayAngle = (Math.PI * 2) / b.numRays;
      const r = b.radius;

      for (let j = 0; j < b.numRays; j++) {
        const startAngle = j * rayAngle - rayAngle * 0.22;
        const endAngle = j * rayAngle + rayAngle * 0.22;

        const grad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
        grad.addColorStop(0, `rgba(255, 255, 230, ${alpha * 0.9})`);
        grad.addColorStop(0.35, `rgba(255, 215, 0, ${alpha * 0.6})`);
        grad.addColorStop(0.7, `rgba(255, 110, 0, ${alpha * 0.25})`);
        grad.addColorStop(1, 'rgba(255, 60, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
      }

      // Center bright incandescent starburst core
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.45);
      coreGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
      coreGrad.addColorStop(0.5, `rgba(255, 215, 0, ${alpha * 0.5})`);
      coreGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  public clear() {
    for (let i = 0; i < this.bursts.length; i++) {
      this.bursts[i].active = false;
    }
  }
}
