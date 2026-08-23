import { Pressable, Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import type { LucideIcon } from 'lucide-react-native'
import { colors, fonts } from '../theme'

interface CouponButtonProps {
  icon: LucideIcon
  label: string
  tone?: 'default' | 'danger'
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

/**
 * Torn-coupon-stub action button — a simplified port of CouponButton.tsx
 * from the web app-preview. The web version clips a zigzag tear edge via
 * `clip-path`; React Native has no equivalent for arbitrary polygon clip
 * paths on a View, so this keeps the icon-badge-in-a-card language and the
 * dashed top rule (which reads as the "torn" cue) without the literal
 * zigzag silhouette.
 */
export default function CouponButton({ icon: Icon, label, tone = 'default', onPress, style }: CouponButtonProps) {
  const isDanger = tone === 'danger'
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }, style]}>
      <View style={[styles.iconBadge, isDanger && styles.iconBadgeDanger]}>
        <Icon size={16} color={isDanger ? '#DC2626' : colors.primary.DEFAULT} />
      </View>
      <Text style={[styles.label, isDanger && styles.labelDanger]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '31%',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(11,11,15,0.12)',
    paddingVertical: 12,
    backgroundColor: colors.surface.tint,
  },
  iconBadge: {
    height: 34,
    width: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  iconBadgeDanger: { backgroundColor: '#FEE2E2' },
  label: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.ink.DEFAULT },
  labelDanger: { color: '#DC2626' },
})
