import { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, ArrowDownToLine } from 'lucide-react-native'
import { earningsSummary, recentTrips, okaPoints, redeemOptions, riderMission, weeklyEarnings } from '../../data/appPreview'
import IconButton from '../../components/IconButton'
import PointsCard from '../../components/PointsCard'
import MissionCard from '../../components/MissionCard'
import WeeklyMiniChart from '../../components/WeeklyMiniChart'
import { CediGhost } from '../../components/GhostSilhouette'
import { colors, fonts } from '../../theme'

interface EarningsScreenProps {
  onBack: () => void
}

/** Ported from EarningsScreen.tsx on the web app-preview. */
export default function EarningsScreen({ onBack }: EarningsScreenProps) {
  const [cashOutAvailableGHS, setCashOutAvailableGHS] = useState(earningsSummary.cashOutAvailableGHS)

  const handleCashOut = () => {
    if (cashOutAvailableGHS <= 0) {
      Alert.alert('Nothing to cash out', 'You have no available balance to cash out right now.')
      return
    }
    Alert.alert('Cash out requested', `GHS ${cashOutAvailableGHS} will arrive in your MoMo wallet within 24 hours.`)
    setCashOutAvailableGHS(0)
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Earnings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Animated.View entering={FadeIn.duration(300)}>
        <View style={styles.summaryCard}>
          {/* Ported from EarningsScreen.tsx on the web app-preview: two CediGhost
              banknote marks, one large upper-right, one small lower-left. */}
          <CediGhost top={8} left={180} width={90} rotate={-6} opacity={0.16} />
          <CediGhost top={95} left={14} width={60} rotate={10} opacity={0.1} />
          <Text style={styles.summaryLabel}>Today's earnings</Text>
          <Text style={styles.summaryValue}>GHS {earningsSummary.todayGHS}</Text>
          <Text style={styles.summaryMeta}>{earningsSummary.todayTrips} trips completed</Text>
          <View style={styles.summaryFooter}>
            <Text style={styles.summaryWeek}>This week: GHS {earningsSummary.weekGHS}</Text>
            <Pressable onPress={handleCashOut} style={({ pressed }) => [styles.cashOutBtn, pressed && styles.cashOutBtnPressed]}>
              <ArrowDownToLine size={13} color={colors.primary.DEFAULT} />
              <Text style={styles.cashOutText}>{cashOutAvailableGHS > 0 ? `Cash out GHS ${cashOutAvailableGHS}` : 'Cash out'}</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 12, gap: 10 }}>
          <PointsCard
            balance={okaPoints.rider.balance}
            tier={okaPoints.rider.tier}
            nextTier={okaPoints.rider.nextTier}
            pointsToNextTier={okaPoints.rider.pointsToNextTier}
            tierProgress={okaPoints.rider.tierProgress}
            redeemOptions={redeemOptions}
            onRedeem={(option) => Alert.alert('Redeemed', `${option.label} redeemed!`)}
          />
          <MissionCard
            label={riderMission.label}
            progress={riderMission.progress}
            target={riderMission.target}
            rewardLabel={riderMission.rewardLabel}
          />
          <WeeklyMiniChart data={weeklyEarnings} label="This week's earnings" />
        </View>

        <Text style={styles.sectionLabel}>Recent trips</Text>
        <View style={styles.tripCard}>
          {recentTrips.map((trip, i) => (
            <Animated.View key={trip.id} entering={FadeInDown.delay(i * 40).duration(250)} style={[styles.tripRow, i > 0 && styles.tripRowBorder]}>
              <View>
                <Text style={styles.tripLabel}>{trip.label}</Text>
                <Text style={styles.tripTime}>{trip.time}</Text>
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
  // Brighter brand blue (not navy) so this reads distinct from the customer
  // Wallet screen's summary card, matching web's `bg-primary` vs `bg-primary-900`.
  summaryCard: { borderRadius: 24, backgroundColor: colors.primary.DEFAULT, padding: 20, overflow: 'hidden' },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  summaryValue: { marginTop: 4, fontFamily: fonts.display, fontSize: 30, color: '#fff' },
  summaryMeta: { marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  summaryFooter: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 12 },
  summaryWeek: { fontSize: 12, fontFamily: fonts.sansMedium, color: 'rgba(255,255,255,0.7)' },
  cashOutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8 },
  cashOutBtnPressed: { transform: [{ scale: 0.96 }] },
  cashOutText: { fontSize: 12, fontFamily: fonts.sansSemibold, color: colors.primary.DEFAULT },
  sectionLabel: { marginTop: 20, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  tripCard: { marginTop: 8, borderRadius: 16, backgroundColor: colors.surface.tint, paddingHorizontal: 14 },
  tripRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  tripRowBorder: { borderTopWidth: 1, borderTopColor: 'rgba(11,11,15,0.06)' },
  tripLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  tripTime: { fontSize: 11, color: colors.ink.light },
  tripFare: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
})
