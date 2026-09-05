import { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import { colors, fonts } from '../../theme'
import { brand } from '../../utils/brand'

interface LegalScreenProps {
  onBack: () => void
  initialDoc?: LegalDocId
}

type LegalDocId = 'privacy' | 'terms' | 'cookies' | 'code-of-conduct'

interface LegalSection {
  heading: string
  text: string
}

interface LegalEntry {
  title: string
  tabLabel: string
  body?: string
  sections?: LegalSection[]
}

// Ported verbatim from okA-website/src/pages/Legal.tsx.
const content: Record<LegalDocId, LegalEntry> = {
  privacy: {
    title: 'Privacy Policy',
    tabLabel: 'Privacy',
    body: 'This is placeholder legal copy for okA Ghana’s Privacy Policy. It outlines how rider, sender, and customer data would be collected, used, and protected. Replace with reviewed legal content before launch.',
  },
  terms: {
    title: 'Terms & Conditions',
    tabLabel: 'Terms',
    body: 'This is placeholder legal copy for okA Ghana’s Terms & Conditions governing use of the Ride and Send services. Replace with reviewed legal content before launch.',
  },
  cookies: {
    title: 'Cookie Policy',
    tabLabel: 'Cookies',
    body: 'This is placeholder legal copy for okA Ghana’s Cookie Policy, describing how cookies and similar technologies are used on this site. Replace with reviewed legal content before launch.',
  },
  'code-of-conduct': {
    title: 'Code of Conduct',
    tabLabel: 'Code of Conduct',
    sections: [
      {
        heading: 'Purpose',
        text: 'This Code of Conduct sets out the standards of behaviour expected from everyone who rides with, delivers for, or uses okA — riders, customers, vendors, and partners alike — so every interaction on the platform stays safe, respectful, and reliable.',
      },
      {
        heading: 'Rider conduct',
        text: 'Riders are expected to represent okA professionally: obey traffic laws, wear required safety gear, handle every package and passenger with care, communicate clearly about pickup and delivery status, and treat every customer with courtesy regardless of the size of the job.',
      },
      {
        heading: 'Customer conduct',
        text: 'Customers are expected to provide accurate pickup/drop-off details, treat riders with respect, avoid requesting unsafe or illegal deliveries, and pay for completed services promptly through the agreed method.',
      },
      {
        heading: 'Zero-tolerance policies',
        text: 'okA has zero tolerance for harassment, discrimination, violence, theft, fraud, or the transport of illegal goods. Any confirmed violation of these policies can result in immediate suspension or permanent removal from the platform.',
      },
      {
        heading: 'Reporting a concern',
        text: 'Riders, customers, and partners can report a safety or conduct concern through the in-app support channel or by contacting our support team. All reports are reviewed, and reporters are protected from retaliation.',
      },
      {
        heading: 'Enforcement',
        text: 'okA investigates reported violations promptly and fairly, and may take action ranging from a warning to permanent deactivation depending on severity. Serious safety violations are referred to the relevant authorities where appropriate.',
      },
    ],
  },
}

const tabOrder: LegalDocId[] = ['privacy', 'terms', 'cookies', 'code-of-conduct']

/** Shared Legal screen — segmented tabs over the same four docs the website's /legal/:doc route serves. */
export default function LegalScreen({ onBack, initialDoc = 'privacy' }: LegalScreenProps) {
  const [doc, setDoc] = useState<LegalDocId>(initialDoc)
  const entry = content[doc]

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Legal</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {tabOrder.map((id) => (
          <Pressable key={id} onPress={() => setDoc(id)} style={[styles.tab, doc === id && styles.tabActive]}>
            <Text style={[styles.tabText, doc === id && styles.tabTextActive]}>{content[id].tabLabel}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.docTitle}>{entry.title}</Text>
        {entry.body && <Text style={styles.paragraph}>{brand(entry.body)}</Text>}
        {entry.sections && (
          <View style={{ gap: 20, marginTop: 4 }}>
            {entry.sections.map((section) => (
              <View key={section.heading}>
                <Text style={styles.sectionHeading}>{section.heading}</Text>
                <Text style={styles.paragraph}>{brand(section.text)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  tabsRow: { paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  tab: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.surface.tint },
  tabActive: { backgroundColor: colors.primary.DEFAULT },
  tabText: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.ink.light },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  docTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.ink.DEFAULT },
  sectionHeading: { fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  paragraph: { marginTop: 8, fontSize: 13, lineHeight: 20, color: colors.ink.light },
})
