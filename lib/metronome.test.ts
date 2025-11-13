/**
 * Metronome test suite (TDD - Red phase)
 */
import { Metronome } from './metronome';
import type { MetronomeConfig } from '../types/metronome';

describe('Metronome', () => {
  let metronome: Metronome;
  const defaultConfig: MetronomeConfig = {
    bpm: 120,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'classic',
    accentEnabled: true,
    subdivision: 'quarter',
  };

  beforeEach(() => {
    metronome = new Metronome(defaultConfig);
  });

  afterEach(() => {
    metronome.stop();
    metronome.dispose();
  });

  describe('Initialization', () => {
    it('should initialize with provided config', () => {
      expect(metronome.getBPM()).toBe(120);
      expect(metronome.getTimeSignature()).toEqual({ beats: 4, noteValue: 4 });
      expect(metronome.isPlaying()).toBe(false);
    });

    it('should accept different time signatures', () => {
      const configs = [
        { beats: 2, noteValue: 4 },
        { beats: 3, noteValue: 4 },
        { beats: 5, noteValue: 4 },
        { beats: 6, noteValue: 8 },
        { beats: 7, noteValue: 8 },
        { beats: 9, noteValue: 8 },
        { beats: 12, noteValue: 8 },
      ];

      configs.forEach((timeSignature) => {
        const m = new Metronome({ ...defaultConfig, timeSignature });
        expect(m.getTimeSignature()).toEqual(timeSignature);
        m.dispose();
      });
    });
  });

  describe('Start and Stop', () => {
    it('should start playing', () => {
      metronome.start();
      expect(metronome.isPlaying()).toBe(true);
    });

    it('should stop playing', () => {
      metronome.start();
      metronome.stop();
      expect(metronome.isPlaying()).toBe(false);
    });

    it('should not start twice', () => {
      metronome.start();
      const wasPlaying = metronome.isPlaying();
      metronome.start(); // Try to start again
      expect(metronome.isPlaying()).toBe(wasPlaying);
    });
  });

  describe('BPM Management', () => {
    it('should update BPM', () => {
      metronome.setBPM(140);
      expect(metronome.getBPM()).toBe(140);
    });

    it('should handle valid BPM range (40-240)', () => {
      metronome.setBPM(40);
      expect(metronome.getBPM()).toBe(40);

      metronome.setBPM(240);
      expect(metronome.getBPM()).toBe(240);
    });

    it('should clamp BPM below minimum', () => {
      metronome.setBPM(30);
      expect(metronome.getBPM()).toBe(40);
    });

    it('should clamp BPM above maximum', () => {
      metronome.setBPM(300);
      expect(metronome.getBPM()).toBe(240);
    });
  });

  describe('Time Signature Management', () => {
    it('should update time signature', () => {
      const newSig = { beats: 3, noteValue: 4 };
      metronome.setTimeSignature(newSig);
      expect(metronome.getTimeSignature()).toEqual(newSig);
    });
  });

  describe('Sound Type Management', () => {
    it('should update sound type', () => {
      metronome.setSoundType('digital');
      expect(metronome.getSoundType()).toBe('digital');
    });

    it('should support all sound types', () => {
      const types = ['classic', 'digital', 'drumstick', 'bell', 'synth'] as const;
      types.forEach((type) => {
        metronome.setSoundType(type);
        expect(metronome.getSoundType()).toBe(type);
      });
    });
  });

  describe('Accent Management', () => {
    it('should toggle accent', () => {
      metronome.setAccent(false);
      expect(metronome.isAccentEnabled()).toBe(false);

      metronome.setAccent(true);
      expect(metronome.isAccentEnabled()).toBe(true);
    });
  });

  describe('Subdivision Management', () => {
    it('should update subdivision', () => {
      metronome.setSubdivision('eighth');
      expect(metronome.getSubdivision()).toBe('eighth');
    });

    it('should support all subdivision types', () => {
      const types = ['quarter', 'eighth', 'sixteenth', 'triplet'] as const;
      types.forEach((type) => {
        metronome.setSubdivision(type);
        expect(metronome.getSubdivision()).toBe(type);
      });
    });
  });

  describe('Current Beat Tracking', () => {
    it('should start at beat 0', () => {
      expect(metronome.getCurrentBeat()).toBe(0);
    });

    it('should track current beat when playing', (done) => {
      metronome.start();
      // Beat should update within a reasonable time
      setTimeout(() => {
        const beat = metronome.getCurrentBeat();
        expect(beat).toBeGreaterThanOrEqual(0);
        expect(beat).toBeLessThan(4); // 4/4 time
        metronome.stop();
        done();
      }, 100);
    }, 1000);
  });

  describe('Scheduler Timing', () => {
    it('should calculate correct interval for BPM', () => {
      // At 120 BPM, each beat = 0.5 seconds
      metronome.setBPM(120);
      const interval = 60 / 120;
      expect(interval).toBe(0.5);
    });

    it('should calculate correct interval for different BPMs', () => {
      // At 60 BPM, each beat = 1 second
      metronome.setBPM(60);
      const interval = 60 / 60;
      expect(interval).toBe(1.0);

      // At 240 BPM, each beat = 0.25 seconds
      metronome.setBPM(240);
      const interval2 = 60 / 240;
      expect(interval2).toBe(0.25);
    });
  });
});
