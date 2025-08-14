/**
 * Utility functions shared across sport-specific modules. Keeping
 * transformations here helps avoid duplication and centralises any
 * tweaks to scoring logic or styling thresholds.
 */

/**
 * Convert a home run rate (0–1) into a CSS class for colour
 * highlighting. These classes correspond to definitions in
 * globals.css.
 */
export function hrRateToClass(rate: number): string {
  if (rate >= 0.3) return 'heat‑veryhigh';
  if (rate >= 0.2) return 'heat‑high';
  if (rate >= 0.1) return 'heat‑medium';
  return 'heat‑low';
}

/**
 * Safely parse numbers from strings. Returns undefined if the value
 * cannot be converted to a finite number.
 */
export function toNumber(value: any): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}