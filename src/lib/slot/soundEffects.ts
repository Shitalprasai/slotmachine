/**
 * Production-Grade Web Audio Synthesizer Engine for Casino Slot Machine
 * 
 * Features:
 * - Dynamic compression master bus to prevent distortion and clipping
 * - Physically modeled stepper motor rumble & mechanical ratchet cogs
 * - Heavy solenoid brake reel-stop "thump" with metallic shoe click
 * - Tension/anticipation riser when high-paying symbols align
 * - Multi-harmonic physical bell synthesis (fundamental + minor 3rd + 5th + octave + high partials)
 * - Authentic dual-resonance steel coin hopper clinks with randomized pitch detune
 * - Multi-tiered win fanfares (Small, Medium, Big Win, Mega Win, Jackpot Siren)
 * - Fiery ignition whoosh for Flaming 50x hits
 * - Tactile mechanical switch clicks for spin, bet up/down, and max bet
 * - Smooth master volume & mute control with localStorage persistence
 */

export type WinTierAudio = 'SMALL' | 'MEDIUM' | 'BIG' | 'MEGA' | 'JACKPOT';

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private enabled: boolean = true;
  private volume: number = 0.8; // 0.0 to 1.0

  // Active rumble/hum state
  private isRumbling: boolean = false;
  private rumbleOsc1: OscillatorNode | null = null;
  private rumbleOsc2: OscillatorNode | null = null;
  private rumbleGain: GainNode | null = null;
  private rumbleInterval: number | null = null;

  // Anticipation riser state
  private anticipationOsc: OscillatorNode | null = null;
  private anticipationSub: OscillatorNode | null = null;
  private anticipationGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedEnabled = localStorage.getItem('slot_sound_enabled');
        if (savedEnabled !== null) {
          this.enabled = savedEnabled === 'true';
        }
        const savedVol = localStorage.getItem('slot_sound_volume');
        if (savedVol !== null) {
          const parsed = parseFloat(savedVol);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.volume = parsed;
          }
        }
      } catch {
        // Ignore localStorage restrictions
      }
    }
  }

  /**
   * Initializes AudioContext, master compressor, and shared noise buffer on user gesture.
   */
  public init() {
    if (typeof window === 'undefined') return;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();

      // Master Dynamics Compressor: prevents digital clipping, glues casino effects
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-8, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(5, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.18, this.ctx.currentTime);

      // Master Gain Node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime);

      // SFX Bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

      // Route: SFX -> Master Gain -> Compressor -> Destination
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      // Pre-synthesize 2-second pink/white noise buffer for snappy mechanical transients
      this.createNoiseBuffer();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private createNoiseBuffer() {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter approximation (Paul Kellet's filter)
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    this.noiseBuffer = buffer;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('slot_sound_enabled', String(enabled));
      } catch {}
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime);
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    if (clamped === 0) {
      this.setEnabled(false);
    } else if (!this.enabled) {
      this.setEnabled(true);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('slot_sound_volume', String(clamped));
      } catch {}
    }
    if (this.masterGain && this.ctx && this.enabled) {
      this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleSound(): boolean {
    const nextState = !this.enabled;
    this.setEnabled(nextState);
    if (nextState) {
      this.playButtonClick('default');
    } else {
      this.stopReelRumble();
      this.stopAnticipation();
    }
    return nextState;
  }

  // ==========================================
  // 1. TACTILE MECHANICAL BUTTONS
  // ==========================================

  public playButtonClick(type: 'default' | 'spin' | 'bet_up' | 'bet_down' | 'max_bet' | 'modal' = 'default') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      if (type === 'spin') {
        // Heavy solenoid push-button switch with spring click
        // Sub thud
        const oscSub = this.ctx.createOscillator();
        const gainSub = this.ctx.createGain();
        oscSub.type = 'triangle';
        oscSub.frequency.setValueAtTime(160, now);
        oscSub.frequency.exponentialRampToValueAtTime(45, now + 0.08);

        gainSub.gain.setValueAtTime(0.45, now);
        gainSub.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        oscSub.connect(gainSub);
        gainSub.connect(this.sfxGain);
        oscSub.start(now);
        oscSub.stop(now + 0.08);

        // Tactile snap
        const oscSnap = this.ctx.createOscillator();
        const gainSnap = this.ctx.createGain();
        oscSnap.type = 'square';
        oscSnap.frequency.setValueAtTime(1400, now);
        oscSnap.frequency.exponentialRampToValueAtTime(350, now + 0.035);

        gainSnap.gain.setValueAtTime(0.18, now);
        gainSnap.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        oscSnap.connect(gainSnap);
        gainSnap.connect(this.sfxGain);
        oscSnap.start(now);
        oscSnap.stop(now + 0.035);
      } else if (type === 'bet_up') {
        // Ascending pleasant click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'bet_down') {
        // Descending pleasant click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(460, now + 0.05);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'max_bet') {
        // Confident gold double-chime
        [660, 990].forEach((f, idx) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const t = now + idx * 0.045;
          osc.frequency.setValueAtTime(f, t);

          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.12);
        });
      } else {
        // Standard crisp switch click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Ignore
    }
  }

  // ==========================================
  // 2. REEL SPINNING & MECHANICAL HUM
  // ==========================================

  /**
   * Powerful mechanical lever release + heavy centrifugal spool-up whoosh
   */
  public playSpinStart() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Heavy solenoid latch "CLACK-CHUNK" (dual mechanical impact)
      // Low sub punch
      const oscTrip = this.ctx.createOscillator();
      const gainTrip = this.ctx.createGain();
      oscTrip.type = 'triangle';
      oscTrip.frequency.setValueAtTime(160, now);
      oscTrip.frequency.exponentialRampToValueAtTime(32, now + 0.16);

      gainTrip.gain.setValueAtTime(0.55, now);
      gainTrip.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      oscTrip.connect(gainTrip);
      gainTrip.connect(this.sfxGain);
      oscTrip.start(now);
      oscTrip.stop(now + 0.16);

      // Metallic lever snap
      const oscSnap = this.ctx.createOscillator();
      const gainSnap = this.ctx.createGain();
      oscSnap.type = 'square';
      oscSnap.frequency.setValueAtTime(880, now);
      oscSnap.frequency.exponentialRampToValueAtTime(180, now + 0.06);

      gainSnap.gain.setValueAtTime(0.24, now);
      gainSnap.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      oscSnap.connect(gainSnap);
      gainSnap.connect(this.sfxGain);
      oscSnap.start(now);
      oscSnap.stop(now + 0.06);

      // 2. Air whoosh acceleration (wide resonant noise sweep simulating heavy metal drums)
      if (this.noiseBuffer) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(260, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 0.32);
        filter.Q.setValueAtTime(3.2, now);

        const gainNoise = this.ctx.createGain();
        gainNoise.gain.setValueAtTime(0.45, now);
        gainNoise.gain.exponentialRampToValueAtTime(0.005, now + 0.38);

        noiseSource.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(this.sfxGain);

        noiseSource.start(now);
        noiseSource.stop(now + 0.38);
      }

      // 3. Spool-up motor pitch with rich harmonics
      const oscMotor = this.ctx.createOscillator();
      const gainMotor = this.ctx.createGain();
      oscMotor.type = 'sawtooth';
      oscMotor.frequency.setValueAtTime(75, now);
      oscMotor.frequency.exponentialRampToValueAtTime(260, now + 0.38);

      gainMotor.gain.setValueAtTime(0.18, now);
      gainMotor.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      const motorFilter = this.ctx.createBiquadFilter();
      motorFilter.type = 'lowpass';
      motorFilter.frequency.setValueAtTime(550, now);
      motorFilter.Q.setValueAtTime(2.0, now);

      oscMotor.connect(motorFilter);
      motorFilter.connect(gainMotor);
      gainMotor.connect(this.sfxGain);

      oscMotor.start(now);
      oscMotor.stop(now + 0.38);

      // 4. Inertia break ratchet burst (3 rapid mechanical teeth)
      [0, 0.04, 0.09].forEach((offset, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const t = now + offset;
        const tick = this.ctx.createOscillator();
        const tickG = this.ctx.createGain();
        tick.type = 'triangle';
        tick.frequency.setValueAtTime(620 + idx * 120, t);
        tickG.gain.setValueAtTime(0.18, t);
        tickG.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
        tick.connect(tickG);
        tickG.connect(this.sfxGain);
        tick.start(t);
        tick.stop(t + 0.025);
      });

      // Start continuous dynamic mechanical reel spin rumble
      this.startReelRumble();
    } catch {
      // Ignore
    }
  }

  /**
   * Authentic physical reel stepper motor hum & rhythmic gear ratchet ticking with wow/flutter
   */
  public startReelRumble() {
    this.stopReelRumble();
    if (!this.enabled || !this.ctx || !this.sfxGain) return;

    try {
      this.isRumbling = true;
      const now = this.ctx.currentTime;

      // Continuous low stepper-motor warmth with mechanical vibration
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(74, now); // Fundamental motor drone
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(148, now); // 2nd harmonic warmth

      // Filtered to give rich deep presence without harshness
      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(280, now);
      rumbleFilter.Q.setValueAtTime(1.8, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.13, now + 0.12);

      osc1.connect(rumbleFilter);
      osc2.connect(rumbleFilter);
      rumbleFilter.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now);

      this.rumbleOsc1 = osc1;
      this.rumbleOsc2 = osc2;
      this.rumbleGain = gain;

      // High-speed rhythmic ratchet pawl ticks with rotational accents (authentic circular reel motion)
      let tickCount = 0;
      this.rumbleInterval = window.setInterval(() => {
        if (!this.isRumbling || !this.ctx || !this.sfxGain || !this.enabled) return;
        try {
          const t = this.ctx.currentTime;
          tickCount++;

          const isAccent = tickCount % 6 === 0;
          const oscTick = this.ctx.createOscillator();
          const gainTick = this.ctx.createGain();

          oscTick.type = 'triangle';
          // Subtle pitch swing per tick simulating 3 reels spinning at slight phase offsets
          const tickFreq = isAccent
            ? 620
            : tickCount % 3 === 0
            ? 390
            : tickCount % 3 === 1
            ? 470
            : 530;
          oscTick.frequency.setValueAtTime(tickFreq, t);

          gainTick.gain.setValueAtTime(isAccent ? 0.12 : 0.07, t);
          gainTick.gain.exponentialRampToValueAtTime(0.001, t + (isAccent ? 0.035 : 0.022));

          oscTick.connect(gainTick);
          gainTick.connect(this.sfxGain);

          oscTick.start(t);
          oscTick.stop(t + (isAccent ? 0.035 : 0.022));

          // Air friction & felt wiper flutter transient
          if (this.noiseBuffer && (tickCount % 2 === 0 || isAccent)) {
            const noise = this.ctx.createBufferSource();
            noise.buffer = this.noiseBuffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(isAccent ? 2200 : 1600, t);
            filter.Q.setValueAtTime(2.8, t);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(isAccent ? 0.08 : 0.045, t);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.sfxGain);

            noise.start(t);
            noise.stop(t + 0.02);
          }
        } catch {}
      }, 42);
    } catch {
      // Ignore
    }
  }

  public stopReelRumble() {
    this.isRumbling = false;
    if (this.rumbleInterval) {
      clearInterval(this.rumbleInterval);
      this.rumbleInterval = null;
    }

    if (this.rumbleGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.rumbleGain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        setTimeout(() => {
          try {
            this.rumbleOsc1?.stop();
            this.rumbleOsc2?.stop();
            this.rumbleOsc1?.disconnect();
            this.rumbleOsc2?.disconnect();
          } catch {}
          this.rumbleOsc1 = null;
          this.rumbleOsc2 = null;
          this.rumbleGain = null;
        }, 90);
      } catch {}
    }
  }

  // ==========================================
  // 3. MECHANICAL REEL STOP LATCH ("CLUNK-SNAP")
  // ==========================================

  /**
   * Heavy mechanical solenoid brake pawl dropping into star wheel
   * Progressive pitch: Reel 0 -> Reel 1 -> Reel 2 builds musical momentum
   */
  public playReelStop(reelIndex: number, isAnticipation: boolean = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const pitchOffset = reelIndex * 2.5; // semitone-equivalent frequency shift

      // Layer 1: Sub Bass Solenoid Punch
      const oscSub = this.ctx.createOscillator();
      const gainSub = this.ctx.createGain();
      oscSub.type = 'triangle';
      const baseFreq = 125 + pitchOffset * 10;
      oscSub.frequency.setValueAtTime(baseFreq, now);
      oscSub.frequency.exponentialRampToValueAtTime(38, now + 0.12);

      gainSub.gain.setValueAtTime(isAnticipation ? 0.55 : 0.42, now);
      gainSub.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      oscSub.connect(gainSub);
      gainSub.connect(this.sfxGain);
      oscSub.start(now);
      oscSub.stop(now + 0.12);

      // Layer 2: Metallic Brake Shoe Snap (bandpass noise friction)
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2600 + reelIndex * 350, now);
        filter.Q.setValueAtTime(4.0, now);

        const gainNoise = this.ctx.createGain();
        gainNoise.gain.setValueAtTime(0.3, now);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(this.sfxGain);

        noise.start(now);
        noise.stop(now + 0.04);
      }

      // Layer 3: Cabinet Chassis Resonant Ring
      const oscRing = this.ctx.createOscillator();
      const gainRing = this.ctx.createGain();
      oscRing.type = 'sine';
      oscRing.frequency.setValueAtTime(620 + reelIndex * 120, now);

      gainRing.gain.setValueAtTime(0.18, now);
      gainRing.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      oscRing.connect(gainRing);
      gainRing.connect(this.sfxGain);
      oscRing.start(now);
      oscRing.stop(now + 0.14);
    } catch {
      // Ignore
    }
  }

  // ==========================================
  // 4. SUSPENSE / ANTICIPATION RISER
  // ==========================================

  /**
   * Tension riser when Reel 1 and Reel 2 land matching high-paying symbols
   */
  public startAnticipation() {
    this.stopAnticipation();
    if (!this.enabled || !this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      // Rising shimmer drone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.85);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(2400, now + 0.85);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);

      this.anticipationOsc = osc;
      this.anticipationGain = gain;

      // Heartbeat sub-bass pulse
      const sub = this.ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(65, now);
      sub.frequency.linearRampToValueAtTime(95, now + 0.85);
      sub.connect(gain);
      sub.start(now);
      this.anticipationSub = sub;
    } catch {}
  }

  public stopAnticipation() {
    if (this.anticipationOsc && this.anticipationGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.anticipationGain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        setTimeout(() => {
          try {
            this.anticipationOsc?.stop();
            this.anticipationSub?.stop();
            this.anticipationOsc?.disconnect();
            this.anticipationSub?.disconnect();
          } catch {}
          this.anticipationOsc = null;
          this.anticipationSub = null;
          this.anticipationGain = null;
        }, 60);
      } catch {}
    }
  }

  // ==========================================
  // 5. PRIZE REEL STOP (THE 50X MULTIPLIER CLIMAX)
  // ==========================================

  public playPrizeReelStop(prizeValue: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    this.stopReelRumble();
    this.stopAnticipation();

    try {
      const now = this.ctx.currentTime;

      if (prizeValue >= 50) {
        // ULTIMATE FLAMING 50x / 100x: Fiery explosion + electric arc + golden 5-note fanfare
        this.playFireBurst();

        // High shimmer golden arpeggio (C6, E6, G6, B6, C7)
        const notes = [1046.5, 1318.51, 1567.98, 1975.53, 2093.0];
        notes.forEach((freq, idx) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const t = now + idx * 0.06;
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

          // Bell harmonic shimmer
          const oscHarm = this.ctx.createOscillator();
          const gainHarm = this.ctx.createGain();
          oscHarm.type = 'triangle';
          oscHarm.frequency.setValueAtTime(freq * 1.5, t);
          gainHarm.gain.setValueAtTime(0.12, t);
          gainHarm.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

          osc.connect(gain);
          oscHarm.connect(gainHarm);
          gain.connect(this.sfxGain);
          gainHarm.connect(this.sfxGain);

          osc.start(t);
          oscHarm.start(t);
          osc.stop(t + 0.45);
          oscHarm.stop(t + 0.25);
        });

        // Deep sub impact
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(110, now);
        sub.frequency.exponentialRampToValueAtTime(35, now + 0.35);
        subGain.gain.setValueAtTime(0.6, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        sub.connect(subGain);
        subGain.connect(this.sfxGain);
        sub.start(now);
        sub.stop(now + 0.35);

      } else if (prizeValue >= 10) {
        // High Multiplier (10x, 20x, 25x): Ascending electric bell chime
        const notes = [659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((freq, idx) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const t = now + idx * 0.055;
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.28, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.3);
        });
      } else {
        // Standard Multiplier (2x, 3x, 5x): Clean electric bell ding
        const notes = [587.33, 880.0];
        notes.forEach((freq, idx) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const t = now + idx * 0.05;
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.22);
        });
      }
    } catch {
      // Ignore
    }
  }

  // ==========================================
  // 6. HARMONIC BELL SYNTHESIS FOR LINE WINS
  // ==========================================

  /**
   * Physically modeled acoustic bell strike with natural partials:
   * Fundamental, minor 3rd (1.20x), fifth (1.50x), octave (2.0x), and high chime (2.76x)
   */
  private playBellTone(freq: number, startTime: number, duration: number = 0.45, volume: number = 0.25) {
    if (!this.ctx || !this.sfxGain) return;

    try {
      const partials = [
        { mult: 1.0, gain: 1.0, decay: duration },
        { mult: 1.20, gain: 0.45, decay: duration * 0.75 },
        { mult: 1.50, gain: 0.35, decay: duration * 0.65 },
        { mult: 2.00, gain: 0.25, decay: duration * 0.5 },
        { mult: 2.76, gain: 0.15, decay: duration * 0.35 },
      ];

      partials.forEach((p) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * p.mult, startTime);

        gain.gain.setValueAtTime(volume * p.gain, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + p.decay);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(startTime);
        osc.stop(startTime + p.decay);
      });
    } catch {}
  }

  /**
   * Rich multi-tiered casino line win chimes
   */
  public playWin(tierOrIsBig: WinTierAudio | boolean = 'SMALL') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    let tier: WinTierAudio = 'SMALL';
    if (typeof tierOrIsBig === 'boolean') {
      tier = tierOrIsBig ? 'BIG' : 'SMALL';
    } else {
      tier = tierOrIsBig;
    }

    try {
      const now = this.ctx.currentTime;

      if (tier === 'SMALL') {
        // Classic 3-note ascending bell triad (C5, E5, G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((f, idx) => {
          this.playBellTone(f, now + idx * 0.08, 0.4, 0.24);
        });
      } else if (tier === 'MEDIUM') {
        // Cheerful 5-note victory arpeggio (G4, C5, E5, G5, C6)
        const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
        notes.forEach((f, idx) => {
          this.playBellTone(f, now + idx * 0.07, 0.45, 0.26);
        });
      } else if (tier === 'BIG') {
        // Las Vegas Celebratory Brass & Bells Fanfare
        // Chord sequence: C Maj -> F Maj -> G Maj -> C Octave
        const chordSchedule = [
          { time: 0.0, notes: [523.25, 659.25, 783.99] }, // C Maj
          { time: 0.16, notes: [523.25, 659.25, 783.99] },
          { time: 0.32, notes: [587.33, 739.99, 880.00] }, // D Maj
          { time: 0.48, notes: [659.25, 830.61, 987.77] }, // E Maj
          { time: 0.68, notes: [783.99, 1046.5, 1318.51] }, // C high
        ];

        chordSchedule.forEach(({ time, notes }) => {
          notes.forEach((f) => {
            this.playBellTone(f, now + time, 0.5, 0.2);
          });
        });
      } else if (tier === 'MEGA') {
        // Grand Triumphant Brass Fanfare with Arpeggios
        const chords = [
          [523.25, 659.25, 783.99],
          [587.33, 739.99, 880.00],
          [659.25, 830.61, 987.77],
          [783.99, 987.77, 1174.66],
          [1046.5, 1318.51, 1567.98],
          [1318.51, 1567.98, 2093.0],
        ];

        chords.forEach((chord, cIdx) => {
          chord.forEach((f) => {
            this.playBellTone(f, now + cIdx * 0.14, 0.6, 0.22);
          });
        });

        // Fast cascading high bell run
        const arps = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0, 2093.0];
        arps.forEach((f, idx) => {
          this.playBellTone(f, now + 0.85 + idx * 0.05, 0.35, 0.18);
        });
      } else if (tier === 'JACKPOT') {
        this.playJackpotFanfare();
      }
    } catch {
      // Ignore
    }
  }

  // ==========================================
  // 7. REALISTIC STEEL COIN HOPPER PAYOUT
  // ==========================================

  /**
   * Dual-resonance acoustic model of heavy brass/nickel slot coins
   * hitting a stainless steel tray. Includes micro-random pitch detune.
   */
  public playCoinDing() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      // Slight pitch variance per coin drop (±90Hz) creates realistic cascading coins
      const detune = (Math.random() - 0.5) * 180;
      const res1 = 3200 + detune;
      const res2 = 5850 + detune * 1.6;

      // Resonant ping 1 (metallic primary mode)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(res1, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc1.connect(gain1);
      gain1.connect(this.sfxGain);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Resonant ping 2 (higher steel overtone)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(res2, now);
      gain2.gain.setValueAtTime(0.12, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(now);
      osc2.stop(now + 0.04);

      // Transient impact noise click
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(4500, now);

        const gainNoise = this.ctx.createGain();
        gainNoise.gain.setValueAtTime(0.08, now);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(this.sfxGain);
        noise.start(now);
        noise.stop(now + 0.012);
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Cash Register Settlement Chime ("Ka-ching!") when roll-up finishes
   */
  public playPayoutComplete() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      // Classic mechanical bell strike at 1864 Hz with sparkling shimmer
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1864, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      // Bell overtone
      const oscHarm = this.ctx.createOscillator();
      const gainHarm = this.ctx.createGain();
      oscHarm.type = 'triangle';
      oscHarm.frequency.setValueAtTime(3728, now);
      gainHarm.gain.setValueAtTime(0.15, now);
      gainHarm.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      oscHarm.connect(gainHarm);
      gain.connect(this.sfxGain);
      gainHarm.connect(this.sfxGain);

      osc.start(now);
      oscHarm.start(now);
      osc.stop(now + 0.65);
      oscHarm.stop(now + 0.4);
    } catch {}
  }

  // ==========================================
  // 8. GRAND JACKPOT SIREN & EPIC FANFARE
  // ==========================================

  /**
   * Classic Las Vegas Rotating Top-Light Emergency Siren + Majestic Brass Victory
   */
  public playJackpotFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Alternating Rotating Beacon Siren (classic Bally / IGT siren wail)
      const sirenOsc = this.ctx.createOscillator();
      const sirenGain = this.ctx.createGain();
      const sirenLfo = this.ctx.createOscillator();
      const sirenLfoGain = this.ctx.createGain();

      sirenOsc.type = 'sawtooth';
      sirenOsc.frequency.setValueAtTime(920, now);

      // 2.8 Hz siren rotation sweep
      sirenLfo.frequency.setValueAtTime(2.8, now);
      sirenLfoGain.gain.setValueAtTime(190, now); // Sweep from ~730Hz to ~1110Hz

      sirenLfo.connect(sirenLfoGain);
      sirenLfoGain.connect(sirenOsc.frequency);

      const sirenFilter = this.ctx.createBiquadFilter();
      sirenFilter.type = 'lowpass';
      sirenFilter.frequency.setValueAtTime(1800, now);

      sirenGain.gain.setValueAtTime(0.16, now);
      sirenGain.gain.linearRampToValueAtTime(0.18, now + 0.5);
      sirenGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      sirenOsc.connect(sirenFilter);
      sirenFilter.connect(sirenGain);
      sirenGain.connect(this.sfxGain);

      sirenLfo.start(now);
      sirenOsc.start(now);
      sirenLfo.stop(now + 2.4);
      sirenOsc.stop(now + 2.4);

      // 2. Majestic Vegas Brass Fanfare Chords
      const chords = [
        { t: 0.0, f: [523.25, 659.25, 783.99, 1046.5] }, // C Maj
        { t: 0.22, f: [523.25, 659.25, 783.99, 1046.5] },
        { t: 0.44, f: [698.46, 880.00, 1046.5, 1396.91] }, // F Maj
        { t: 0.72, f: [783.99, 987.77, 1174.66, 1567.98] }, // G Maj
        { t: 1.05, f: [1046.5, 1318.51, 1567.98, 2093.00] }, // C High Octave Grand Finale
      ];

      chords.forEach(({ t, f }) => {
        f.forEach((freq) => {
          this.playBellTone(freq, now + t, 0.75, 0.24);
        });
      });

      // 3. Fire blast sound
      this.playFireBurst();
    } catch {
      // Ignore
    }
  }

  // ==========================================
  // 9. MYTHIC FIRE BURST & SIZZLE
  // ==========================================

  /**
   * Deep fiery whoosh & ignition crackle for Golden 50x / flaming features
   */
  public playFireBurst() {
    if (!this.enabled || !this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Deep fiery whoosh (swept noise bandpass)
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(900, now + 0.18);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.65);
        filter.Q.setValueAtTime(1.8, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
        noise.stop(now + 0.65);
      }

      // 2. Sub-bass heat ignition punch
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(95, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.3);

      subGain.gain.setValueAtTime(0.45, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      sub.connect(subGain);
      subGain.connect(this.sfxGain);
      sub.start(now);
      sub.stop(now + 0.3);
    } catch {}
  }

  // ==========================================
  // 10. PHYSICAL SYMBOL POP & TRAVEL SOUNDS
  // ==========================================

  /**
   * Tactile, punchy acoustic pop & golden impact sound when a winning symbol pops forward
   */
  public playSymbolImpact(intensity: 'normal' | 'big' | 'huge' = 'normal') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Sub-punch for physical weight and 3D depth pop
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'triangle';
      const startFreq = intensity === 'huge' ? 180 : intensity === 'big' ? 150 : 130;
      sub.frequency.setValueAtTime(startFreq, now);
      sub.frequency.exponentialRampToValueAtTime(38, now + 0.12);

      const subVol = intensity === 'huge' ? 0.45 : intensity === 'big' ? 0.35 : 0.25;
      subGain.gain.setValueAtTime(subVol, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      sub.connect(subGain);
      subGain.connect(this.sfxGain);
      sub.start(now);
      sub.stop(now + 0.12);

      // 2. Radiant Golden Acoustic Chime
      const baseChimeFreq = intensity === 'huge' ? 1318.51 : intensity === 'big' ? 1174.66 : 1046.5;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseChimeFreq, now);

      const chimeVol = intensity === 'huge' ? 0.3 : 0.22;
      oscGain.gain.setValueAtTime(chimeVol, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.22);

      // 3. Subtle whoosh/crackle
      if (intensity === 'huge' || intensity === 'big') {
        this.playFireBurst();
      }
    } catch {}
  }

  /**
   * Delicate golden sparkle sound when particles fly toward the WIN display
   */
  public playSparkTravel() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const sparkles = [1567.98, 1975.53, 2349.32]; // G6, B6, D7
      sparkles.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.04;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.14);
      });
    } catch {}
  }
}

export const soundEffects = new SoundManager();
