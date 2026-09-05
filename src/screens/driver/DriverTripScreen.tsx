import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Phone, MessageCircle, Navigation } from 'lucide-react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'
import MockMap from '../../components/MockMap'
import TicketDivider from '../../components/TicketDivider'
import CouponButton from '../../components/CouponButton'
import IconButton from '../../components/IconButton'
import PrimaryButton from '../../components/PrimaryButton'
import StampMark from '../../components/StampMark'
import WaveCap from '../../components/WaveCap'
import { incomingRequest, driverTripSteps } from '../../data/appPreview'
import { colors, fonts } from '../../theme'

interface DriverTripScreenProps {
  onComplete: () => void
}

/** Ported from DriverTripScreen.tsx on the web app-preview — driver-side active trip. */
export default function DriverTripScreen({ onComplete }: DriverTripScreenProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const isLastStep = stepIndex === driverTripSteps.length - 1
  const { customer } = incomingRequest

  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withTiming((stepIndex / (driverTripSteps.length - 1)) * 100, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    })
  }, [stepIndex, progress])
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }))

  return (
    <View style={styles.screen}>
      <MockMap showRoute animateVehicle focus="route" />

      <SafeAreaView edges={['top']} style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusStep}>{driverTripSteps[stepIndex]}</Text>
          <Text style={styles.statusMeta}>
            Step {stepIndex + 1} of {driverTripSteps.length}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </SafeAreaView>

      <View style={styles.bottomWrap}>
        <WaveCap fill="#1D3554" />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.ticket}>
            <View style={styles.customerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{customer.name.split(' ').map((n) => n[0]).join('')}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerMeta}>★ {customer.rating} · {incomingRequest.type === 'ride' ? 'Ride' : 'Delivery'} · GHS {incomingRequest.fareGHS}</Text>
              </View>
              <View style={styles.stampCol}>
                <StampMark label={driverTripSteps[stepIndex]} style={{ width: 96 }} />
                <IconButton icon={Navigation} accessibilityLabel="Open navigation" size={15} />
              </View>
            </View>

            <TicketDivider holeColor="#1D3554" style={{ marginVertical: 16 }} />

            <View style={styles.actionsRow}>
              <CouponButton icon={Phone} label="Call" layout="row" style={{ flex: 1 }} />
              <CouponButton icon={MessageCircle} label="Message" layout="row" style={{ flex: 1 }} />
            </View>

            <PrimaryButton
              label={isLastStep ? `Complete — GHS ${incomingRequest.fareGHS}` : `Confirm: ${driverTripSteps[stepIndex + 1]}`}
              onPress={() => (isLastStep ? onComplete() : setStepIndex((i) => i + 1))}
              style={{ marginTop: 16 }}
            />
          </View>
        </SafeAreaView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E7EEFC' },
  statusCard: { marginHorizontal: 20, marginTop: 4, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusStep: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.primary.DEFAULT },
  statusMeta: { fontSize: 11, color: colors.ink.light },
  progressTrack: { marginTop: 8, height: 6, borderRadius: 3, backgroundColor: 'rgba(11,11,15,0.1)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.primary.DEFAULT },
  bottomWrap: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheet: { marginTop: -1, backgroundColor: colors.primary[900], paddingHorizontal: 20, paddingTop: 20 },
  ticket: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  customerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: colors.primary[900], alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.sansSemibold, fontSize: 14, color: '#fff' },
  customerName: { fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  customerMeta: { fontSize: 11, color: colors.ink.light },
  stampCol: { alignItems: 'flex-end', gap: 8 },
  actionsRow: { flexDirection: 'row', gap: 12 },
})
