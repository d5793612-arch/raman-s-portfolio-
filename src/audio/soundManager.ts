// Procedural Web Audio Sound Engine for Raman's World

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // start muted per browser autoplay policy
  private ambientGain: GainNode | null = null;
  private currentChordIndex: number = 0;
  private ambientTimer: number | null = null;

  // Harmonic chord progressions (frequencies in Hz)
  private chords: number[][] = [
    // Chord 0 (Genesis - C Maj9 - calm, fresh)
    [130.81, 164.81, 196.00, 246.94, 293.66], 
    // Chord 1 (Workshop - F Maj7#11 - creative, inquisitive)
    [174.61, 220.00, 261.63, 329.63, 369.99],
    // Chord 2 (Gallery - A min9 - sleek, modern)
    [110.00, 164.81, 220.00, 261.63, 329.63],
    // Chord 3 (Observatory - D Maj9 - starry, expansive)
    [146.83, 185.00, 220.00, 277.18, 329.63],
    // Chord 4 (Campfire - E min7 - warm, cozy)
    [164.81, 196.00, 246.94, 293.66, 392.00],
    // Chord 5 (Beacon - G Maj add9 - luminous, uplifting)
    [196.00, 246.94, 293.66, 370.00, 440.00]
  ];

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbient();
      this.playChime(440, 'triangle');
    } else {
      this.stopAmbient();
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setStationChord(stationIndex: number) {
    this.currentChordIndex = Math.max(0, Math.min(this.chords.length - 1, stationIndex));
    if (!this.isMuted && this.ctx) {
      this.playChordPad();
    }
  }

  private startAmbient() {
    if (!this.ctx || this.isMuted) return;

    if (!this.ambientGain) {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);
    }

    this.playChordPad();
    if (!this.ambientTimer) {
      this.ambientTimer = window.setInterval(() => {
        if (!this.isMuted) {
          this.playChordPad();
        }
      }, 7000);
    }
  }

  private stopAmbient() {
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  private playChordPad() {
    if (!this.ctx || this.isMuted || !this.ambientGain) return;

    const chord = this.chords[this.currentChordIndex % this.chords.length];
    const now = this.ctx.currentTime;

    chord.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle warm detune
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + i * 120, now);

      // Soft swell envelope
      const startTime = now + i * 0.15;
      const duration = 6.0;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.025 / (i + 1), startTime + 2.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain!);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }

  // Interactive UI sound effects
  public playChime(freq: number = 520, waveType: OscillatorType = 'sine') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.12);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playDragTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.06, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.52);
    });
  }

  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }
}

export const soundManager = new SoundManager();
