/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SymbolGlowOptions {
  width: number;
  height: number;
  intensity?: 'normal' | 'big' | 'huge';
  pulsePhase?: number;
  color?: string;
  rimColor?: string;
}

/**
 * Renders high-contrast, multi-pass golden glow, radiant halo, and metallic rim highlights
 * for winning slot symbols.
 */
export class SymbolGlow {
  /**
   * Draw the deep golden back-glow / halo behind the symbol
   */
  public static drawBackGlow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    options: SymbolGlowOptions
  ) {
    const { width, height, intensity = 'normal', pulsePhase = 0 } = options;
    const pulse = 0.5 + 0.5 * Math.sin(pulsePhase);

    let blurRadius = 18 + pulse * 12;
    let alpha = 0.45 + pulse * 0.25;

    if (intensity === 'big') {
      blurRadius = 26 + pulse * 18;
      alpha = 0.65 + pulse * 0.25;
    } else if (intensity === 'huge') {
      blurRadius = 36 + pulse * 24;
      alpha = 0.85 + pulse * 0.15;
    }

    ctx.save();
    ctx.translate(x, y);

    // Multi-stop radial fiery gradient halo
    const radius = Math.max(width, height) * (intensity === 'huge' ? 0.95 : 0.82);
    const grad = ctx.createRadialGradient(0, 0, radius * 0.15, 0, 0, radius);
    grad.addColorStop(0, `rgba(255, 245, 157, ${alpha * 0.9})`);
    grad.addColorStop(0.35, `rgba(255, 193, 7, ${alpha * 0.7})`);
    grad.addColorStop(0.7, `rgba(255, 87, 34, ${alpha * 0.4})`);
    grad.addColorStop(1, 'rgba(216, 27, 96, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Additional intense central bloom
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = blurRadius;
    ctx.beginPath();
    ctx.roundRect(-width * 0.52, -height * 0.52, width * 1.04, height * 1.04, 12);
    ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.35})`;
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw the crisp, radiant metallic golden rim outline around the popped symbol
   */
  public static drawRim(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    pulsePhase = 0,
    intensity: 'normal' | 'big' | 'huge' = 'normal'
  ) {
    const pulse = 0.5 + 0.5 * Math.sin(pulsePhase);
    ctx.save();
    ctx.translate(x, y);

    const cornerRadius = 14;
    const rimWidth = width * 1.05;
    const rimHeight = height * 1.05;

    // 1. Outer bevel stroke
    ctx.shadowColor = intensity === 'huge' ? '#ff9800' : '#ffe082';
    ctx.shadowBlur = 10 + pulse * 8;
    ctx.lineWidth = intensity === 'huge' ? 3.5 : intensity === 'big' ? 2.8 : 2.0;

    const strokeGrad = ctx.createLinearGradient(
      -rimWidth / 2,
      -rimHeight / 2,
      rimWidth / 2,
      rimHeight / 2
    );
    strokeGrad.addColorStop(0, '#ffffff'); // Glinting top-left highlight
    strokeGrad.addColorStop(0.25, '#ffe082');
    strokeGrad.addColorStop(0.5, '#ffb300');
    strokeGrad.addColorStop(0.75, '#ff6f00');
    strokeGrad.addColorStop(1, '#ffd54f');

    ctx.strokeStyle = strokeGrad;
    ctx.beginPath();
    ctx.roundRect(-rimWidth / 2, -rimHeight / 2, rimWidth, rimHeight, cornerRadius);
    ctx.stroke();

    // 2. Corner specular glints
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 6;
    const glintSize = 2.5 + pulse * 1.5;
    ctx.beginPath();
    ctx.arc(-rimWidth / 2 + 6, -rimHeight / 2 + 6, glintSize, 0, Math.PI * 2);
    ctx.arc(rimWidth / 2 - 6, -rimHeight / 2 + 6, glintSize * 0.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
