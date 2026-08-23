import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Phone, MessageCircle, Navigation } from 'lucide-react-native'
import MockMap from '../../components/MockMap'
import TicketDivider from '../../components/TicketDivider'
import CouponButton from '../../components/CouponButton'
import PrimaryButton from '../../components/PrimaryButton'
import { incomingRequest, driverTripSteps } from '../../data/appPreview'
import { colors, fonts } from '../../theme'

interface DriverTripScreenProps {
  onComplete: () => void
}

/** Ported from DriverTripScreen.tsx on the web app-preview — driver-side active trip. */
export default function DriverTripScreen({ onComplete }: DriverTripScreenProps) {
  const stepIndex = 1
  return (
    <View style={styles.screen}>
      <MockMap showRoute />

      <SafeAreaView edges={['top']} style={styles.statusCard}>
        <Text style={styles.statusStep}>{driverTripSteps[stepIndex]}</Text>
        <Text style={styles.statusMeta}>
          Step {stepIndex + 1} of {driverTripSteps.length}
        </Text>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <View style={styles.ticket}>
          <View style={styles.customerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{incomingRequest.customer.name.split(' ').map((n) => n[0]).join('')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.customerName}>{incomingRequest.customer.name}</Text>
              <Text style={styles.customerMeta}>★ {incomingRequest.customer.rating} · {incomingRequest.pickup} → {incomingRequest.dropoff}</Text>
            </View>
          </View>

          <TicketDivider holeColor="#00205C" style={{ marginVertical: 16 }} />

          <View style={styles.actionsRow}>
            <CouponButton icon={Phone} label="Call" />
            <CouponButton icon={MessageCircle} label="Message" />
            <CouponButton icon={Navigation} label="Navigate" />
          </View>

          <PrimaryButton label="Complete trip" onPress={onComplete} style={{ marginTop: 16 }} />
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E7EEFC' },
  statusCard: { marginHorizontal: 20, marginTop: 4, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  statusStep: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.primary.DEFAULT },
  statusMeta: { fontSize: 11, color: colors.ink.light },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.primary[900], paddingHorizontal: 20, paddingTop: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  ticket: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: colors.surface.tint, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.ink.DEFAULT },
  customerName: { fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  customerMeta: { fontSize: 11, color: colors.ink.light },
  actionsRow: { flexDirection: 'row', gap: 12 },
})
