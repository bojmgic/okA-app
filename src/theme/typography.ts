/**
 * Font family names as registered by expo-font (see App.tsx's useFonts call)
 * from @expo-google-fonts/space-grotesk and @expo-google-fonts/inter — the
 * same two families the website uses (`font-display` / `font-sans` in
 * tailwind.config.js), so headings and body text read as the same product.
 */
export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displaySemibold: 'SpaceGrotesk_600SemiBold',
  displayMedium: 'SpaceGrotesk_500Medium',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const
