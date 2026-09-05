import { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Mic } from 'lucide-react-native'
import IconButton from '../../components/IconButton'
import { colors, fonts } from '../../theme'

interface NewsroomScreenProps {
  onBack: () => void
}

interface Story {
  id: string
  category: 'Stories' | 'Updates' | 'Insights' | 'Podcast'
  headline: string
  excerpt: string
  date: string
  featured?: boolean
}

// Ported verbatim from okA-website/src/data/stories.ts — placeholder editorial
// content, plausible mock headlines rather than real news.
const stories: Story[] = [
  {
    id: 'rider-spotlight-bernard',
    category: 'Stories',
    headline: 'From stigma to stability: a rider’s road with okA',
    excerpt: 'Bernard joined okA in its earliest WhatsApp-group days. Two years on, he talks about what changed — for him and for how Accra sees riders.',
    date: 'July 2026',
    featured: true,
  },
  {
    id: 'app-update-tracking',
    category: 'Updates',
    headline: 'Live tracking links are now faster across all service classes',
    excerpt: 'A behind-the-scenes look at the update that shaved seconds off every tracking link generated.',
    date: 'June 2026',
  },
  {
    id: 'community-market-day',
    category: 'Stories',
    headline: 'Inside a Makola market-day delivery run',
    excerpt: 'What it takes to move produce, textiles, and everything between before the afternoon rain.',
    date: 'May 2026',
  },
  {
    id: 'insight-last-mile',
    category: 'Insights',
    headline: 'Why last-mile logistics look different in Accra than anywhere else',
    excerpt: 'A short field note on building for Ghana’s streets, not importing a template built for someone else’s.',
    date: 'April 2026',
  },
]

const categories = ['Stories', 'Updates', 'Insights', 'Podcast'] as const
type Category = (typeof categories)[number]

/** Ported (condensed) from okA-website/src/pages/Newsroom.tsx. */
export default function NewsroomScreen({ onBack }: NewsroomScreenProps) {
  const [category, setCategory] = useState<Category>('Stories')
  const featured = stories.find((s) => s.featured)
  const rest = stories.filter((s) => !s.featured)
  const filtered = category === 'Stories' ? rest : rest.filter((s) => s.category === category)

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Newsroom</Text>
      </View>

      <Text style={[styles.heroEyebrow, { paddingHorizontal: 20 }]}>The okA Chronicle.</Text>
      <Text style={[styles.heroBody, { paddingHorizontal: 20 }]}>
        Rider spotlights, app updates, and community stories from across the okA network — representative content,
        not live press releases.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {categories.map((c) => (
          <Pressable key={c} onPress={() => setCategory(c)} style={[styles.tab, category === c && styles.tabActive]}>
            <Text style={[styles.tabText, category === c && styles.tabTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {featured && (
          <View style={styles.featuredCard}>
            <Text style={styles.featuredTag}>Featured — {featured.date}</Text>
            <Text style={styles.featuredHeadline}>{featured.headline}</Text>
            <Text style={styles.featuredExcerpt}>{featured.excerpt}</Text>
          </View>
        )}

        {category === 'Podcast' ? (
          <View style={styles.emptyCard}>
            <Mic size={20} color={colors.primary.DEFAULT} />
            <Text style={styles.emptyTitle}>The okA Chronicle podcast is coming soon.</Text>
            <Text style={styles.emptyBody}>Episodes on riders, growth, and the future of mobility in Ghana.</Text>
          </View>
        ) : filtered.length > 0 ? (
          <View style={{ gap: 10, marginTop: 10 }}>
            {filtered.map((s) => (
              <View key={s.id} style={styles.storyCard}>
                <Text style={styles.storyDate}>{s.date}</Text>
                <Text style={styles.storyHeadline}>{s.headline}</Text>
                <Text style={styles.storyExcerpt}>{s.excerpt}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyBody}>More {category.toLowerCase()} coming soon.</Text>
        )}

        <Pressable onPress={() => Linking.openURL('mailto:pradmin@okaghana.com')} style={{ marginTop: 24 }}>
          <Text style={styles.footerText}>
            For media inquiries, contact <Text style={styles.footerLink}>pradmin@okaghana.com</Text>. This address
            responds only to media inquiries — for customer support, use Help & Support in the app.
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  heroEyebrow: { fontFamily: fonts.display, fontSize: 20, color: colors.ink.DEFAULT },
  heroBody: { marginTop: 6, fontSize: 12, lineHeight: 18, color: colors.ink.light },
  tabsRow: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  tab: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.surface.tint },
  tabActive: { backgroundColor: colors.primary.DEFAULT },
  tabText: { fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.ink.light },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  featuredCard: { borderRadius: 20, backgroundColor: colors.navy.DEFAULT, padding: 18 },
  featuredTag: { fontSize: 10, fontFamily: fonts.sansBold, letterSpacing: 1, color: colors.primary[300], textTransform: 'uppercase' },
  featuredHeadline: { marginTop: 8, fontFamily: fonts.display, fontSize: 17, color: '#fff', lineHeight: 22 },
  featuredExcerpt: { marginTop: 8, fontSize: 12, lineHeight: 18, color: 'rgba(255,255,255,0.7)' },
  storyCard: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(11,11,15,0.08)', padding: 14 },
  storyDate: { fontSize: 10, color: colors.ink.light, textTransform: 'uppercase', letterSpacing: 0.5 },
  storyHeadline: { marginTop: 6, fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT, lineHeight: 19 },
  storyExcerpt: { marginTop: 4, fontSize: 12, lineHeight: 17, color: colors.ink.light },
  emptyCard: { marginTop: 14, alignItems: 'flex-start', gap: 8, borderRadius: 16, backgroundColor: colors.surface.tint, padding: 18 },
  emptyTitle: { fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  emptyBody: { marginTop: 14, fontSize: 12, color: colors.ink.light },
  footerText: { fontSize: 11, lineHeight: 16, color: colors.ink.light },
  footerLink: { color: colors.primary.DEFAULT, fontFamily: fonts.sansSemibold },
})
