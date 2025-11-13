/**
 * TapTempo test suite (TDD)
 */
import { TapTempo } from './tapTempo';

describe('TapTempo', () => {
  let tapTempo: TapTempo;

  beforeEach(() => {
    tapTempo = new TapTempo();
  });

  it('should return null for less than 2 taps', () => {
    expect(tapTempo.tap()).toBeNull();
  });

  it('should calculate BPM from 2 taps', () => {
    const now = Date.now();
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 500); // 500ms = 120 BPM

    tapTempo.tap();
    const bpm = tapTempo.tap();
    expect(bpm).toBe(120);
  });

  it('should calculate BPM from multiple taps', () => {
    const now = Date.now();
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 500)
      .mockReturnValueOnce(now + 1000)
      .mockReturnValueOnce(now + 1500);

    tapTempo.tap();
    tapTempo.tap();
    tapTempo.tap();
    const bpm = tapTempo.tap();
    expect(bpm).toBe(120);
  });

  it('should reset tap history', () => {
    tapTempo.tap();
    tapTempo.tap();
    tapTempo.reset();
    expect(tapTempo.tap()).toBeNull();
  });

  it('should remove old taps (> 3 seconds)', () => {
    const now = Date.now();
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + 4000); // 4 seconds later

    tapTempo.tap();
    const bpm = tapTempo.tap();
    // Should return null because first tap is too old
    expect(bpm).toBeNull();
  });
});
