/**
 * Type definitions for Metronome application
 */

// Time signature (e.g., 4/4, 3/4, etc.)
export interface TimeSignature {
  beats: number;      // Numerator (number of beats)
  noteValue: number;  // Denominator (note type)
}

// Sound type options
export type SoundType = 'classic' | 'digital' | 'drumstick' | 'bell' | 'synth';

// Subdivision options
export type Subdivision = 'quarter' | 'eighth' | 'sixteenth' | 'triplet';

// Metronome configuration
export interface MetronomeConfig {
  bpm: number;
  timeSignature: TimeSignature;
  soundType: SoundType;
  accentEnabled: boolean;
  subdivision: Subdivision;
}

// Metronome state (extends config with runtime state)
export interface MetronomeState extends MetronomeConfig {
  isPlaying: boolean;
  currentBeat: number;
}

// Preset definition
export interface MetronomePreset {
  id: string;
  name: string;
  bpm: number;
  timeSignature: TimeSignature;
  soundType: SoundType;
  subdivision: Subdivision;
  accentEnabled: boolean;
  isBuiltIn: boolean;
}

// AI generated content
export interface AIContent {
  rhythmTraining: string;
  genreBPM: string;
  generatedAt: Date;
}
