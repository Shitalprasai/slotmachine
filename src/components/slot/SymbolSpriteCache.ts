import { SlotSymbol } from '../../lib/slot/types';

// High-resolution offscreen sprite cache for 60 FPS crisp Canvas rendering
const spriteCache = new Map<SlotSymbol, HTMLCanvasElement>();

/**
 * Creates high-resolution (256x256) crisp vector sprites for all slot symbols.
 * Pre-rendered once into offscreen canvases so rendering during 60 FPS spin is ultra-fast.
 */
export function getSymbolSprite(symbol: SlotSymbol): HTMLCanvasElement {
  const cached = spriteCache.get(symbol);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw symbol based on type
  drawSymbolToContext(ctx, symbol, 256, 256);

  spriteCache.set(symbol, canvas);
  return canvas;
}

/**
 * Preloads all symbol sprites into the cache
 */
export function preloadAllSymbolSprites() {
  const symbols: SlotSymbol[] = [
    'GOLDEN_50',
    'WILD',
    'LION',
    'CROWN',
    'DIAMOND',
    'COIN',
    'SEVEN',
    'WHITE_SEVEN',
    'BELL',
    'TRIPLE_BAR',
    'DOUBLE_BAR',
    'BAR',
    'CHERRY',
    'A',
    'K',
    'Q',
    'J',
    'TEN',
  ];
  symbols.forEach((s) => getSymbolSprite(s));
}

function drawSymbolToContext(
  ctx: CanvasRenderingContext2D,
  symbol: SlotSymbol,
  w: number,
  h: number
) {
  ctx.save();
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;

  switch (symbol) {
    case 'GOLDEN_50':
      drawGolden50(ctx, cx, cy);
      break;
    case 'WILD':
      drawWild(ctx, cx, cy);
      break;
    case 'LION':
      drawLion(ctx, cx, cy);
      break;
    case 'CROWN':
      drawCrown(ctx, cx, cy);
      break;
    case 'DIAMOND':
      drawDiamond(ctx, cx, cy);
      break;
    case 'COIN':
      drawCoin(ctx, cx, cy);
      break;
    case 'SEVEN':
      drawRedSeven(ctx, cx, cy);
      break;
    case 'WHITE_SEVEN':
      drawWhiteSeven(ctx, cx, cy);
      break;
    case 'BELL':
      drawBell(ctx, cx, cy);
      break;
    case 'TRIPLE_BAR':
      drawTripleBar(ctx, cx, cy);
      break;
    case 'DOUBLE_BAR':
      drawDoubleBar(ctx, cx, cy);
      break;
    case 'BAR':
      drawSingleBar(ctx, cx, cy);
      break;
    case 'CHERRY':
      drawCherry(ctx, cx, cy);
      break;
    case 'A':
      drawRoyals(ctx, cx, cy, 'A', '#FDE047', '#78350F');
      break;
    case 'K':
      drawRoyals(ctx, cx, cy, 'K', '#FBBF24', '#78350F');
      break;
    case 'Q':
      drawRoyals(ctx, cx, cy, 'Q', '#F472B6', '#831843');
      break;
    case 'J':
      drawRoyals(ctx, cx, cy, 'J', '#60A5FA', '#1E3A8A');
      break;
    case 'TEN':
      drawRoyals(ctx, cx, cy, '10', '#C084FC', '#581C87');
      break;
    default:
      drawRedSeven(ctx, cx, cy);
  }

  ctx.restore();
}

// ----------------------------------------------------
// 1. GOLDEN 50 (Ultra 3D Sculpted Grand Shield)
// ----------------------------------------------------
function drawGolden50(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();

  // 1A. Deep 3D Cast Drop Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 12;

  // 1B. 3D Extrusion Side Block (Thick Cast Metal Depth)
  for (let step = 8; step > 0; step--) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 105 + step);
    ctx.lineTo(cx + 96, cy - 60 + step);
    ctx.lineTo(cx + 76, cy + 58 + step);
    ctx.lineTo(cx, cy + 108 + step);
    ctx.lineTo(cx - 76, cy + 58 + step);
    ctx.lineTo(cx - 96, cy - 60 + step);
    ctx.closePath();
    ctx.fillStyle = step === 8 ? '#150501' : '#3d1604';
    ctx.fill();
  }

  // 1C. Outer Heavy 3D Gold Beveled Shield Face
  ctx.beginPath();
  ctx.moveTo(cx, cy - 105);
  ctx.lineTo(cx + 96, cy - 60);
  ctx.lineTo(cx + 76, cy + 58);
  ctx.lineTo(cx, cy + 108);
  ctx.lineTo(cx - 76, cy + 58);
  ctx.lineTo(cx - 96, cy - 60);
  ctx.closePath();

  const goldGrad = ctx.createLinearGradient(cx - 96, cy - 105, cx + 96, cy + 108);
  goldGrad.addColorStop(0, '#FFFFFF');
  goldGrad.addColorStop(0.18, '#FFF275');
  goldGrad.addColorStop(0.42, '#FFD700');
  goldGrad.addColorStop(0.72, '#B45309');
  goldGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = goldGrad;
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 1D. Inner Stepped Bevel Gold Ridge
  ctx.beginPath();
  ctx.moveTo(cx, cy - 95);
  ctx.lineTo(cx + 84, cy - 54);
  ctx.lineTo(cx + 66, cy + 50);
  ctx.lineTo(cx, cy + 96);
  ctx.lineTo(cx - 66, cy + 50);
  ctx.lineTo(cx - 84, cy - 54);
  ctx.closePath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FEF08A';
  ctx.stroke();

  // 1E. 3D Gemstone Studs around Shield Perimeter (Spherical Rubies with 3D Bevels)
  const studs = [
    { x: cx, y: cy - 98 },
    { x: cx + 48, y: cy - 76 },
    { x: cx + 86, y: cy - 57 },
    { x: cx + 72, y: cy },
    { x: cx + 50, y: cy + 62 },
    { x: cx, y: cy + 100 },
    { x: cx - 50, y: cy + 62 },
    { x: cx - 72, y: cy },
    { x: cx - 86, y: cy - 57 },
    { x: cx - 48, y: cy - 76 },
  ];
  studs.forEach((st) => {
    // Gold Setting
    ctx.beginPath();
    ctx.arc(st.x, st.y, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#451A03';
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#FEF08A';
    ctx.stroke();
    // 3D Spherical Gem Core
    ctx.beginPath();
    ctx.arc(st.x, st.y, 4, 0, Math.PI * 2);
    const gemGrad = ctx.createRadialGradient(st.x - 1.5, st.y - 1.5, 0.5, st.x, st.y, 4);
    gemGrad.addColorStop(0, '#FFAAAA');
    gemGrad.addColorStop(0.4, '#EF4444');
    gemGrad.addColorStop(0.8, '#991B1B');
    gemGrad.addColorStop(1, '#450A0A');
    ctx.fillStyle = gemGrad;
    ctx.fill();
    // Specular Pinpoint
    ctx.beginPath();
    ctx.arc(st.x - 1.2, st.y - 1.2, 1, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  });

  // 1F. Inner Crimson Enamel Guilloche Field
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - 88);
  ctx.lineTo(cx + 74, cy - 48);
  ctx.lineTo(cx + 58, cy + 44);
  ctx.lineTo(cx, cy + 86);
  ctx.lineTo(cx - 58, cy + 44);
  ctx.lineTo(cx - 74, cy - 48);
  ctx.closePath();

  const rubyGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 88);
  rubyGrad.addColorStop(0, '#DC2626');
  rubyGrad.addColorStop(0.5, '#991B1B');
  rubyGrad.addColorStop(0.85, '#580e0e');
  rubyGrad.addColorStop(1, '#200505');
  ctx.fillStyle = rubyGrad;
  ctx.fill();

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#FDE047';
  ctx.stroke();

  // Sunburst Guilloche Rays
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
  ctx.lineWidth = 1.6;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx + Math.cos(a) * 65, cy - 5 + Math.sin(a) * 65);
    ctx.stroke();
  }

  // 1G. Header "GOLDEN" Arched Ribbon
  ctx.font = "900 22px 'Cinzel Decorative', 'Cinzel', serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('GOLDEN', cx, cy - 44);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#B45309';
  ctx.strokeText('GOLDEN', cx, cy - 44);

  // 1H. TRUE 3D EXTRUDED "50" NUMERALS
  const textX = cx;
  const textY = cy + 18;
  ctx.font = "900 84px 'Russo One', sans-serif";

  // 3D Extrusion Side Layers
  for (let step = 7; step > 0; step--) {
    ctx.fillStyle = step === 7 ? '#1a0501' : step > 4 ? '#381203' : '#652304';
    ctx.fillText('50', textX + step * 0.7, textY + step * 0.9);
  }

  // Front Face Radiant 3D Gold
  const numGrad = ctx.createLinearGradient(textX - 45, textY - 40, textX + 45, textY + 40);
  numGrad.addColorStop(0, '#FFFFFF');
  numGrad.addColorStop(0.2, '#FFFBEB');
  numGrad.addColorStop(0.45, '#FDE047');
  numGrad.addColorStop(0.75, '#F59E0B');
  numGrad.addColorStop(1, '#B45309');
  ctx.fillStyle = numGrad;
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#451A03';
  ctx.strokeText('50', textX, textY);
  ctx.fillText('50', textX, textY);

  // 3D Inner Bevel Highlight on numerals
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#FFFFFF';
  ctx.strokeText('50', textX, textY);

  // 1I. Laurel Stars at bottom
  ctx.font = "900 18px 'Cinzel Decorative', serif";
  ctx.fillStyle = '#FDE047';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#FFD700';
  ctx.fillText('★ ★ ★', cx, cy + 68);

  ctx.restore();
  ctx.restore();
}

// ----------------------------------------------------
// 2. WILD (3D Machined Medallion with Chiseled Letters)
// ----------------------------------------------------
function drawWild(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();

  // 2A. Cast Drop Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;

  // 2B. 3D Medallion Extrusion Block
  for (let step = 8; step > 0; step--) {
    ctx.beginPath();
    ctx.arc(cx, cy + step, 92, 0, Math.PI * 2);
    ctx.fillStyle = step === 8 ? '#150501' : '#381203';
    ctx.fill();
  }

  // 2C. Outer Beveled Heavy Gold Ring
  ctx.beginPath();
  ctx.arc(cx, cy, 92, 0, Math.PI * 2);
  const ringGrad = ctx.createLinearGradient(cx - 92, cy - 92, cx + 92, cy + 92);
  ringGrad.addColorStop(0, '#FFFFFF');
  ringGrad.addColorStop(0.2, '#FEF08A');
  ringGrad.addColorStop(0.5, '#F59E0B');
  ringGrad.addColorStop(0.8, '#B45309');
  ringGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = ringGrad;
  ctx.fill();

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 2D. 3D Beveled Outer Teeth / Flame Spurs around perimeter
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -90);
    ctx.lineTo(8, -100);
    ctx.lineTo(0, -106);
    ctx.lineTo(-8, -100);
    ctx.closePath();
    ctx.fillStyle = ringGrad;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#451A03';
    ctx.stroke();
    ctx.restore();
  }

  // 2E. Machined Recessed Core with Fiery Lava
  ctx.beginPath();
  ctx.arc(cx, cy, 78, 0, Math.PI * 2);
  const lavaGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 78);
  lavaGrad.addColorStop(0, '#B91C1C');
  lavaGrad.addColorStop(0.4, '#7F1D1D');
  lavaGrad.addColorStop(0.8, '#3A0808');
  lavaGrad.addColorStop(1, '#150202');
  ctx.fillStyle = lavaGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FEF08A';
  ctx.stroke();

  // 2F. 3D EXTRUDED "WILD" LETTERS
  const wildX = cx;
  const wildY = cy - 6;
  ctx.font = "900 58px 'Russo One', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 3D Depth Block
  for (let step = 7; step > 0; step--) {
    ctx.fillStyle = step === 7 ? '#1a0303' : step > 3 ? '#450a0a' : '#7f1d1d';
    ctx.fillText('WILD', wildX + step * 0.7, wildY + step * 0.9);
  }

  // Front Face Radiant Gold
  const wildGrad = ctx.createLinearGradient(wildX, wildY - 30, wildX, wildY + 30);
  wildGrad.addColorStop(0, '#FFFFFF');
  wildGrad.addColorStop(0.3, '#FEF08A');
  wildGrad.addColorStop(0.7, '#F59E0B');
  wildGrad.addColorStop(1, '#DC2626');

  ctx.lineWidth = 5;
  ctx.strokeStyle = '#450A0A';
  ctx.strokeText('WILD', wildX, wildY);
  ctx.fillStyle = wildGrad;
  ctx.fillText('WILD', wildX, wildY);

  // Top Edge Specular Stroke
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#FFFFFF';
  ctx.strokeText('WILD', wildX, wildY);

  // 2G. Subtitle "SUBSTITUTE" Gilded Plaque
  ctx.beginPath();
  ctx.roundRect(cx - 62, cy + 34, 124, 20, 5);
  ctx.fillStyle = ringGrad;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  ctx.font = "900 12px 'Montserrat', sans-serif";
  ctx.fillStyle = '#451A03';
  ctx.fillText('SUBSTITUTE', cx, cy + 44);

  ctx.restore();
}

// ----------------------------------------------------
// 3. LION (Sculpted 24K Gold 3D Relief Medallion)
// ----------------------------------------------------
function drawLion(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;

  // Extrusion depth
  for (let step = 7; step > 0; step--) {
    ctx.beginPath();
    ctx.arc(cx, cy + step, 92, 0, Math.PI * 2);
    ctx.fillStyle = step === 7 ? '#150501' : '#381203';
    ctx.fill();
  }

  // Beveled outer rim
  ctx.beginPath();
  ctx.arc(cx, cy, 92, 0, Math.PI * 2);
  const gGrad = ctx.createLinearGradient(cx - 90, cy - 90, cx + 90, cy + 90);
  gGrad.addColorStop(0, '#FFFFFF');
  gGrad.addColorStop(0.2, '#FEF08A');
  gGrad.addColorStop(0.5, '#F59E0B');
  gGrad.addColorStop(0.8, '#B45309');
  gGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = gGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // Recessed Core
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80);
  coreGrad.addColorStop(0, '#2D1005');
  coreGrad.addColorStop(0.7, '#140502');
  coreGrad.addColorStop(1, '#080201');
  ctx.fillStyle = coreGrad;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#FEF08A';
  ctx.stroke();

  // 3D Lion Mane Rays (Layered Chiseled Petals)
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -56);
    ctx.lineTo(14, -76);
    ctx.lineTo(0, -84);
    ctx.lineTo(-14, -76);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? gGrad : '#B45309';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#451A03';
    ctx.stroke();
    ctx.restore();
  }

  // 3D Sculpted Lion Face Shield
  ctx.beginPath();
  ctx.ellipse(cx, cy + 4, 46, 52, 0, 0, Math.PI * 2);
  const faceGrad = ctx.createLinearGradient(cx, cy - 48, cx, cy + 54);
  faceGrad.addColorStop(0, '#FFFBEB');
  faceGrad.addColorStop(0.3, '#FDE047');
  faceGrad.addColorStop(0.7, '#F59E0B');
  faceGrad.addColorStop(1, '#78350F');
  ctx.fillStyle = faceGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 3D Crown on Head
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy - 42);
  ctx.lineTo(cx - 16, cy - 60);
  ctx.lineTo(cx, cy - 50);
  ctx.lineTo(cx + 16, cy - 60);
  ctx.lineTo(cx + 24, cy - 42);
  ctx.closePath();
  ctx.fillStyle = '#FEF08A';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 3D Brilliant Emerald Eyes
  [-16, 16].forEach((eyeX) => {
    ctx.beginPath();
    ctx.ellipse(cx + eyeX, cy - 8, 6, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#10B981';
    ctx.shadowColor = '#34D399';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + eyeX - 1.5, cy - 9, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  });

  // Snout & Whiskers
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#451A03';
  ctx.beginPath();
  ctx.moveTo(cx, cy + 8);
  ctx.lineTo(cx + 12, cy + 18);
  ctx.lineTo(cx - 12, cy + 18);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy + 24);
  ctx.lineTo(cx - 34, cy + 22);
  ctx.moveTo(cx - 6, cy + 28);
  ctx.lineTo(cx - 32, cy + 32);
  ctx.moveTo(cx + 6, cy + 24);
  ctx.lineTo(cx + 34, cy + 22);
  ctx.moveTo(cx + 6, cy + 28);
  ctx.lineTo(cx + 32, cy + 32);
  ctx.stroke();

  ctx.restore();
}

// ----------------------------------------------------
// 4. CROWN (3D Imperial Gold Crown with Cabochons)
// ----------------------------------------------------
function drawCrown(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;

  // 3D Crimson Velvet Cap
  ctx.beginPath();
  ctx.moveTo(cx - 72, cy + 30);
  ctx.quadraticCurveTo(cx, cy - 65, cx + 72, cy + 30);
  ctx.closePath();
  const vGrad = ctx.createRadialGradient(cx, cy - 10, 10, cx, cy, 70);
  vGrad.addColorStop(0, '#EF4444');
  vGrad.addColorStop(0.5, '#991B1B');
  vGrad.addColorStop(1, '#3B0808');
  ctx.fillStyle = vGrad;
  ctx.fill();

  // 3D Gold Crown Peaks
  ctx.beginPath();
  ctx.moveTo(cx - 78, cy + 32);
  ctx.lineTo(cx - 84, cy - 35);
  ctx.lineTo(cx - 42, cy - 10);
  ctx.lineTo(cx, cy - 60);
  ctx.lineTo(cx + 42, cy - 10);
  ctx.lineTo(cx + 84, cy - 35);
  ctx.lineTo(cx + 78, cy + 32);
  ctx.closePath();

  const cGrad = ctx.createLinearGradient(cx - 80, cy - 60, cx + 80, cy + 40);
  cGrad.addColorStop(0, '#FFFFFF');
  cGrad.addColorStop(0.2, '#FEF08A');
  cGrad.addColorStop(0.5, '#F59E0B');
  cGrad.addColorStop(0.8, '#B45309');
  cGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = cGrad;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 3D Spherical Pearls on peak tips
  [-84, 0, 84].forEach((px, idx) => {
    const py = idx === 1 ? cy - 60 : cy - 35;
    ctx.beginPath();
    ctx.arc(cx + px, py, 7, 0, Math.PI * 2);
    const pGrad = ctx.createRadialGradient(cx + px - 2, py - 2, 1, cx + px, py, 7);
    pGrad.addColorStop(0, '#FFFFFF');
    pGrad.addColorStop(0.5, '#FEF08A');
    pGrad.addColorStop(1, '#B45309');
    ctx.fillStyle = pGrad;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#451A03';
    ctx.stroke();
  });

  // 3D Beveled Crown Base Headband
  ctx.beginPath();
  ctx.roundRect(cx - 82, cy + 24, 164, 26, 6);
  ctx.fillStyle = cGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 3D Cabochon Gemstones along headband (Emerald, Ruby, Sapphire)
  const gems = [
    { x: cx - 55, color: '#10B981' },
    { x: cx - 28, color: '#EF4444' },
    { x: cx, color: '#3B82F6' },
    { x: cx + 28, color: '#EF4444' },
    { x: cx + 55, color: '#10B981' },
  ];
  gems.forEach((gm) => {
    ctx.beginPath();
    ctx.arc(gm.x, cy + 37, 5, 0, Math.PI * 2);
    ctx.fillStyle = gm.color;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#FEF08A';
    ctx.stroke();
    // Specular
    ctx.beginPath();
    ctx.arc(gm.x - 1.5, cy + 35.5, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  });

  ctx.restore();
}

// ----------------------------------------------------
// 5. DIAMOND (3D Brilliant Cut Gemstone with Refraction)
// ----------------------------------------------------
function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;

  const topY = cy - 65;
  const tableY = cy - 20;
  const botY = cy + 75;
  const w = 84;

  // 3D Extrusion
  for (let step = 6; step > 0; step--) {
    ctx.beginPath();
    ctx.moveTo(cx - 50, topY + step);
    ctx.lineTo(cx + 50, topY + step);
    ctx.lineTo(cx + w, tableY + step);
    ctx.lineTo(cx, botY + step);
    ctx.lineTo(cx - w, tableY + step);
    ctx.closePath();
    ctx.fillStyle = step === 6 ? '#082f49' : '#0369a1';
    ctx.fill();
  }

  // Main Pavilion
  ctx.beginPath();
  ctx.moveTo(cx - 50, topY);
  ctx.lineTo(cx + 50, topY);
  ctx.lineTo(cx + w, tableY);
  ctx.lineTo(cx, botY);
  ctx.lineTo(cx - w, tableY);
  ctx.closePath();

  const dGrad = ctx.createLinearGradient(cx - w, topY, cx + w, botY);
  dGrad.addColorStop(0, '#FFFFFF');
  dGrad.addColorStop(0.25, '#BAE6FD');
  dGrad.addColorStop(0.65, '#0284C7');
  dGrad.addColorStop(1, '#0C4A6E');
  ctx.fillStyle = dGrad;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#E0F2FE';
  ctx.stroke();

  // 3D Facet Geometry (Individual Light/Dark Triangles)
  // Center Table
  ctx.beginPath();
  ctx.moveTo(cx - 50, topY);
  ctx.lineTo(cx + 50, topY);
  ctx.lineTo(cx + 25, tableY);
  ctx.lineTo(cx - 25, tableY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fill();
  ctx.stroke();

  // Left & Right Upper Kites
  ctx.beginPath();
  ctx.moveTo(cx - 50, topY);
  ctx.lineTo(cx - 25, tableY);
  ctx.lineTo(cx - w, tableY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(186, 230, 253, 0.35)';
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 50, topY);
  ctx.lineTo(cx + w, tableY);
  ctx.lineTo(cx + 25, tableY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(2, 132, 199, 0.5)';
  ctx.fill();
  ctx.stroke();

  // Center Lower Pavilion Triangle
  ctx.beginPath();
  ctx.moveTo(cx - 25, tableY);
  ctx.lineTo(cx + 25, tableY);
  ctx.lineTo(cx, botY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();
  ctx.stroke();

  // Lower Left & Right Facets
  ctx.beginPath();
  ctx.moveTo(cx - w, tableY);
  ctx.lineTo(cx - 25, tableY);
  ctx.lineTo(cx, botY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + w, tableY);
  ctx.lineTo(cx, botY);
  ctx.lineTo(cx + 25, tableY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(8, 47, 73, 0.65)';
  ctx.fill();
  ctx.stroke();

  // Diamond Sparkle Starburst
  ctx.beginPath();
  ctx.arc(cx - 30, tableY - 8, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = '#FFFFFF';
  ctx.shadowBlur = 12;
  ctx.fill();

  ctx.restore();
}

// ----------------------------------------------------
// 6. COIN (3D Solid Gold Casino Bullion Token)
// ----------------------------------------------------
function drawCoin(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;

  // 3D Coin Extrusion Block
  for (let step = 8; step > 0; step--) {
    ctx.beginPath();
    ctx.arc(cx, cy + step, 92, 0, Math.PI * 2);
    ctx.fillStyle = step === 8 ? '#1a0802' : '#451a03';
    ctx.fill();
  }

  // Outer Beveled Coin Face
  ctx.beginPath();
  ctx.arc(cx, cy, 92, 0, Math.PI * 2);
  const coinGrad = ctx.createLinearGradient(cx - 90, cy - 90, cx + 90, cy + 90);
  coinGrad.addColorStop(0, '#FFFFFF');
  coinGrad.addColorStop(0.2, '#FEF08A');
  coinGrad.addColorStop(0.5, '#EAB308');
  coinGrad.addColorStop(0.8, '#A16207');
  coinGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = coinGrad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 3D Milled Serrated Edge Teeth (Radial notches)
  for (let i = 0; i < 36; i++) {
    const angle = (i * Math.PI * 2) / 36;
    const x1 = cx + Math.cos(angle) * 87;
    const y1 = cy + Math.sin(angle) * 87;
    const x2 = cx + Math.cos(angle) * 91;
    const y2 = cy + Math.sin(angle) * 91;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = i % 2 === 0 ? '#FFFFFF' : '#451A03';
    ctx.stroke();
  }

  // Recessed Core
  ctx.beginPath();
  ctx.arc(cx, cy, 72, 0, Math.PI * 2);
  const coreGrad = ctx.createRadialGradient(cx - 15, cy - 15, 10, cx, cy, 72);
  coreGrad.addColorStop(0, '#FFFBEB');
  coreGrad.addColorStop(0.3, '#FDE047');
  coreGrad.addColorStop(0.7, '#CA8A04');
  coreGrad.addColorStop(1, '#5B2904');
  ctx.fillStyle = coreGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FEF08A';
  ctx.stroke();

  // Embossed 3D "$" with Drop Shadow & Highlight
  ctx.font = "900 74px 'Russo One', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Shadow
  ctx.fillStyle = '#381203';
  ctx.fillText('$', cx + 3, cy + 6);

  // Face
  ctx.fillStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#451A03';
  ctx.strokeText('$', cx, cy + 2);
  ctx.fillText('$', cx, cy + 2);

  ctx.restore();
}

// ----------------------------------------------------
// 7. RED SEVEN (Chiseled 3D Gemstone Ingot with Center Spine)
// ----------------------------------------------------
function drawRedSeven(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;

  // 7 Polygon Geometry Definition:
  // Top horizontal bar: (-65, -78) to (+65, -78)
  // Right diagonal: (+65, -78) -> (+65, -42) -> (+8, +86)
  // Bottom horizontal base: (+8, +86) -> (-36, +86)
  // Inner diagonal: (-36, +86) -> (+20, -42) -> (-65, -42) -> (-65, -78)
  const p7 = new Path2D();
  p7.moveTo(cx - 65, cy - 78);
  p7.lineTo(cx + 65, cy - 78);
  p7.lineTo(cx + 65, cy - 42);
  p7.lineTo(cx + 8, cy + 86);
  p7.lineTo(cx - 36, cy + 86);
  p7.lineTo(cx + 20, cy - 42);
  p7.lineTo(cx - 65, cy - 42);
  p7.closePath();

  // 7A. 3D Extrusion Side Block (Physical Cast Depth)
  for (let step = 8; step > 0; step--) {
    ctx.save();
    ctx.translate(step * 0.8, step * 1.0);
    ctx.fillStyle = step === 8 ? '#150202' : '#380808';
    ctx.fill(p7);
    ctx.restore();
  }

  // 7B. Heavy 3D Gold Outer Bevel Frame
  ctx.lineWidth = 16;
  const goldBorder = ctx.createLinearGradient(cx - 65, cy - 78, cx + 65, cy + 86);
  goldBorder.addColorStop(0, '#FFFFFF');
  goldBorder.addColorStop(0.2, '#FEF08A');
  goldBorder.addColorStop(0.5, '#F59E0B');
  goldBorder.addColorStop(0.8, '#B45309');
  goldBorder.addColorStop(1, '#451A03');
  ctx.strokeStyle = goldBorder;
  ctx.stroke(p7);

  // 7C. Inner Recessed Crimson Base
  const baseRed = ctx.createLinearGradient(cx, cy - 78, cx, cy + 86);
  baseRed.addColorStop(0, '#DC2626');
  baseRed.addColorStop(1, '#450A0A');
  ctx.fillStyle = baseRed;
  ctx.fill(p7);

  // 7D. CHISELED 3D FACETS (The iconic casino 3D '7' with center spine ridge!)
  // Left Facet (Lit Face)
  const leftFacet = new Path2D();
  leftFacet.moveTo(cx - 65, cy - 78);
  leftFacet.lineTo(cx + 25, cy - 60); // Center spine top
  leftFacet.lineTo(cx - 14, cy + 86); // Center spine bottom
  leftFacet.lineTo(cx - 36, cy + 86);
  leftFacet.lineTo(cx + 20, cy - 42);
  leftFacet.lineTo(cx - 65, cy - 42);
  leftFacet.closePath();

  const litGrad = ctx.createLinearGradient(cx - 65, cy - 78, cx + 25, cy - 60);
  litGrad.addColorStop(0, '#FFAAAA');
  litGrad.addColorStop(0.3, '#FF4D4D');
  litGrad.addColorStop(0.7, '#DC2626');
  litGrad.addColorStop(1, '#B91C1C');
  ctx.fillStyle = litGrad;
  ctx.fill(leftFacet);

  // Right Facet (Shaded Face)
  const rightFacet = new Path2D();
  rightFacet.moveTo(cx + 25, cy - 60); // Center spine top
  rightFacet.lineTo(cx + 65, cy - 78);
  rightFacet.lineTo(cx + 65, cy - 42);
  rightFacet.lineTo(cx + 8, cy + 86);
  rightFacet.lineTo(cx - 14, cy + 86); // Center spine bottom
  rightFacet.closePath();

  const shadedGrad = ctx.createLinearGradient(cx + 25, cy - 60, cx + 65, cy + 86);
  shadedGrad.addColorStop(0, '#991B1B');
  shadedGrad.addColorStop(0.5, '#7F1D1D');
  shadedGrad.addColorStop(1, '#2D0404');
  ctx.fillStyle = shadedGrad;
  ctx.fill(rightFacet);

  // Center Spine Ridge Highlight Line
  ctx.beginPath();
  ctx.moveTo(cx + 25, cy - 60);
  ctx.lineTo(cx - 14, cy + 86);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#FFE4E4';
  ctx.stroke();

  // Top Horizontal Spine Line
  ctx.beginPath();
  ctx.moveTo(cx - 65, cy - 60);
  ctx.lineTo(cx + 25, cy - 60);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  // 7E. Gold Rivet Corner Accents
  [
    { x: cx - 58, y: cy - 72 },
    { x: cx + 58, y: cy - 72 },
    { x: cx - 28, y: cy + 78 },
    { x: cx + 2, y: cy + 78 },
  ].forEach((rv) => {
    ctx.beginPath();
    ctx.arc(rv.x, rv.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = '#451A03';
    ctx.stroke();
  });

  // Top Left Brilliant Sparkle
  ctx.beginPath();
  ctx.arc(cx - 55, cy - 70, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = '#FFFFFF';
  ctx.shadowBlur = 10;
  ctx.fill();

  ctx.restore();
}

// ----------------------------------------------------
// 8. WHITE SEVEN (Chiseled 3D Mirror Platinum Ingot)
// ----------------------------------------------------
function drawWhiteSeven(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;

  const p7 = new Path2D();
  p7.moveTo(cx - 65, cy - 78);
  p7.lineTo(cx + 65, cy - 78);
  p7.lineTo(cx + 65, cy - 42);
  p7.lineTo(cx + 8, cy + 86);
  p7.lineTo(cx - 36, cy + 86);
  p7.lineTo(cx + 20, cy - 42);
  p7.lineTo(cx - 65, cy - 42);
  p7.closePath();

  // 3D Extrusion Side Block
  for (let step = 8; step > 0; step--) {
    ctx.save();
    ctx.translate(step * 0.8, step * 1.0);
    ctx.fillStyle = step === 8 ? '#080d1a' : '#1e293b';
    ctx.fill(p7);
    ctx.restore();
  }

  // Platinum Chrome Bevel Frame
  ctx.lineWidth = 16;
  const chromeBorder = ctx.createLinearGradient(cx - 65, cy - 78, cx + 65, cy + 86);
  chromeBorder.addColorStop(0, '#FFFFFF');
  chromeBorder.addColorStop(0.25, '#E2E8F0');
  chromeBorder.addColorStop(0.5, '#94A3B8');
  chromeBorder.addColorStop(0.75, '#475569');
  chromeBorder.addColorStop(1, '#0F172A');
  ctx.strokeStyle = chromeBorder;
  ctx.stroke(p7);

  // Recessed Platinum Base
  const basePlat = ctx.createLinearGradient(cx, cy - 78, cx, cy + 86);
  basePlat.addColorStop(0, '#FFFFFF');
  basePlat.addColorStop(1, '#475569');
  ctx.fillStyle = basePlat;
  ctx.fill(p7);

  // Left Facet (Lit Chrome Face)
  const leftFacet = new Path2D();
  leftFacet.moveTo(cx - 65, cy - 78);
  leftFacet.lineTo(cx + 25, cy - 60);
  leftFacet.lineTo(cx - 14, cy + 86);
  leftFacet.lineTo(cx - 36, cy + 86);
  leftFacet.lineTo(cx + 20, cy - 42);
  leftFacet.lineTo(cx - 65, cy - 42);
  leftFacet.closePath();

  const litGrad = ctx.createLinearGradient(cx - 65, cy - 78, cx + 25, cy - 60);
  litGrad.addColorStop(0, '#FFFFFF');
  litGrad.addColorStop(0.4, '#F8FAFC');
  litGrad.addColorStop(0.8, '#CBD5E1');
  litGrad.addColorStop(1, '#94A3B8');
  ctx.fillStyle = litGrad;
  ctx.fill(leftFacet);

  // Right Facet (Shaded Chrome Face)
  const rightFacet = new Path2D();
  rightFacet.moveTo(cx + 25, cy - 60);
  rightFacet.lineTo(cx + 65, cy - 78);
  rightFacet.lineTo(cx + 65, cy - 42);
  rightFacet.lineTo(cx + 8, cy + 86);
  rightFacet.lineTo(cx - 14, cy + 86);
  rightFacet.closePath();

  const shadedGrad = ctx.createLinearGradient(cx + 25, cy - 60, cx + 65, cy + 86);
  shadedGrad.addColorStop(0, '#64748B');
  shadedGrad.addColorStop(0.5, '#334155');
  shadedGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = shadedGrad;
  ctx.fill(rightFacet);

  // Center Spine Ridge
  ctx.beginPath();
  ctx.moveTo(cx + 25, cy - 60);
  ctx.lineTo(cx - 14, cy + 86);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 65, cy - 60);
  ctx.lineTo(cx + 25, cy - 60);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  // Top Sparkle
  ctx.beginPath();
  ctx.arc(cx - 55, cy - 70, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = '#FFFFFF';
  ctx.shadowBlur = 12;
  ctx.fill();

  ctx.restore();
}

// ----------------------------------------------------
// 9. BELL (3D Lathed Brass Liberty Bell)
// ----------------------------------------------------
function drawBell(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;

  // 3D Extrusion
  for (let step = 7; step > 0; step--) {
    ctx.beginPath();
    ctx.roundRect(cx - 85, cy + 44 + step, 170, 20, 8);
    ctx.fillStyle = step === 7 ? '#150802' : '#451a03';
    ctx.fill();
  }

  // Top Mounting Hanger
  ctx.beginPath();
  ctx.roundRect(cx - 18, cy - 84, 36, 24, 6);
  ctx.fillStyle = '#78350F';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FDE047';
  ctx.stroke();

  // Mounting Bolt
  ctx.beginPath();
  ctx.arc(cx, cy - 72, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#FEF08A';
  ctx.fill();

  // Bell Flare Body with 3D Lathed Brass Lighting
  ctx.beginPath();
  ctx.moveTo(cx - 26, cy - 60);
  ctx.lineTo(cx + 26, cy - 60);
  ctx.bezierCurveTo(cx + 36, cy - 20, cx + 58, cy + 25, cx + 82, cy + 50);
  ctx.lineTo(cx - 82, cy + 50);
  ctx.bezierCurveTo(cx - 58, cy + 25, cx - 36, cy - 20, cx - 26, cy - 60);
  ctx.closePath();

  const bellGrad = ctx.createLinearGradient(cx - 82, cy - 60, cx + 82, cy + 50);
  bellGrad.addColorStop(0, '#FFFFFF');
  bellGrad.addColorStop(0.2, '#FEF08A');
  bellGrad.addColorStop(0.45, '#F59E0B');
  bellGrad.addColorStop(0.75, '#B45309');
  bellGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = bellGrad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 3D Lathed Bell Curved Specular Highlight Arc
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 56);
  ctx.bezierCurveTo(cx - 5, cy - 20, cx + 5, cy + 15, cx + 22, cy + 48);
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.stroke();

  // Heavy 3D Beveled Lip Rim
  ctx.beginPath();
  ctx.roundRect(cx - 86, cy + 44, 172, 22, 8);
  ctx.fillStyle = bellGrad;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 3D Spherical Clapper Ball
  ctx.beginPath();
  ctx.arc(cx, cy + 74, 16, 0, Math.PI * 2);
  const clapperGrad = ctx.createRadialGradient(cx - 4, cy + 70, 2, cx, cy + 74, 16);
  clapperGrad.addColorStop(0, '#FEF08A');
  clapperGrad.addColorStop(0.5, '#B45309');
  clapperGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = clapperGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#2D0D02';
  ctx.stroke();

  ctx.restore();
}

// ----------------------------------------------------
// 10, 11, 12. BAR INGOTS (True 3D Gold Bullion Ingots)
// ----------------------------------------------------
function drawTripleBar(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const bars = [cy - 54, cy, cy + 54];
  bars.forEach((by) => {
    drawBarIngot(ctx, cx, by, 192, 38, '#2563EB', '#0F172A', '#E0F2FE', 'BAR');
  });
}

function drawDoubleBar(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const bars = [cy - 30, cy + 30];
  bars.forEach((by) => {
    drawBarIngot(ctx, cx, by, 202, 44, '#DC2626', '#450A0A', '#FEE2E2', 'BAR');
  });
}

function drawSingleBar(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  drawBarIngot(ctx, cx, cy, 212, 56, '#059669', '#022C22', '#D1FAE5', 'BAR');
}

/**
 * Renders an authentic 3D gold bullion ingot with 4-way 45-degree chamfers,
 * recessed enamel face, corner rivets, and extruded 3D "BAR" text.
 */
function drawBarIngot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  color1: string,
  color2: string,
  textColor: string,
  text: string
) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;

  const halfW = w / 2;
  const halfH = h / 2;
  const chamfer = Math.min(8, h * 0.22);

  // 1. 3D Ingot Extrusion Depth
  for (let step = 6; step > 0; step--) {
    ctx.beginPath();
    ctx.roundRect(cx - halfW + step * 0.6, cy - halfH + step * 0.8, w, h, 6);
    ctx.fillStyle = step === 6 ? '#140501' : '#381203';
    ctx.fill();
  }

  // 2. Outer Rectangle Ingot Face
  const x0 = cx - halfW;
  const y0 = cy - halfH;
  const x1 = cx + halfW;
  const y1 = cy + halfH;

  const ix0 = x0 + chamfer;
  const iy0 = y0 + chamfer;
  const ix1 = x1 - chamfer;
  const iy1 = y1 - chamfer;

  // 3. 4-WAY 45-DEGREE 3D CHAMFERED GOLD FACES
  // A. Top Chamfer Trapezoid (Catches bright ceiling light)
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y0);
  ctx.lineTo(ix1, iy0);
  ctx.lineTo(ix0, iy0);
  ctx.closePath();
  const topChamferGrad = ctx.createLinearGradient(0, y0, 0, iy0);
  topChamferGrad.addColorStop(0, '#FFFFFF');
  topChamferGrad.addColorStop(1, '#FEF08A');
  ctx.fillStyle = topChamferGrad;
  ctx.fill();

  // B. Bottom Chamfer Trapezoid (In deep bronze shadow)
  ctx.beginPath();
  ctx.moveTo(x0, y1);
  ctx.lineTo(x1, y1);
  ctx.lineTo(ix1, iy1);
  ctx.lineTo(ix0, iy1);
  ctx.closePath();
  const botChamferGrad = ctx.createLinearGradient(0, iy1, 0, y1);
  botChamferGrad.addColorStop(0, '#78350F');
  botChamferGrad.addColorStop(1, '#290E03');
  ctx.fillStyle = botChamferGrad;
  ctx.fill();

  // C. Left Chamfer Trapezoid (Mid-tone gold)
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(ix0, iy0);
  ctx.lineTo(ix0, iy1);
  ctx.lineTo(x0, y1);
  ctx.closePath();
  ctx.fillStyle = '#F59E0B';
  ctx.fill();

  // D. Right Chamfer Trapezoid (Shadow gold)
  ctx.beginPath();
  ctx.moveTo(x1, y0);
  ctx.lineTo(ix1, iy0);
  ctx.lineTo(ix1, iy1);
  ctx.lineTo(x1, y1);
  ctx.closePath();
  ctx.fillStyle = '#92400E';
  ctx.fill();

  // Outer Stroke Rim
  ctx.beginPath();
  ctx.rect(x0, y0, w, h);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#451A03';
  ctx.stroke();

  // 4. Recessed Enameled Gem Center Core
  ctx.beginPath();
  ctx.rect(ix0, iy0, ix1 - ix0, iy1 - iy0);
  const gemGrad = ctx.createLinearGradient(0, iy0, 0, iy1);
  gemGrad.addColorStop(0, color1);
  gemGrad.addColorStop(0.7, color2);
  gemGrad.addColorStop(1, '#050201');
  ctx.fillStyle = gemGrad;
  ctx.fill();

  // Inner Ingot Shadow
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.stroke();

  // 5. 3D Extruded "BAR" Lettering
  const fontSize = Math.round(h * 0.62);
  ctx.font = `900 ${fontSize}px 'Russo One', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '5px';

  // Letter depth
  for (let s = 3; s > 0; s--) {
    ctx.fillStyle = '#050201';
    ctx.fillText(text, cx + s * 0.6, cy + s * 0.8);
  }

  // Face
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#000000';
  ctx.strokeText(text, cx, cy);
  ctx.fillStyle = textColor;
  ctx.fillText(text, cx, cy);

  // Top highlight edge on letters
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = '#FFFFFF';
  ctx.strokeText(text, cx, cy);

  // 6. Corner Rivet Screws
  [
    { x: x0 + 4, y: y0 + 4 },
    { x: x1 - 4, y: y0 + 4 },
    { x: x0 + 4, y: y1 - 4 },
    { x: x1 - 4, y: y1 - 4 },
  ].forEach((rv) => {
    ctx.beginPath();
    ctx.arc(rv.x, rv.y, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
  });

  ctx.restore();
}

// ----------------------------------------------------
// 13. CHERRY (Twin 3D Ultra-Glossy Lacquered Cherries)
// ----------------------------------------------------
function drawCherry(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;

  // Stems with 3D Wood Tone
  ctx.lineWidth = 5.5;
  ctx.strokeStyle = '#4D7C0F';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 66);
  ctx.quadraticCurveTo(cx - 36, cy - 40, cx - 44, cy + 16);
  ctx.moveTo(cx, cy - 66);
  ctx.quadraticCurveTo(cx + 36, cy - 35, cx + 46, cy + 26);
  ctx.stroke();

  // Stem Highlight Ridge
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#A3E635';
  ctx.stroke();

  // 3D Sculpted Emerald Leaf
  ctx.beginPath();
  ctx.ellipse(cx + 18, cy - 62, 26, 11, Math.PI / 6, 0, Math.PI * 2);
  const leafGrad = ctx.createLinearGradient(cx, cy - 70, cx + 36, cy - 54);
  leafGrad.addColorStop(0, '#84CC16');
  leafGrad.addColorStop(0.6, '#4D7C0F');
  leafGrad.addColorStop(1, '#1E3A08');
  ctx.fillStyle = leafGrad;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#BEF264';
  ctx.stroke();

  // Cherry 1 (Left Sphere)
  const c1X = cx - 44;
  const c1Y = cy + 28;
  const r1 = 36;

  // Contact Shadow underneath
  ctx.beginPath();
  ctx.ellipse(c1X + 4, c1Y + 34, 28, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fill();

  // Sphere Radial Gradient
  ctx.beginPath();
  ctx.arc(c1X, c1Y, r1, 0, Math.PI * 2);
  const c1Grad = ctx.createRadialGradient(c1X - 12, c1Y - 12, 3, c1X, c1Y, r1);
  c1Grad.addColorStop(0, '#FF8585');
  c1Grad.addColorStop(0.3, '#DC2626');
  c1Grad.addColorStop(0.7, '#991B1B');
  c1Grad.addColorStop(1, '#3B0808');
  ctx.fillStyle = c1Grad;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#450A0A';
  ctx.stroke();

  // High-Gloss Curved Glass Sheen Crescent
  ctx.beginPath();
  ctx.ellipse(c1X - 12, c1Y - 14, 12, 6, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fill();

  // Cherry 2 (Right Sphere)
  const c2X = cx + 42;
  const c2Y = cy + 36;
  const r2 = 33;

  ctx.beginPath();
  ctx.ellipse(c2X + 4, c2Y + 32, 26, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(c2X, c2Y, r2, 0, Math.PI * 2);
  const c2Grad = ctx.createRadialGradient(c2X - 10, c2Y - 10, 3, c2X, c2Y, r2);
  c2Grad.addColorStop(0, '#FF8585');
  c2Grad.addColorStop(0.3, '#DC2626');
  c2Grad.addColorStop(0.7, '#991B1B');
  c2Grad.addColorStop(1, '#3B0808');
  ctx.fillStyle = c2Grad;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#450A0A';
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(c2X - 10, c2Y - 12, 10, 5, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fill();

  ctx.restore();
}

// ----------------------------------------------------
// 14. ROYALS (3D Chiseled Gilded Plaques)
// ----------------------------------------------------
function drawRoyals(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  letter: string,
  textColor: string,
  borderColor: string
) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 8;

  // 3D Plaque Extrusion
  for (let step = 6; step > 0; step--) {
    ctx.beginPath();
    ctx.roundRect(cx - 66 + step * 0.6, cy - 66 + step * 0.8, 132, 132, 22);
    ctx.fillStyle = step === 6 ? '#150602' : '#381203';
    ctx.fill();
  }

  // 3D Medallion Plaque Face
  ctx.beginPath();
  ctx.roundRect(cx - 66, cy - 66, 132, 132, 22);
  const plate = ctx.createLinearGradient(cx - 66, cy - 66, cx + 66, cy + 66);
  plate.addColorStop(0, '#2D1005');
  plate.addColorStop(0.5, '#140502');
  plate.addColorStop(1, '#080201');
  ctx.fillStyle = plate;
  ctx.fill();

  // Heavy 3D Gilded Frame
  ctx.lineWidth = 6;
  const gBorder = ctx.createLinearGradient(cx - 66, cy - 66, cx + 66, cy + 66);
  gBorder.addColorStop(0, '#FFFFFF');
  gBorder.addColorStop(0.25, textColor);
  gBorder.addColorStop(0.7, '#B45309');
  gBorder.addColorStop(1, '#451A03');
  ctx.strokeStyle = gBorder;
  ctx.stroke();

  // 3D Giant Serif Royal Glyph with Depth Block
  ctx.font = "900 86px 'Cinzel Decorative', serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let s = 4; s > 0; s--) {
    ctx.fillStyle = '#050201';
    ctx.fillText(letter, cx + s * 0.7, cy + 4 + s * 0.8);
  }

  const tGrad = ctx.createLinearGradient(cx, cy - 40, cx, cy + 40);
  tGrad.addColorStop(0, '#FFFFFF');
  tGrad.addColorStop(0.35, textColor);
  tGrad.addColorStop(1, borderColor);

  ctx.lineWidth = 6;
  ctx.strokeStyle = borderColor;
  ctx.strokeText(letter, cx, cy + 4);
  ctx.fillStyle = tGrad;
  ctx.fillText(letter, cx, cy + 4);

  // Highlight Edge
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = '#FFFFFF';
  ctx.strokeText(letter, cx, cy + 4);

  ctx.restore();
}
