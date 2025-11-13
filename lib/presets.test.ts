/**
 * Presets test suite
 */
import {
  BUILT_IN_PRESETS,
  getAllPresets,
  getPresetById,
  createUserPreset,
  isPresetNameUnique,
} from './presets';
import type { MetronomePreset } from '../types/metronome';

describe('Presets', () => {
  describe('BUILT_IN_PRESETS', () => {
    it('should have 9 built-in presets', () => {
      expect(BUILT_IN_PRESETS.length).toBe(9);
    });

    it('should include all required presets', () => {
      const presetNames = BUILT_IN_PRESETS.map((p) => p.id);
      expect(presetNames).toContain('largo');
      expect(presetNames).toContain('adagio');
      expect(presetNames).toContain('andante');
      expect(presetNames).toContain('moderato');
      expect(presetNames).toContain('allegro');
      expect(presetNames).toContain('presto');
      expect(presetNames).toContain('rock');
      expect(presetNames).toContain('jazz');
      expect(presetNames).toContain('techno');
    });

    it('should have all presets marked as built-in', () => {
      BUILT_IN_PRESETS.forEach((preset) => {
        expect(preset.isBuiltIn).toBe(true);
      });
    });
  });

  describe('getAllPresets', () => {
    it('should return only built-in presets when no user presets', () => {
      const presets = getAllPresets();
      expect(presets.length).toBe(9);
    });

    it('should combine built-in and user presets', () => {
      const userPresets: MetronomePreset[] = [
        {
          id: 'user-1',
          name: 'My Preset',
          bpm: 150,
          timeSignature: { beats: 4, noteValue: 4 },
          soundType: 'digital',
          subdivision: 'quarter',
          accentEnabled: true,
          isBuiltIn: false,
        },
      ];

      const presets = getAllPresets(userPresets);
      expect(presets.length).toBe(10);
    });
  });

  describe('getPresetById', () => {
    it('should find built-in preset by ID', () => {
      const preset = getPresetById('allegro');
      expect(preset).toBeDefined();
      expect(preset?.name).toBe('Allegro');
    });

    it('should find user preset by ID', () => {
      const userPresets: MetronomePreset[] = [
        {
          id: 'user-1',
          name: 'My Preset',
          bpm: 150,
          timeSignature: { beats: 4, noteValue: 4 },
          soundType: 'digital',
          subdivision: 'quarter',
          accentEnabled: true,
          isBuiltIn: false,
        },
      ];

      const preset = getPresetById('user-1', userPresets);
      expect(preset).toBeDefined();
      expect(preset?.name).toBe('My Preset');
    });

    it('should return undefined for non-existent ID', () => {
      const preset = getPresetById('non-existent');
      expect(preset).toBeUndefined();
    });
  });

  describe('createUserPreset', () => {
    it('should create user preset with generated ID', () => {
      const preset = createUserPreset({
        name: 'Test Preset',
        bpm: 100,
        timeSignature: { beats: 4, noteValue: 4 },
        soundType: 'digital',
        subdivision: 'eighth',
        accentEnabled: true,
      });

      expect(preset.id).toMatch(/^user-/);
      expect(preset.isBuiltIn).toBe(false);
      expect(preset.name).toBe('Test Preset');
    });
  });

  describe('isPresetNameUnique', () => {
    it('should return false for built-in preset name', () => {
      const unique = isPresetNameUnique('Allegro', []);
      expect(unique).toBe(false);
    });

    it('should return false for user preset name', () => {
      const userPresets: MetronomePreset[] = [
        {
          id: 'user-1',
          name: 'My Preset',
          bpm: 150,
          timeSignature: { beats: 4, noteValue: 4 },
          soundType: 'digital',
          subdivision: 'quarter',
          accentEnabled: true,
          isBuiltIn: false,
        },
      ];

      const unique = isPresetNameUnique('My Preset', userPresets);
      expect(unique).toBe(false);
    });

    it('should return true for unique name', () => {
      const unique = isPresetNameUnique('Unique Name', []);
      expect(unique).toBe(true);
    });
  });
});
