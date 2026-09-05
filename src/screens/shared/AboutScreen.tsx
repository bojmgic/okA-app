import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Users, Handshake, Building2, ShieldCheck, MapPin, KeyRound } from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import PrimaryButton from '../../components/PrimaryButton'
import { colors, fonts } from '../../theme'

interface AboutScreenProps {
  onBack: () => void
  onOpenCareers: () => void
  onOpenNewsroom: () => void
}

const peopleItems = [
  { initials: 'AO', name: 'Arhin Kofi Owusu', title: 'Administration and Revenue Dept. (Officer)' },
  { initials: 'WK', name: 'Wilson S. Klido', title: 'Operations Dept. (Officer)' },
  { initials: 'WT', name: 'Wisdom Tetteh', title: 'Information & Marketing Dept. (Officer)' },
]

const impactItems: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Users, title: 'Rider Elevation', body: 'Transforming informal street hustle into a recognised, respected career.' },
  {
    icon: Building2,
    title: 'Communities',
    body: 'Every delivery creates opportunity by connecting businesses and customers with local riders — creating jobs, empowering youths, and keeping value within communities.',
  },
  { icon: Handshake, title: 'Grassroots', body: 'Supporting SMEs and local business through affordable logistics to serve more customers and grow.' },
]

const safetyPillars: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: ShieldCheck, title: 'Verified Riders', body: 'Ghana Card identity checks and safety onboarding for every rider before their first trip.' },
  { icon: MapPin, title: 'Real-Time Tracking', body: 'Live map visibility from pickup to drop-off, for every ride and every delivery.' },
  { icon: KeyRound, title: '4-Digit Parcel Verification', body: 'A mandatory recipient PIN so packages land in the right hands, every time.' },
]

/** Ported from About.tsx on the web — mission/story/people/impact, condensed for a single scrollable native screen. */
export default function AboutScreen({ onBack, onOpenCareers, onOpenNewsroom }: AboutScreenProps) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>About okA</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.heroEyebrow}>Ghana in motion, by design.</Text>
        <Text style={styles.heroBody}>
          okA Ghana is a logistics company providing delivery, mobility and business logistics solutions through
          people and technology — making every movement easily trackable, manageable and reliable.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Operating country</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>200+</Text>
            <Text style={styles.statLabel}>Partners</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Customers</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Our story — 2025</Text>
        <Text style={styles.sectionTitle}>From a basketball court to a movement.</Text>
        <Text style={styles.paragraph}>
          The story of okA didn&rsquo;t start in a corporate boardroom. It began on a basketball court after a match
          between friends. A simple question was thrown into the air: What can we build to serve society if we have
          zero capital, relying only on dream and skill?
        </Text>
        <Text style={styles.paragraph}>
          Looking closely at the Ghanaian streets, the founders saw two major problems: the heavy stigma surrounding
          &ldquo;Okada&rdquo; riders whose professional dignity was routinely overlooked, and a logistics system where
          customers had to rely on luck and &ldquo;faith&rdquo; just to get packages delivered safely. okA was born to
          change that.
        </Text>
        <Text style={styles.paragraph}>
          Refining the street language from &ldquo;Okada&rdquo; to &ldquo;Okadah&rdquo; and finally to okA, the
          movement evolved into a high-standard logistics platform built on community and modern technology. Growing
          organically through simple WhatsApp and phone calls, okA brought over 150 riders into the fold and
          completed hundreds of deliveries on pure trust and grit.
        </Text>
        <Text style={styles.paragraph}>
          Today, okA combines that grassroots foundation with digital infrastructure: taking a label once used in
          shame and turning it into a crown of service.
        </Text>

        <View style={styles.growthCard}>
          <Text style={styles.growthEyebrow}>Our Growth — 2026</Text>
          <Text style={styles.growthBody}>
            Today, okA continues to grow from that foundation. Every successful delivery, every satisfied customer
            and every rider who proudly represents the okA brand adds another brick to what we are building.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Founders</Text>
        <Text style={styles.sectionTitle}>People before capital.</Text>
        <Text style={styles.paragraph}>
          Founded by a group of Ghanaian friends, engineers, and visionaries, the team proved that people don&rsquo;t
          follow money; they follow heart. Driven by human potential, the founders built okA to elevate rider
          dignity, provide enterprise-grade reliability for local commerce, and show that &ldquo;nothing&rdquo;
          becomes &ldquo;something&rdquo; when a community moves together.
        </Text>
        <View style={styles.quoteBlock}>
          <Text style={styles.quoteText}>
            &ldquo;Great movements don&rsquo;t begin when everything is available. They begin when people agree on a
            purpose, take the first step, and continue one step at a time.&rdquo;
          </Text>
        </View>

        <Text style={styles.sectionLabel}>The People</Text>
        <Text style={styles.sectionTitle}>The people who keep okA moving.</Text>
        <View style={{ gap: 10, marginTop: 12 }}>
          {peopleItems.map((person) => (
            <View key={person.name} style={styles.personCard}>
              <View style={styles.personAvatar}>
                <Text style={styles.personInitials}>{person.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.personTitle}>{person.title}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Mission & Vision</Text>
        <View style={styles.mvCard}>
          <Text style={styles.mvEyebrow}>Mission</Text>
          <Text style={styles.mvText}>
            Elevating the dignity of riders while transforming mobility and logistics through human-centred,
            technology-enabled services built on excellence rather than chance.
          </Text>
        </View>
        <View style={styles.mvCard}>
          <Text style={styles.mvEyebrow}>Vision</Text>
          <Text style={styles.mvText}>
            A trusted logistics network connecting partners through seamless movement of people and goods.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Impact</Text>
        <Text style={styles.sectionTitle}>Built with accountability.</Text>
        <View style={{ gap: 10, marginTop: 12 }}>
          {impactItems.map((item) => (
            <View key={item.title} style={styles.impactCard}>
              <item.icon size={20} color={colors.primary.DEFAULT} />
              <Text style={styles.impactTitle}>{item.title}</Text>
              <Text style={styles.impactBody}>{item.body}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Safety</Text>
        <Text style={styles.sectionTitle}>Your safety. Our priority.</Text>
        <View style={{ gap: 10, marginTop: 12 }}>
          {safetyPillars.map((pillar) => (
            <View key={pillar.title} style={styles.impactCard}>
              <pillar.icon size={20} color={colors.primary.DEFAULT} />
              <Text style={styles.impactTitle}>{pillar.title}</Text>
              <Text style={styles.impactBody}>{pillar.body}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Move with us.</Text>
          <Text style={styles.ctaBody}>
            Ride, send, or build alongside a network that&rsquo;s scaling Ghana&rsquo;s mobility from the ground up.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <PrimaryButton label="See open roles" onPress={onOpenCareers} style={{ flex: 1 }} />
            <PrimaryButton label="Newsroom" tone="dark" onPress={onOpenNewsroom} style={{ flex: 1 }} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  heroEyebrow: { marginTop: 4, fontFamily: fonts.display, fontSize: 22, color: colors.ink.DEFAULT },
  heroBody: { marginTop: 8, fontSize: 13, lineHeight: 20, color: colors.ink.light },
  statsRow: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(11,11,15,0.08)', paddingVertical: 16 },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontFamily: fonts.display, fontSize: 20, color: colors.primary.DEFAULT },
  statLabel: { marginTop: 2, fontSize: 10, color: colors.ink.light, textAlign: 'center' },
  sectionLabel: { marginTop: 24, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.primary.DEFAULT, textTransform: 'uppercase' },
  sectionTitle: { marginTop: 4, fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  paragraph: { marginTop: 10, fontSize: 13, lineHeight: 20, color: colors.ink.light },
  growthCard: { marginTop: 16, borderRadius: 16, backgroundColor: colors.surface.tint, padding: 16 },
  growthEyebrow: { fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.primary.DEFAULT, textTransform: 'uppercase' },
  growthBody: { marginTop: 8, fontSize: 13, lineHeight: 20, color: colors.ink.light },
  quoteBlock: { marginTop: 14, borderLeftWidth: 3, borderLeftColor: colors.primary.DEFAULT, paddingLeft: 14 },
  quoteText: { fontFamily: fonts.display, fontSize: 15, fontStyle: 'italic', color: colors.ink.DEFAULT, lineHeight: 22 },
  personCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, backgroundColor: colors.surface.tint, padding: 14 },
  personAvatar: { height: 44, width: 44, borderRadius: 22, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' },
  personInitials: { fontFamily: fonts.display, fontSize: 14, color: '#fff' },
  personName: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  personTitle: { marginTop: 2, fontSize: 11, color: colors.ink.light },
  mvCard: { marginTop: 10, borderRadius: 16, backgroundColor: colors.surface.tint, padding: 16 },
  mvEyebrow: { fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.primary.DEFAULT, textTransform: 'uppercase' },
  mvText: { marginTop: 8, fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20, color: colors.ink.DEFAULT },
  impactCard: { borderRadius: 16, backgroundColor: colors.navy.DEFAULT, padding: 16 },
  impactTitle: { marginTop: 8, fontFamily: fonts.sansSemibold, fontSize: 14, color: '#fff' },
  impactBody: { marginTop: 4, fontSize: 12, lineHeight: 18, color: 'rgba(255,255,255,0.7)' },
  ctaCard: { marginTop: 28, borderRadius: 20, backgroundColor: colors.primary.DEFAULT, padding: 20 },
  ctaTitle: { fontFamily: fonts.display, fontSize: 20, color: '#fff' },
  ctaBody: { marginTop: 8, fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.85)' },
})
