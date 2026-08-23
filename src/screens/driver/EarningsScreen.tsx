import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { earningsSummary, recentTrips } from '../../data/appPreview'
import IconButton from '../../components/IconButton'
import PrimaryButton from '../../components/PrimaryButton'
import { colors, fonts } from '../../theme'

interface EarningsScreenProps {
  onBack: () => void
}

/** Ported from EarningsScreen.tsx on the web app-preview. */
export default function EarningsScreen({ onBack }: EarningsScreenProps) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Earnings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today</Text>
          <Text style={styles.summaryValue}>GHS {earningsSummary.todayGHS}</Text>
          <Text style={styles.summaryMeta}>{earningsSummary.todayTrips} trips · GHS {earningsSummary.weekGHS} this week</Text>
          <PrimaryButton label={`Cash out GHS ${earningsSummary.cashOutAvailableGHS}`} style={{ marginTop: 16 }} />
        </View>

        <Text style={styles.sectionLabel}>Recent trips</Text>
        <View style={styles.tripCard}>
          {recentTrips.map((trip, i) => (
            <View key={trip.id} style={[styles.tripRow, i > 0 && styles.tripRowBorder]}>
              <View>
                <Text style={styles.tripLabel}>{trip.label}</Text>
                <Text style={styles.tripTime}>{trip.time}</Text>
              </View>
              <Text style={styles.tripFare}>GHS {trip.fareGHS}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  summaryCard: { borderRadius: 24, backgroundColor: colors.primary[900], padding: 20 },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  summaryValue: { marginTop: 4, fontFamily: fonts.display, fontSize: 30, color: '#fff' },
  summaryMeta: { marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  sectionLabel: { marginTop: 20, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  tripCard: { marginTop: 8, borderRadius: 16, backgroundColor: colors.surface.tint, paddingHorizontal: 14 },
  tripRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  tripRowBorder: { borderTopWidth: 1, borderTopColor: 'rgba(11,11,15,0.06)' },
  tripLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  tripTime: { fontSize: 11, color: colors.ink.light },
  tripFare: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
})
