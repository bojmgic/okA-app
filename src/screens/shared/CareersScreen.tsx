import { View, Text, Pressable, ScrollView, StyleSheet, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Palette, Code2, Bike, Handshake, Megaphone, Newspaper, Mail } from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import { colors, fonts } from '../../theme'
import { brand } from '../../utils/brand'

interface CareersScreenProps {
  onBack: () => void
}

const departments: { icon: LucideIcon; name: string }[] = [
  { icon: Palette, name: 'okA Creative Hub' },
  { icon: Code2, name: 'Tech' },
  { icon: Bike, name: 'Rider Management Crew' },
  { icon: Handshake, name: 'Sales' },
  { icon: Megaphone, name: 'Marketing' },
  { icon: Newspaper, name: 'Public Relations' },
]

/** Ported (condensed) from okA-website/src/pages/Careers.tsx. */
export default function CareersScreen({ onBack }: CareersScreenProps) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Careers</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.heroEyebrow}>Build the future of mobility.</Text>
        <Text style={styles.heroBody}>
          A grassroots company built by people who understood the streets first — and we’re just getting
          started.
        </Text>

        <Text style={styles.sectionLabel}>{brand("Life at okA")}</Text>
        <Text style={styles.sectionTitle}>Fast-moving, street-smart, real-world.</Text>
        <Text style={styles.paragraph}>
          We are a team of fast-moving operators, designers, and builders who care deeply about real-world impact. We
          value street-smart problem solving, high operational integrity, and relentless execution.
        </Text>

        <Text style={styles.sectionLabel}>Why build with us</Text>
        <Text style={styles.sectionTitle}>Real impact, from the ground up.</Text>
        <Text style={styles.paragraph}>
          Be part of a movement that transforms lives, restores professional dignity to local workers, and builds
          digital infrastructure from the ground up. We’re looking for passionate people who want to make real
          impact.
        </Text>

        <Text style={styles.sectionLabel}>Departments</Text>
        <Text style={styles.sectionTitle}>Where you could build.</Text>
        <View style={styles.deptGrid}>
          {departments.map((d) => (
            <View key={d.name} style={styles.deptCard}>
              <View style={styles.deptIcon}>
                <d.icon size={18} color={colors.primary.DEFAULT} />
              </View>
              <Text style={styles.deptName}>{brand(d.name)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Open roles</Text>
        <Text style={styles.sectionTitle}>We grow deliberately.</Text>
        <Text style={styles.paragraph}>
          We’re a small, fast-moving team and we grow it deliberately. Reach out below and we’ll let you
          know what’s currently open — including volunteer and internship opportunities.
        </Text>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Let’s talk.</Text>
          <Text style={styles.ctaBody}>
            Interested in any of our departments? Send a letter of interest and your CV to admin@okaghana.com.
          </Text>
          <Pressable
            onPress={() => Linking.openURL('mailto:admin@okaghana.com')}
            style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.85 }]}
          >
            <Mail size={15} color={colors.primary.DEFAULT} />
            <Text style={styles.ctaBtnText}>Email admin@okaghana.com</Text>
          </Pressable>
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
  sectionLabel: { marginTop: 24, fontSize: 11, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.primary.DEFAULT, textTransform: 'uppercase' },
  sectionTitle: { marginTop: 4, fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  paragraph: { marginTop: 10, fontSize: 13, lineHeight: 20, color: colors.ink.light },
  deptGrid: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  deptCard: { width: '47%', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(11,11,15,0.08)', padding: 14 },
  deptIcon: { height: 36, width: 36, borderRadius: 18, backgroundColor: colors.surface.tint, alignItems: 'center', justifyContent: 'center' },
  deptName: { marginTop: 10, fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  ctaCard: { marginTop: 28, borderRadius: 20, backgroundColor: colors.primary.DEFAULT, padding: 20 },
  ctaTitle: { fontFamily: fonts.display, fontSize: 20, color: '#fff' },
  ctaBody: { marginTop: 8, fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.85)' },
  ctaBtn: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 999, backgroundColor: '#fff', paddingVertical: 13 },
  ctaBtnText: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.primary.DEFAULT },
})
