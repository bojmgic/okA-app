import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Bike, Package, Home, Clock, Wallet, User } from 'lucide-react-native'
import { activityHistory } from '../../data/appPreview'
import IconButton from '../../components/IconButton'
import TabBar from '../../components/TabBar'
import WaveCap from '../../components/WaveCap'
import { colors, fonts } from '../../theme'

interface ActivityScreenProps {
  onBack: () => void
}

/** Ported from ActivityScreen.tsx on the web app-preview — full ride/send history grouped by day. */
export default function ActivityScreen({ onBack }: ActivityScreenProps) {
  // Flat row counter across every group, so the stagger delay keeps
  // increasing down the whole list rather than restarting at each date
  // header — mirrors web's per-item `delay` on a single flattened list.
  let rowIndex = 0

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Activity</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Animated.View entering={FadeIn.duration(300)}>
          {activityHistory.map((group) => (
            <View key={group.date} style={{ marginBottom: 16 }}>
              <Text style={styles.dateLabel}>{group.date}</Text>
              <View style={styles.groupCard}>
                {group.trips.map((trip, i) => {
                  const delay = rowIndex++ * 40
                  return (
                    <Animated.View key={trip.id} entering={FadeInDown.delay(delay).duration(250)} style={[styles.tripRow, i > 0 && styles.tripRowBorder]}>
                      <View style={styles.tripIcon}>
                        {trip.type === 'ride' ? <Bike size={16} color={colors.primary.DEFAULT} /> : <Package size={16} color={colors.primary.DEFAULT} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tripLabel} numberOfLines={1}>
                          {trip.label}
                        </Text>
                        <Text style={styles.tripMeta}>
                          {trip.vehicle} · {trip.time}
                          {trip.status === 'Cancelled' && <Text style={{ color: '#DC2626' }}> · Cancelled</Text>}
                        </Text>
                      </View>
                      <Text style={[styles.tripFare, trip.status === 'Cancelled' && styles.tripFareCancelled]}>GHS {trip.fareGHS}</Text>
                    </Animated.View>
                  )
                })}
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <View style={styles.tabBarOuter}>
        <WaveCap fill="#fff" />
        <SafeAreaView edges={['bottom']} style={styles.tabBarWrap}>
          <TabBar
            active="activity"
            items={[
              { key: 'home', icon: Home, label: 'Home', onPress: onBack },
              { key: 'activity', icon: Clock, label: 'Activity' },
              { key: 'wallet', icon: Wallet, label: 'Wallet' },
              { key: 'profile', icon: User, label: 'Profile' },
            ]}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  // See WalletScreen.tsx: 100 wasn't enough clearance above the WaveCap +
  // TabBar + safe-area-bottom stack, so the last row(s) were hidden behind it.
  list: { paddingHorizontal: 20, paddingBottom: 150 },
  dateLabel: { fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  groupCard: { marginTop: 8, borderRadius: 16, backgroundColor: colors.surface.tint, paddingHorizontal: 12 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  tripRowBorder: { borderTopWidth: 1, borderTopColor: 'rgba(11,11,15,0.06)' },
  tripIcon: { height: 36, width: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  tripLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  tripMeta: { fontSize: 11, color: colors.ink.light },
  tripFare: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  tripFareCancelled: { color: colors.ink.light, textDecorationLine: 'line-through' },
  tabBarOuter: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  tabBarWrap: { marginTop: -1, alignItems: 'center', backgroundColor: '#fff', paddingTop: 8, paddingBottom: 12 },
})
