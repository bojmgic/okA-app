import { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import { colors, fonts } from '../../theme'

interface SettingsScreenProps {
  onBack: () => void
}

/** Simple track-and-thumb toggle — this codebase has no Switch component yet, so
 *  it's built inline here as a Pressable rather than pulling in RN's built-in Switch
 *  (which doesn't match the app's rounded-pill visual language as closely). */
function ToggleRow({ label, detail, value, onChange }: { label: string; detail?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onChange(!value)} style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {detail && <Text style={styles.rowDetail}>{detail}</Text>}
      </View>
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </View>
    </Pressable>
  )
}

/** Shared Settings screen — used by both customer and driver personas. */
export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [promoEnabled, setPromoEnabled] = useState(false)
  const [shareLocation, setShareLocation] = useState(true)

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.card}>
          <ToggleRow label="Push notifications" detail="Alerts on your device" value={pushEnabled} onChange={setPushEnabled} />
          <View style={styles.divider} />
          <ToggleRow label="Ride/trip updates via SMS" detail="Text messages for trip status" value={smsEnabled} onChange={setSmsEnabled} />
          <View style={styles.divider} />
          <ToggleRow label="Promotional emails" detail="Offers and news" value={promoEnabled} onChange={setPromoEnabled} />
        </View>

        <Text style={styles.sectionLabel}>Privacy</Text>
        <View style={styles.card}>
          <ToggleRow label="Share location while online" detail="Needed for pickups and live tracking" value={shareLocation} onChange={setShareLocation} />
        </View>

        <View style={styles.versionRow}>
          <Text style={styles.versionText}>App version 1.0.0</Text>
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
  sectionLabel: { marginTop: 16, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  card: { marginTop: 8, borderRadius: 16, backgroundColor: colors.surface.tint, paddingHorizontal: 14 },
  divider: { height: 1, backgroundColor: 'rgba(11,11,15,0.06)' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  rowLabel: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  rowDetail: { marginTop: 2, fontSize: 11, color: colors.ink.light },
  track: { width: 44, height: 26, borderRadius: 13, backgroundColor: 'rgba(11,11,15,0.15)', padding: 3, justifyContent: 'center' },
  trackOn: { backgroundColor: colors.primary.DEFAULT },
  thumb: { height: 20, width: 20, borderRadius: 10, backgroundColor: '#fff' },
  thumbOn: { transform: [{ translateX: 18 }] },
  versionRow: { marginTop: 24, alignItems: 'center' },
  versionText: { fontSize: 11, color: colors.ink.light },
})
