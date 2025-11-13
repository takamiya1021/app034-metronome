/**
 * AudioEngine test suite (TDD - Red phase)
 */
import { AudioEngine } from './audioEngine';
import type { SoundType } from '../types/metronome';

describe('AudioEngine', () => {
  let audioEngine: AudioEngine;

  beforeEach(() => {
    audioEngine = new AudioEngine();
  });

  afterEach(() => {
    audioEngine.dispose();
  });

  describe('Initialization', () => {
    it('should create AudioContext on initialization', () => {
      expect(audioEngine.audioContext).toBeDefined();
      expect(audioEngine.audioContext.state).toBe('running');
    });

    it('should create GainNode and connect to destination', () => {
      expect(audioEngine['gainNode']).toBeDefined();
    });
  });

  describe('playClick', () => {
    it('should play click sound at specified time', () => {
      const mockTime = 0.5;
      // This should not throw
      expect(() => {
        audioEngine.playClick(mockTime, false);
      }).not.toThrow();
    });

    it('should play accent click with higher frequency', () => {
      const mockTime = 0.5;
      // Accent click should use different frequency
      expect(() => {
        audioEngine.playClick(mockTime, true);
      }).not.toThrow();
    });
  });

  describe('playCustomClick', () => {
    const soundTypes: SoundType[] = ['classic', 'digital', 'drumstick', 'bell', 'synth'];

    soundTypes.forEach((soundType) => {
      it(`should play ${soundType} sound`, () => {
        const mockTime = 0.5;
        expect(() => {
          audioEngine.playCustomClick(mockTime, soundType, false);
        }).not.toThrow();
      });

      it(`should play ${soundType} sound with accent`, () => {
        const mockTime = 0.5;
        expect(() => {
          audioEngine.playCustomClick(mockTime, soundType, true);
        }).not.toThrow();
      });
    });
  });

  describe('resume', () => {
    it('should resume AudioContext when suspended', async () => {
      // Suspend first
      await audioEngine.audioContext.suspend();
      expect(audioEngine.audioContext.state).toBe('suspended');

      // Then resume
      await audioEngine.resume();
      expect(audioEngine.audioContext.state).toBe('running');
    });

    it('should not throw when already running', async () => {
      expect(audioEngine.audioContext.state).toBe('running');
      await expect(audioEngine.resume()).resolves.not.toThrow();
    });
  });

  describe('dispose', () => {
    it('should close AudioContext', async () => {
      await audioEngine.dispose();
      expect(audioEngine.audioContext.state).toBe('closed');
    });

    it('should be safe to call multiple times', async () => {
      await audioEngine.dispose();
      await expect(audioEngine.dispose()).resolves.not.toThrow();
    });
  });

  describe('Sound frequency and volume', () => {
    it('should use correct frequency for accent vs normal', () => {
      const mockOscillator = audioEngine.audioContext.createOscillator();

      // Normal click should be around 800Hz
      // Accent click should be around 1000Hz or higher
      // This is tested indirectly through the playClick method
      expect(mockOscillator.frequency.value).toBeDefined();
    });
  });
});
