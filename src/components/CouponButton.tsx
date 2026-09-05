import { Pressable, Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import type { LucideIcon } from 'lucide-react-native'
import { colors, fonts } from '../theme'

interface CouponButtonProps {
  icon: LucideIcon
  label: string
  tone?: 'default' | 'danger'
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  /** 'column' = icon above label (3-up grid, default); 'row' = icon beside
   *  label (2-up grid) — matches the web version's `layout` prop. */
  layout?: 'column' | 'row'
}

// Same sawtooth silhouette as the web version's `clip-path: polygon(...)`
// zigzag, re-expressed as an SVG path in a 0-100 coordinate space (stretched
// to the button's real size via `preserveAspectRatio="none"`) since React
// Native has no clip-path. Drawn once, filled AND stroked (dashed) in a
// single <Path> so the border follows the torn top edge exactly like the
// web version's border-inside-clip-path trick, instead of a separate
// straight dashed rule sitting on top of a plain rounded card.
const ZIGZAG_PATH =
  'M 0,9 L 7,0 L 14,9 L 21,0 L 28,9 L 35,0 L 42,9 L 49,0 L 56,9 L 63,0 L 70,9 L 77,0 L 84,9 L 91,0 L 98,9 L 100,4 L 100,100 L 0,100 Z'

/**
 * Action button styled as a torn coupon stub — direct port of the web app-
 * preview's CouponButton, including the zigzag torn top edge (the web
 * version's `clip-path`, rebuilt here as a stretched SVG path since RN has
 * no clip-path), with the icon in its own tinted badge rather than floating
 * bare next to the label.
 */
export default function CouponButton({ icon: Icon, label, tone = 'default', onPress, style, layout = 'column' }: CouponButtonProps) {
  const isDanger = tone === 'danger'
  const fill = isDanger ? '#FEF2F2' : colors.surface.tint
  const stroke = isDanger ? 'rgba(220,38,38,0.35)' : 'rgba(11,11,15,0.15)'
  const isRow = layout === 'row'
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, isRow ? styles.cardRow : styles.cardColumn, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Path d={ZIGZAG_PATH} fill={fill} stroke={stroke} strokeWidth={1} strokeDasharray="4,3" />
      </Svg>
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
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 12,
  },
  cardColumn: {
    width: '31%',
    gap: 6,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
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
