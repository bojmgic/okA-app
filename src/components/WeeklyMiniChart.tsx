import { View, Text, StyleSheet } from 'react-native'
import Svg, { Rect } from 'react-native-svg'
import { colors, fonts } from '../theme'

interface WeeklyMiniChartProps {
  data: { day: string; valueGHS: number }[]
  label: string
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const BAR_HEIGHT = 44

/**
 * Small seven-bar weekly chart — ported from WeeklyMiniChart.tsx on the web
 * app-preview. Shared by the customer Wallet (spend) and rider Earnings
 * (income) screens: real per-day numbers instead of a single lifetime total,
 * so both screens read as an active account with a rhythm to it.
 */
export default function WeeklyMiniChart({ data, label }: WeeklyMiniChartProps) {
  const max = Math.max(...data.map((d) => d.valueGHS), 1)
  const bestIndex = data.reduce((best, d, i) => (d.valueGHS > data[best].valueGHS ? i : best), 0)

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barsRow}>
        {data.map((d, i) => {
          const pct = Math.max(10, (d.valueGHS / max) * 100)
          const barHeight = (pct / 100) * BAR_HEIGHT
          const isBest = i === bestIndex
          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barTrack}>
                <Svg width="100%" height={BAR_HEIGHT} viewBox="0 0 20 44" preserveAspectRatio="none">
                  <Rect
                    x={0}
                    y={BAR_HEIGHT - barHeight}
                    width={20}
                    height={barHeight}
                    rx={4}
                    fill={isBest ? colors.primary.DEFAULT : colors.ink.DEFAULT + '26'}
                  />
                </Svg>
              </View>
              <Text style={[styles.dayLabel, isBest && styles.dayLabelActive]}>{d.day}</Text>
            </View>
          )
        })}
      </View>
      <Text style={styles.busiest}>
        Busiest day: <Text style={styles.busiestBold}>{DAY_NAMES[bestIndex]}</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  label: { fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  barsRow: { marginTop: 8, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barTrack: { height: BAR_HEIGHT, width: '100%', borderRadius: 6, backgroundColor: colors.surface.tint, overflow: 'hidden', justifyContent: 'flex-end' },
  dayLabel: { fontSize: 10, fontFamily: fonts.sansMedium, color: colors.ink.light },
  dayLabelActive: { color: colors.primary.DEFAULT },
  busiest: { marginTop: 6, fontSize: 11, color: colors.ink.light },
  busiestBold: { fontFamily: fonts.sansSemibold, color: colors.ink.DEFAULT },
})
