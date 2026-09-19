import React, { useMemo } from 'react';

interface EmberParticle {
  id: number;
  left: number; // percentage (0 - 100)
  size: number; // px (2 - 6)
  duration: number; // seconds
  delay: number; // seconds
  driftX: number; // px horizontal drift
  swayDistance: number; // px
  color: string;
  boxShadow: string;
}

interface BokehOrb {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  opacity: number;
}

interface FireEffectsProps {
  intensity?: 'low' | 'normal' | 'high' | 'jackpot';
  className?: string;
}

export const FireEffects: React.FC<FireEffectsProps> = ({
  intensity = 'normal',
  className = '',
}) => {
  const emberCount = useMemo(() => {
    switch (intensity) {
      case 'low':
        return 20;
      case 'high':
        return 45;
      case 'jackpot':
        return 75;
      case 'normal':
      default:
        return 32;
    }
  }, [intensity]);

  // Deterministic GPU-accelerated golden & ruby embers
  const embers: EmberParticle[] = useMemo(() => {
    const colors = [
      '#ffffff', // Spark
      '#fff6b0', // Pale gold
      '#ffd700', // Classic gold
      '#ff9500', // Amber flame
      '#ff3b30', // Ruby fire
      '#dc2626', // Deep crimson
    ];

    return Array.from({ length: emberCount }, (_, i) => {
      const spread = 6 + ((i * 29) % 88); // 6% to 94% width
      const size = 2 + ((i * 3) % 4.5); // 2px to 5.5px
      const duration = 3.5 + ((i * 7) % 35) / 10; // 3.5s to 7.0s
      const delay = -((i * 13) % 60) / 10; // negative delay so already in motion
      const driftX = (((i * 19) % 80) - 40); // -40px to +40px drift
      const swayDistance = 8 + ((i * 7) % 18); // 8px to 26px
      const color = colors[i % colors.length];
      const boxShadow = `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px rgba(255, 69, 0, 0.7)`;

      return {
        id: i,
        left: spread,
        size,
        duration,
        delay,
        driftX,
        swayDistance,
        color,
        boxShadow,
      };
    });
  }, [emberCount]);

  // Layer 2: Subtle blurred arcade/casino-inspired shapes (bokeh/lights)
  const bokehOrbs: BokehOrb[] = useMemo(() => {
    const colors = [
      'rgba(239, 68, 68, 0.16)',  // Ruby Red
      'rgba(245, 158, 11, 0.14)', // Warm Amber
      'rgba(220, 38, 38, 0.18)',  // Crimson
      'rgba(251, 191, 36, 0.12)', // Bright Gold
    ];

    return [
      { id: 1, left: 12, top: 18, size: 260, color: colors[0], duration: 12, delay: 0, opacity: 0.7 },
      { id: 2, left: 82, top: 22, size: 240, color: colors[1], duration: 14, delay: -4, opacity: 0.65 },
      { id: 3, left: 25, top: 75, size: 280, color: colors[2], duration: 16, delay: -8, opacity: 0.6 },
      { id: 4, left: 75, top: 70, size: 270, color: colors[3], duration: 13, delay: -2, opacity: 0.65 },
      { id: 5, left: 50, top: 40, size: 340, color: 'rgba(239, 68, 68, 0.22)', duration: 10, delay: -6, opacity: 0.8 },
      { id: 6, left: 4, top: 50, size: 190, color: colors[1], duration: 15, delay: -5, opacity: 0.5 },
      { id: 7, left: 92, top: 45, size: 200, color: colors[0], duration: 11, delay: -3, opacity: 0.5 },
    ];
  }, []);

  return (
    <div
      id="fire-effects-atmosphere"
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}
    >
      <style>{`
        @keyframes deepAtmosphereBreath {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes bokehDrift {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(15px, -20px, 0) scale(1.12);
          }
        }

        @keyframes emberFloat {
          0% {
            transform: translate3d(0, 15px, 0) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
            transform: translate3d(calc(var(--sway) * 0.5), -15vh, 0) scale(1.05);
          }
          50% {
            opacity: 0.85;
            transform: translate3d(calc(var(--sway) * -0.8), -48vh, 0) scale(0.9);
          }
          85% {
            opacity: 0.45;
            transform: translate3d(calc(var(--sway) * 0.7 + var(--drift)), -80vh, 0) scale(0.65);
          }
          100% {
            transform: translate3d(calc(var(--drift) * 1.2), -105vh, 0) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes cabinetHaloPulse {
          0%, 100% {
            opacity: 0.65;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.03);
          }
        }

        .ember-spark {
          position: absolute;
          bottom: -15px;
          border-radius: 50%;
          will-change: transform, opacity;
          animation: emberFloat linear infinite;
        }
      `}</style>

      {/* Floating Golden & Ruby Ember Sparks (100% transparent overlay) */}
      {embers.map((ember) => (
        <div
          key={`ember-${ember.id}`}
          className="ember-spark"
          style={
            {
              left: `${ember.left}%`,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              backgroundColor: ember.color,
              boxShadow: ember.boxShadow,
              animationDuration: `${ember.duration}s`,
              animationDelay: `${ember.delay}s`,
              '--drift': `${ember.driftX}px`,
              '--sway': `${ember.swayDistance}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

