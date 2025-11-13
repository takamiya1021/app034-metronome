/**
 * TapTempo class
 * Detects BPM from user taps
 */

const TAP_TIMEOUT = 3000; // 3 seconds

export class TapTempo {
  private tapTimes: number[] = [];

  /**
   * Record a tap and calculate BPM if enough taps
   * @returns BPM or null if not enough taps
   */
  tap(): number | null {
    const now = Date.now();
    this.tapTimes.push(now);

    // Remove taps older than TAP_TIMEOUT
    this.tapTimes = this.tapTimes.filter(time => now - time < TAP_TIMEOUT);

    // Need at least 2 taps to calculate BPM
    if (this.tapTimes.length < 2) {
      return null;
    }

    // Calculate intervals between consecutive taps
    const intervals: number[] = [];
    for (let i = 1; i < this.tapTimes.length; i++) {
      intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
    }

    // Calculate average interval
    const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;

    // Convert to BPM (60000 ms per minute)
    const bpm = Math.round(60000 / averageInterval);

    return bpm;
  }

  /**
   * Reset tap history
   */
  reset(): void {
    this.tapTimes = [];
  }
}
