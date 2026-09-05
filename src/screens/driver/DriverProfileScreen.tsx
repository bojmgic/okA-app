import { View, Text, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Car, Landmark, History, LifeBuoy, Settings, LogOut, Info } from 'lucide-react-native'
import { mockRider, okaPoints, redeemOptions, riderMission } from '../../data/appPreview'
import { CediGhost } from '../../components/GhostSilhouette'
import IconButton from '../../components/IconButton'
import StampMark from '../../components/StampMark'
import TicketDivider from '../../components/TicketDivider'
import PointsCard from '../../components/PointsCard'
import MissionCard from '../../components/MissionCard'
import CouponButton from '../../components/CouponButton'
import { colors, fonts } from '../../theme'
import { brand } from '../../utils/brand'

interface DriverProfileScreenProps {
  onBack: () => void
  onOpenSettings: () => void
  onOpenHelp: () => void
  onOpenVehicleDocs: () => void
  onOpenPayout: () => void
  onOpenRideHistory: () => void
  onOpenAbout: () => void
  onLogout: () => void
}

/** Ported from DriverProfileScreen.tsx on the web app-preview — rider/driver profile. */
export default function DriverProfileScreen({
  onBack,
  onOpenSettings,
  onOpenHelp,
  onOpenVehicleDocs,
  onOpenPayout,
  onOpenRideHistory,
  onOpenAbout,
  onLogout,
}: DriverProfileScreenProps) {
  const menuItems = [
    { icon: Car, label: 'Vehicle & documents', onPress: onOpenVehicleDocs },
    { icon: Landmark, label: 'Bank & payouts', onPress: onOpenPayout },
    { icon: History, label: 'Ride history', onPress: onOpenRideHistory },
    { icon: LifeBuoy, label: 'Help & Support', onPress: onOpenHelp },
    { icon: Info, label: 'About okA', onPress: onOpenAbout },
    { icon: Settings, label: 'Settings', onPress: onOpenSettings },
  ]
  const initials = mockRider.name.split(' ').map((n) => n[0]).join('')
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.card}>
          {/* Moved down/left of the header row so it sits in the card's open
              lower-right space instead of behind the "Verified" StampMark
              badge, which was clipping most of the visible mark. */}
          <CediGhost top={96} left={190} width={130} rotate={-8} opacity={0.16} />
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{mockRider.name}</Text>
              <Text style={styles.meta}>
                {brand(mockRider.vehicle)} · {mockRider.plate}
              </Text>
            </View>
            <StampMark label="Verified" tone="white" style={{ width: 84 }} />
          </View>

          <TicketDivider holeColor={colors.primary[900]} style={{ marginVertical: 16 }} />

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statValue}>{mockRider.totalTrips}</Text>
              <Text style={styles.statLabel}>Total trips</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{okaPoints.rider.tier}</Text>
              <Text style={styles.statLabel}>Points tier</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{mockRider.rating} ★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 10 }}>
        <PointsCard
          balance={okaPoints.rider.balance}
          tier={okaPoints.rider.tier}
          nextTier={okaPoints.rider.nextTier}
          pointsToNextTier={okaPoints.rider.pointsToNextTier}
          tierProgress={okaPoints.rider.tierProgress}
          redeemOptions={redeemOptions}
          onRedeem={(option) => Alert.alert('Redeemed', `${option.label} redeemed!`)}
        />
        <MissionCard label={riderMission.label} progress={riderMission.progress} target={riderMission.target} rewardLabel={riderMission.rewardLabel} />

        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <CouponButton key={item.label} icon={item.icon} label={item.label} layout="row" style={styles.menuItem} onPress={item.onPress} />
          ))}
          <CouponButton icon={LogOut} label="Log out" tone="danger" layout="row" style={styles.menuItemFull} onPress={onLogout} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 4 },
  headerTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  card: { borderRadius: 24, backgroundColor: colors.primary[900], padding: 20, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 14, color: '#fff' },
  name: { fontFamily: fonts.sansSemibold, fontSize: 15, color: '#fff' },
  meta: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  statsRow: { flexDirection: 'row', gap: 20 },
  statValue: { fontFamily: fonts.display, fontSize: 16, color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  sectionLabel: { marginTop: 8, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  menuGrid: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 32 },
  menuItem: { width: '47%', borderRadius: 12 },
  menuItemFull: { width: '100%', borderRadius: 12 },
})
