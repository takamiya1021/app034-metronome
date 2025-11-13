/**
 * AudioContext Mock verification test
 */
import { MockAudioContext } from '../__mocks__/audioContext';

describe('AudioContext Mock', () => {
  it('should create AudioContext instance', () => {
    const context = new AudioContext();
    expect(context).toBeDefined();
    expect(context.state).toBe('running');
  });

  it('should create oscillator node', () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    expect(oscillator).toBeDefined();
    expect(oscillator.frequency.value).toBe(440);
  });

  it('should create gain node', () => {
    const context = new AudioContext();
    const gain = context.createGain();
    expect(gain).toBeDefined();
    expect(gain.gain.value).toBe(1.0);
  });

  it('should connect audio nodes', () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const result = oscillator.connect(gain);
    expect(result).toBe(gain);
  });

  it('should start and stop oscillator', () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();

    oscillator.start(0);
    expect(oscillator.startTime).toBe(0);

    oscillator.stop(1);
    expect(oscillator.stopTime).toBe(1);
  });

  it('should set audio param values', () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();

    oscillator.frequency.value = 1000;
    expect(oscillator.frequency.value).toBe(1000);
  });

  it('should support exponential ramp', () => {
    const context = new AudioContext();
    const gain = context.createGain();

    gain.gain.exponentialRampToValueAtTime(0.001, 1);
    expect(gain.gain.value).toBe(0.001);
  });
});
