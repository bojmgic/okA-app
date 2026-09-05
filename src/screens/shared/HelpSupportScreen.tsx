import { useState } from 'react'
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, Alert, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, ChevronDown, LifeBuoy, Wrench, MessageSquare, PackageSearch, CarFront, Mail, MapPin, Phone, Search, Scale } from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import PrimaryButton from '../../components/PrimaryButton'
import { colors, fonts } from '../../theme'

interface HelpSupportScreenProps {
  onBack: () => void
  onOpenLegal?: () => void
}

interface FaqItem {
  id: string
  q: string
  a: string
}
interface FaqGroup {
  id: string
  title: string
  items: FaqItem[]
}

// Ported verbatim from okA-website/src/pages/FAQ.tsx, grouped the same way.
const faqGroups: FaqGroup[] = [
  {
    id: 'how-it-works',
    title: 'How okA works',
    items: [
      {
        id: 'steps',
        q: 'What are the steps from request to delivery?',
        a: 'okA works in five steps. First, you contact okA via WhatsApp or the app with your pickup, drop-off, and contact numbers. Second, you receive your price up front before confirming anything. Third, at pickup a photo of your item is taken and shared with both sender and recipient. Fourth, you get a real-time tracking link to follow the trip or delivery. Fifth, you receive a notification the moment delivery is complete.',
      },
    ],
  },
  {
    id: 'pricing',
    title: 'How pricing works',
    items: [
      {
        id: 'price-factors',
        q: 'What determines my price?',
        a: 'Pricing is based on real factors: distance, service type, vehicle type, waiting time, and demand at the time of your request. okA does not publish fixed numeric prices, since every trip and delivery is different — you always see your price before confirming. Business clients receive full pricing details during a direct consultation.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    items: [
      { id: 'pay-how', q: 'How do I pay for a ride or delivery?', a: 'You prepay via Mobile Money (MoMo) before drop-off, so every trip and delivery is settled and confirmed up front.' },
      {
        id: 'pay-record',
        q: 'Can I get a record of my rides or payments?',
        a: 'Yes. Ride and payment reports are available on request — message okA on WhatsApp with the email address you’d like the report sent to.',
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety & incident reporting',
    items: [
      {
        id: 'emergency',
        q: 'What should I do in a medical emergency during a trip?',
        a: 'Call an ambulance immediately. If the rider hasn’t already contacted the police, call them as well. Once you and everyone involved are safe, contact okA support at support@okaghana.com so we can follow up and support any incident report.',
      },
    ],
  },
  {
    id: 'lost-item',
    title: 'Lost item',
    items: [
      {
        id: 'lost',
        q: 'I think I left something with my rider — what now?',
        a: 'Contact your rider directly first, by text or call — most lost items are resolved this way. If there’s no resolution after two days, contact support@okaghana.com with a description of the item and we’ll take it from there.',
      },
    ],
  },
]

const supportTopics: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Wrench, title: 'Technical issues', body: "Found a bug or something not working right? Let us know and we'll help." },
  { icon: PackageSearch, title: 'Lost item', body: 'Contact your rider directly first. No resolution after two days? Reach support@okaghana.com.' },
  { icon: CarFront, title: 'Ride issues', body: 'Chat with us on WhatsApp, or email support@okaghana.com.' },
]

/** Shared Help & Support screen — grouped FAQ (ported from FAQ.tsx) plus the
 *  order-tracking mock, feedback, and contact-the-team flows from the
 *  website's Support.tsx, all frontend-only mocks with no network calls. */
export default function HelpSupportScreen({ onBack, onOpenLegal }: HelpSupportScreenProps) {
  const [expanded, setExpanded] = useState<string | null>('steps')
  const [trackingId, setTrackingId] = useState('')
  const [tracked, setTracked] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id))

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) return
    setFeedbackSent(true)
  }

  const openWhatsApp = () => Linking.openURL('https://wa.me/233507153711')
  const openEmail = () => Linking.openURL('mailto:hello@okaghana.com')

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionLabel}>Track my order</Text>
        <View style={styles.trackCard}>
          <View style={styles.trackRow}>
            <Search size={14} color={colors.ink.light} />
            <TextInput
              value={trackingId}
              onChangeText={setTrackingId}
              placeholder="Enter tracking ID (e.g. OKA-4821-GH)"
              placeholderTextColor={colors.ink.light}
              style={styles.trackInput}
            />
          </View>
          <PrimaryButton label="Track" onPress={() => trackingId.trim() && setTracked(true)} />
          {tracked && (
            <Text style={styles.trackNote}>
              Live tracking for this ID appears on your active trip screen once a rider is assigned — this box is a
              quick lookup, not a live map.
            </Text>
          )}
        </View>

        <Text style={styles.sectionLabel}>Frequently asked</Text>
        {faqGroups.map((group) => (
          <View key={group.id} style={{ marginTop: 10 }}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.card}>
              {group.items.map((item, i) => {
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
          </View>
        ))}

        <Text style={styles.sectionLabel}>Support topics</Text>
        <View style={{ gap: 10, marginTop: 8 }}>
          {supportTopics.map((t) => (
            <View key={t.title} style={styles.topicCard}>
              <t.icon size={18} color={colors.primary.DEFAULT} />
              <View style={{ flex: 1 }}>
                <Text style={styles.topicTitle}>{t.title}</Text>
                <Text style={styles.topicBody}>{t.body}</Text>
              </View>
            </View>
          ))}
          <View style={styles.topicCard}>
            <MessageSquare size={18} color={colors.primary.DEFAULT} />
            <View style={{ flex: 1 }}>
              <Text style={styles.topicTitle}>Feedback & others</Text>
              <Text style={styles.topicBody}>Have thoughts on how we can do better? We read every message.</Text>
              <TextInput
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Tell us what's on your mind..."
                placeholderTextColor={colors.ink.light}
                multiline
                numberOfLines={3}
                style={styles.feedbackInput}
              />
              <Pressable onPress={handleFeedbackSubmit} disabled={feedbackSent} style={({ pressed }) => [styles.feedbackBtn, pressed && { opacity: 0.7 }]}>
                <Text style={styles.feedbackBtnText}>{feedbackSent ? 'Sent — thank you' : 'Send feedback'}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Reach the team</Text>
        <View style={styles.card}>
          <Pressable onPress={openEmail} style={styles.contactRow}>
            <Mail size={16} color={colors.primary.DEFAULT} />
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactDetail}>hello@okaghana.com</Text>
            </View>
          </Pressable>
          <View style={styles.itemBorder}>
            <View style={styles.contactRow}>
              <MapPin size={16} color={colors.primary.DEFAULT} />
              <View>
                <Text style={styles.contactLabel}>Office</Text>
                <Text style={styles.contactDetail}>Accra, Ghana</Text>
              </View>
            </View>
          </View>
          <Pressable onPress={openWhatsApp} style={[styles.contactRow, styles.itemBorder]}>
            <Phone size={16} color={colors.primary.DEFAULT} />
            <View>
              <Text style={styles.contactLabel}>WhatsApp support</Text>
              <Text style={styles.contactDetail}>0507 153 711</Text>
            </View>
          </Pressable>
        </View>

        <Pressable onPress={openWhatsApp} style={({ pressed }) => [styles.contactBtn, pressed && styles.contactBtnPressed]}>
          <LifeBuoy size={16} color={colors.primary.DEFAULT} />
          <Text style={styles.contactText}>Chat on WhatsApp</Text>
        </Pressable>

        {onOpenLegal && (
          <Pressable onPress={onOpenLegal} style={({ pressed }) => [styles.legalRow, pressed && { opacity: 0.7 }]}>
            <Scale size={14} color={colors.ink.light} />
            <Text style={styles.legalText}>Legal — Privacy, Terms, Cookies & Code of Conduct</Text>
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
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionLabel: { marginTop: 20, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.ink.light, textTransform: 'uppercase' },
  groupTitle: { fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 0.5, color: colors.primary.DEFAULT, textTransform: 'uppercase', marginBottom: 6 },
  trackCard: { marginTop: 8, borderRadius: 16, backgroundColor: colors.surface.tint, padding: 14, gap: 10 },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10 },
  trackInput: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  trackNote: { fontSize: 11, lineHeight: 16, color: colors.ink.light },
  card: { borderRadius: 16, backgroundColor: colors.surface.tint, paddingHorizontal: 14 },
  itemBorder: { borderTopWidth: 1, borderTopColor: 'rgba(11,11,15,0.06)' },
  qRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  qText: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 13, color: colors.ink.DEFAULT },
  aWrap: { paddingBottom: 14 },
  aText: { fontSize: 12, color: colors.ink.light, lineHeight: 18 },
  topicCard: { flexDirection: 'row', gap: 12, borderRadius: 16, backgroundColor: colors.surface.tint, padding: 14 },
  topicTitle: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  topicBody: { marginTop: 3, fontSize: 12, lineHeight: 17, color: colors.ink.light },
  feedbackInput: { marginTop: 10, minHeight: 60, borderRadius: 10, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 8, fontFamily: fonts.sansMedium, fontSize: 12, color: colors.ink.DEFAULT, textAlignVertical: 'top' },
  feedbackBtn: { marginTop: 8, alignSelf: 'flex-start' },
  feedbackBtnText: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.primary.DEFAULT },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  contactLabel: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.ink.DEFAULT },
  contactDetail: { marginTop: 2, fontSize: 12, color: colors.ink.light },
  contactBtn: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, backgroundColor: colors.primary.DEFAULT + '0F', paddingVertical: 14 },
  contactBtnPressed: { opacity: 0.7 },
  contactText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.primary.DEFAULT },
  legalRow: { marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 8 },
  legalText: { fontSize: 11, color: colors.ink.light, textDecorationLine: 'underline' },
})
