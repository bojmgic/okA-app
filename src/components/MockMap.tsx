import { useEffect } from 'react'
import Svg, { Rect, Circle, Path, G, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg'
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing } from 'react-native-reanimated'
import { StyleSheet, View } from 'react-native'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const ROUTE_D =
  'M90,620 L100,600 L100,258 Q100,242 116,242 L234,242 Q250,242 250,226 L250,142 Q250,126 266,126 L300,70'

const NEARBY_VEHICLE_SPOTS = [
  { x: 118, y: 330 },
  { x: 268, y: 400 },
  { x: 150, y: 470 },
  { x: 232, y: 300 },
]

const BLOCKS: [number, number, number, number, boolean][] = [
  [20, 30, 70, 90, false], [130, 20, 90, 60, false], [260, 40, 110, 70, false], [30, 150, 100, 80, false],
  [180, 130, 70, 100, true], [230, 150, 55, 60, true], [300, 160, 80, 90, false], [40, 260, 90, 70, false],
  [200, 260, 60, 90, true], [290, 280, 90, 60, false], [20, 370, 80, 100, false], [150, 380, 90, 60, false],
  [280, 380, 100, 80, false], [30, 500, 100, 70, false], [180, 490, 80, 90, false], [300, 500, 80, 70, false],
]

function Pulse({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1)
  }, [progress])
  const animatedProps = useAnimatedProps(() => ({
    r: r + progress.value * r * 1.4,
    opacity: 0.35 * (1 - progress.value),
  }))
  return <AnimatedCircle cx={cx} cy={cy} fill={color} animatedProps={animatedProps} />
}

/**
 * Simplified React Native port of MockMap.tsx from the web app-preview —
 * same illustrated-city language (streets, blocks, park, water, route,
 * pins, you-are-here pulse) rebuilt on react-native-svg. The web version's
 * per-frame `getPointAtLength()` bike-follows-the-route animation and the
 * floating zoom/recenter control overlay aren't ported yet (both are
 * meaningfully more work against RN's animation APIs) — this keeps the map
 * static with a still marker at the route start and a pulsing you-are-here
 * dot, which is a reasonable first pass to build on rather than a blocker
 * for shipping the rest of the screens.
 */
export default function MockMap({
  showRoute = false,
  showYouAreHere = false,
  showNearbyVehicles = false,
}: {
  showRoute?: boolean
  showYouAreHere?: boolean
  showNearbyVehicles?: boolean
}) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <RadialGradient id="vignette" cx="50%" cy="35%" r="75%">
            <Stop offset="0%" stopColor="#000" stopOpacity={0} />
            <Stop offset="100%" stopColor="#000" stopOpacity={0.08} />
          </RadialGradient>
        </Defs>
        <Rect width={400} height={700} fill="#E7EEFC" />

        {/* Park */}
        <Path d="M-20,80 C40,50 90,90 60,150 C30,210 -30,190 -20,80 Z" fill="#D7EEDD" stroke="#0057E7" strokeOpacity={0.15} strokeWidth={1.5} />

        {/* Water */}
        <Path
          d="M330,420 C400,390 430,460 400,540 C370,620 300,600 300,520 C300,470 300,440 330,420 Z"
          fill="#CFE3F9"
          stroke="#0057E7"
          strokeOpacity={0.15}
          strokeWidth={1.5}
        />

        {/* City blocks */}
        {BLOCKS.map(([x, y, w, h, core], i) => (
          <G key={i}>
            <Rect x={x + 3} y={y + 5} width={w} height={h} rx={10} fill="#00205C" fillOpacity={0.1} />
            <Rect x={x} y={y} width={w} height={h} rx={10} fill={core ? '#C3D3F4' : '#D7E2F7'} stroke="#0057E7" strokeOpacity={core ? 0.22 : 0.14} strokeWidth={1.5} />
          </G>
        ))}

        {/* Streets */}
        <G stroke="#F4F7FD" strokeWidth={11} strokeLinecap="round" fill="none">
          <Path d="M0,120 C100,116 140,126 220,120 C300,114 340,124 400,120" />
          <Path d="M0,242 C90,238 160,248 240,242 C310,236 350,246 400,240" />
          <Path d="M0,358 C100,354 150,364 230,358 C300,352 350,362 400,358" />
          <Path d="M0,481 C90,477 160,487 240,481 C310,475 350,485 400,480" />
          <Path d="M0,579 C100,575 150,585 230,579 C300,573 350,583 400,580" />
          <Path d="M100,0 C96,100 106,140 100,220 C94,300 104,340 100,420 C96,500 106,560 100,700" />
          <Path d="M250,0 C246,90 256,160 250,240 C244,310 254,350 250,420 C246,500 256,560 250,700" />
        </G>
        <Rect width={400} height={700} fill="url(#vignette)" />

        {/* Compass */}
        <G transform="translate(368 44)" opacity={0.4}>
          <Circle r={13} fill="white" stroke="#0057E7" strokeWidth={1.3} />
          <Path d="M0,-8 L3,0 L0,3 L-3,0 Z" fill="#0057E7" />
          <SvgText x={0} y={-16} textAnchor="middle" fontSize={7} fontWeight="700" fill="#00205C">
            N
          </SvgText>
        </G>

        {showNearbyVehicles &&
          NEARBY_VEHICLE_SPOTS.map((spot, i) => (
            <G key={i}>
              <Pulse cx={spot.x} cy={spot.y} r={9} color="#0057E7" />
              <Circle cx={spot.x} cy={spot.y} r={4} fill="#0057E7" fillOpacity={0.5} />
            </G>
          ))}

        {showYouAreHere && (
          <G>
            <Pulse cx={180} cy={400} r={10} color="#0057E7" />
            <Circle cx={180} cy={400} r={7} fill="#0057E7" stroke="white" strokeWidth={3} />
          </G>
        )}

        {showRoute && (
          <>
            <Path d={ROUTE_D} fill="none" stroke="#0057E7" strokeWidth={5} strokeLinecap="round" strokeOpacity={0.22} />
            <Path d={ROUTE_D} fill="none" stroke="#0057E7" strokeWidth={5} strokeLinecap="round" />
            <Circle cx={90} cy={620} r={8} fill="#0057E7" stroke="white" strokeWidth={3} />
            <Circle cx={300} cy={70} r={8} fill="#0057E7" stroke="white" strokeWidth={3} />
          </>
        )}
      </Svg>
    </View>
  )
}
