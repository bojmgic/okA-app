import Svg, { Path } from 'react-native-svg'
import { View } from 'react-native'

/**
 * Signature wavy top edge for bottom sheets — ported 1:1 from the web
 * app-preview's WaveCap.tsx. A plain rounded-top card reads as generic;
 * this scalloped cap is the recurring "this is unmistakably okA" detail
 * used at the top of every full-bleed bottom sheet.
 */
export default function WaveCap({ fill }: { fill: string }) {
  return (
    <View style={{ width: '100%' }}>
      <Svg width="100%" height={20} viewBox="0 0 400 20" preserveAspectRatio="none">
        <Path
          d="M0,20 L0,10 C40,-4 80,18 120,8 C160,-2 200,16 240,6 C280,-4 320,18 360,8 C380,3 390,6 400,10 L400,20 Z"
          fill={fill}
        />
      </Svg>
    </View>
  )
}
