import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Check, ThumbsUp, ThumbsDown } from 'lucide-react-native'
import { VehicleGhost } from '../../components/GhostSilhouette'
import PrimaryButton from '../../components/PrimaryButton'
import { colors, fonts } from '../../theme'

interface RatingScreenProps {
  subjectName: string
  subjectDetail: string
  fareGHS: number
  tripLabel: string
  tags: string[]
  onDone: () => void
}

/** Trip receipt + rating in one screen — ported from RatingScreen.tsx on the web app-preview. */
export default function RatingScreen({ subjectName, subjectDetail, fareGHS, tripLabel, tags, onDone }: RatingScreenProps) {
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const initials = subjectName.split(' ').map((n) => n[0]).join('')

  const toggleTag = (tag: string) => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <VehicleGhost top={40} left={70} width={200} rotate={-5} opacity={0.1} />

      <View style={styles.summary}>
        <View style={styles.checkBadge}>
          <Check size={22} color="#fff" />
        </View>
        <Text style={styles.tripLabel}>{tripLabel} complete</Text>
        <Text style={styles.fare}>GHS {fareGHS}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.rateLabel}>Rate {subjectName}</Text>
        <Text style={styles.subjectDetail}>{subjectDetail}</Text>

        <View style={styles.thumbsRow}>
          <Pressable
            onPress={() => setRating('down')}
            hitSlop={6}
            accessibilityLabel="Rate thumbs down"
            style={({ pressed }) => [styles.thumbBtn, rating === 'down' && styles.thumbBtnDownActive, pressed && styles.thumbPressed]}
          >
            <ThumbsDown size={26} color={rating === 'down' ? '#DC2626' : colors.ink.light} fill={rating === 'down' ? '#DC2626' : 'transparent'} />
          </Pressable>
          <Pressable
            onPress={() => setRating('up')}
            hitSlop={6}
            accessibilityLabel="Rate thumbs up"
            style={({ pressed }) => [styles.thumbBtn, rating === 'up' && styles.thumbBtnUpActive, pressed && styles.thumbPressed]}
          >
            <ThumbsUp size={26} color={rating === 'up' ? colors.primary.DEFAULT : colors.ink.light} fill={rating === 'up' ? colors.primary.DEFAULT : 'transparent'} />
          </Pressable>
        </View>

        {rating !== null && (
          <View style={styles.tagRow}>
            {tags.map((tag) => {
              const active = selectedTags.includes(tag)
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={({ pressed }) => [styles.tag, active && styles.tagActive, pressed && styles.tagPressed]}
                >
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                </Pressable>
              )
            })}
          </View>
        )}

        <PrimaryButton label="Submit rating" disabled={rating === null} onPress={onDone} style={{ marginTop: 20 }} />
        <Pressable onPress={onDone} style={({ pressed }) => [pressed && styles.skipPressed]}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary[900], alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  summary: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  checkBadge: { height: 48, width: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tripLabel: { fontFamily: fonts.sansMedium, fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  fare: { marginTop: 4, fontFamily: fonts.display, fontSize: 30, color: '#fff' },
  card: { width: '100%', borderRadius: 24, backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  avatar: { height: 56, width: 56, borderRadius: 28, backgroundColor: colors.primary[900], alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 18, color: '#fff' },
  rateLabel: { marginTop: 10, fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  subjectDetail: { fontSize: 12, color: colors.ink.light },
  thumbsRow: { flexDirection: 'row', gap: 16, marginTop: 16 },
  thumbBtn: { height: 56, width: 56, borderRadius: 28, borderWidth: 2, borderColor: 'rgba(11,11,15,0.15)', alignItems: 'center', justifyContent: 'center' },
  thumbBtnUpActive: { borderColor: colors.primary.DEFAULT, backgroundColor: colors.primary.DEFAULT + '1A' },
  thumbBtnDownActive: { borderColor: '#DC2626', backgroundColor: '#FEE2E2' },
  thumbPressed: { transform: [{ scale: 0.88 }] },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 16 },
  tag: { borderRadius: 999, borderWidth: 1, borderColor: 'rgba(11,11,15,0.15)', paddingHorizontal: 12, paddingVertical: 6 },
  tagActive: { borderColor: colors.primary.DEFAULT, backgroundColor: colors.primary.DEFAULT + '1A' },
  tagPressed: { transform: [{ scale: 0.96 }] },
  tagText: { fontSize: 11, fontFamily: fonts.sansMedium, color: colors.ink.light },
  tagTextActive: { color: colors.primary.DEFAULT },
  skip: { marginTop: 12, textAlign: 'center', fontSize: 12, fontFamily: fonts.sansMedium, color: colors.ink.light },
  skipPressed: { opacity: 0.6 },
})
