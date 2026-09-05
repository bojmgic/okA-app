import { useState } from 'react'
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Home, Briefcase, Star, MapPin, Trash2, Plus } from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import PrimaryButton from '../../components/PrimaryButton'
import { colors, fonts } from '../../theme'

interface SavedPlacesScreenProps {
  onBack: () => void
}

interface SavedPlace {
  id: string
  icon: LucideIcon
  label: string
  detail: string
}

// Seeded from the same three entries HomeScreen.tsx defines inline as `savedPlaces`.
const initialPlaces: SavedPlace[] = [
  { id: 'home', icon: Home, label: 'Home', detail: 'East Legon' },
  { id: 'work', icon: Briefcase, label: 'Work', detail: 'Airport City' },
  { id: 'mall', icon: Star, label: 'Accra Mall', detail: 'Frequent stop' },
]

/** Customer-only saved addresses screen — list, add, delete, all local state. */
export default function SavedPlacesScreen({ onBack }: SavedPlacesScreenProps) {
  const [places, setPlaces] = useState<SavedPlace[]>(initialPlaces)
  const [adding, setAdding] = useState(false)
  const [labelInput, setLabelInput] = useState('')
  const [addressInput, setAddressInput] = useState('')

  const removePlace = (id: string) => setPlaces((prev) => prev.filter((p) => p.id !== id))

  const submitPlace = () => {
    if (!labelInput.trim() || !addressInput.trim()) return
    setPlaces((prev) => [...prev, { id: `place-${Date.now()}`, icon: MapPin, label: labelInput.trim(), detail: addressInput.trim() }])
    setLabelInput('')
    setAddressInput('')
    setAdding(false)
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Saved places</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.card}>
          {places.map((place, i) => (
            <View key={place.id} style={[styles.placeRow, i > 0 && styles.placeRowBorder]}>
              <View style={styles.placeIcon}>
                <place.icon size={15} color={colors.ink.light} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.placeLabel}>{place.label}</Text>
                <Text style={styles.placeDetail}>{place.detail}</Text>
              </View>
              <Pressable onPress={() => removePlace(place.id)} accessibilityLabel={`Delete ${place.label}`} style={styles.deleteBtn}>
                <Trash2 size={15} color="#DC2626" />
              </Pressable>
            </View>
          ))}
          {places.length === 0 && <Text style={styles.emptyText}>No saved places yet.</Text>}
        </View>

        {adding ? (
          <View style={styles.form}>
            <Text style={styles.formLabel}>Label</Text>
            <TextInput
              value={labelInput}
              onChangeText={setLabelInput}
              placeholder="e.g. Gym"
              placeholderTextColor={colors.ink.light}
              style={styles.input}
            />
            <Text style={styles.formLabel}>Address</Text>
            <TextInput
              value={addressInput}
              onChangeText={setAddressInput}
              placeholder="e.g. Cantonments, Accra"
              placeholderTextColor={colors.ink.light}
              style={styles.input}
            />
            <View style={styles.formActions}>
              <Pressable onPress={() => setAdding(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <PrimaryButton label="Save place" onPress={submitPlace} style={{ flex: 1 }} />
            </View>
          </View>
        ) : (
          <Pressable onPress={() => setAdding(true)} style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}>
            <Plus size={16} color={colors.primary.DEFAULT} />
            <Text style={styles.addText}>Add place</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  card: { borderRadius: 16, backgroundColor: colors.surface.tint, paddingHorizontal: 12 },
  emptyText: { paddingVertical: 16, textAlign: 'center', fontSize: 12, color: colors.ink.light },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  placeRowBorder: { borderTopWidth: 1, borderTopColor: 'rgba(11,11,15,0.06)' },
  placeIcon: { height: 32, width: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  placeLabel: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  placeDetail: { fontSize: 11, color: colors.ink.light },
  deleteBtn: { height: 32, width: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  addBtn: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary.DEFAULT + '4D', paddingVertical: 14 },
  addBtnPressed: { opacity: 0.7 },
  addText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.primary.DEFAULT },
  form: { marginTop: 12, borderRadius: 16, backgroundColor: colors.surface.tint, padding: 14, gap: 4 },
  formLabel: { marginTop: 8, fontSize: 11, fontFamily: fonts.sansSemibold, color: colors.ink.light, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { marginTop: 4, borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10, fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  formActions: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cancelBtn: { paddingHorizontal: 14, paddingVertical: 12 },
  cancelText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.light },
})
