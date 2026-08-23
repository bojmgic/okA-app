/**
 * Ported 1:1 from okA-website/tailwind.config.js — same palette, same
 * naming, so anyone moving between the web app-preview and this native app
 * is looking at the same numbers, not a re-interpretation of them.
 */
export const colors = {
  primary: {
    DEFAULT: '#0057E7',
    50: '#EBF1FF',
    100: '#D6E4FF',
    200: '#ADC8FF',
    300: '#7FA6FF',
    400: '#4B7EFF',
    500: '#1450E0',
    600: '#0057E7',
    700: '#0044B8',
    800: '#00318A',
    900: '#00205C',
  },
  ink: {
    DEFAULT: '#0B0B0F',
    light: '#3A3A42',
  },
  surface: {
    DEFAULT: '#FFFFFF',
    tint: '#EAF1FF',
    muted: '#DCE9FF',
  },
  navy: {
    DEFAULT: '#050B18',
    light: '#0A1428',
    border: '#152340',
  },
  white: '#FFFFFF',
} as const

/** Same 180deg blue button gradient used everywhere on the web app-preview
 *  (`linear-gradient(180deg,#1D6BFF 0%,#0057E7 60%)`) — kept as an explicit
 *  two-stop tuple since RN's LinearGradient takes colors/locations arrays
 *  rather than a CSS gradient string. */
export const primaryButtonGradient = {
  colors: ['#1D6BFF', '#0057E7'] as const,
  locations: [0, 0.6] as const,
}

export const darkButtonGradient = {
  colors: ['#0A2E73', '#00205C'] as const,
  locations: [0, 0.6] as const,
}
