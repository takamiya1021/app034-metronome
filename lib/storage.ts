/**
 * Local Storage management
 */

import type { MetronomeConfig, MetronomePreset } from '../types/metronome';

const STORAGE_KEYS = {
  API_KEY: 'metronome-app-api-key',
  LAST_CONFIG: 'metronome-last-config',
  USER_PRESETS: 'metronome-user-presets',
} as const;

/**
 * Save API key
 */
export function saveAPIKey(apiKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
  }
}

/**
 * Load API key
 */
export function loadAPIKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  }
  return null;
}

/**
 * Save last used configuration
 */
export function saveLastConfig(config: MetronomeConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LAST_CONFIG, JSON.stringify(config));
  }
}

/**
 * Load last used configuration
 */
export function loadLastConfig(): MetronomeConfig | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_CONFIG);
    if (data) {
      try {
        return JSON.parse(data) as MetronomeConfig;
      } catch (e) {
        console.error('Failed to parse last config:', e);
        return null;
      }
    }
  }
  return null;
}

/**
 * Save user presets
 */
export function saveUserPresets(presets: MetronomePreset[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_PRESETS, JSON.stringify(presets));
  }
}

/**
 * Load user presets
 */
export function loadUserPresets(): MetronomePreset[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PRESETS);
    if (data) {
      try {
        return JSON.parse(data) as MetronomePreset[];
      } catch (e) {
        console.error('Failed to parse user presets:', e);
        return [];
      }
    }
  }
  return [];
}

/**
 * Clear all stored data
 */
export function clearAllData(): void {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
