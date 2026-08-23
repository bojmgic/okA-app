import { View, Pressable, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import type { LucideIcon } from 'lucide-react-native'
import { colors, fonts, primaryButtonGradient } from '../theme'

export interface TabBarItem {
  key: string
  icon: LucideIcon
  label: string
  onPress?: () => void
}

interface TabBarProps {
  items: TabBarItem[]
  active: string
}

/**
 * Floating capsule tab bar with a gradient pill behind the active item —
 * ported from TabBar.tsx on the web app-preview (which used a Framer Motion
 * `layoutId` morph between tabs; here the pill just fades in per tab, which
 * reads just as intentional without needing shared-element layout animation
 * wired up on day one). Replaces the flat four-icons-with-labels row every
 * competitor ships.
 */
export default function TabBar({ items, active }: TabBarProps) {
  return (
    <View style={styles.row}>
      {items.map((item) => {
        const isActive = item.key === active
        return (
          <Pressable key={item.key} onPress={item.onPress} style={styles.tab}>
            {isActive ? (
              <LinearGradient colors={primaryButtonGradient.colors} locations={primaryButtonGradient.locations} style={styles.pill}>
                <item.icon size={17} color="#fff" />
                <Text style={styles.activeLabel}>{item.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactive}>
                <item.icon size={17} color={colors.ink.light + '80'} />
              </View>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.surface.tint,
    borderRadius: 999,
    padding: 6,
  },
  tab: {},
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  inactive: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  activeLabel: {
    color: '#fff',
    fontFamily: fonts.sansSemibold,
    fontSize: 12,
  },
})
