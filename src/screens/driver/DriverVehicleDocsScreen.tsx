import { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Check, RotateCw, ArrowLeft, FileText, IdCard, Bike, Camera } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import { colors, fonts } from '../../theme'

interface DriverVehicleDocsScreenProps {
  onBack: () => void
}

// Same shape as the `documents` array in DriverOnboardingScreen.tsx.
const documents = [
  { id: 'ghanaCard', icon: IdCard, label: 'Ghana Card', detail: 'Front and back photo' },
  { id: 'license', icon: FileText, label: "Driver's license", detail: 'Valid, not expired' },
  { id: 'vehicle', icon: Bike, label: 'Vehicle registration', detail: 'Roadworthy sticker included' },
  { id: 'selfie', icon: Camera, label: 'Selfie verification', detail: 'Matches your Ghana Card' },
]

/** Driver "manage your documents" screen — reuses the onboarding checklist pattern,
 *  but everything starts verified since the driver already onboarded. Tapping a
 *  verified doc simulates kicking off a re-upload (marks it pending again); tapping
 *  a pending doc simulates the re-upload completing. */
export default function DriverVehicleDocsScreen({ onBack }: DriverVehicleDocsScreenProps) {
  const [verified, setVerified] = useState<string[]>(documents.map((d) => d.id))

  const toggle = (id: string, label: string) => {
    const isVerified = verified.includes(id)
    if (isVerified) {
      setVerified((prev) => prev.filter((d) => d !== id))
      Alert.alert('Re-upload started', `${label} marked for re-upload. Simulating review…`)
    } else {
      setVerified((prev) => [...prev, id])
      Alert.alert('Document verified', `${label} verified ✓`)
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Vehicle & documents</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.subtitle}>Tap a document to simulate a re-upload, or confirm it's verified.</Text>

        <View style={{ marginTop: 16, gap: 10 }}>
          {documents.map((doc) => {
            const done = verified.includes(doc.id)
            return (
              <Pressable
                key={doc.id}
                onPress={() => toggle(doc.id, doc.label)}
                style={({ pressed }) => [styles.docRow, done && styles.docRowDone, pressed && styles.docRowPressed]}
              >
                <View style={[styles.docIcon, done && styles.docIconDone]}>
                  {done ? <Check size={17} color="#fff" /> : <doc.icon size={17} color={colors.ink.light} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docLabel}>{doc.label}</Text>
                  <Text style={styles.docDetail}>{done ? 'Verified ✓' : doc.detail}</Text>
                </View>
                {!done && <RotateCw size={16} color={colors.ink.light} />}
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  subtitle: { fontSize: 13, color: colors.ink.light },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(11,11,15,0.1)', backgroundColor: colors.surface.tint, padding: 14 },
  docRowDone: { borderColor: colors.primary.DEFAULT, backgroundColor: colors.primary.DEFAULT + '0F' },
  docRowPressed: { transform: [{ scale: 0.98 }] },
  docIcon: { height: 40, width: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  docIconDone: { backgroundColor: colors.primary.DEFAULT },
  docLabel: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  docDetail: { fontSize: 11, color: colors.ink.light },
})
