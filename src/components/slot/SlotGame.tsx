import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SlotSymbol, PrizeNumber, SpinResult, SlotGameState } from '../../lib/slot/types';
import { gameEngine, DEFAULT_BET_LEVELS } from '../../lib/slot/gameEngine';
import { soundEffects } from '../../lib/slot/soundEffects';
import { SlotCabinet3D } from './SlotCabinet3D';
import { WinEffects } from './WinEffects';
import { Paytable } from './Paytable';
import { SimulationModal } from './SimulationModal';
import { DevModePanel } from './DevModePanel';
import { RedCasinoBackground } from './RedCasinoBackground';
import { LoadingScreen } from './LoadingScreen';
import { RotatePrompt } from './RotatePrompt';

// DEV_MODE configuration: set to false in production builds
const DEV_MODE_ENABLED = true;

export const SlotGame: React.FC = () => {
  // Loading & Asset Warmup State
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Game Financial & Session State
  const [balance, setBalance] = useState<number>(500.0);
  const [betIndex, setBetIndex] = useState<number>(0); // $0.50 default
  const [win, setWin] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundEffects.isEnabled());
  const [volume, setVolume] = useState<number>(() => soundEffects.getVolume());
  const [paytableOpen, setPaytableOpen] = useState<boolean>(false);
  const [simulationOpen, setSimulationOpen] = useState<boolean>(false);
  const [devModeOpen, setDevModeOpen] = useState<boolean>(false);

  // Strict State Machine
  const [gameState, setGameState] = useState<SlotGameState>('IDLE');
  const gameStateRef = useRef<SlotGameState>('IDLE');
  gameStateRef.current = gameState;

  // Reels Visual Matrix
  const [reels, setReels] = useState<[
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol],
    [SlotSymbol, SlotSymbol, SlotSymbol]
  ]>([
    ['DOUBLE_BAR', 'BAR', 'BAR'],
    ['WHITE_SEVEN', 'WILD', 'WHITE_SEVEN'],
    ['TRIPLE_BAR', 'SEVEN', 'SEVEN'],
  ]);
  const [prizeNumber, setPrizeNumber] = useState<PrizeNumber>(50);

  // Reel motion states
  const [spinningReels, setSpinningReels] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [prizeSpinning, setPrizeSpinning] = useState<boolean>(false);

  // Paylines & Outcome
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [hoveredPayline, setHoveredPayline] = useState<number | null>(null);
  const [activeResult, setActiveResult] = useState<SpinResult | null>(null);

  const currentBet = DEFAULT_BET_LEVELS[betIndex] ?? 0.5;

  // Timers and Synchronous Refs
  const timeoutsRef = useRef<number[]>([]);
  const isSpinningRef = useRef<boolean>(false);
  const pendingResultRef = useRef<SpinResult | null>(null);
  const autoSpinRef = useRef(autoSpin);
  autoSpinRef.current = autoSpin;

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Sound Controls
  const handleToggleSound = () => {
    const newState = soundEffects.toggleSound();
    setSoundEnabled(newState);
    setVolume(soundEffects.getVolume());
  };

  const handleVolumeChange = (newVol: number) => {
    soundEffects.setVolume(newVol);
    setVolume(newVol);
    setSoundEnabled(newVol > 0);
  };

  // Bet Adjustments
  const handleBetChange = (delta: number) => {
    if (isSpinningRef.current || isSpinning) return;
    soundEffects.playButtonClick(delta > 0 ? 'bet_up' : 'bet_down');
    setBetIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next >= DEFAULT_BET_LEVELS.length) return DEFAULT_BET_LEVELS.length - 1;
      return next;
    });
  };

  const handleMaxBet = () => {
    if (isSpinningRef.current || isSpinning) return;
    soundEffects.playButtonClick('max_bet');
    setBetIndex(DEFAULT_BET_LEVELS.length - 1);
  };

  const handleToggleAuto = () => {
    soundEffects.playButtonClick('default');
    setAutoSpin((prev) => !prev);
  };

  // Keyboard shortcut: Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'BUTTON')) return;
        e.preventDefault();
        if (isSpinningRef.current) {
          handleFastStop();
        } else {
          executeSpin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Spin Execution Pipeline
  const runSpinWithResult = useCallback((result: SpinResult) => {
    if (!result || !result.reels || !Array.isArray(result.reels) || !result.reels[0]) {
      console.error('Invalid spin outcome structure:', result);
      isSpinningRef.current = false;
      setIsSpinning(false);
      setSpinningReels([false, false, false]);
      setPrizeSpinning(false);
      setGameState('IDLE');
      return;
    }

    clearAllTimeouts();

    // 1. Deduct Bet & Lock
    isSpinningRef.current = true;
    pendingResultRef.current = result;
    setIsSpinning(true);
    setGameState('SPINNING');

    // Clear previous winning lines & animations immediately
    setWinningLines([]);
    setWin(0);
    setActiveResult(null);
    setBalance((prev) => Math.max(0, Math.round((prev - currentBet) * 100) / 100));

    // Anticipation check
    const r1 = result.reels[0];
    const r2 = result.reels[1];
    let hasPotentialWin = false;
    const paylinePairs = [
      [0, 0],
      [1, 1],
      [2, 2],
      [0, 1],
      [2, 1],
    ];
    for (const [row1, row2] of paylinePairs) {
      const s1 = r1[row1];
      const s2 = r2[row2];
      if (s1 === s2 || s1 === 'WILD' || s2 === 'WILD') {
        if (
          s1 === 'SEVEN' ||
          s2 === 'SEVEN' ||
          s1 === 'WHITE_SEVEN' ||
          s2 === 'WHITE_SEVEN' ||
          s1 === 'WILD' ||
          s2 === 'WILD' ||
          s1 === 'TRIPLE_BAR' ||
          s2 === 'TRIPLE_BAR'
        ) {
          hasPotentialWin = true;
          break;
        }
      }
    }

    // 2. Play spin audio & start all reels
    soundEffects.playSpinStart();
    setSpinningReels([true, true, true]);
    setPrizeSpinning(true);

    // 3. Sequential Reel Stopping Schedule:
    // Reel 1 stop signal at 700ms
    const t1 = window.setTimeout(() => {
      try {
        setGameState('STOPPING_REEL_1');
        setReels((prev) => [result.reels[0], prev[1], prev[2]]);
        setSpinningReels([false, true, true]);
        soundEffects.playReelStop(0);
      } catch (err) {
        console.error('Error stopping Reel 1:', err);
      }
    }, 700);
    timeoutsRef.current.push(t1);

    // Reel 2 stop signal at 1100ms
    const t2 = window.setTimeout(() => {
      try {
        setGameState('STOPPING_REEL_2');
        setReels((prev) => [result.reels[0], result.reels[1], prev[2]]);
        setSpinningReels([false, false, true]);
        soundEffects.playReelStop(1);

        if (hasPotentialWin) {
          soundEffects.startAnticipation();
        }
      } catch (err) {
        console.error('Error stopping Reel 2:', err);
      }
    }, 1100);
    timeoutsRef.current.push(t2);

    // Reel 3 stop signal at 1550ms
    const t3 = window.setTimeout(() => {
      try {
        setGameState('STOPPING_REEL_3');
        setReels((prev) => [result.reels[0], result.reels[1], result.reels[2]]);
        setSpinningReels([false, false, false]);
        soundEffects.stopAnticipation();
        soundEffects.playReelStop(2, hasPotentialWin);

        // Lock Multiplier value alongside Reel 3
        setPrizeNumber(result.number);
        setPrizeSpinning(false);
        soundEffects.playPrizeReelStop(result.number);
      } catch (err) {
        console.error('Error stopping Reel 3:', err);
      }
    }, 1550);
    timeoutsRef.current.push(t3);
  }, [currentBet]);

  // Handle all reels fully settled (called by CylindricalReelCanvas physics loop)
  const handleAllReelsSettled = useCallback(() => {
    const result = pendingResultRef.current;
    if (!result) return;
    if (gameStateRef.current !== 'STOPPING_REEL_3' && gameStateRef.current !== 'SPINNING') return;

    // Transition state: REELS ARE COMPLETELY STOPPED AND SETTLED
    setGameState('REELS_SETTLED');

    // Strict delay: WAIT ~100–200ms before revealing winning paylines (mandated requirement)
    const tReveal = window.setTimeout(() => {
      setGameState('WIN_REVEAL');

      if (result.winAmount > 0) {
        // Reveal winning paylines & highlight winning symbols
        setWinningLines(result.winningLines || []);
        setWin(result.winAmount);
        setBalance((prev) => Math.round((prev + result.winAmount) * 100) / 100);
        setActiveResult(result);

        // Play appropriate win audio
        if (result.winTier === 'JACKPOT') {
          soundEffects.playJackpotFanfare();
        } else if (result.winTier === 'MEGA_WIN') {
          soundEffects.playWin('MEGA');
        } else if (result.winTier === 'BIG_WIN') {
          soundEffects.playWin('BIG');
        } else if (result.winAmount >= currentBet * 5) {
          soundEffects.playWin('MEDIUM');
        } else {
          soundEffects.playWin('SMALL');
        }

        setGameState('WIN_ANIMATION');

        const animDuration =
          result.winTier === 'JACKPOT'
            ? 3800
            : result.winTier === 'MEGA_WIN'
            ? 3200
            : result.winTier === 'BIG_WIN'
            ? 2500
            : 1300;

        const tComplete = window.setTimeout(() => {
          setGameState('COMPLETE');
          isSpinningRef.current = false;
          setIsSpinning(false);
          setGameState('IDLE');

          // Auto-spin trigger
          if (autoSpinRef.current) {
            const tNext = window.setTimeout(() => {
              if (autoSpinRef.current && !isSpinningRef.current) {
                executeSpin();
              }
            }, 600);
            timeoutsRef.current.push(tNext);
          }
        }, animDuration);
        timeoutsRef.current.push(tComplete);
      } else {
        // Non-winning spin
        const tNoWin = window.setTimeout(() => {
          setGameState('COMPLETE');
          isSpinningRef.current = false;
          setIsSpinning(false);
          setGameState('IDLE');

          if (autoSpinRef.current) {
            const tNext = window.setTimeout(() => {
              if (autoSpinRef.current && !isSpinningRef.current) {
                executeSpin();
              }
            }, 500);
            timeoutsRef.current.push(tNext);
          }
        }, 300);
        timeoutsRef.current.push(tNoWin);
      }
    }, 160);
    timeoutsRef.current.push(tReveal);
  }, [currentBet]);

  // Execute normal cryptographic spin
  const executeSpin = useCallback(() => {
    if (isSpinningRef.current || isSpinning) return;
    if (balance < currentBet) {
      setAutoSpin(false);
      return;
    }
    const result = gameEngine.spin(currentBet);
    runSpinWithResult(result);
  }, [balance, currentBet, isSpinning, runSpinWithResult]);

  // Fast Stop (stops all reels crisply while respecting settlement sequence)
  const handleFastStop = useCallback(() => {
    if (!isSpinningRef.current) return;
    const result = pendingResultRef.current;
    if (!result) return;

    clearAllTimeouts();

    setReels([result.reels[0], result.reels[1], result.reels[2]]);
    setSpinningReels([false, false, false]);
    setPrizeNumber(result.number);
    setPrizeSpinning(false);
    soundEffects.stopAnticipation();
    soundEffects.playReelStop(2);
    soundEffects.playPrizeReelStop(result.number);
    setGameState('STOPPING_REEL_3');
  }, []);

  // Developer mode test win simulation
  const handleTestWin = (type: 'SEVENS' | 'WILDS') => {
    if (isSpinningRef.current) return;
    let mockResult: SpinResult;

    if (type === 'SEVENS') {
      mockResult = {
        reels: [
          ['SEVEN', 'SEVEN', 'BAR'],
          ['SEVEN', 'SEVEN', 'BAR'],
          ['SEVEN', 'SEVEN', 'BAR'],
        ],
        number: 50,
        prizeMultiplier: 50,
        baseWinAmount: currentBet * 50,
        winAmount: currentBet * 50 * 50,
        isJackpot: false,
        winTier: 'BIG_WIN',
        winningLines: [1, 2],
        lineWins: [],
      };
    } else {
      mockResult = {
        reels: [
          ['WILD', 'WHITE_SEVEN', 'BAR'],
          ['WILD', 'WHITE_SEVEN', 'BAR'],
          ['WILD', 'WHITE_SEVEN', 'BAR'],
        ],
        number: 100,
        prizeMultiplier: 100,
        baseWinAmount: currentBet * 100,
        winAmount: currentBet * 100 * 100,
        isJackpot: true,
        winTier: 'JACKPOT',
        winningLines: [1, 2, 3],
        lineWins: [],
        jackpotType: 'GRAND',
      };
    }

    runSpinWithResult(mockResult);
  };

  return (
    <div
      id="slot-root"
      className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between items-center p-0.5 sm:p-2 md:p-2.5 bg-[#45070e] text-white select-none"
    >
      {/* 0. Asset Preloader & Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* 0B. Portrait Orientation Guidance for Mobile */}
      <RotatePrompt />

      {/* 1. Luxurious Red-Themed Casino Background (Clean VIP lounge, no props, no people) */}
      <RedCasinoBackground
        isSpinning={isSpinning}
        winTier={activeResult?.winTier ?? null}
      />

      {/* 3. MAIN GAMEPLAY VIEWPORT: Dominant Centered 3D Casino Slot Machine Cabinet */}
      <main
        id="slot-main-stage"
        className="relative z-20 w-full flex-1 min-h-0 flex items-center justify-center px-1 sm:px-3 md:px-6 py-1 sm:py-2 my-auto overflow-visible"
      >
        <SlotCabinet3D
          reels={reels}
          spinningReels={spinningReels}
          winningLines={winningLines}
          hoveredPayline={hoveredPayline}
          winTier={activeResult?.winTier ?? null}
          prizeNumber={prizeNumber}
          prizeSpinning={prizeSpinning}
          currentBet={currentBet}
          hasWin={winningLines.length > 0}
          onHoverPayline={setHoveredPayline}
          onAllReelsSettled={handleAllReelsSettled}
          balance={balance}
          win={win}
          isSpinning={isSpinning}
          autoSpin={autoSpin}
          soundEnabled={soundEnabled}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          onSpin={executeSpin}
          onFastStop={handleFastStop}
          onBetChange={handleBetChange}
          onMaxBet={handleMaxBet}
          onToggleAuto={handleToggleAuto}
          onToggleSound={handleToggleSound}
          onOpenPaytable={() => {
            soundEffects.playButtonClick('modal');
            setPaytableOpen(true);
          }}
          devModeEnabled={DEV_MODE_ENABLED}
          onOpenDevMode={() => setDevModeOpen(true)}
        />
      </main>

      {/* Paytable Modal with Payouts & Progressive Jackpots */}
      <Paytable
        isOpen={paytableOpen}
        onClose={() => {
          soundEffects.playButtonClick('default');
          setPaytableOpen(false);
        }}
      />

      {/* Developer / Test Mode Modal (Only accessible when DEV_MODE is enabled) */}
      {DEV_MODE_ENABLED && (
        <DevModePanel
          isOpen={devModeOpen}
          onClose={() => setDevModeOpen(false)}
          onOpenSimulation={() => setSimulationOpen(true)}
          onTestWin={handleTestWin}
          onAddBalance={(amt) => setBalance((b) => Math.round((b + amt) * 100) / 100)}
          onResetBalance={() => setBalance(500.0)}
          isSpinning={isSpinning}
        />
      )}

      {/* Simulation Modal (RNG statistical audit suite) */}
      <SimulationModal
        isOpen={simulationOpen}
        onClose={() => {
          soundEffects.playButtonClick('default');
          setSimulationOpen(false);
        }}
        currentBet={currentBet}
      />

      {/* Cinematic Win Celebration Overlays (Big Win, Mega Win, Jackpot) */}
      {activeResult &&
        (activeResult.winTier === 'BIG_WIN' ||
          activeResult.winTier === 'MEGA_WIN' ||
          activeResult.winTier === 'JACKPOT') && (
          <WinEffects
            winAmount={activeResult.winAmount}
            winTier={activeResult.winTier}
            jackpotType={activeResult.jackpotType}
            onDismiss={() => setActiveResult(null)}
          />
        )}
    </div>
  );
};
