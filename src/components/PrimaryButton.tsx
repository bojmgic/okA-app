import { Pressable, Text, StyleSheet, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { fonts } from '../theme'
import { primaryButtonGradient, darkButtonGradient } from '../theme/colors'
import { brand } from '../utils/brand'

interface PrimaryButtonProps {
  label: string
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  tone?: 'primary' | 'dark'
  icon?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

/**
 * The one recurring "big blue pill button" from the web app-preview
 * (`linear-gradient(180deg,#6E9AD2 0%,#4a80c8 60%)` + inset top highlight),
 * ported once here rather than re-declared per screen — every screen that
 * had a bespoke gradient button on the web side uses this instead.
 */
export default function PrimaryButton({ label, onPress, disabled, loading, tone = 'primary', icon, style }: PrimaryButtonProps) {
  const gradient = tone === 'dark' ? darkButtonGradient : primaryButtonGradient
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={[{ opacity: disabled ? 0.4 : 1 }, style]}>
      {({ pressed }) => (
        <LinearGradient
          colors={gradient.colors}
          locations={gradient.locations}
          style={[styles.button, pressed && styles.pressed]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {icon}
              <Text style={styles.label}>{brand(label)}</Text>
            </>
          )}
        </LinearGradient>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    paddingVertical: 15,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    color: '#fff',
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
  },
})
