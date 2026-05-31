/**
 * Cross-client formatting helpers. Pure functions only — no I/O.
 * Used by both backend response shapers and TV client components
 * to guarantee identical display across Fire TV and Roku.
 */

/**
 * Format a USD price. Cents are shown for prices under $1000,
 * dropped above that to save screen space on TV.
 */
export function formatPrice(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (Math.abs(value) >= 1000) {
    return `$${Math.round(value).toLocaleString('en-US')}`;
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format a percentage with sign and one decimal (e.g. "+1.2%"). */
export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/** Format a large dollar amount using K/M/B/T suffixes for TV legibility. */
export function formatCompactUsd(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

/** Returns 'up' for positive change, 'down' for negative, 'flat' for zero/NaN. */
export function changeDirection(value: number): 'up' | 'down' | 'flat' {
  if (!Number.isFinite(value) || value === 0) return 'flat';
  return value > 0 ? 'up' : 'down';
}
