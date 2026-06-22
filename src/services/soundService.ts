/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class TeaSoundService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3;
    }
  }

  // Synthesize a gentle bowl chime sound
  playChime() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency of a traditional meditation bowl (approx)
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 3);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 4);
    
    // Add a harmonic
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 2.5);
    osc2.connect(gain);
    osc2.start();
    osc2.stop(this.ctx.currentTime + 4);
  }

  // Synthesize a white noise based water pouring sound
  private pourSource: AudioBufferSourceNode | null = null;
  private pourGain: GainNode | null = null;

  startPouring() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.pourSource = this.ctx.createBufferSource();
    this.pourSource.buffer = buffer;
    this.pourSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.value = 1;

    this.pourGain = this.ctx.createGain();
    this.pourGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.pourGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.5);

    this.pourSource.connect(filter);
    filter.connect(this.pourGain);
    this.pourGain.connect(this.masterGain);

    this.pourSource.start();
  }

  stopPouring() {
    if (this.pourGain && this.ctx) {
      this.pourGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        if (this.pourSource) this.pourSource.stop();
        this.pourSource = null;
        this.pourGain = null;
      }, 600);
    }
  }

  // Gentle bubble pop sound
  playPop() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(150 + Math.random() * 100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Boiling sound using external asset for realism
  private boilingAudio: HTMLAudioElement | null = null;
  startBoiling() {
    if (typeof window === 'undefined') return;
    if (!this.boilingAudio) {
      this.boilingAudio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-bubbles-liquid-2921.mp3');
      this.boilingAudio.loop = true;
      this.boilingAudio.volume = 0.3;
    }
    this.boilingAudio.play().catch(() => {});
  }

  stopBoiling() {
    if (this.boilingAudio) {
      this.boilingAudio.pause();
    }
  }
}

export const teaSounds = new TeaSoundService();
