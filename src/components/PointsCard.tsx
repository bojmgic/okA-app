import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { Sparkles } from 'lucide-react-native'
import { colors, fonts } from '../theme'
import { brand } from '../utils/brand'

type RedeemOptionType = { id: string; label: string; pointsCost: number }

interface PointsCardProps {
  balance: number
  tier: string
  nextTier: string
  pointsToNextTier: number
  tierProgress: number
  redeemOptions: RedeemOptionType[]
  onRedeem?: (option: RedeemOptionType) => void
}

/** okA Points card — ported from PointsCard.tsx on the web app-preview. */
export default function PointsCard({ balance, tier, nextTier, pointsToNextTier, tierProgress, redeemOptions, onRedeem }: PointsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Sparkles size={14} color={colors.primary.DEFAULT} />
          <Text style={styles.title}>{brand("okA Points")}</Text>
        </View>
        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>{tier}</Text>
        </View>
      </View>
      <Text style={styles.balance}>
        {balance.toLocaleString()} <Text style={styles.balanceUnit}>pts</Text>
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${tierProgress * 100}%` }]} />
      </View>
      <Text style={styles.progressLabel}>
        {pointsToNextTier} pts to <Text style={styles.progressLabelBold}>{nextTier}</Text>
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.redeemRow} contentContainerStyle={{ gap: 8 }}>
        {redeemOptions.map((r) => (
          <Pressable key={r.id} onPress={() => onRedeem?.(r)} style={({ pressed }) => [styles.chip, pressed && { opacity: 0.7 }]}>
            <Text style={styles.chipText}>
              {brand(r.label)} · {r.pointsCost} pts
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(11,11,15,0.1)', padding: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  tierBadge: { backgroundColor: colors.primary.DEFAULT + '1A', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  tierBadgeText: { fontFamily: fonts.sansBold, fontSize: 10, color: colors.primary.DEFAULT, textTransform: 'uppercase', letterSpacing: 0.5 },
  balance: { marginTop: 6, fontFamily: fonts.display, fontSize: 24, color: colors.ink.DEFAULT },
  balanceUnit: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.light },
  progressTrack: { marginTop: 10, height: 6, borderRadius: 999, backgroundColor: colors.surface.tint, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: colors.primary.DEFAULT },
  progressLabel: { marginTop: 4, fontSize: 11, color: colors.ink.light },
  progressLabelBold: { fontFamily: fonts.sansSemibold, color: colors.ink.DEFAULT },
  redeemRow: { marginTop: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary.DEFAULT + '4D',
    backgroundColor: colors.primary.DEFAULT + '0D',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.primary.DEFAULT },
})
