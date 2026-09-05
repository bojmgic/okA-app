import { useEffect, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { MapPin, X, Check } from 'lucide-react-native'
import Svg, { Circle } from 'react-native-svg'
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated'
import { VehicleGhost } from '../../components/GhostSilhouette'
import { incomingRequest } from '../../data/appPreview'
import { colors, fonts } from '../../theme'

interface RequestScreenProps {
  onAccept: () => void
  onDecline: () => void
}

const COUNTDOWN_SECONDS = 12
const RING_RADIUS = 20
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

/** Ported from RequestScreen.tsx on the web app-preview — incoming trip request with a countdown. */
export default function RequestScreen({ onAccept, onDecline }: RequestScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)
  const insets = useSafeAreaInsets()

  // Fraction of the ring remaining (1 = full circle, 0 = drained) — driven
  // by time directly rather than derived from `secondsLeft` so the ring
  // drains smoothly instead of jumping once per second like the number does.
  const remaining = useSharedValue(1)
  useEffect(() => {
    remaining.value = withTiming(0, { duration: COUNTDOWN_SECONDS * 1000, easing: Easing.linear })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_CIRCUMFERENCE * remaining.value,
  }))

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          onDecline()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [onDecline])

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Ported from RequestScreen.tsx on the web app-preview: a large, prominent
          VehicleGhost commanding the backdrop behind the incoming-request card. */}
      <VehicleGhost top={90} left={30} width={240} rotate={-4} opacity={0.14} />

      <View style={[styles.countdownRow, { top: 20 + insets.top }]}>
        <View style={styles.countdownRing}>
          <Svg width={48} height={48} viewBox="0 0 48 48" style={styles.countdownSvg}>
            <Circle cx={24} cy={24} r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={4} />
            <AnimatedCircle
              cx={24}
              cy={24}
              r={RING_RADIUS}
              fill="none"
              stroke="#fff"
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              animatedProps={ringProps}
            />
          </Svg>
          <Text style={styles.countdownText}>{secondsLeft}</Text>
        </View>
        <Text style={styles.newRequestLabel}>New request</Text>
      </View>

      <View style={styles.card}>
        {/* Faint corner logo watermark — the request card is the one place in
            the app without a map or ink band to carry the ghost pattern, so
            it gets a quiet logo mark instead, same as web's RequestScreen. */}
        <VehicleGhost top={-10} left={260} width={90} rotate={-6} opacity={0.06} />
        <View style={styles.fareRow}>
          <Text style={styles.fare}>GHS {incomingRequest.fareGHS}</Text>
          <Text style={styles.distance}>{incomingRequest.distanceKm} km · {incomingRequest.etaPickupMins} min to pickup</Text>
        </View>

        <View style={styles.routeRow}>
          <View style={styles.routeIcons}>
            <View style={styles.dotPickup} />
            <View style={styles.routeLine} />
            <MapPin size={12} color={colors.primary.DEFAULT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeText}>{incomingRequest.pickup}</Text>
            <View style={{ height: 18 }} />
            <Text style={styles.routeText}>{incomingRequest.dropoff}</Text>
          </View>
        </View>

        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{incomingRequest.customer.name.split(' ').map((n) => n[0]).join('')}</Text>
          </View>
          <Text style={styles.customerName}>{incomingRequest.customer.name}</Text>
          <Text style={styles.customerRating}>★ {incomingRequest.customer.rating}</Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable onPress={onDecline} style={({ pressed }) => [styles.declineBtn, pressed && styles.declineBtnPressed]}>
            <X size={18} color={colors.ink.light} />
          </Pressable>
          <Pressable onPress={onAccept} style={({ pressed }) => [styles.acceptBtn, pressed && styles.acceptBtnPressed]}>
            <Check size={18} color="#fff" />
            <Text style={styles.acceptText}>Accept</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary[900], justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 16 },
  countdownRow: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  countdownRing: { height: 48, width: 48, alignItems: 'center', justifyContent: 'center' },
  countdownSvg: { position: 'absolute', transform: [{ rotate: '-90deg' }] },
  countdownText: { color: '#fff', fontFamily: fonts.sansBold, fontSize: 13 },
  newRequestLabel: { color: '#fff', fontFamily: fonts.sansSemibold, fontSize: 14 },
  card: { borderRadius: 24, backgroundColor: '#fff', padding: 20, overflow: 'hidden' },
  fareRow: { alignItems: 'center' },
  fare: { fontFamily: fonts.display, fontSize: 30, color: colors.ink.DEFAULT },
  distance: { marginTop: 2, fontSize: 12, color: colors.ink.light },
  routeRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  routeIcons: { alignItems: 'center' },
  dotPickup: { height: 8, width: 8, borderRadius: 4, backgroundColor: colors.primary.DEFAULT },
  routeLine: { width: 1, flex: 1, backgroundColor: 'rgba(11,11,15,0.15)', marginVertical: 2 },
  routeText: { fontSize: 12, fontFamily: fonts.sansMedium, color: colors.ink.DEFAULT },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(11,11,15,0.08)' },
  avatar: { height: 32, width: 32, borderRadius: 16, backgroundColor: colors.surface.tint, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontFamily: fonts.sansBold, color: colors.ink.DEFAULT },
  customerName: { flex: 1, fontSize: 13, fontFamily: fonts.sansSemibold, color: colors.ink.DEFAULT },
  customerRating: { fontSize: 12, color: colors.ink.light },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  declineBtn: { height: 52, width: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.tint },
  declineBtnPressed: { transform: [{ scale: 0.94 }] },
  acceptBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 26, backgroundColor: colors.primary.DEFAULT },
  acceptBtnPressed: { transform: [{ scale: 0.97 }] },
  acceptText: { color: '#fff', fontFamily: fonts.sansSemibold, fontSize: 14 },
})
