import React, { useRef, useEffect, useCallback } from 'react';
import { SlotSymbol } from '../../lib/slot/types';
import { REEL_1_STRIP, REEL_2_STRIP, REEL_3_STRIP } from '../../lib/slot/symbols';
import { getSymbolSprite, preloadAllSymbolSprites } from './SymbolSpriteCache';
import { WinSymbolPopManager } from './effects/WinSymbolPop';

interface CylindricalReelCanvasProps {
  reels: [
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol]
  ];
  spinningReels: [boolean, boolean, boolean];
  winningLines: number[];
  hoveredPayline: number | null;
  winTier?: 'NONE' | 'NORMAL' | 'BIG_WIN' | 'MEGA_WIN' | 'JACKPOT' | null;
  onReelStopped?: (reelIndex: number) => void;
  onReelSettled?: (reelIndex: number) => void;
  onAllReelsSettled?: () => void;
}

interface SingleReelState {
  strip: SlotSymbol[];
  currentPos: number; // Continuous position along strip (float)
  targetPos: number; // Final stop position along strip
  velocity: number; // Speed in symbols per second
  phase: 'IDLE' | 'ANTICIPATION' | 'ACCELERATING' | 'SPINNING' | 'DECELERATING' | 'BOUNCING';
  phaseTimer: number; // Seconds spent in current phase
  overshootAmp: number;
}

export const CylindricalReelCanvas: React.FC<CylindricalReelCanvasProps> = ({
  reels,
  spinningReels,
  winningLines,
  hoveredPayline,
  winTier,
  onReelStopped,
  onReelSettled,
  onAllReelsSettled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerDimensions = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const onReelSettledRef = useRef(onReelSettled);
  onReelSettledRef.current = onReelSettled;
  const onAllReelsSettledRef = useRef(onAllReelsSettled);
  onAllReelsSettledRef.current = onAllReelsSettled;

  // Responsive ResizeObserver for mobile orientation changes & viewport adjustments
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          containerDimensions.current = { width, height };
        }
      }
    });

    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);
  const hasEverSpun = useRef<boolean>(false);
  const winSymbolPopRef = useRef<WinSymbolPopManager>(new WinSymbolPopManager());

  // Preload sprites on mount
  useEffect(() => {
    preloadAllSymbolSprites();
  }, []);

  // Internal physics states for the 3 individual reel cylinders
  const reelStates = useRef<SingleReelState[]>([
    {
      strip: REEL_1_STRIP,
      currentPos: 0,
      targetPos: 0,
      velocity: 0,
      phase: 'IDLE',
      phaseTimer: 0,
      overshootAmp: 0,
    },
    {
      strip: REEL_2_STRIP,
      currentPos: 0,
      targetPos: 0,
      velocity: 0,
      phase: 'IDLE',
      phaseTimer: 0,
      overshootAmp: 0,
    },
    {
      strip: REEL_3_STRIP,
      currentPos: 0,
      targetPos: 0,
      velocity: 0,
      phase: 'IDLE',
      phaseTimer: 0,
      overshootAmp: 0,
    },
  ]);

  // Keep track of spinning props to detect transition edges
  const prevSpinning = useRef<[boolean, boolean, boolean]>([false, false, false]);

  // Setup initial target positions matching the passed `reels` props
  useEffect(() => {
    const strips = [REEL_1_STRIP, REEL_2_STRIP, REEL_3_STRIP];
    for (let i = 0; i < 3; i++) {
      const state = reelStates.current[i];
      if (state.phase === 'IDLE') {
        const centerSym = reels[i]?.[1] || 'SEVEN';
        const strip = strips[i];
        let idx = strip.indexOf(centerSym);
        if (idx === -1) idx = 0;
        state.currentPos = idx;
        state.targetPos = idx;
      }
    }
  }, [reels]);

  // Handle spin state transitions for each reel independently
  useEffect(() => {
    const strips = [REEL_1_STRIP, REEL_2_STRIP, REEL_3_STRIP];

    for (let i = 0; i < 3; i++) {
      const wasSpin = prevSpinning.current[i];
      const isSpin = spinningReels[i];
      const state = reelStates.current[i];

      // START SPIN: Idle -> Anticipation (small upward recoil) -> Accelerating
      if (!wasSpin && isSpin) {
        hasEverSpun.current = true;
        state.phase = 'ANTICIPATION';
        state.phaseTimer = 0;
        state.velocity = 0;
      }
      // STOP REEL: Spinning -> Decelerating -> Mechanical Bounce -> Idle
      else if (wasSpin && !isSpin) {
        // Find strip index where row 0, 1, 2 matches the target result
        const targetCenter = reels[i]?.[1] || 'SEVEN';
        const strip = strips[i];
        const len = strip.length;

        // Find candidate index in strip matching target symbols
        let matchIdx = -1;
        for (let s = 0; s < len; s++) {
          if (strip[s] === targetCenter) {
            matchIdx = s;
            break;
          }
        }
        if (matchIdx === -1) matchIdx = 0;

        // Project target stop ahead by at least 6 symbols for smooth mechanical deceleration
        const cur = state.currentPos;
        const minAhead = 5.5;
        let target = cur + minAhead;
        const remainder = ((matchIdx - (target % len)) % len + len) % len;
        target += remainder;

        state.targetPos = target;
        state.phase = 'DECELERATING';
        state.phaseTimer = 0;
      }
    }

    prevSpinning.current = [...spinningReels];
  }, [spinningReels, reels]);

  // Main 60 FPS Physics & Render Loop
  const renderFrame = useCallback(
    (timestamp: number, dt: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      let width = containerDimensions.current.width;
      let height = containerDimensions.current.height;
      if (width <= 0 || height <= 0) {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }
      if (width <= 0 || height <= 0) return;

      // Ensure canvas internal resolution matches display size
      const targetW = Math.round(width * dpr);
      const targetH = Math.round(height * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Draw Deep Recessed Chamber Background (Midnight Obsidian & Charcoal)
      const chamberGrad = ctx.createLinearGradient(0, 0, 0, height);
      chamberGrad.addColorStop(0, '#06070a');
      chamberGrad.addColorStop(0.15, '#0b0d13');
      chamberGrad.addColorStop(0.5, '#10131c');
      chamberGrad.addColorStop(0.85, '#0b0d13');
      chamberGrad.addColorStop(1, '#06070a');
      ctx.fillStyle = chamberGrad;
      ctx.fillRect(0, 0, width, height);

      // Inner drop shadow inside the chamber
      const innerShadow = ctx.createLinearGradient(0, 0, 0, height);
      innerShadow.addColorStop(0, 'rgba(0,0,0,0.95)');
      innerShadow.addColorStop(0.12, 'rgba(0,0,0,0.45)');
      innerShadow.addColorStop(0.5, 'rgba(0,0,0,0)');
      innerShadow.addColorStop(0.88, 'rgba(0,0,0,0.45)');
      innerShadow.addColorStop(1, 'rgba(0,0,0,0.95)');
      ctx.fillStyle = innerShadow;
      ctx.fillRect(0, 0, width, height);

      // Reel Geometry calculations - strictly responsive for mobile, desktop, and landscape
      const reelCount = 3;
      const isCompact = width < 480 || height < 340;
      const dividerWidth = isCompact ? Math.max(3, Math.round(width * 0.012)) : Math.max(5, Math.round(width * 0.018));
      const totalDividers = (reelCount - 1) * dividerWidth;
      const sidePadding = isCompact ? Math.max(2, Math.round(width * 0.008)) : Math.max(4, Math.round(width * 0.015));
      const availableReelWidth = width - sidePadding * 2 - totalDividers;
      const reelWidth = availableReelWidth / reelCount;

      const centerY = height / 2;
      // Cylinder radius & row pitch: ensures 3 rows are spaced cleanly and never squished on mobile or landscape
      const rowPitch = height * 0.265;
      const cylinderRadius = height * 0.53;
      const anglePerSymbol = Math.asin(Math.min(0.85, rowPitch / cylinderRadius)); // ~0.524 rad (~30°)
      const topSpeed = 26; // Symbols per second at full spin

      // Responsive symbol dimensions: bounds by BOTH width and vertical pitch
      // Prevents vertical collision on small heights while maximizing size in landscape
      const maxW = reelWidth * (isCompact ? 0.88 : 0.84);
      const maxH = rowPitch * 1.08;
      const baseSize = Math.max(20, Math.min(maxW, maxH));

      // 2. Update Physics for each reel
      for (let i = 0; i < 3; i++) {
        const state = reelStates.current[i];
        state.phaseTimer += dt;

        switch (state.phase) {
          case 'ANTICIPATION': {
            // Small mechanical pull-up / anticipation recoil before downward release
            const dur = 0.12; // 120ms
            if (state.phaseTimer < dur) {
              const p = state.phaseTimer / dur;
              // Smooth upward recoil of ~0.25 symbols
              const recoil = Math.sin(p * Math.PI) * 0.28;
              state.currentPos -= recoil * dt * 4;
            } else {
              state.phase = 'ACCELERATING';
              state.phaseTimer = 0;
            }
            break;
          }

          case 'ACCELERATING': {
            // Smooth acceleration up to top speed
            const accelDuration = 0.35; // 350ms to reach max velocity
            const progress = Math.min(state.phaseTimer / accelDuration, 1);
            state.velocity = topSpeed * (progress * progress);
            state.currentPos += state.velocity * dt;

            if (progress >= 1) {
              state.phase = 'SPINNING';
              state.velocity = topSpeed;
            }
            break;
          }

          case 'SPINNING': {
            // High-speed constant crisp rotation
            state.velocity = topSpeed;
            state.currentPos += state.velocity * dt;
            break;
          }

          case 'DECELERATING': {
            // Smooth deceleration approaching target position
            const remaining = state.targetPos - state.currentPos;
            if (remaining > 0.05) {
              // Smooth exponential deceleration
              state.velocity = Math.max(2.5, Math.min(topSpeed, remaining * 5.2));
              state.currentPos += state.velocity * dt;
            } else {
              // Transition to mechanical overshoot bounce
              state.phase = 'BOUNCING';
              state.phaseTimer = 0;
              state.currentPos = state.targetPos;
              state.overshootAmp = 0.32; // Overhang amplitude in symbols
            }
            break;
          }

          case 'BOUNCING': {
            // Mechanical spring-damped oscillation settling dead center
            const bounceDuration = 0.38;
            if (state.phaseTimer < bounceDuration) {
              const t = state.phaseTimer;
              const damping = Math.exp(-t * 9.5);
              const osc = Math.sin(t * 28) * state.overshootAmp * damping;
              state.currentPos = state.targetPos + osc;
            } else {
              state.phase = 'IDLE';
              state.currentPos = state.targetPos;
              state.velocity = 0;
              onReelSettledRef.current?.(i);

              // Check if all 3 reels have settled
              const allIdle = reelStates.current.every((r) => r.phase === 'IDLE');
              if (allIdle && hasEverSpun.current) {
                hasEverSpun.current = false;
                onAllReelsSettledRef.current?.();
              }
            }
            break;
          }

          case 'IDLE':
          default:
            break;
        }

        // Keep currentPos bounded to avoid numeric overflow over long runs
        const len = state.strip.length;
        if (state.phase === 'IDLE') {
          state.currentPos = ((state.currentPos % len) + len) % len;
          state.targetPos = state.currentPos;
        }
      }

      // Check if all 3 reels are completely settled in IDLE phase
      const allReelsIdle = reelStates.current.every((r) => r.phase === 'IDLE');

      // Check which rows are winning for illumination (ONLY allowed when all reels are IDLE)
      const isWinningRow = (reelIndex: number, rowIdx: number) => {
        if (!allReelsIdle || !winningLines || winningLines.length === 0) return false;
        // Lines: 1=top(row 0), 2=mid(row 1), 3=bot(row 2), 4=diag top-left, 5=diag bot-left
        if (winningLines.includes(1) && rowIdx === 0) return true;
        if (winningLines.includes(2) && rowIdx === 1) return true;
        if (winningLines.includes(3) && rowIdx === 2) return true;
        if (winningLines.includes(4)) {
          if (reelIndex === 0 && rowIdx === 0) return true;
          if (reelIndex === 1 && rowIdx === 1) return true;
          if (reelIndex === 2 && rowIdx === 2) return true;
        }
        if (winningLines.includes(5)) {
          if (reelIndex === 0 && rowIdx === 2) return true;
          if (reelIndex === 1 && rowIdx === 1) return true;
          if (reelIndex === 2 && rowIdx === 0) return true;
        }
        return false;
      };

      const hasAnyWin = allReelsIdle && winningLines && winningLines.length > 0;

      // Row Y positions and Reel X Centers (calibrated exactly with rowPitch)
      const rowYPositions = [
        centerY - rowPitch, // Top row (row 0)
        centerY, // Middle row (row 1)
        centerY + rowPitch, // Bottom row (row 2)
      ];

      const reelXCenters = [
        sidePadding + reelWidth / 2,
        sidePadding + reelWidth + dividerWidth + reelWidth / 2,
        sidePadding + (reelWidth + dividerWidth) * 2 + reelWidth / 2,
      ];

      winSymbolPopRef.current.setWinMeterTarget(width * 0.5, height * 1.12);

      // Trigger 3D Physical Symbol Pop forward when win lands and all reels are idle
      if (allReelsIdle && winningLines && winningLines.length > 0) {
        const popIntensity =
          winTier === 'JACKPOT'
            ? 'huge'
            : winTier === 'MEGA_WIN' || winTier === 'BIG_WIN'
            ? 'big'
            : 'normal';

        for (let r = 0; r < reelCount; r++) {
          const state = reelStates.current[r];
          const strip = state.strip;
          const len = strip.length;
          for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
            if (isWinningRow(r, rowIdx)) {
              const symIndex = Math.round(state.currentPos) + (rowIdx - 1);
              const wrappedIdx = ((symIndex % len) + len) % len;
              const symType = strip[wrappedIdx];
              winSymbolPopRef.current.triggerPop(
                r,
                rowIdx,
                symType,
                reelXCenters[r],
                rowYPositions[rowIdx],
                baseSize,
                baseSize,
                popIntensity
              );
            }
          }
        }
      } else if (!allReelsIdle) {
        winSymbolPopRef.current.clear();
      }

      // 3. DRAW EACH REEL CYLINDER
      for (let r = 0; r < reelCount; r++) {
        const reelX = sidePadding + r * (reelWidth + dividerWidth);
        const state = reelStates.current[r];
        const strip = state.strip;
        const len = strip.length;

        ctx.save();
        // Clip to this individual reel column
        ctx.beginPath();
        ctx.rect(reelX, 0, reelWidth, height);
        ctx.clip();

        // 3A. Draw Realistic 3D Cylindrical Drum Surface with Circular Machine Bend
        // 1. Vertical cylinder gradient: dark top & bottom bending into cabinet, bright center apex
        const drumGrad = ctx.createLinearGradient(0, 0, 0, height);
        drumGrad.addColorStop(0, '#0c0d12');
        drumGrad.addColorStop(0.14, '#1b1d24');
        drumGrad.addColorStop(0.30, '#ede9e3');
        drumGrad.addColorStop(0.5, '#ffffff');
        drumGrad.addColorStop(0.70, '#ede9e3');
        drumGrad.addColorStop(0.86, '#1b1d24');
        drumGrad.addColorStop(1, '#0c0d12');
        ctx.fillStyle = drumGrad;
        ctx.fillRect(reelX, 0, reelWidth, height);

        // 2. Horizontal Convex Drum Curvature (Gives each drum a 3D rounded circular profile)
        const drumHoriz = ctx.createLinearGradient(reelX, 0, reelX + reelWidth, 0);
        drumHoriz.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
        drumHoriz.addColorStop(0.06, 'rgba(255, 255, 255, 0.08)');
        drumHoriz.addColorStop(0.2, 'rgba(255, 255, 255, 0.02)');
        drumHoriz.addColorStop(0.5, 'rgba(255, 255, 255, 0.16)');
        drumHoriz.addColorStop(0.8, 'rgba(255, 255, 255, 0.02)');
        drumHoriz.addColorStop(0.94, 'rgba(255, 255, 255, 0.08)');
        drumHoriz.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = drumHoriz;
        ctx.fillRect(reelX, 0, reelWidth, height);

        // 3. Machined Drum Wheel Flanges (Left & right metallic circular disc rims)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.fillRect(reelX, 0, 1.5, height);
        ctx.fillRect(reelX + reelWidth - 1.5, 0, 1.5, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(reelX + 1.5, 0, 1, height);
        ctx.fillRect(reelX + reelWidth - 2.5, 0, 1, height);

        // Center Payline Golden Laser Sightline Guide
        ctx.fillStyle = 'rgba(245, 158, 11, 0.07)';
        ctx.fillRect(reelX, centerY - height * 0.155, reelWidth, height * 0.31);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.28)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(reelX, centerY - height * 0.155);
        ctx.lineTo(reelX + reelWidth, centerY - height * 0.155);
        ctx.moveTo(reelX, centerY + height * 0.155);
        ctx.lineTo(reelX + reelWidth, centerY + height * 0.155);
        ctx.stroke();

        // 3B. Render 3D Cylindrical Symbols along the circular strip
        // Find visible symbols around currentPos
        const curCenter = state.currentPos;
        const centerInt = Math.floor(curCenter);

        // Render from -3 to +3 positions relative to current center
        for (let offset = -3; offset <= 3; offset++) {
          const symIndex = centerInt + offset;
          const delta = symIndex - curCenter;
          const theta = delta * anglePerSymbol; // Angle on cylinder in radians

          // Only render symbols on the facing hemisphere
          if (theta < -Math.PI / 2.05 || theta > Math.PI / 2.05) continue;

          // 3D Circular Mathematical Projection:
          // y = centerY + R * sin(theta)
          const projY = centerY + cylinderRadius * Math.sin(theta);
          const cosTheta = Math.cos(theta);

          // CIRCULAR MACHINE BEND FORESHORTENING:
          // Height squashes dramatically as the symbol curves over the cylinder (cosTheta^1.55)
          // Width stays broad across the drum face (cosTheta^0.22)
          const scaleY = Math.pow(cosTheta, 1.55);
          const scaleX = Math.pow(cosTheta, 0.22);

          // Wrapped symbol index in the strip
          const wrappedIdx = ((symIndex % len) + len) % len;
          const symbolType = strip[wrappedIdx];

          // Determine row index if stopped: -1 = top row, 0 = center row, 1 = bottom row
          const roundedDelta = Math.round(delta);
          const isAtRow = Math.abs(delta - roundedDelta) < 0.25;
          let rowIdx = -1;
          if (isAtRow) {
            if (roundedDelta === -1) rowIdx = 0; // Top row
            else if (roundedDelta === 0) rowIdx = 1; // Middle row
            else if (roundedDelta === 1) rowIdx = 2; // Bottom row
          }

          const isWin =
            state.phase === 'IDLE' && rowIdx !== -1 && isWinningRow(r, rowIdx);
          const isDim =
            state.phase === 'IDLE' && hasAnyWin && !isWin && rowIdx !== -1;

          const winScale = isWin ? 1.08 : 1.0;
          const drawW = baseSize * scaleX * winScale;
          const drawH = baseSize * scaleY * winScale;

          // Get crisp pre-rendered high-res 3D sprite
          const sprite = getSymbolSprite(symbolType);

          ctx.save();
          ctx.translate(reelX + reelWidth / 2, projY);

          const isPopping = isWin && winSymbolPopRef.current.isSymbolPopping(r, rowIdx);

          // Alpha & Curvature lighting: Natural cylindrical falloff towards top/bottom edges
          let symbolAlpha = Math.max(0.38, Math.pow(cosTheta, 1.35));
          if (isDim) symbolAlpha *= 0.25; // Darken non-winning symbols
          ctx.globalAlpha = symbolAlpha;

          // If the symbol is popping, render its drum contact shadow & socket,
          // while the unclipped foreground layer renders the full popping 3D symbol!
          if (isPopping) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.roundRect(-drawW * 0.48, -drawH * 0.48, drawW * 0.96, drawH * 0.96, 12);
            ctx.fill();
            ctx.restore();
            continue;
          }

          // Soft 3D cast contact shadow onto the curved drum beneath each symbol
          ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
          ctx.shadowOffsetY = 6 * cosTheta;
          ctx.shadowBlur = 8;

          // Winning Symbol Radiant Gold Halo
          if (isWin) {
            const auraPulse = 0.5 + 0.5 * Math.sin(timestamp * 0.008);
            ctx.save();
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20 + auraPulse * 10;
            ctx.beginPath();
            ctx.roundRect(-drawW * 0.53, -drawH * 0.53, drawW * 1.06, drawH * 1.06, 12);
            ctx.fillStyle = `rgba(255, 215, 0, ${0.30 + auraPulse * 0.20})`;
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#FEF08A';
            ctx.stroke();
            ctx.restore();
          }

          // Draw the Crisp 3D Symbol wrapped on the circular machine drum
          ctx.drawImage(sprite, -drawW / 2, -drawH / 2, drawW, drawH);

          ctx.restore();
        }

        // 3C. Curved Drum Hood Shadows (Arched Circular Mechanical Aperture)
        // Dynamically clamped relative to top & bottom symbol boundaries so symbols on Row 0 and Row 2 are NEVER obscured in landscape mode!
        const topSymbolTopEdge = (centerY - rowPitch) - (baseSize * 0.48);
        const maxAllowedDip = Math.max(4, Math.min(height * 0.13, topSymbolTopEdge - 2));
        const hoodDip = Math.max(4, maxAllowedDip);
        const hoodDepth = Math.max(3, hoodDip * 0.65);

        // Top Arched Hood: Curves gently above the top row
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(reelX, 0);
        ctx.lineTo(reelX + reelWidth, 0);
        ctx.lineTo(reelX + reelWidth, hoodDepth);
        ctx.quadraticCurveTo(reelX + reelWidth / 2, hoodDip, reelX, hoodDepth);
        ctx.closePath();
        const topCurvedShadow = ctx.createLinearGradient(0, 0, 0, hoodDip);
        topCurvedShadow.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
        topCurvedShadow.addColorStop(0.5, 'rgba(0, 0, 0, 0.55)');
        topCurvedShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = topCurvedShadow;
        ctx.fill();
        ctx.restore();

        // Bottom Arched Hood: Curves gently below the bottom row
        const botHoodDepth = height - hoodDepth;
        const botHoodDip = height - hoodDip;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(reelX, height);
        ctx.lineTo(reelX + reelWidth, height);
        ctx.lineTo(reelX + reelWidth, botHoodDepth);
        ctx.quadraticCurveTo(reelX + reelWidth / 2, botHoodDip, reelX, botHoodDepth);
        ctx.closePath();
        const botCurvedShadow = ctx.createLinearGradient(0, height, 0, botHoodDip);
        botCurvedShadow.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
        botCurvedShadow.addColorStop(0.5, 'rgba(0, 0, 0, 0.55)');
        botCurvedShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = botCurvedShadow;
        ctx.fill();
        ctx.restore();

        // 3D Center Specular Horizon Highlight (Eye-level reflection on convex drum)
        ctx.save();
        const centerHighlight = ctx.createLinearGradient(0, centerY - 28, 0, centerY + 28);
        centerHighlight.addColorStop(0, 'rgba(255,255,255,0)');
        centerHighlight.addColorStop(0.5, 'rgba(255,255,255,0.20)');
        centerHighlight.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = centerHighlight;
        ctx.fillRect(reelX, centerY - 28, reelWidth, 56);
        ctx.restore();

        ctx.restore();

        // 4. DRAW 3D MACHINED BRASS / CHROME DIVIDERS BETWEEN REELS
        if (r < reelCount - 1) {
          const divX = reelX + reelWidth;
          ctx.save();
          // Divider Shadow on left reel
          const divLeftShadow = ctx.createLinearGradient(divX - 4, 0, divX, 0);
          divLeftShadow.addColorStop(0, 'rgba(0,0,0,0)');
          divLeftShadow.addColorStop(1, 'rgba(0,0,0,0.7)');
          ctx.fillStyle = divLeftShadow;
          ctx.fillRect(divX - 4, 0, 4, height);

          // Divider Body (3D Gold/Brass Ingot Pillar)
          const divGrad = ctx.createLinearGradient(divX, 0, divX + dividerWidth, 0);
          divGrad.addColorStop(0, '#451A03');
          divGrad.addColorStop(0.2, '#B45309');
          divGrad.addColorStop(0.5, '#FEF08A');
          divGrad.addColorStop(0.8, '#B45309');
          divGrad.addColorStop(1, '#451A03');
          ctx.fillStyle = divGrad;
          ctx.fillRect(divX, 0, dividerWidth, height);

          // Center groove along divider
          ctx.fillStyle = 'rgba(20, 5, 2, 0.6)';
          ctx.fillRect(divX + dividerWidth / 2 - 1, 0, 2, height);

          // Divider Shadow on right reel
          const divRightShadow = ctx.createLinearGradient(
            divX + dividerWidth,
            0,
            divX + dividerWidth + 4,
            0
          );
          divRightShadow.addColorStop(0, 'rgba(0,0,0,0.7)');
          divRightShadow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = divRightShadow;
          ctx.fillRect(divX + dividerWidth, 0, 4, height);

          // Fastener Screws on dividers (Top, Middle, Bottom)
          [height * 0.1, centerY, height * 0.9].forEach((sy) => {
            ctx.beginPath();
            ctx.arc(divX + dividerWidth / 2, sy, dividerWidth * 0.28, 0, Math.PI * 2);
            ctx.fillStyle = '#FEF08A';
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 3;
            ctx.fill();
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = '#451A03';
            ctx.stroke();
          });

          ctx.restore();
        }
      }

      // 4B. RENDER 3D PHYSICAL POPPING SYMBOLS, GOD-RAYS & SPARKS (Unclipped Foreground Pass)
      // Symbols physically pop forward out of the cylindrical drum towards the player!
      winSymbolPopRef.current.update(dt, timestamp * 0.001);
      winSymbolPopRef.current.drawForeground(ctx, getSymbolSprite, timestamp);

      // 5. DRAW ACTIVE PAYLINES OVERLAY (Crisp Laser Glow Vectors)
      // Paylines MUST NEVER appear until all 3 reels are in IDLE phase and fully settled
      const activeLines = hoveredPayline
        ? [hoveredPayline]
        : allReelsIdle
        ? winningLines
        : [];
      if (activeLines && activeLines.length > 0) {
        ctx.save();

        activeLines.forEach((lineId) => {
          let rows: [number, number, number] = [1, 1, 1];
          let color = '#FFD700';

          if (lineId === 1) {
            rows = [0, 0, 0];
            color = '#EF4444'; // Red line
          } else if (lineId === 2) {
            rows = [1, 1, 1];
            color = '#F59E0B'; // Gold line
          } else if (lineId === 3) {
            rows = [2, 2, 2];
            color = '#3B82F6'; // Blue line
          } else if (lineId === 4) {
            rows = [0, 1, 2];
            color = '#10B981'; // Green diagonal
          } else if (lineId === 5) {
            rows = [2, 1, 0];
            color = '#EC4899'; // Magenta diagonal
          }

          const pt0 = { x: reelXCenters[0], y: rowYPositions[rows[0]] };
          const pt1 = { x: reelXCenters[1], y: rowYPositions[rows[1]] };
          const pt2 = { x: reelXCenters[2], y: rowYPositions[rows[2]] };

          // Animated pulse
          const linePulse = 0.7 + 0.3 * Math.sin(timestamp * 0.01 + lineId);

          // Outer Laser Glow
          ctx.beginPath();
          ctx.moveTo(pt0.x, pt0.y);
          ctx.lineTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.lineWidth = 8;
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.45 * linePulse;
          ctx.shadowColor = color;
          ctx.shadowBlur = 18;
          ctx.stroke();

          // Core High-Intensity Laser
          ctx.beginPath();
          ctx.moveTo(pt0.x, pt0.y);
          ctx.lineTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.lineWidth = 3.5;
          ctx.strokeStyle = '#FFFFFF';
          ctx.globalAlpha = 0.95;
          ctx.shadowBlur = 8;
          ctx.stroke();

          // Glowing nodes on symbols
          [pt0, pt1, pt2].forEach((pt) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
          });
        });
        ctx.restore();
      }

      // 6. REALISTIC CIRCULAR MACHINE GLASS OVERLAY & CYLINDRICAL SPECULAR REFLECTION
      ctx.save();
      // Cylindrical Curved Lens Glare (Convex glass bulb reflection)
      const lensGrad = ctx.createLinearGradient(0, 0, width, height);
      lensGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      lensGrad.addColorStop(0.24, 'rgba(255, 255, 255, 0.18)');
      lensGrad.addColorStop(0.30, 'rgba(255, 255, 255, 0.03)');
      lensGrad.addColorStop(0.68, 'rgba(255, 255, 255, 0)');
      lensGrad.addColorStop(0.82, 'rgba(255, 255, 255, 0.08)');
      lensGrad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
      ctx.fillStyle = lensGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Circular Machine Hood Shadow (Cabinet depth shadow)
      const cabShadowH = Math.min(24, height * 0.10);
      const topCabinetShadow = ctx.createLinearGradient(0, 0, 0, cabShadowH);
      topCabinetShadow.addColorStop(0, 'rgba(0, 0, 0, 0.90)');
      topCabinetShadow.addColorStop(0.6, 'rgba(0, 0, 0, 0.40)');
      topCabinetShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topCabinetShadow;
      ctx.fillRect(0, 0, width, cabShadowH);

      // Bottom Circular Machine Hood Shadow
      const botCabinetShadow = ctx.createLinearGradient(0, height - cabShadowH, 0, height);
      botCabinetShadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
      botCabinetShadow.addColorStop(0.6, 'rgba(0, 0, 0, 0.40)');
      botCabinetShadow.addColorStop(1, 'rgba(0, 0, 0, 0.90)');
      ctx.fillStyle = botCabinetShadow;
      ctx.fillRect(0, height - cabShadowH, width, cabShadowH);

      // Top Glass Beveled Lip
      const topGlassLip = ctx.createLinearGradient(0, 0, 0, 6);
      topGlassLip.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      topGlassLip.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = topGlassLip;
      ctx.fillRect(0, 0, width, 6);

      // Bottom Glass Beveled Lip
      const botGlassLip = ctx.createLinearGradient(0, height - 6, 0, height);
      botGlassLip.addColorStop(0, 'rgba(0, 0, 0, 0)');
      botGlassLip.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
      ctx.fillStyle = botGlassLip;
      ctx.fillRect(0, height - 6, width, 6);

      ctx.restore();

      ctx.restore();
    },
    [winningLines, hoveredPayline]
  );

  // RAF Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      renderFrame(now, dt);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  return (
    <canvas
      ref={canvasRef}
      id="cylindrical-reel-canvas"
      className="w-full h-full block cursor-default pointer-events-none select-none"
    />
  );
};
