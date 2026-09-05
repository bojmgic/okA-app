import { useState } from 'react'
import { View, Pressable, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Car, Bike } from 'lucide-react-native'
import { vehicleOptions } from '../data/appPreview'
import { initialSavedPlaces, type SavedPlace } from '../data/savedPlaces'
import { colors, fonts } from '../theme'

import AuthScreen from '../screens/shared/AuthScreen'
import RatingScreen from '../screens/shared/RatingScreen'
import NotificationsScreen from '../screens/shared/NotificationsScreen'
import SettingsScreen from '../screens/shared/SettingsScreen'
import HelpSupportScreen from '../screens/shared/HelpSupportScreen'
import AboutScreen from '../screens/shared/AboutScreen'
import LegalScreen from '../screens/shared/LegalScreen'
import CareersScreen from '../screens/shared/CareersScreen'
import NewsroomScreen from '../screens/shared/NewsroomScreen'

import HomeScreen from '../screens/customer/HomeScreen'
import VehicleSelectScreen from '../screens/customer/VehicleSelectScreen'
import LiveTripScreen from '../screens/customer/LiveTripScreen'
import WalletScreen from '../screens/customer/WalletScreen'
import ProfileScreen from '../screens/customer/ProfileScreen'
import ActivityScreen from '../screens/customer/ActivityScreen'
import SavedPlacesScreen from '../screens/customer/SavedPlacesScreen'

import DriverHomeScreen from '../screens/driver/DriverHomeScreen'
import RequestScreen from '../screens/driver/RequestScreen'
import DriverTripScreen from '../screens/driver/DriverTripScreen'
import EarningsScreen from '../screens/driver/EarningsScreen'
import DriverProfileScreen from '../screens/driver/DriverProfileScreen'
import DriverOnboardingScreen from '../screens/driver/DriverOnboardingScreen'
import DriverVehicleDocsScreen from '../screens/driver/DriverVehicleDocsScreen'
import DriverPayoutScreen from '../screens/driver/DriverPayoutScreen'
import DriverRideHistoryScreen from '../screens/driver/DriverRideHistoryScreen'

import { mockRider, mockCustomer, incomingRequest } from '../data/appPreview'

type CustomerScreen =
  | 'auth'
  | 'home'
  | 'select'
  | 'trip'
  | 'rating'
  | 'wallet'
  | 'profile'
  | 'activity'
  | 'notifications'
  | 'settings'
  | 'savedPlaces'
  | 'help'
  | 'about'
  | 'legal'
  | 'careers'
  | 'newsroom'
type DriverScreen =
  | 'auth'
  | 'onboarding'
  | 'home'
  | 'request'
  | 'trip'
  | 'rating'
  | 'earnings'
  | 'profile'
  | 'settings'
  | 'help'
  | 'vehicleDocs'
  | 'payout'
  | 'rideHistory'
  | 'about'
  | 'legal'
  | 'careers'
  | 'newsroom'

/**
 * Root screen switcher — mirrors the state-machine shape of AppPreview.tsx
 * on the web (a persona toggle plus one `screen` string per persona,
 * swapped in `switch`/ternary blocks) rather than a `@react-navigation`
 * stack, so this native app matches the same screen graph the web prototype
 * already proved out. `@react-navigation` is installed and ready — swapping
 * this in for real stack/tab navigators (native back gestures, deep
 * linking, persisted state) is a clean next step once the screens
 * themselves are wired to a real backend, not a structural rewrite.
 */
export default function RootApp() {
  const [persona, setPersona] = useState<'customer' | 'driver'>('customer')

  const [customerScreen, setCustomerScreen] = useState<CustomerScreen>('auth')
  const [mode, setMode] = useState<'ride' | 'send'>('ride')
  const [selectedVehicle, setSelectedVehicle] = useState('okada')

  const [driverScreen, setDriverScreen] = useState<DriverScreen>('auth')
  const [online, setOnline] = useState(false)

  // Lifted here (rather than local to SavedPlacesScreen) so HomeScreen's
  // quick-pick list reflects the same data — see src/data/savedPlaces.ts.
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(initialSavedPlaces)

  // LegalScreen is reachable from two different points per persona (the
  // sign-in screen's "Terms and Privacy Policy" link, and Help & Support) —
  // this remembers which one, so its back button returns to the right place.
  const [legalOrigin, setLegalOrigin] = useState<'auth' | 'help'>('help')

  const selectedVehicleOption = vehicleOptions.find((v) => v.id === selectedVehicle) ?? vehicleOptions[0]

  if (persona === 'customer') {
    switch (customerScreen) {
      case 'auth':
        return (
          <View style={{ flex: 1 }}>
            <AuthScreen
              role="customer"
              onDone={() => setCustomerScreen('home')}
              onOpenLegal={() => {
                setLegalOrigin('auth')
                setCustomerScreen('legal')
              }}
            />
            {__DEV__ && <PersonaSwitcher persona={persona} onSwitch={setPersona} />}
          </View>
        )
      case 'home':
        return (
          <HomeScreen
            mode={mode}
            setMode={setMode}
            onRequestRide={() => setCustomerScreen('select')}
            onOpenWallet={() => setCustomerScreen('wallet')}
            onOpenProfile={() => setCustomerScreen('profile')}
            onOpenActivity={() => setCustomerScreen('activity')}
            onOpenNotifications={() => setCustomerScreen('notifications')}
            savedPlaces={savedPlaces}
          />
        )
      case 'select':
        return (
          <VehicleSelectScreen
            mode={mode}
            selected={selectedVehicle}
            onSelect={setSelectedVehicle}
            onBack={() => setCustomerScreen('home')}
            onConfirm={() => setCustomerScreen('trip')}
          />
        )
      case 'trip':
        return <LiveTripScreen mode={mode} vehicleId={selectedVehicle} onEnd={() => setCustomerScreen('rating')} />
      case 'rating':
        return (
          <RatingScreen
            subjectName={mockRider.name}
            subjectDetail={`${selectedVehicleOption.name} · ${mockRider.plate}`}
            fareGHS={selectedVehicleOption.priceGHS}
            tripLabel={mode === 'ride' ? 'Ride' : 'Delivery'}
            tags={['Safe driving', 'Clean vehicle', 'Friendly', 'On time']}
            onDone={() => setCustomerScreen('home')}
          />
        )
      case 'wallet':
        return <WalletScreen onBack={() => setCustomerScreen('home')} onOpenProfile={() => setCustomerScreen('profile')} />
      case 'profile':
        return (
          <ProfileScreen
            onBack={() => setCustomerScreen('home')}
            onOpenWallet={() => setCustomerScreen('wallet')}
            onOpenSettings={() => setCustomerScreen('settings')}
            onOpenSavedPlaces={() => setCustomerScreen('savedPlaces')}
            onOpenHelp={() => setCustomerScreen('help')}
            onOpenNotifications={() => setCustomerScreen('notifications')}
            onOpenActivity={() => setCustomerScreen('activity')}
            onOpenAbout={() => setCustomerScreen('about')}
            onLogout={() => setCustomerScreen('auth')}
          />
        )
      case 'activity':
        return <ActivityScreen onBack={() => setCustomerScreen('home')} />
      case 'notifications':
        return <NotificationsScreen onBack={() => setCustomerScreen('home')} />
      case 'settings':
        return <SettingsScreen onBack={() => setCustomerScreen('profile')} />
      case 'savedPlaces':
        return <SavedPlacesScreen onBack={() => setCustomerScreen('profile')} places={savedPlaces} setPlaces={setSavedPlaces} />
      case 'help':
        return (
          <HelpSupportScreen
            onBack={() => setCustomerScreen('profile')}
            onOpenLegal={() => {
              setLegalOrigin('help')
              setCustomerScreen('legal')
            }}
          />
        )
      case 'about':
        return (
          <AboutScreen
            onBack={() => setCustomerScreen('profile')}
            onOpenCareers={() => setCustomerScreen('careers')}
            onOpenNewsroom={() => setCustomerScreen('newsroom')}
          />
        )
      case 'legal':
        return <LegalScreen onBack={() => setCustomerScreen(legalOrigin)} />
      case 'careers':
        return <CareersScreen onBack={() => setCustomerScreen('about')} />
      case 'newsroom':
        return <NewsroomScreen onBack={() => setCustomerScreen('about')} />
    }
  }

  switch (driverScreen) {
    case 'auth':
      return (
        <View style={{ flex: 1 }}>
          <AuthScreen
            role="rider"
            onDone={() => setDriverScreen('onboarding')}
            onOpenLegal={() => {
              setLegalOrigin('auth')
              setDriverScreen('legal')
            }}
          />
          {__DEV__ && <PersonaSwitcher persona={persona} onSwitch={setPersona} />}
        </View>
      )
    case 'onboarding':
      return <DriverOnboardingScreen onDone={() => setDriverScreen('home')} />
    case 'home':
      return (
        <DriverHomeScreen
          online={online}
          setOnline={setOnline}
          onOpenEarnings={() => setDriverScreen('earnings')}
          onOpenProfile={() => setDriverScreen('profile')}
          onSimulateRequest={() => setDriverScreen('request')}
        />
      )
    case 'request':
      return <RequestScreen onAccept={() => setDriverScreen('trip')} onDecline={() => setDriverScreen('home')} />
    case 'trip':
      return <DriverTripScreen onComplete={() => setDriverScreen('rating')} />
    case 'rating':
      return (
        <RatingScreen
          subjectName={mockCustomer.name}
          subjectDetail={`${incomingRequest.pickup} → ${incomingRequest.dropoff}`}
          fareGHS={incomingRequest.fareGHS}
          tripLabel={incomingRequest.type === 'ride' ? 'Ride' : 'Delivery'}
          tags={['Polite', 'On time', 'Clear pickup', 'Easy drop-off']}
          onDone={() => setDriverScreen('home')}
        />
      )
    case 'earnings':
      return <EarningsScreen onBack={() => setDriverScreen('home')} />
    case 'profile':
      return (
        <DriverProfileScreen
          onBack={() => setDriverScreen('home')}
          onOpenSettings={() => setDriverScreen('settings')}
          onOpenHelp={() => setDriverScreen('help')}
          onOpenVehicleDocs={() => setDriverScreen('vehicleDocs')}
          onOpenPayout={() => setDriverScreen('payout')}
          onOpenRideHistory={() => setDriverScreen('rideHistory')}
          onOpenAbout={() => setDriverScreen('about')}
          onLogout={() => setDriverScreen('auth')}
        />
      )
    case 'settings':
      return <SettingsScreen onBack={() => setDriverScreen('profile')} />
    case 'help':
      return (
        <HelpSupportScreen
          onBack={() => setDriverScreen('profile')}
          onOpenLegal={() => {
            setLegalOrigin('help')
            setDriverScreen('legal')
          }}
        />
      )
    case 'vehicleDocs':
      return <DriverVehicleDocsScreen onBack={() => setDriverScreen('profile')} />
    case 'payout':
      return <DriverPayoutScreen onBack={() => setDriverScreen('profile')} />
    case 'rideHistory':
      return <DriverRideHistoryScreen onBack={() => setDriverScreen('profile')} />
    case 'about':
      return (
        <AboutScreen
          onBack={() => setDriverScreen('profile')}
          onOpenCareers={() => setDriverScreen('careers')}
          onOpenNewsroom={() => setDriverScreen('newsroom')}
        />
      )
    case 'legal':
      return <LegalScreen onBack={() => setDriverScreen(legalOrigin)} />
    case 'careers':
      return <CareersScreen onBack={() => setDriverScreen('about')} />
    case 'newsroom':
      return <NewsroomScreen onBack={() => setDriverScreen('about')} />
  }

  return <View style={styles.fallback} />
}

/**
 * Persona toggle shown only on the sign-in screens (the natural fork point
 * before an account exists yet — the customer and rider-partner apps in
 * production would be two separate installs/accounts, not a runtime
 * switch). Kept here for demo/QA purposes: lets anyone flip between both
 * sides of the product without two separate builds while this is still a
 * design-system-complete-but-backend-less prototype. Rendered only when
 * `__DEV__` is true (both call sites below gate it) so it can never appear
 * in a production build/release binary.
 */
function PersonaSwitcher({ persona, onSwitch }: { persona: 'customer' | 'driver'; onSwitch: (p: 'customer' | 'driver') => void }) {
  return (
    <SafeAreaView edges={['top']} style={switcherStyles.wrap} pointerEvents="box-none">
      <View style={switcherStyles.pillGroup}>
        {(
          [
            { key: 'customer' as const, label: "I'm a customer", icon: Car },
            { key: 'driver' as const, label: "I'm a rider", icon: Bike },
          ]
        ).map((p) => (
          <Pressable key={p.key} onPress={() => onSwitch(p.key)} style={[switcherStyles.pill, persona === p.key && switcherStyles.pillActive]}>
            <p.icon size={13} color={persona === p.key ? '#fff' : 'rgba(255,255,255,0.6)'} />
            <Text style={[switcherStyles.pillText, persona === p.key && switcherStyles.pillTextActive]}>{p.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  )
}

const switcherStyles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  pillGroup: { flexDirection: 'row', marginTop: 8, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.35)', padding: 4 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  pillActive: { backgroundColor: colors.primary.DEFAULT },
  pillText: { fontSize: 11, fontFamily: fonts.sansSemibold, color: 'rgba(255,255,255,0.6)' },
  pillTextActive: { color: '#fff' },
})

const styles = StyleSheet.create({
  fallback: { flex: 1, backgroundColor: '#fff' },
})
