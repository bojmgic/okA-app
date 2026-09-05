import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bike, Tag, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react-native'
import { notifications as mockNotifications } from '../../data/appPreview'
import IconButton from '../../components/IconButton'
import { colors, fonts } from '../../theme'

interface NotificationsScreenProps {
  onBack: () => void
}

const kindIcon = { trip: Bike, promo: Tag, account: ShieldCheck, system: Sparkles } as const

/** Ported from NotificationsScreen.tsx on the web app-preview — shared by both personas. */
export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [items, setItems] = useState(mockNotifications)
  const unreadCount = items.filter((n) => n.unread).length

  const markRead = (id: string) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={onBack} accessibilityLabel="Back" />
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Sparkles size={22} color={colors.ink.light} />
          </View>
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptyBody}>New trip updates and offers will show up here.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          <Animated.View entering={FadeIn.duration(300)}>
          {items.map((n, i) => {
            const Icon = kindIcon[n.kind]
            return (
              <Animated.View key={n.id} entering={FadeInDown.delay(i * 40).duration(250)}>
                <Pressable
                  onPress={() => markRead(n.id)}
                  style={({ pressed }) => [styles.card, n.unread && styles.cardUnread, pressed && styles.cardPressed]}
                >
                  <View style={styles.cardIcon}>
                    <Icon size={16} color={colors.primary.DEFAULT} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardTitle}>{n.title}</Text>
                      {n.unread && <View style={styles.dot} />}
                    </View>
                    <Text style={styles.cardBody}>{n.body}</Text>
                    <Text style={styles.cardTime}>{n.time}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            )
          })}
          </Animated.View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink.DEFAULT },
  badge: { marginLeft: 'auto', height: 20, minWidth: 20, borderRadius: 10, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeText: { color: '#fff', fontSize: 10, fontFamily: fonts.sansBold },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIcon: { height: 56, width: 56, borderRadius: 28, backgroundColor: colors.surface.tint, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginTop: 12, fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  emptyBody: { marginTop: 4, fontSize: 12, color: colors.ink.light, textAlign: 'center' },
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 8 },
  card: { flexDirection: 'row', gap: 12, borderRadius: 16, backgroundColor: colors.surface.tint, padding: 14 },
  cardUnread: { backgroundColor: colors.primary.DEFAULT + '0F' },
  cardPressed: { transform: [{ scale: 0.97 }] },
  cardIcon: { height: 36, width: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontFamily: fonts.sansSemibold, fontSize: 13, color: colors.ink.DEFAULT },
  dot: { height: 6, width: 6, borderRadius: 3, backgroundColor: colors.primary.DEFAULT },
  cardBody: { marginTop: 2, fontSize: 12, color: colors.ink.light },
  cardTime: { marginTop: 4, fontSize: 10, color: colors.ink.light },
})
