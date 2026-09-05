import { View, Text, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Home, Clock, Wallet, User, CreditCard, MapPinned, Bell, LifeBuoy, Settings, LogOut } from 'lucide-react-native'
import { mockCustomer, okaPoints, redeemOptions, customerMission } from '../../data/appPreview'
import { CediGhost } from '../../components/GhostSilhouette'
import StampMark from '../../components/StampMark'
import TicketDivider from '../../components/TicketDivider'
import TabBar from '../../components/TabBar'
import WaveCap from '../../components/WaveCap'
import PointsCard from '../../components/PointsCard'
import MissionCard from '../../components/MissionCard'
import CouponButton from '../../components/CouponButton'
import { colors, fonts } from '../../theme'

interface ProfileScreenProps {
  onBack: () => void
  onOpenWallet: () => void
  onOpenSettings: () => void
  onOpenSavedPlaces: () => void
  onOpenHelp: () => void
  onOpenNotifications: () => void
  onOpenActivity: () => void
  onLogout: () => void
}

/** Ported from ProfileScreen.tsx on the web app-preview — customer profile. */
export default function ProfileScreen({
  onBack,
  onOpenWallet,
  onOpenSettings,
  onOpenSavedPlaces,
  onOpenHelp,
  onOpenNotifications,
  onOpenActivity,
  onLogout,
}: ProfileScreenProps) {
  const menuItems = [
    { icon: CreditCard, label: 'Payment methods', onPress: onOpenWallet },
    { icon: MapPinned, label: 'Saved places', onPress: onOpenSavedPlaces },
    { icon: Bell, label: 'Notifications', onPress: onOpenNotifications },
    { icon: LifeBuoy, label: 'Help & Support', onPress: onOpenHelp },
    { icon: Settings, label: 'Settings', onPress: onOpenSettings },
  ]
  const initials = mockCustomer.name.split(' ').map((n) => n[0]).join('')
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <View style={styles.card}>
          {/* Moved down/left of the header row so it sits in the card's open
              lower-right space instead of behind the "Verified" StampMark
              badge, which was clipping most of the visible mark. */}
          <CediGhost top={104} left={195} width={130} rotate={-8} opacity={0.16} />
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{mockCustomer.name}</Text>
              <Text style={styles.meta}>
                {mockCustomer.rating} ★ · Member since {mockCustomer.memberSince}
              </Text>
            </View>
            <StampMark label="Verified" tone="white" style={{ width: 84 }} />
          </View>

          <TicketDivider holeColor={colors.primary[900]} style={{ marginVertical: 16 }} />

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mockCustomer.totalRides}</Text>
              <Text style={styles.statLabel}>Total rides</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{okaPoints.customer.tier}</Text>
              <Text style={styles.statLabel}>Points tier</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 10 }}>
        <PointsCard
          balance={okaPoints.customer.balance}
          tier={okaPoints.customer.tier}
          nextTier={okaPoints.customer.nextTier}
          pointsToNextTier={okaPoints.customer.pointsToNextTier}
          tierProgress={okaPoints.customer.tierProgress}
          redeemOptions={redeemOptions}
          onRedeem={(option) => Alert.alert('Redeemed', `${option.label} redeemed!`)}
        />
        <MissionCard
          label={customerMission.label}
          progress={customerMission.progress}
          target={customerMission.target}
          rewardLabel={customerMission.rewardLabel}
        />

        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <CouponButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              layout="row"
              style={styles.menuItem}
              onPress={item.onPress}
            />
          ))}
          <CouponButton icon={LogOut} label="Log out" tone="danger" layout="row" style={styles.menuItemFull} onPress={onLogout} />
        </View>
      </View>

      <View style={styles.tabBarOuter}>
        <WaveCap fill="#fff" />
        <SafeAreaView edges={['bottom']} style={styles.tabBarWrap}>
          <TabBar
            active="profile"
            items={[
              { key: 'home', icon: Home, label: 'Home', onPress: onBack },
              { key: 'activity', icon: Clock, label: 'Activity', onPress: onOpenActivity },
              { key: 'wallet', icon: Wallet, label: 'Wallet', onPress: onOpenWallet },
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
  card: { borderRadius: 24, backgroundColor: colors.primary[900], padding: 20, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 14, color: '#fff' },
  name: { fontFamily: fonts.sansSemibold, fontSize: 15, color: '#fff' },
  meta: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  statsRow: { flexDirection: 'row', gap: 24 },
  stat: {},
  statValue: { fontFamily: fonts.display, fontSize: 18, color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  sectionLabel: { marginTop: 8, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  menuGrid: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 150 },
  menuItem: { width: '47%', borderRadius: 12 },
  menuItemFull: { width: '100%', borderRadius: 12 },
  tabBarOuter: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  tabBarWrap: { marginTop: -1, alignItems: 'center', backgroundColor: '#fff', paddingTop: 8, paddingBottom: 12 },
})
