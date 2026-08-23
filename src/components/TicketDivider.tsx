import { View, StyleSheet } from 'react-native'
import Svg, { Line } from 'react-native-svg'

/**
 * The tear-line of a physical ticket stub — a dashed rule with two punched
 * "holes" at either end, matching TicketDivider.tsx on the web app-preview.
 * `holeColor` should match the surrounding card's own background so the
 * circles read as real die-cut holes rather than colored dots.
 */
export default function TicketDivider({ holeColor, style }: { holeColor: string; style?: object }) {
  return (
    <View style={[styles.row, style]}>
      <View style={[styles.hole, { backgroundColor: holeColor }]} />
      <Svg height={2} width="100%" style={{ flex: 1 }}>
        <Line x1="0" y1="1" x2="100%" y2="1" stroke="rgba(11,11,15,0.15)" strokeWidth={2} strokeDasharray="6,5" />
      </Svg>
      <View style={[styles.hole, { backgroundColor: holeColor }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -20,
  },
  hole: {
    height: 20,
    width: 10,
    borderRadius: 10,
  },
})
