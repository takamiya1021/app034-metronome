/**
 * Audio Engine for Metronome
 * Handles Web Audio API operations for sound generation
 */

import type { SoundType } from '../types/metronome';

// Sound configuration constants
const SOUND_CONFIG = {
  classic: {
    type: 'sine' as OscillatorType,
    normalFreq: 900,
    accentFreq: 1200,
    normalGain: 0.6,
    accentGain: 1.0,
    duration: 0.03,
  },
  digital: {
    type: 'square' as OscillatorType,
    normalFreq: 1200,
    accentFreq: 1500,
    normalGain: 0.5,
    accentGain: 0.8,
    duration: 0.02,
  },
  drumstick: {
    type: 'triangle' as OscillatorType,
    normalFreq: 1600,
    accentFreq: 2000,
    normalGain: 0.6,
    accentGain: 0.9,
    duration: 0.015,
  },
  bell: {
    type: 'sine' as OscillatorType,
    normalFreq: 2000,
    accentFreq: 2400,
    normalGain: 0.5,
    accentGain: 0.7,
    duration: 0.08,
  },
  synth: {
    type: 'sawtooth' as OscillatorType,
    normalFreq: 600,
    accentFreq: 800,
    normalGain: 0.4,
    accentGain: 0.6,
    duration: 0.04,
  },
} as const;

const DEFAULT_CLICK = {
  normalFreq: 800,
  accentFreq: 1000,
  normalGain: 0.7,
  accentGain: 1.0,
  duration: 0.05,
} as const;

export class AudioEngine {
  public audioContext: AudioContext;
  private gainNode: GainNode;
  private masterVolume: number = 0.7; // Default volume (0.0 to 1.0)

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = this.masterVolume;
    this.gainNode.connect(this.audioContext.destination);
  }

  /**
   * Play basic metronome click sound
   * @param time - When to play the sound (AudioContext time)
   * @param isAccent - Whether this is an accent beat
   */
  playClick(time: number, isAccent: boolean = false): void {
    const frequency = isAccent ? DEFAULT_CLICK.accentFreq : DEFAULT_CLICK.normalFreq;
    const volume = isAccent ? DEFAULT_CLICK.accentGain : DEFAULT_CLICK.normalGain;

    this.playTone(time, frequency, volume, DEFAULT_CLICK.duration, 'sine');
  }

  /**
   * Internal method to play a tone with specified parameters
   * Reduces code duplication across sound methods
   */
  private playTone(
    time: number,
    frequency: number,
    volume: number,
    duration: number,
    type: OscillatorType = 'sine'
  ): void {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = type;
    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(this.gainNode); // Connect to master gain node

    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.start(time);
    osc.stop(time + duration);
  }

  /**
   * Set master volume
   * @param volume - Volume level (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.gainNode.gain.value = this.masterVolume;
  }

  /**
   * Get current master volume
   */
  getVolume(): number {
    return this.masterVolume;
  }

  /**
   * Play custom sound based on selected type
   * @param time - When to play the sound
   * @param soundType - Type of sound to play
   * @param isAccent - Whether this is an accent beat
   */
  playCustomClick(time: number, soundType: SoundType, isAccent: boolean = false): void {
    switch (soundType) {
      case 'classic':
        this.playWoodClick(time, isAccent);
        break;
      case 'digital':
        this.playDigitalClick(time, isAccent);
        break;
      case 'drumstick':
        this.playDrumstickClick(time, isAccent);
        break;
      case 'bell':
        this.playBellClick(time, isAccent);
        break;
      case 'synth':
        this.playSynthClick(time, isAccent);
        break;
    }
  }

  /**
   * Classic wood metronome sound
   */
  private playWoodClick(time: number, isAccent: boolean): void {
    const config = SOUND_CONFIG.classic;
    const frequency = isAccent ? config.accentFreq : config.normalFreq;
    const volume = isAccent ? config.accentGain : config.normalGain;
    this.playTone(time, frequency, volume, config.duration, config.type);
  }

  /**
   * Digital beep sound
   */
  private playDigitalClick(time: number, isAccent: boolean): void {
    const config = SOUND_CONFIG.digital;
    const frequency = isAccent ? config.accentFreq : config.normalFreq;
    const volume = isAccent ? config.accentGain : config.normalGain;
    this.playTone(time, frequency, volume, config.duration, config.type);
  }

  /**
   * Drumstick sound (short percussive)
   */
  private playDrumstickClick(time: number, isAccent: boolean): void {
    const config = SOUND_CONFIG.drumstick;
    const frequency = isAccent ? config.accentFreq : config.normalFreq;
    const volume = isAccent ? config.accentGain : config.normalGain;
    this.playTone(time, frequency, volume, config.duration, config.type);
  }

  /**
   * Bell sound (metallic, longer decay)
   */
  private playBellClick(time: number, isAccent: boolean): void {
    const config = SOUND_CONFIG.bell;
    const frequency = isAccent ? config.accentFreq : config.normalFreq;
    const volume = isAccent ? config.accentGain : config.normalGain;
    this.playTone(time, frequency, volume, config.duration, config.type);
  }

  /**
   * Synth sound (electronic)
   */
  private playSynthClick(time: number, isAccent: boolean): void {
    const config = SOUND_CONFIG.synth;
    const frequency = isAccent ? config.accentFreq : config.normalFreq;
    const volume = isAccent ? config.accentGain : config.normalGain;
    this.playTone(time, frequency, volume, config.duration, config.type);
  }

  /**
   * Resume AudioContext (needed for browser autoplay policy)
   */
  async resume(): Promise<void> {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    await this.audioContext.close();
  }
}
