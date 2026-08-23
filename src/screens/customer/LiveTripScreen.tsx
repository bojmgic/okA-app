import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { X, Phone, MessageCircle, ShieldAlert, User } from 'lucide-react-native'
import MockMap from '../../components/MockMap'
import IconButton from '../../components/IconButton'
import StampMark from '../../components/StampMark'
import TicketDivider from '../../components/TicketDivider'
import CouponButton from '../../components/CouponButton'
import { vehicleOptions, mockRider } from '../../data/appPreview'
import { colors, fonts } from '../../theme'

interface LiveTripScreenProps {
  mode: 'ride' | 'send'
  vehicleId: string
  onEnd: () => void
}

/** Ported from LiveTripScreen.tsx on the web app-preview — trip tracking as a ticket stub. */
export default function LiveTripScreen({ vehicleId, onEnd }: LiveTripScreenProps) {
  const vehicle = vehicleOptions.find((v) => v.id === vehicleId) ?? vehicleOptions[0]

  return (
    <View style={styles.screen}>
      <MockMap showRoute />
      <SafeAreaView edges={['top']} style={styles.topRow}>
        <IconButton icon={X} onPress={onEnd} accessibilityLabel="Close" />
        <View style={styles.etaPill}>
          <Text style={styles.etaText}>Arriving in {vehicle.etaMins} min</Text>
        </View>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <View style={styles.ticket}>
          <View style={styles.ticketHeader}>
            <View style={styles.riderRow}>
              <View style={styles.avatar}>
                <User size={24} color={colors.ink.light} />
              </View>
              <View>
                <Text style={styles.riderName}>{mockRider.name}</Text>
                <Text style={styles.riderMeta}>
                  {mockRider.rating} · {vehicle.name} · {mockRider.plate}
                </Text>
              </View>
            </View>
            <StampMark label="On the way" style={{ width: 96 }} />
          </View>

          <TicketDivider holeColor="#00205C" style={{ marginVertical: 16 }} />

          <View style={styles.actionsRow}>
            <CouponButton icon={Phone} label="Call" />
            <CouponButton icon={MessageCircle} label="Message" />
            <CouponButton icon={ShieldAlert} label="Safety" tone="danger" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E7EEFC' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 4 },
  etaPill: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  etaText: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.ink.DEFAULT },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.primary[900], paddingHorizontal: 20, paddingTop: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  ticket: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { height: 56, width: 56, borderRadius: 28, backgroundColor: colors.surface.tint, alignItems: 'center', justifyContent: 'center' },
  riderName: { fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  riderMeta: { fontSize: 12, color: colors.ink.light },
  actionsRow: { flexDirection: 'row', gap: 12 },
})
