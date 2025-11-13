/**
 * Metronome class
 * Core metronome logic with precise timing using Web Audio API
 */

import { AudioEngine } from './audioEngine';
import type {
  MetronomeConfig,
  TimeSignature,
  SoundType,
  Subdivision,
} from '../types/metronome';

// BPM constraints
const MIN_BPM = 40;
const MAX_BPM = 240;

// Scheduling constants for timing accuracy
const SCHEDULE_AHEAD_TIME = 0.1; // Schedule 100ms ahead
const LOOKAHEAD = 25.0; // Check every 25ms

export class Metronome {
  private audioEngine: AudioEngine;
  private bpm: number;
  private timeSignature: TimeSignature;
  private soundType: SoundType;
  private accentEnabled: boolean;
  private subdivision: Subdivision;
  private playing: boolean = false;
  private currentBeat: number = 0;
  private nextNoteTime: number = 0;
  private timerID: number | null = null;

  constructor(config: MetronomeConfig) {
    this.audioEngine = new AudioEngine();
    this.bpm = this.clampBPM(config.bpm);
    this.timeSignature = config.timeSignature;
    this.soundType = config.soundType;
    this.accentEnabled = config.accentEnabled;
    this.subdivision = config.subdivision;
  }

  /**
   * Clamp BPM to valid range
   */
  private clampBPM(bpm: number): number {
    return Math.max(MIN_BPM, Math.min(MAX_BPM, bpm));
  }

  /**
   * Start the metronome
   */
  start(): void {
    if (this.playing) return;

    this.playing = true;
    this.currentBeat = 0;
    this.nextNoteTime = this.audioEngine.audioContext.currentTime;
    this.audioEngine.resume();
    this.scheduler();
  }

  /**
   * Stop the metronome
   */
  stop(): void {
    this.playing = false;
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  /**
   * Scheduling loop - checks if notes need to be scheduled
   */
  private scheduler(): void {
    // Schedule notes that fall within the lookahead window
    while (
      this.nextNoteTime <
      this.audioEngine.audioContext.currentTime + SCHEDULE_AHEAD_TIME
    ) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      this.nextNote();
    }

    // Continue scheduling if still playing
    if (this.playing) {
      this.timerID = window.setTimeout(() => {
        this.scheduler();
      }, LOOKAHEAD);
    }
  }

  /**
   * Schedule a single note
   */
  private scheduleNote(beatNumber: number, time: number): void {
    // Determine if this is an accent beat (first beat of the measure)
    const isAccent = this.accentEnabled && beatNumber === 0;

    // Play the main beat
    this.audioEngine.playCustomClick(time, this.soundType, isAccent);

    // Handle subdivisions
    if (this.subdivision !== 'quarter') {
      this.scheduleSubdivisions(time);
    }
  }

  /**
   * Schedule subdivision clicks between main beats
   */
  private scheduleSubdivisions(time: number): void {
    const subdivisionCount = this.getSubdivisionCount();
    const secondsPerBeat = 60.0 / this.bpm;
    const subdivisionInterval = secondsPerBeat / subdivisionCount;

    // Schedule subdivision notes (skip the first one as it's the main beat)
    for (let i = 1; i < subdivisionCount; i++) {
      const subdivisionTime = time + subdivisionInterval * i;
      this.audioEngine.playCustomClick(subdivisionTime, this.soundType, false);
    }
  }

  /**
   * Get number of subdivisions per beat
   */
  private getSubdivisionCount(): number {
    switch (this.subdivision) {
      case 'eighth':
        return 2;
      case 'sixteenth':
        return 4;
      case 'triplet':
        return 3;
      default:
        return 1;
    }
  }

  /**
   * Advance to the next note
   */
  private nextNote(): void {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += secondsPerBeat;

    this.currentBeat++;
    if (this.currentBeat >= this.timeSignature.beats) {
      this.currentBeat = 0;
    }
  }

  // Getters
  getBPM(): number {
    return this.bpm;
  }

  getTimeSignature(): TimeSignature {
    return this.timeSignature;
  }

  getSoundType(): SoundType {
    return this.soundType;
  }

  isAccentEnabled(): boolean {
    return this.accentEnabled;
  }

  getSubdivision(): Subdivision {
    return this.subdivision;
  }

  getCurrentBeat(): number {
    return this.currentBeat;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  // Setters
  setBPM(bpm: number): void {
    this.bpm = this.clampBPM(bpm);
  }

  setTimeSignature(timeSignature: TimeSignature): void {
    this.timeSignature = timeSignature;
    // Reset beat counter when time signature changes
    if (this.playing) {
      this.currentBeat = 0;
    }
  }

  setSoundType(soundType: SoundType): void {
    this.soundType = soundType;
  }

  setAccent(enabled: boolean): void {
    this.accentEnabled = enabled;
  }

  setSubdivision(subdivision: Subdivision): void {
    this.subdivision = subdivision;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    this.audioEngine.dispose();
  }
}
