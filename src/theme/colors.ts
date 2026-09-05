/**
 * Ported 1:1 from okA-website/tailwind.config.js — same palette, same
 * naming, so anyone moving between the web app-preview and this native app
 * is looking at the same numbers, not a re-interpretation of them.
 */
export const colors = {
  primary: {
    DEFAULT: '#4a80c8',
    50: '#EEF3FA',
    100: '#DCE7F4',
    200: '#B9CFE9',
    300: '#96B7DE',
    400: '#6E9AD2',
    500: '#4a80c8',
    600: '#3A6BB0',
    700: '#2F5590',
    800: '#264670',
    900: '#1D3554',
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
 *  (`linear-gradient(180deg,#6E9AD2 0%,#4a80c8 60%)`) — kept as an explicit
 *  two-stop tuple since RN's LinearGradient takes colors/locations arrays
 *  rather than a CSS gradient string. Re-derived from the primary.400→500
 *  ramp above after the brand blue moved from #0057E7 to #4a80c8. */
export const primaryButtonGradient = {
  colors: ['#6E9AD2', '#4a80c8'] as const,
  locations: [0, 0.6] as const,
}

export const darkButtonGradient = {
  colors: ['#264670', '#1D3554'] as const,
  locations: [0, 0.6] as const,
}
