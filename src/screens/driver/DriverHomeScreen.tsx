import { useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Power, Wallet, Bell, ChevronRight } from 'lucide-react-native'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated'
import MockMap from '../../components/MockMap'
import IconButton from '../../components/IconButton'
import PrimaryButton from '../../components/PrimaryButton'
import { VehicleGhost } from '../../components/GhostSilhouette'
import WaveCap from '../../components/WaveCap'
import { earningsSummary, mockRider } from '../../data/appPreview'
import { colors, fonts } from '../../theme'

interface DriverHomeScreenProps {
  online: boolean
  setOnline: (v: boolean) => void
  onOpenEarnings: () => void
  onOpenProfile: () => void
  onSimulateRequest: () => void
}

function PulseDot() {
  const scale = useSharedValue(1)
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.3, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [scale])
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
  return (
    <View style={styles.pulseWrap}>
      <Animated.View style={[styles.pulseOuter, style]} />
      <View style={styles.pulseInner} />
    </View>
  )
}

/** Ported from DriverHomeScreen.tsx on the web app-preview — rider-partner landing screen. */
export default function DriverHomeScreen({ online, setOnline, onOpenEarnings, onOpenProfile, onSimulateRequest }: DriverHomeScreenProps) {
  const initials = mockRider.name.split(' ').map((n) => n[0]).join('')
  const insets = useSafeAreaInsets()
  return (
    <View style={styles.screen}>
      <MockMap showYouAreHere showNearbyVehicles focus="wide" />

      <SafeAreaView edges={['top']}>
        <LinearGradient colors={[colors.primary[900], colors.primary[900] + 'D9', 'transparent']} style={styles.topBand}>
          {/* Ported from DriverHomeScreen.tsx on the web app-preview: small VehicleGhost
              tucked between the rider's name and the bell, level with "Welcome back". */}
          {/* See HomeScreen.tsx — dialed back for the same reason: at the
              corrected aspect ratio this small mark reads too legibly at
              0.12. */}
          <VehicleGhost top={0} left={210} width={56} rotate={0} opacity={0.07} />
          <View style={styles.topRow}>
            <Pressable onPress={onOpenProfile} style={({ pressed }) => [styles.identityRow, pressed && styles.identityRowPressed]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View>
                <Text style={styles.welcome}>Welcome back</Text>
                <Text style={styles.riderName}>{mockRider.name}</Text>
              </View>
            </Pressable>
            <View>
              <IconButton icon={Bell} accessibilityLabel="Notifications" tone="dark" />
              <View style={styles.notifDot} />
            </View>
          </View>

          <Pressable onPress={onOpenEarnings} style={({ pressed }) => [styles.earningsCard, pressed && styles.earningsCardPressed]}>
            <View>
              <Text style={styles.earningsLabel}>Today</Text>
              <Text style={styles.earningsValue}>GHS {earningsSummary.todayGHS}</Text>
            </View>
            <View style={styles.walletLink}>
              <Wallet size={13} color={colors.primary[300]} />
              <Text style={styles.walletLinkText}>Wallet</Text>
              <ChevronRight size={13} color={colors.primary[300]} />
            </View>
          </Pressable>
        </LinearGradient>
      </SafeAreaView>

      <View style={[styles.middleArea, { bottom: 130 + insets.bottom }]}>
        {online ? (
          <>
            <PulseDot />
            <Text style={styles.onlineTitle}>Online — waiting for requests</Text>
            <Text style={styles.onlineSubtitle}>You'll be notified the moment a ride or delivery comes in.</Text>
            <Pressable onPress={onSimulateRequest} style={({ pressed }) => [styles.simulateBtn, pressed && styles.simulateBtnPressed]}>
              <Text style={styles.simulateText}>Preview: simulate incoming request</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.offlineText}>You're offline. Go online to start receiving requests.</Text>
        )}
      </View>

      <View style={styles.bottomWrap}>
        <WaveCap fill="#fff" />
        <SafeAreaView edges={['bottom']} style={styles.bottomSheet}>
          <PrimaryButton
            label={online ? 'Go offline' : 'Go online'}
            tone={online ? 'dark' : 'primary'}
            icon={<Power size={16} color="#fff" />}
            onPress={() => setOnline(!online)}
          />
        </SafeAreaView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E7EEFC' },
  topBand: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  identityRowPressed: { opacity: 0.7 },
  avatar: { height: 36, width: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 12, color: '#fff' },
  welcome: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  riderName: { fontFamily: fonts.sansSemibold, fontSize: 15, color: '#fff' },
  notifDot: { position: 'absolute', top: 2, right: 2, height: 8, width: 8, borderRadius: 4, backgroundColor: colors.primary[300], borderWidth: 2, borderColor: colors.primary[900] },
  earningsCard: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 12 },
  earningsCardPressed: { transform: [{ scale: 0.98 }] },
  earningsLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  earningsValue: { fontFamily: fonts.display, fontSize: 18, color: '#fff' },
  walletLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  walletLinkText: { fontSize: 12, fontFamily: fonts.sansMedium, color: colors.primary[300] },
  middleArea: { position: 'absolute', left: 20, right: 20, alignItems: 'center' },
  pulseWrap: { height: 64, width: 64, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  pulseOuter: { position: 'absolute', height: 64, width: 64, borderRadius: 32, backgroundColor: colors.primary.DEFAULT + '26' },
  pulseInner: { height: 36, width: 36, borderRadius: 18, backgroundColor: colors.primary.DEFAULT },
  onlineTitle: { fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT, textAlign: 'center' },
  onlineSubtitle: { marginTop: 4, fontSize: 12, color: colors.ink.light, textAlign: 'center' },
  simulateBtn: { marginTop: 16, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(11,11,15,0.15)', paddingHorizontal: 16, paddingVertical: 8 },
  simulateBtnPressed: { transform: [{ scale: 0.96 }] },
  simulateText: { fontSize: 11, fontFamily: fonts.sansMedium, color: colors.ink.light },
  offlineText: { fontSize: 13, fontFamily: fonts.sansMedium, color: colors.ink.light, textAlign: 'center' },
  bottomWrap: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  bottomSheet: { marginTop: -1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 16 },
})
