import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Bike } from 'lucide-react-native'
import { recentTrips } from '../../data/appPreview'
import IconButton from '../../components/IconButton'
import { colors, fonts } from '../../theme'

interface DriverRideHistoryScreenProps {
  onBack: () => void
}

/** Driver ride history — `recentTrips` in appPreview.ts (already used by
 *  EarningsScreen.tsx) is a flat list with no date field, so this renders it as a
 *  single "Recent trips" group using ActivityScreen.tsx's grouped-list visual
 *  pattern (FadeIn/FadeInDown entrance, same row styling) rather than inventing
 *  extra date-bucket data that doesn't exist. */
export default function DriverRideHistoryScreen({ onBack }: DriverRideHistoryScreenProps) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Ride history</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Animated.View entering={FadeIn.duration(300)}>
          <Text style={styles.dateLabel}>Recent trips</Text>
          <View style={styles.groupCard}>
            {recentTrips.map((trip, i) => (
              <Animated.View key={trip.id} entering={FadeInDown.delay(i * 40).duration(250)} style={[styles.tripRow, i > 0 && styles.tripRowBorder]}>
                <View style={styles.tripIcon}>
                  <Bike size={16} color={colors.primary.DEFAULT} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tripLabel} numberOfLines={1}>
                    {trip.label}
                  </Text>
                  <Text style={styles.tripMeta}>{trip.time}</Text>
                </View>
                <Text style={styles.tripFare}>GHS {trip.fareGHS}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  dateLabel: { fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  groupCard: { marginTop: 8, borderRadius: 16, backgroundColor: colors.surface.tint, paddingHorizontal: 12 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  tripRowBorder: { borderTopWidth: 1, borderTopColor: 'rgba(11,11,15,0.06)' },
  tripIcon: { height: 36, width: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  tripLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  tripMeta: { fontSize: 11, color: colors.ink.light },
  tripFare: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
})
