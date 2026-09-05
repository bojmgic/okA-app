import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, ChevronLeft, ChevronRight, Zap, Wallet } from 'lucide-react-native'
import MockMap from '../../components/MockMap'
import IconButton from '../../components/IconButton'
import PrimaryButton from '../../components/PrimaryButton'
import WaveCap from '../../components/WaveCap'
import { vehicleOptions } from '../../data/appPreview'
import { colors, fonts } from '../../theme'

interface VehicleSelectScreenProps {
  mode: 'ride' | 'send'
  selected: string
  onSelect: (id: string) => void
  onBack: () => void
  onConfirm: () => void
}

const tagFor = (index: number) => {
  if (index === 0) return { label: 'Cheapest', icon: Wallet }
  if (index === 1) return { label: 'Fastest', icon: Zap }
  return null
}

/** Ported from VehicleSelectScreen.tsx on the web app-preview — one vehicle at a time, not a vertical list. */
export default function VehicleSelectScreen({ mode, selected, onSelect, onBack, onConfirm }: VehicleSelectScreenProps) {
  const activeIndex = Math.max(0, vehicleOptions.findIndex((v) => v.id === selected))
  const active = vehicleOptions[activeIndex]
  const tag = tagFor(activeIndex)

  const go = (delta: number) => {
    const next = (activeIndex + delta + vehicleOptions.length) % vehicleOptions.length
    onSelect(vehicleOptions[next].id)
  }

  return (
    <View style={styles.screen}>
      <MockMap showRoute focus="route" />
      <SafeAreaView edges={['top']}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" style={styles.backBtn} />
      </SafeAreaView>

      <View style={styles.bottomWrap}>
        <WaveCap fill="#00205C" />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <Text style={styles.heading}>{mode === 'ride' ? 'Choose a ride' : 'Choose a courier'}</Text>


          <View style={styles.card}>
            <Pressable onPress={() => go(-1)} style={({ pressed }) => [styles.arrow, pressed && styles.arrowPressed]}>
              <ChevronLeft size={18} color="#fff" />
            </Pressable>

            <View style={styles.deckCard}>
              {tag && (
                <View style={styles.tag}>
                  <tag.icon size={11} color={colors.primary.DEFAULT} />
                  <Text style={styles.tagText}>{tag.label}</Text>
                </View>
              )}
              <Image source={active.image} style={styles.vehicleImage} resizeMode="contain" />
              <Text style={styles.vehicleName}>{active.name}</Text>
              <Text style={styles.vehicleTagline}>{active.tagline}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{active.etaMins} min away</Text>
                <Text style={styles.price}>GHS {active.priceGHS}</Text>
              </View>
            </View>

            <Pressable onPress={() => go(1)} style={({ pressed }) => [styles.arrow, pressed && styles.arrowPressed]}>
              <ChevronRight size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.dots}>
            {vehicleOptions.map((v, i) => (
              <View key={v.id} style={[styles.dot, i === activeIndex && styles.dotActive]} />
            ))}
          </View>

          <PrimaryButton label={`Confirm ${active.name}`} onPress={onConfirm} style={{ marginTop: 16, marginHorizontal: 20 }} />
        </SafeAreaView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E7EEFC' },
  backBtn: { marginLeft: 20, marginTop: 4 },
  bottomWrap: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheet: { marginTop: -1, backgroundColor: colors.primary[900], paddingTop: 12 },
  heading: { fontFamily: fonts.display, fontSize: 18, fontWeight: '600', color: '#fff', marginHorizontal: 20, marginBottom: 4 },
  card: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  arrow: { height: 36, width: 36, alignItems: 'center', justifyContent: 'center' },
  arrowPressed: { transform: [{ scale: 0.88 }] },
  deckCard: { flex: 1, alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, paddingVertical: 16 },
  tag: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary.DEFAULT + '1A', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  tagText: { fontSize: 10, fontFamily: fonts.sansBold, color: colors.primary.DEFAULT },
  vehicleImage: { width: 140, height: 100 },
  vehicleName: { marginTop: 8, fontFamily: fonts.display, fontSize: 16, color: colors.ink.DEFAULT },
  vehicleTagline: { fontSize: 11, color: colors.ink.light },
  metaRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  metaText: { fontSize: 12, color: colors.ink.light },
  price: { fontSize: 12, fontFamily: fonts.sansBold, color: colors.primary.DEFAULT },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 },
  dot: { height: 6, width: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { backgroundColor: '#fff', width: 16 },
})
