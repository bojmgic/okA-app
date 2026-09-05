import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Smartphone, Landmark, RefreshCw } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import { colors, fonts } from '../../theme'

interface DriverPayoutScreenProps {
  onBack: () => void
}

// walletBalance.savedMethod in appPreview.ts is 'MTN MoMo •••• 4521' — matched here
// and extended with two more mock methods to cycle through.
const payoutMethods = [
  { id: 'momo', label: 'MTN MoMo •••• 4521', icon: Smartphone },
  { id: 'vodafone', label: 'Vodafone Cash •••• 7788', icon: Smartphone },
  { id: 'bank', label: 'GCB Bank •••• 3390', icon: Landmark },
]

const schedules = ['Daily', 'Weekly'] as const

/** Driver payout settings — mock payout method cycling + payout schedule toggle. */
export default function DriverPayoutScreen({ onBack }: DriverPayoutScreenProps) {
  const [methodIndex, setMethodIndex] = useState(0)
  const [schedule, setSchedule] = useState<(typeof schedules)[number]>('Daily')

  const method = payoutMethods[methodIndex]

  const cycleMethod = () => setMethodIndex((prev) => (prev + 1) % payoutMethods.length)

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Bank & payouts</Text>
      </View>

      <View style={styles.list}>
        <Text style={styles.sectionLabel}>Payout method</Text>
        <View style={styles.card}>
          <View style={styles.methodRow}>
            <View style={styles.methodIcon}>
              <method.icon size={16} color={colors.primary.DEFAULT} />
            </View>
            <Text style={styles.methodLabel}>{method.label}</Text>
          </View>
          <Pressable onPress={cycleMethod} style={({ pressed }) => [styles.changeBtn, pressed && styles.changeBtnPressed]}>
            <RefreshCw size={13} color={colors.primary.DEFAULT} />
            <Text style={styles.changeText}>Change payout method</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Payout schedule</Text>
        <View style={styles.scheduleToggle}>
          {schedules.map((s) => (
            <Pressable key={s} onPress={() => setSchedule(s)} style={[styles.scheduleOption, schedule === s && styles.scheduleOptionActive]}>
              <Text style={[styles.scheduleText, schedule === s && styles.scheduleTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.scheduleHint}>
          {schedule === 'Daily' ? 'Your earnings are paid out every day.' : 'Your earnings are paid out once a week.'}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  sectionLabel: { marginTop: 16, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  card: { marginTop: 8, borderRadius: 16, backgroundColor: colors.surface.tint, padding: 14 },
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodIcon: { height: 36, width: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  methodLabel: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  changeBtn: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, backgroundColor: '#fff', paddingVertical: 12 },
  changeBtnPressed: { opacity: 0.7 },
  changeText: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.primary.DEFAULT },
  scheduleToggle: { marginTop: 8, flexDirection: 'row', borderRadius: 999, backgroundColor: colors.surface.tint, padding: 4 },
  scheduleOption: { flex: 1, alignItems: 'center', borderRadius: 999, paddingVertical: 10 },
  scheduleOptionActive: { backgroundColor: colors.primary.DEFAULT },
  scheduleText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.light },
  scheduleTextActive: { color: '#fff' },
  scheduleHint: { marginTop: 8, fontSize: 11, color: colors.ink.light },
})
