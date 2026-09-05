import { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, ChevronDown, LifeBuoy } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import { colors, fonts } from '../../theme'

interface HelpSupportScreenProps {
  onBack: () => void
}

const faqs = [
  { id: 'payment', q: 'How do I add a payment method?', a: 'Open Wallet from the tab bar, then tap "Top up" or your saved method to manage how you pay for rides.' },
  { id: 'cancel', q: 'How do I cancel a ride?', a: 'While a trip is active, open the live trip screen and use the cancel option before your rider-partner arrives.' },
  { id: 'fares', q: 'How are fares calculated?', a: 'Fares are based on vehicle type, distance, and estimated time — shown up front before you confirm a ride.' },
  { id: 'become-rider', q: 'How do I become a rider-partner?', a: 'Switch to the rider-partner app, sign up, and complete the document verification checklist to start accepting trips.' },
]

/** Shared Help & Support screen — simple expandable FAQ list used by both personas. */
export default function HelpSupportScreen({ onBack }: HelpSupportScreenProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [contacted, setContacted] = useState(false)

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id))

  const handleContact = () => {
    setContacted(true)
    Alert.alert('Message sent', "We'll get back to you within 24 hours.")
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionLabel}>Frequently asked</Text>
        <View style={styles.card}>
          {faqs.map((item, i) => {
            const isOpen = expanded === item.id
            return (
              <View key={item.id} style={i > 0 ? styles.itemBorder : undefined}>
                <Pressable onPress={() => toggle(item.id)} style={styles.qRow}>
                  <Text style={styles.qText}>{item.q}</Text>
                  <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                    <ChevronDown size={16} color={colors.ink.light} />
                  </View>
                </Pressable>
                {isOpen && (
                  <View style={styles.aWrap}>
                    <Text style={styles.aText}>{item.a}</Text>
                  </View>
                )}
              </View>
            )
          })}
        </View>

        <Text style={styles.sectionLabel}>Still need help?</Text>
        <Pressable onPress={handleContact} style={({ pressed }) => [styles.contactBtn, pressed && styles.contactBtnPressed]}>
          <LifeBuoy size={16} color={colors.primary.DEFAULT} />
          <Text style={styles.contactText}>Contact support</Text>
        </Pressable>
        {contacted && <Text style={styles.contactConfirm}>We'll get back to you within 24 hours.</Text>}
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
  itemBorder: { borderTopWidth: 1, borderTopColor: 'rgba(11,11,15,0.06)' },
  qRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  qText: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  aWrap: { paddingBottom: 14 },
  aText: { fontSize: 12, color: colors.ink.light, lineHeight: 18 },
  contactBtn: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, backgroundColor: colors.primary.DEFAULT + '0F', paddingVertical: 14 },
  contactBtnPressed: { opacity: 0.7 },
  contactText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.primary.DEFAULT },
  contactConfirm: { marginTop: 10, textAlign: 'center', fontSize: 12, color: colors.ink.light },
})
