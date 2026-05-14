/**
 * Procedural fantasy audio engine using Web Audio API.
 * No external assets, no network calls — everything is synthesized.
 */

type SfxName = "click" | "collect" | "choice" | "tick" | "complete";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicNodes: { stop: () => void } | null = null;
  private muted = false;
  private listeners = new Set<(muted: boolean) => void>();

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctx =
      typeof window !== "undefined"
        ? (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
        : null;
    if (!Ctx) return null;
    const ctx = new Ctx();
    this.ctx = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 0.9;
    this.masterGain.connect(ctx.destination);
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.18;
    this.musicGain.connect(this.masterGain);
    this.sfxGain = ctx.createGain();
    this.sfxGain.gain.value = 0.55;
    this.sfxGain.connect(this.masterGain);
    return ctx;
  }

  private async resume() {
    const ctx = this.ensure();
    if (!ctx) return null;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        /* noop */
      }
    }
    return ctx;
  }

  isMuted() {
    return this.muted;
  }

  onChange(cb: (muted: boolean) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      const target = muted ? 0 : 0.9;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.15);
    }
    this.listeners.forEach((cb) => cb(muted));
  }

  toggleMute() {
    this.setMuted(!this.muted);
  }

  // ---------- SFX ----------

  async play(name: SfxName) {
    const ctx = await this.resume();
    if (!ctx || !this.sfxGain) return;
    switch (name) {
      case "click":
        this.playChime(ctx, [880, 1320], 0.18, "triangle");
        break;
      case "tick":
        this.playChime(ctx, [620], 0.07, "sine", 0.18);
        break;
      case "collect":
        this.playSparkle(ctx);
        break;
      case "choice":
        this.playChime(ctx, [660, 990, 1320], 0.22, "triangle");
        break;
      case "complete":
        this.playFanfare(ctx);
        break;
    }
  }

  private playChime(
    ctx: AudioContext,
    freqs: number[],
    duration: number,
    type: OscillatorType = "triangle",
    gainScale = 0.5,
  ) {
    const now = ctx.currentTime;
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = f;
      const start = now + i * 0.04;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(gainScale, start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(start);
      o.stop(start + duration + 0.05);
    });
  }

  private playSparkle(ctx: AudioContext) {
    const now = ctx.currentTime;
    // Rising magical arpeggio
    const notes = [880, 1108.73, 1318.51, 1760, 2349.32];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const start = now + i * 0.05;
      const dur = 0.35;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(0.35, start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(start);
      o.stop(start + dur + 0.05);
    });
    // Soft shimmer noise
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 4000;
    const ng = ctx.createGain();
    ng.gain.value = 0.18;
    noise.connect(filter);
    filter.connect(ng);
    ng.connect(this.sfxGain!);
    noise.start(now);
  }

  private playFanfare(ctx: AudioContext) {
    const now = ctx.currentTime;
    // Classic JRPG victory fanfare — heroic triad run + sustained chord stab.
    // Melody (C major): C-E-G-C-G-C  then big C-major chord swell.
    const melody: { f: number; t: number; d: number }[] = [
      { f: 523.25, t: 0.0, d: 0.14 },   // C5
      { f: 659.25, t: 0.14, d: 0.14 },  // E5
      { f: 783.99, t: 0.28, d: 0.14 },  // G5
      { f: 1046.5, t: 0.42, d: 0.18 },  // C6
      { f: 783.99, t: 0.62, d: 0.12 },  // G5
      { f: 1046.5, t: 0.76, d: 1.2 },   // C6 sustained
    ];
    melody.forEach(({ f, t, d }) => {
      const start = now + t;
      // Two layered oscillators: triangle lead + saw harmonic = brassy bell.
      (["triangle", "sawtooth"] as OscillatorType[]).forEach((type, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.value = f * (i === 1 ? 2 : 1);
        const peak = i === 0 ? 0.42 : 0.12;
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(peak, start + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, start + d);
        o.connect(g);
        g.connect(this.sfxGain!);
        o.start(start);
        o.stop(start + d + 0.05);
      });
    });

    // Sustained triumphant C-major chord underneath final note.
    const chordStart = now + 0.76;
    const chordDur = 1.6;
    [261.63, 329.63, 392.0, 523.25].forEach((f) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0, chordStart);
      g.gain.linearRampToValueAtTime(0.18, chordStart + 0.08);
      g.gain.linearRampToValueAtTime(0.14, chordStart + chordDur * 0.7);
      g.gain.exponentialRampToValueAtTime(0.0001, chordStart + chordDur);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(chordStart);
      o.stop(chordStart + chordDur + 0.05);
    });

    // Timpani-ish low thump at the start for drama.
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(160, now);
    thump.frequency.exponentialRampToValueAtTime(55, now + 0.3);
    thumpGain.gain.setValueAtTime(0.6, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    thump.connect(thumpGain);
    thumpGain.connect(this.sfxGain!);
    thump.start(now);
    thump.stop(now + 0.5);
  }

  // ---------- MUSIC ----------

  async startMusic() {
    if (this.musicNodes) return;
    const ctx = await this.resume();
    if (!ctx || !this.musicGain) return;

    // A natural-minor pad + arpeggio for a fantasy/JRPG vibe.
    // Root: A2 (110Hz). Chords cycle: Am, F, C, G (vi-IV-I-V in C major).
    const chords: number[][] = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [261.63, 329.63, 392.0], // C
      [196.0, 246.94, 293.66], // G
    ];
    const arpPattern = [0, 2, 1, 2]; // indices into each chord

    const padOscs: OscillatorNode[] = [];
    const padGains: GainNode[] = [];
    // Two layered detuned sawtooths through a lowpass = warm pad
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 1200;
    padFilter.Q.value = 0.6;
    const padBus = ctx.createGain();
    padBus.gain.value = 0.0;
    padFilter.connect(padBus);
    padBus.connect(this.musicGain);

    for (let i = 0; i < 6; i++) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.detune.value = (i % 2 === 0 ? -7 : 7) + (i - 3) * 2;
      const g = ctx.createGain();
      g.gain.value = 0.0;
      o.connect(g);
      g.connect(padFilter);
      o.start();
      padOscs.push(o);
      padGains.push(g);
    }

    // Arpeggio voice — bell-like sine
    const arpFilter = ctx.createBiquadFilter();
    arpFilter.type = "lowpass";
    arpFilter.frequency.value = 4000;
    const arpBus = ctx.createGain();
    arpBus.gain.value = 0.5;
    arpFilter.connect(arpBus);
    arpBus.connect(this.musicGain);

    const beat = 0.55; // seconds per arp note
    const chordDur = beat * 8; // 8 arp notes per chord
    let chordIdx = 0;
    let nextTime = ctx.currentTime + 0.1;

    // Pad fade-in
    padBus.gain.setValueAtTime(0, ctx.currentTime);
    padBus.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2.5);

    let stopped = false;
    const setChord = (notes: number[], when: number) => {
      // Voice 0,1: root low octave; 2,3: third; 4,5: fifth, all an octave up too
      const targets = [
        notes[0],
        notes[0],
        notes[1],
        notes[1],
        notes[2],
        notes[2] * 2,
      ];
      padOscs.forEach((o, i) => {
        o.frequency.cancelScheduledValues(when);
        o.frequency.setValueAtTime(targets[i], when);
      });
      padGains.forEach((g) => {
        g.gain.cancelScheduledValues(when);
        g.gain.linearRampToValueAtTime(0.13, when + 0.4);
      });
    };

    const scheduleArp = (chord: number[], when: number) => {
      for (let step = 0; step < 8; step++) {
        const idx = arpPattern[step % arpPattern.length];
        const octave = step >= 4 ? 2 : 1;
        const f = chord[idx] * octave;
        const start = when + step * beat;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        const dur = beat * 0.9;
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(0.22, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        o.connect(g);
        g.connect(arpFilter);
        o.start(start);
        o.stop(start + dur + 0.05);
      }
    };

    const tick = () => {
      if (stopped) return;
      while (nextTime < ctx.currentTime + 1.5) {
        const chord = chords[chordIdx % chords.length];
        setChord(chord, nextTime);
        scheduleArp(chord, nextTime);
        nextTime += chordDur;
        chordIdx++;
      }
    };
    tick();
    const interval = window.setInterval(tick, 500);

    this.musicNodes = {
      stop: () => {
        stopped = true;
        window.clearInterval(interval);
        const t = ctx.currentTime;
        padBus.gain.cancelScheduledValues(t);
        padBus.gain.linearRampToValueAtTime(0, t + 0.6);
        arpBus.gain.cancelScheduledValues(t);
        arpBus.gain.linearRampToValueAtTime(0, t + 0.6);
        padOscs.forEach((o) => o.stop(t + 0.7));
        this.musicNodes = null;
      },
    };
  }

  stopMusic() {
    this.musicNodes?.stop();
  }
}

export const audio = new AudioEngine();
export type { SfxName };