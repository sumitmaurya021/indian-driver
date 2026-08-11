// Web Audio API Synthesizer for Indian Truck Modified Pressure Horns

class TruckSoundEngine {
  constructor() {
    this.audioCtx = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Helper to create dual/triple tone air pressure oscillator
  playTone(freqs, duration = 0.5, type = 'sawtooth', volume = 0.4, delay = 0) {
    this.initContext();
    const ctx = this.audioCtx;
    const now = ctx.currentTime + delay;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(volume, now + 0.03); // rapid attack
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // decay

    // Filter to simulate metal air horn acoustic chamber
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);

    // Subtle noise for air pressure hiss
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    noise.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start(now);

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // Vibrato frequency modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 6; // 6Hz vibrato
      lfoGain.gain.value = freq * 0.015; // modulation depth
      lfo.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + duration);

      osc.connect(filter);
      osc.start(now);
      osc.stop(now + duration);
    });

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
  }

  // 1. Classic Dual Pressure Horn Blast
  playPressureHorn() {
    this.playTone([415, 520, 622], 0.6, 'sawtooth', 0.5);
    this.playTone([415, 520, 622], 0.4, 'sawtooth', 0.45, 0.4);
  }

  // 2. Nagin Tune Modified Horn (5-Note Melody)
  playNaginHorn() {
    // Melody: D5 (587Hz), F#5 (740Hz), G5 (784Hz), A5 (880Hz), F#5 (740Hz), D5 (587Hz)
    const notes = [
      { freqs: [587, 734], dur: 0.18, delay: 0 },
      { freqs: [740, 925], dur: 0.18, delay: 0.16 },
      { freqs: [784, 980], dur: 0.18, delay: 0.32 },
      { freqs: [880, 1100], dur: 0.35, delay: 0.48 },
      { freqs: [740, 925], dur: 0.22, delay: 0.80 },
      { freqs: [587, 734], dur: 0.45, delay: 1.00 }
    ];

    notes.forEach(n => {
      this.playTone(n.freqs, n.dur, 'sawtooth', 0.45, n.delay);
    });
  }

  // 3. Pee-Poo-Pee Multi-Tone Horn
  playPeePooHorn() {
    const sequence = [
      { freqs: [440, 554], dur: 0.15, delay: 0 },
      { freqs: [659, 830], dur: 0.22, delay: 0.14 },
      { freqs: [440, 554], dur: 0.15, delay: 0.38 },
      { freqs: [659, 830], dur: 0.35, delay: 0.52 }
    ];

    sequence.forEach(s => {
      this.playTone(s.freqs, s.dur, 'sawtooth', 0.5, s.delay);
    });
  }

  // 4. Heavy Jat Duty Pressure Horn (Deep Low Frequencies)
  playJatHorn() {
    this.playTone([220, 277, 330], 0.8, 'sawtooth', 0.6, 0);
    this.playTone([220, 277, 330], 0.5, 'sawtooth', 0.55, 0.7);
  }

  // 5. Dhoom Highway Modified Horn
  playDhoomHorn() {
    const sequence = [
      { freqs: [523, 659], dur: 0.12, delay: 0 },
      { freqs: [587, 740], dur: 0.12, delay: 0.11 },
      { freqs: [659, 830], dur: 0.12, delay: 0.22 },
      { freqs: [784, 987], dur: 0.40, delay: 0.33 }
    ];
    sequence.forEach(s => {
      this.playTone(s.freqs, s.dur, 'sawtooth', 0.48, s.delay);
    });
  }

  // 6. Reverse Warning Horn Chime
  playReverseHorn() {
    const sequence = [
      { freqs: [880], dur: 0.12, delay: 0 },
      { freqs: [1046], dur: 0.12, delay: 0.15 },
      { freqs: [1318], dur: 0.12, delay: 0.30 },
      { freqs: [880], dur: 0.12, delay: 0.45 },
      { freqs: [1046], dur: 0.25, delay: 0.60 }
    ];
    sequence.forEach(s => {
      this.playTone(s.freqs, s.dur, 'triangle', 0.35, s.delay);
    });
  }
}

export const soundEngine = new TruckSoundEngine();
