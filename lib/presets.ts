/**
 * Preset management for Metronome
 */

import type { MetronomePreset } from '../types/metronome';

export const BUILT_IN_PRESETS: MetronomePreset[] = [
  {
    id: 'largo',
    name: 'Largo',
    bpm: 50,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'classic',
    subdivision: 'quarter',
    accentEnabled: true,
    isBuiltIn: true,
  },
  {
    id: 'adagio',
    name: 'Adagio',
    bpm: 70,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'classic',
    subdivision: 'quarter',
    accentEnabled: true,
    isBuiltIn: true,
  },
  {
    id: 'andante',
    name: 'Andante',
    bpm: 90,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'classic',
    subdivision: 'quarter',
    accentEnabled: true,
    isBuiltIn: true,
  },
  {
    id: 'moderato',
    name: 'Moderato',
    bpm: 110,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'classic',
    subdivision: 'quarter',
    accentEnabled: true,
    isBuiltIn: true,
  },
  {
    id: 'allegro',
    name: 'Allegro',
    bpm: 140,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'classic',
    subdivision: 'quarter',
    accentEnabled: true,
    isBuiltIn: true,
  },
  {
    id: 'presto',
    name: 'Presto',
    bpm: 180,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'classic',
    subdivision: 'quarter',
    accentEnabled: true,
    isBuiltIn: true,
  },
  {
    id: 'rock',
    name: 'ロック',
    bpm: 130,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'drumstick',
    subdivision: 'eighth',
    accentEnabled: true,
    isBuiltIn: true,
  },
  {
    id: 'jazz',
    name: 'ジャズ',
    bpm: 120,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'bell',
    subdivision: 'triplet',
    accentEnabled: false,
    isBuiltIn: true,
  },
  {
    id: 'techno',
    name: 'テクノ',
    bpm: 135,
    timeSignature: { beats: 4, noteValue: 4 },
    soundType: 'synth',
    subdivision: 'sixteenth',
    accentEnabled: true,
    isBuiltIn: true,
  },
];

/**
 * Get all presets (built-in + user presets)
 */
export function getAllPresets(userPresets: MetronomePreset[] = []): MetronomePreset[] {
  return [...BUILT_IN_PRESETS, ...userPresets];
}

/**
 * Get preset by ID
 */
export function getPresetById(
  id: string,
  userPresets: MetronomePreset[] = []
): MetronomePreset | undefined {
  const allPresets = getAllPresets(userPresets);
  return allPresets.find((preset) => preset.id === id);
}

/**
 * Create a new user preset
 */
export function createUserPreset(
  preset: Omit<MetronomePreset, 'id' | 'isBuiltIn'>
): MetronomePreset {
  return {
    ...preset,
    id: `user-${Date.now()}`,
    isBuiltIn: false,
  };
}

/**
 * Validate preset name uniqueness
 */
export function isPresetNameUnique(
  name: string,
  userPresets: MetronomePreset[]
): boolean {
  const allPresets = getAllPresets(userPresets);
  return !allPresets.some((preset) => preset.name === name);
}
