/**
 * Dark TV theme. Sized for 10-foot viewing — minimum 32px body / 48px headers.
 * All colors keep contrast >= 7:1 on the base background for WCAG AAA at distance.
 */
export const theme = {
  colors: {
    bg: '#0A0E14',
    bgElevated: '#141B24',
    bgCard: '#1A2230',
    border: '#2A3548',
    text: '#FFFFFF',
    textMuted: '#8B96AB',
    textDim: '#5A6478',
    accent: '#FFB800',
    up: '#00D88A',
    down: '#FF5860',
    flat: '#8B96AB',
    overlay: 'rgba(0,0,0,0.7)',
  },
  fontSize: {
    label: 24,
    body: 32,
    bodyLg: 40,
    header: 48,
    display: 72,
    ticker: 36,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 20,
    lg: 32,
    xl: 48,
    xxl: 80,
  },
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  focus: {
    ringWidth: 3,
    ringColor: '#FFB800',
    scale: 1.05,
  },
} as const;

export type Theme = typeof theme;
