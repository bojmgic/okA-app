import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Check, ChevronRight, FileText, IdCard, Bike, Camera } from 'lucide-react-native'
import PrimaryButton from '../../components/PrimaryButton'
import { VehicleGhost } from '../../components/GhostSilhouette'
import { colors, fonts } from '../../theme'

interface DriverOnboardingScreenProps {
  onDone: () => void
}

const documents = [
  { id: 'ghanaCard', icon: IdCard, label: 'Ghana Card', detail: 'Front and back photo' },
  { id: 'license', icon: FileText, label: "Driver's license", detail: 'Valid, not expired' },
  { id: 'vehicle', icon: Bike, label: 'Vehicle registration', detail: 'Roadworthy sticker included' },
  { id: 'selfie', icon: Camera, label: 'Selfie verification', detail: 'Matches your Ghana Card' },
]

/** Ported from DriverOnboardingScreen.tsx on the web app-preview — rider-partner document checklist. */
export default function DriverOnboardingScreen({ onDone }: DriverOnboardingScreenProps) {
  const [uploaded, setUploaded] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const allDone = uploaded.length === documents.length

  const toggle = (id: string) => setUploaded((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))

  if (submitted) {
    return (
      <SafeAreaView style={styles.pendingScreen} edges={['top', 'bottom']}>
        {/* Ported from DriverOnboardingScreen.tsx on the web app-preview's
            "submitted" confirmation card. */}
        <VehicleGhost top={40} left={100} width={120} rotate={-8} opacity={0.1} />
        <View style={styles.checkBadge}>
          <Check size={24} color="#fff" />
        </View>
        <Text style={styles.pendingTitle}>Documents submitted</Text>
        <Text style={styles.pendingBody}>
          Our team reviews new riders within 24 hours. We'll text you the moment you're approved to go online.
        </Text>
        <Pressable onPress={onDone} style={({ pressed }) => [styles.skipBtn, pressed && styles.skipBtnPressed]}>
          <Text style={styles.skipBtnText}>Preview: skip to rider home</Text>
        </Pressable>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <Text style={styles.eyebrow}>Rider sign-up</Text>
      <Text style={styles.title}>Verify your documents</Text>
      <Text style={styles.subtitle}>Required once, before you can go online. Tap each item to simulate an upload.</Text>

      <View style={{ marginTop: 20, gap: 10 }}>
        {documents.map((doc) => {
          const done = uploaded.includes(doc.id)
          return (
            <Pressable
              key={doc.id}
              onPress={() => toggle(doc.id)}
              style={({ pressed }) => [styles.docRow, done && styles.docRowDone, pressed && styles.docRowPressed]}
            >
              <View style={[styles.docIcon, done && styles.docIconDone]}>
                {done ? <Check size={17} color="#fff" /> : <doc.icon size={17} color={colors.ink.light} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.docLabel}>{doc.label}</Text>
                <Text style={styles.docDetail}>{doc.detail}</Text>
              </View>
              {!done && <ChevronRight size={16} color={colors.ink.light} />}
            </Pressable>
          )
        })}
      </View>

      <PrimaryButton
        label={allDone ? 'Submit for review' : `Upload ${documents.length - uploaded.length} more to continue`}
        disabled={!allDone}
        onPress={() => setSubmitted(true)}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 16 },
  eyebrow: { fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.primary.DEFAULT, textTransform: 'uppercase' },
  title: { marginTop: 4, fontFamily: fonts.display, fontSize: 24, color: colors.ink.DEFAULT },
  subtitle: { marginTop: 6, fontSize: 13, color: colors.ink.light },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(11,11,15,0.1)', backgroundColor: colors.surface.tint, padding: 14 },
  docRowDone: { borderColor: colors.primary.DEFAULT, backgroundColor: colors.primary.DEFAULT + '0F' },
  docRowPressed: { transform: [{ scale: 0.98 }] },
  docIcon: { height: 40, width: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  docIconDone: { backgroundColor: colors.primary.DEFAULT },
  docLabel: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  docDetail: { fontSize: 11, color: colors.ink.light },
  pendingScreen: { flex: 1, backgroundColor: colors.primary[900], alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, overflow: 'hidden' },
  checkBadge: { height: 56, width: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  pendingTitle: { marginTop: 16, fontFamily: fonts.display, fontSize: 18, color: '#fff' },
  pendingBody: { marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  skipBtn: { marginTop: 24, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 20, paddingVertical: 10 },
  skipBtnPressed: { transform: [{ scale: 0.96 }] },
  skipBtnText: { fontSize: 12, fontFamily: fonts.sansSemibold, color: '#fff' },
})
