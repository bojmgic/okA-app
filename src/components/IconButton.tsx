import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import type { LucideIcon } from 'lucide-react-native'
import { colors } from '../theme'

interface IconButtonProps {
  icon: LucideIcon
  onPress?: () => void
  accessibilityLabel: string
  tone?: 'light' | 'dark'
  size?: number
  style?: StyleProp<ViewStyle>
}

/**
 * Round icon control — the same "tactile circle, not a bare glyph" treatment
 * used for every icon-only control across the web app-preview (back/close,
 * bell, map controls). `tone: 'light'` for use on the map/photo backgrounds,
 * `'dark'` for use on the brand-blue blocks.
 */
export default function IconButton({ icon: Icon, onPress, accessibilityLabel, tone = 'light', size = 16, style }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        tone === 'light' ? styles.light : styles.dark,
        pressed && { transform: [{ scale: 0.92 }] },
        style,
      ]}
    >
      <Icon size={size} color={tone === 'light' ? colors.ink.DEFAULT : '#fff'} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  light: {
    backgroundColor: '#F3F6FC',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  dark: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
})
