import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { X, Phone, MessageCircle, ShieldAlert, User, KeyRound } from 'lucide-react-native'
import MockMap from '../../components/MockMap'
import IconButton from '../../components/IconButton'
import StampMark from '../../components/StampMark'
import TicketDivider from '../../components/TicketDivider'
import CouponButton from '../../components/CouponButton'
import WaveCap from '../../components/WaveCap'
import { vehicleOptions, mockRider, sendStatusSteps } from '../../data/appPreview'
import { colors, fonts } from '../../theme'
import { brand } from '../../utils/brand'

interface LiveTripScreenProps {
  mode: 'ride' | 'send'
  vehicleId: string
  onEnd: () => void
}

/** Ported from LiveTripScreen.tsx on the web app-preview — trip tracking as a ticket stub. */
// Mock recipient verification PIN — ported from the website's 4-Digit Parcel
// Verification safety pillar (Safety.tsx / Send.tsx). In production this
// would be generated per-delivery and shown only to the recipient.
const PARCEL_PIN = '4821'

export default function LiveTripScreen({ mode, vehicleId, onEnd }: LiveTripScreenProps) {
  const stepIndex = 1 // "Picked up" — a representative mid-trip snapshot for the preview
  const vehicle = vehicleOptions.find((v) => v.id === vehicleId) ?? vehicleOptions[0]

  return (
    <View style={styles.screen}>
      <MockMap showRoute animateVehicle focus="route" />
      <SafeAreaView edges={['top']}>
        <View style={styles.topBar}>
          <IconButton icon={X} onPress={onEnd} accessibilityLabel="Close" />
        </View>

        {mode === 'ride' ? (
          <View style={styles.etaPill}>
            <Text style={styles.etaText}>Arriving in {vehicle.etaMins} min</Text>
          </View>
        ) : (
          <View style={styles.sendStatusCard}>
            <View style={styles.sendStatusRow}>
              <Text style={styles.sendStatusLabel}>{sendStatusSteps[stepIndex]}</Text>
              <Text style={styles.sendStatusMeta}>
                Step {stepIndex + 1} of {sendStatusSteps.length}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(stepIndex / (sendStatusSteps.length - 1)) * 100}%` }]} />
            </View>
            <View style={styles.sendStepsRow}>
              {sendStatusSteps.map((step, i) => (
                <Text key={step} style={[styles.sendStepLabel, i <= stepIndex && styles.sendStepLabelActive]}>
                  {step}
                </Text>
              ))}
            </View>
          </View>
        )}
      </SafeAreaView>

      <View style={styles.bottomWrap}>
        <WaveCap fill="#1D3554" />
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
                    {mockRider.rating} · {brand(vehicle.name)} · {mockRider.plate}
                  </Text>
                </View>
              </View>
              <StampMark label={mode === 'ride' ? 'On the way' : sendStatusSteps[stepIndex]} style={{ width: 104 }} />
            </View>

            <TicketDivider holeColor="#1D3554" style={{ marginVertical: 16 }} />

            {mode === 'send' && (
              <View style={styles.pinBlock}>
                <View style={styles.pinHeader}>
                  <KeyRound size={13} color={colors.primary.DEFAULT} />
                  <Text style={styles.pinLabel}>Recipient verification PIN</Text>
                </View>
                <View style={styles.pinRow}>
                  {PARCEL_PIN.split('').map((digit, i) => (
                    <View key={i} style={styles.pinDigit}>
                      <Text style={styles.pinDigitText}>{digit}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.pinHint}>Share this code with your recipient — your rider confirms it at drop-off.</Text>
              </View>
            )}

            <View style={styles.actionsRow}>
              <CouponButton icon={Phone} label="Call" />
              <CouponButton icon={MessageCircle} label="Message" />
              <CouponButton icon={ShieldAlert} label="Safety" tone="danger" />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E7EEFC' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 4 },
  etaPill: { position: 'absolute', top: 4, right: 20, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  etaText: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.ink.DEFAULT },
  sendStatusCard: { marginHorizontal: 20, marginTop: 8, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  sendStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sendStatusLabel: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.primary.DEFAULT },
  sendStatusMeta: { fontSize: 11, color: colors.ink.light },
  progressTrack: { marginTop: 8, height: 6, borderRadius: 3, backgroundColor: 'rgba(11,11,15,0.1)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.primary.DEFAULT },
  sendStepsRow: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
  sendStepLabel: { fontSize: 9, fontFamily: fonts.sansMedium, color: colors.ink.light + '80' },
  sendStepLabelActive: { color: colors.primary.DEFAULT },
  bottomWrap: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheet: { marginTop: -1, backgroundColor: colors.primary[900], paddingHorizontal: 20, paddingTop: 20 },
  ticket: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { height: 56, width: 56, borderRadius: 28, backgroundColor: colors.surface.tint, alignItems: 'center', justifyContent: 'center' },
  riderName: { fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  riderMeta: { fontSize: 12, color: colors.ink.light },
  actionsRow: { flexDirection: 'row', gap: 12 },
  pinBlock: { marginBottom: 16, borderRadius: 14, backgroundColor: colors.surface.tint, padding: 14 },
  pinHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pinLabel: { fontFamily: fonts.sansSemibold, fontSize: 11, color: colors.primary.DEFAULT, textTransform: 'uppercase', letterSpacing: 0.5 },
  pinRow: { marginTop: 10, flexDirection: 'row', gap: 8 },
  pinDigit: { height: 40, width: 32, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  pinDigitText: { fontFamily: fonts.display, fontSize: 17, color: colors.ink.DEFAULT },
  pinHint: { marginTop: 10, fontSize: 11, lineHeight: 15, color: colors.ink.light },
})
