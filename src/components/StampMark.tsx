import { View, Text, StyleSheet } from 'react-native'
import { colors, fonts } from '../theme'

interface StampMarkProps {
  label: string
  tone?: 'primary' | 'white'
  style?: object
}

/**
 * Rotated double-ring "stamped" status mark — matches StampMark.tsx on the
 * web app-preview. `tone="white"` for use on dark brand-blue card
 * backgrounds where the default primary-blue ring would be invisible.
 */
export default function StampMark({ label, tone = 'primary', style }: StampMarkProps) {
  const ringColor = tone === 'white' ? '#fff' : colors.primary.DEFAULT
  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.outerRing, { borderColor: ringColor }]}>
        <View style={[styles.innerRing, { borderColor: ringColor }]}>
          <Text style={[styles.label, { color: ringColor }]} numberOfLines={2}>
            {label.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },
  outerRing: {
    borderWidth: 1.5,
    borderRadius: 999,
    padding: 3,
  },
  innerRing: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 9,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
})
