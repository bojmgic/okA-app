import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Search, MapPin, Home, Clock, Wallet, User, Briefcase, Star, Bell } from 'lucide-react-native'
import MockMap from '../../components/MockMap'
import IconButton from '../../components/IconButton'
import TabBar from '../../components/TabBar'
import { VehicleGhost } from '../../components/GhostSilhouette'
import WaveCap from '../../components/WaveCap'
import { colors, fonts } from '../../theme'

interface HomeScreenProps {
  mode: 'ride' | 'send'
  setMode: (mode: 'ride' | 'send') => void
  onRequestRide: () => void
  onOpenWallet: () => void
  onOpenProfile: () => void
  onOpenActivity: () => void
  onOpenNotifications: () => void
}

const savedPlaces = [
  { icon: Home, label: 'Home', detail: 'East Legon' },
  { icon: Briefcase, label: 'Work', detail: 'Airport City' },
  { icon: Star, label: 'Accra Mall', detail: 'Frequent stop' },
]

/** Ported from HomeScreen.tsx on the web app-preview — customer landing screen. */
export default function HomeScreen({ mode, setMode, onRequestRide, onOpenWallet, onOpenProfile, onOpenActivity, onOpenNotifications }: HomeScreenProps) {
  const insets = useSafeAreaInsets()
  return (
    <View style={styles.screen}>
      <MockMap showYouAreHere showNearbyVehicles focus="wide" />

      <SafeAreaView edges={['top']}>
        <LinearGradient colors={[colors.primary[900], colors.primary[900] + 'D9', 'transparent']} style={styles.topBand}>
          {/* Ported from HomeScreen.tsx on the web app-preview: a small VehicleGhost
              tucked between the greeting text and the bell icon, level with the
              "Good afternoon" row. */}
          {/* Now that VehicleGhost renders at its correct (non-letterboxed)
              aspect ratio, this small header-band mark reads crisply enough
              at web's 0.12 opacity to look like solid logo text rather than
              a soft watermark — dialed back to keep it as ambient texture. */}
          <VehicleGhost top={0} left={230} width={56} rotate={0} opacity={0.07} />
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>Good afternoon</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={colors.primary[300]} />
                <Text style={styles.locationText}>Accra, Ghana</Text>
              </View>
            </View>
            <View>
              <IconButton icon={Bell} onPress={onOpenNotifications} accessibilityLabel="Notifications" tone="dark" />
              <View style={styles.notifDot} />
            </View>
          </View>

          <View style={styles.modeToggle}>
            {(['ride', 'send'] as const).map((m) => (
              <Pressable key={m} onPress={() => setMode(m)} style={({ pressed }) => [{ flex: 1 }, pressed && styles.modeTogglePressed]}>
                {mode === m ? (
                  <LinearGradient colors={['#1D6BFF', '#0057E7']} style={styles.modePillActive}>
                    <Text style={styles.modeTextActive}>{m === 'ride' ? 'Ride' : 'Send'}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.modePill}>
                    <Text style={styles.modeText}>{m === 'ride' ? 'Ride' : 'Send'}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </LinearGradient>
      </SafeAreaView>

      <View style={[styles.bottomArea, { bottom: 108 + insets.bottom }]}>
        <Pressable onPress={onRequestRide} style={({ pressed }) => [styles.searchBar, pressed && styles.searchBarPressed]}>
          <View style={styles.searchIcon}>
            <Search size={16} color={colors.primary.DEFAULT} />
          </View>
          <Text style={styles.searchText}>{mode === 'ride' ? 'Where are you headed?' : 'Enter drop-off address'}</Text>
        </Pressable>

        <View style={styles.placesCard}>
          {savedPlaces.map((place, i) => (
            <Pressable
              key={place.label}
              onPress={onRequestRide}
              style={({ pressed }) => [styles.placeRow, i > 0 && styles.placeRowBorder, pressed && styles.placeRowPressed]}
            >
              <View style={styles.placeIcon}>
                <place.icon size={13} color={colors.ink.light} />
              </View>
              <View>
                <Text style={styles.placeLabel}>{place.label}</Text>
                <Text style={styles.placeDetail}>{place.detail}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.tabBarOuter}>
        <WaveCap fill="#fff" />
        <SafeAreaView edges={['bottom']} style={styles.tabBarWrap}>
          <TabBar
            active="home"
            items={[
              { key: 'home', icon: Home, label: 'Home' },
              { key: 'activity', icon: Clock, label: 'Activity', onPress: onOpenActivity },
              { key: 'wallet', icon: Wallet, label: 'Wallet', onPress: onOpenWallet },
              { key: 'profile', icon: User, label: 'Profile', onPress: onOpenProfile },
            ]}
          />
        </SafeAreaView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E7EEFC' },
  topBand: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  greeting: { fontFamily: fonts.sansMedium, fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  locationText: { fontFamily: fonts.sansSemibold, fontSize: 14, color: '#fff' },
  notifDot: { position: 'absolute', top: 2, right: 2, height: 8, width: 8, borderRadius: 4, backgroundColor: colors.primary[300], borderWidth: 2, borderColor: colors.primary[900] },
  modeToggle: { marginTop: 16, flexDirection: 'row', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.1)', padding: 4 },
  modeTogglePressed: { opacity: 0.85 },
  modePillActive: { borderRadius: 999, paddingVertical: 8, alignItems: 'center' },
  modePill: { borderRadius: 999, paddingVertical: 8, alignItems: 'center' },
  modeTextActive: { color: '#fff', fontFamily: fonts.sansSemibold, fontSize: 13 },
  modeText: { color: 'rgba(255,255,255,0.7)', fontFamily: fonts.sansSemibold, fontSize: 13 },
  bottomArea: { position: 'absolute', left: 20, right: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  searchBarPressed: { transform: [{ scale: 0.98 }] },
  searchIcon: { height: 36, width: 36, borderRadius: 18, backgroundColor: colors.primary.DEFAULT + '1A', alignItems: 'center', justifyContent: 'center' },
  searchText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.light },
  placesCard: { marginTop: 8, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.95)', overflow: 'hidden' },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  placeRowBorder: { borderTopWidth: 1, borderTopColor: 'rgba(11,11,15,0.05)' },
  placeRowPressed: { backgroundColor: 'rgba(11,11,15,0.03)' },
  placeIcon: { height: 28, width: 28, borderRadius: 14, backgroundColor: colors.surface.tint, alignItems: 'center', justifyContent: 'center' },
  placeLabel: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.ink.DEFAULT },
  placeDetail: { fontSize: 11, color: colors.ink.light },
  tabBarOuter: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  tabBarWrap: { marginTop: -1, alignItems: 'center', backgroundColor: '#fff', paddingTop: 10 },
})
