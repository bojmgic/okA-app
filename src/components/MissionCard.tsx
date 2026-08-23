import { View, Text, StyleSheet } from 'react-native'
import { Target } from 'lucide-react-native'
import { colors, fonts } from '../theme'

interface MissionCardProps {
  label: string
  progress: number
  target: number
  rewardLabel: string
}

/** Weekly mission card — ported from MissionCard.tsx on the web app-preview. */
export default function MissionCard({ label, progress, target, rewardLabel }: MissionCardProps) {
  const pct = Math.min(1, progress / target)
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.titleRow}>
          <Target size={14} color={colors.primary.DEFAULT} />
          <Text style={styles.title}>{label}</Text>
        </View>
        <Text style={styles.count}>
          {progress}/{target}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
      </View>
      <Text style={styles.reward}>{rewardLabel}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, backgroundColor: colors.surface.tint, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  count: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.ink.light },
  progressTrack: { marginTop: 8, height: 6, borderRadius: 999, backgroundColor: '#fff', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: colors.primary.DEFAULT },
  reward: { marginTop: 6, fontSize: 11, fontFamily: fonts.sansMedium, color: colors.primary.DEFAULT },
})
