import { useEffect, useState } from 'react'
import Svg, {
  Rect,
  Circle,
  Path,
  G,
  Text as SvgText,
  Defs,
  RadialGradient,
  LinearGradient,
  Pattern,
  Line,
  Stop,
  Image as SvgImage,
} from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import { StyleSheet, View, Pressable } from 'react-native'
import { Plus, Minus, LocateFixed } from 'lucide-react-native'
import { colors } from '../theme'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedG = Animated.createAnimatedComponent(G)
const AnimatedPath = Animated.createAnimatedComponent(Path)

const okaMotorbikeTopDown = require('../assets/vehicles/oka-motorbike-topdown.webp')

const ROUTE_D =
  'M90,620 L100,600 L100,258 Q100,242 116,242 L234,242 Q250,242 250,226 L250,142 Q250,126 266,126 L300,70'
const RIDE_DURATION_MS = 6000
// Matches web's motion.path draw-on transition duration (1.1s).
const DRAW_ON_DURATION_MS = 1100

// Positions this ambient decoration is framed/zoomed around — mirrors the
// web version's `focus` prop.
type Focus = 'wide' | 'route' | 'pickup'
const FOCUS_CENTER: Record<Focus, [number, number]> = {
  wide: [200, 350],
  route: [178, 330],
  pickup: [95, 560],
}
// Three zoom stops (viewBox width as a fraction of the full 400x700 canvas) —
// same stops as the web version.
const ZOOM_SCALES = [1, 0.76, 0.56]

// Mirrors web's NEARBY_VEHICLE_SPOTS — fixed spots + per-spot rotation/delay
// so the idle "riders nearby" markers read as a real overhead motorbike
// photo rather than a plain dot.
const NEARBY_VEHICLE_SPOTS: { x: number; y: number; rotate: number; delay: number }[] = [
  { x: 118, y: 330, rotate: -18, delay: 0 },
  { x: 268, y: 400, rotate: 32, delay: 0.6 },
  { x: 150, y: 470, rotate: -60, delay: 1.2 },
  { x: 232, y: 300, rotate: 10, delay: 1.8 },
]

// Web's full 18-block array, including the per-block `rotate` value —
// [x, y, w, h, rotate, core].
const BLOCKS: [number, number, number, number, number, boolean][] = [
  [20, 30, 70, 90, -2, false], [130, 20, 90, 60, 3, false], [260, 40, 110, 70, -1, false], [30, 150, 100, 80, 2, false],
  [180, 130, 70, 100, -3, true], [230, 150, 55, 60, 2, true], [300, 160, 80, 90, 1, false], [40, 260, 90, 70, -2, false],
  [200, 260, 60, 90, 3, true], [290, 280, 90, 60, -1, false], [20, 370, 80, 100, 2, false], [150, 380, 90, 60, -2, false],
  [280, 380, 100, 80, 1, false], [30, 500, 100, 70, -3, false], [180, 490, 80, 90, 2, false], [300, 500, 80, 70, -1, false],
  [40, 610, 90, 70, 3, false], [200, 600, 70, 80, -2, false],
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

// --- Ambient background traffic dots -------------------------------------
// Web drives these with framer-motion `animate={{ cx: [a, b, a], cy: [c, d,
// c] }}` — a there-and-back tween. react-native-svg has no equivalent
// keyframe-array API, so this reproduces the same there-and-back motion with
// a single Reanimated progress value that yoyos 0→1→0 (via `withRepeat(...,
// -1, true)`), interpolated into cx/cy. Because every waypoint list here
// starts and ends on the same value, one yoyo cycle == one "a → b → a" loop.
// `duration` below is the *total* web cycle time; each Reanimated leg runs
// half of it so the full there-and-back matches.
function useAmbientDot(cxRange: [number, number], cyRange: [number, number], totalDurationMs: number, delayMs: number) {
  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: totalDurationMs / 2, easing: Easing.inOut(Easing.ease) }), -1, true),
    )
  }, [progress])
  return useAnimatedProps(() => ({
    cx: interpolate(progress.value, [0, 1], cxRange),
    cy: interpolate(progress.value, [0, 1], cyRange),
  }))
}

// --- Route point sampling ----------------------------------------------
// react-native-svg has no `getPointAtLength()` (unlike the web DOM), so the
// "bike rides along the route" animation can't sample the path's own
// geometry each frame the way the web version does. Instead the fixed
// ROUTE_D path (only L and Q segments, both easy to sample analytically) is
// pre-walked once at module load into ~200 arc-length-evenly-spaced points,
// each carrying a heading angle from its neighbors' tangent — then the
// per-frame animation just interpolates between two of those precomputed
// points, driven by a Reanimated shared value on the UI thread. The same
// precomputed points are reused below to get the route's total length for
// the draw-on reveal (see the pathLength note there).
type Pt = { x: number; y: number }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y)
function quadPoint(p0: Pt, c: Pt, p1: Pt, t: number): Pt {
  const mt = 1 - t
  return { x: mt * mt * p0.x + 2 * mt * t * c.x + t * t * p1.x, y: mt * mt * p0.y + 2 * mt * t * c.y + t * t * p1.y }
}

const ROUTE_SEGMENTS: Array<{ type: 'L'; p0: Pt; p1: Pt } | { type: 'Q'; p0: Pt; c: Pt; p1: Pt }> = [
  { type: 'L', p0: { x: 90, y: 620 }, p1: { x: 100, y: 600 } },
  { type: 'L', p0: { x: 100, y: 600 }, p1: { x: 100, y: 258 } },
  { type: 'Q', p0: { x: 100, y: 258 }, c: { x: 100, y: 242 }, p1: { x: 116, y: 242 } },
  { type: 'L', p0: { x: 116, y: 242 }, p1: { x: 234, y: 242 } },
  { type: 'Q', p0: { x: 234, y: 242 }, c: { x: 250, y: 242 }, p1: { x: 250, y: 226 } },
  { type: 'L', p0: { x: 250, y: 226 }, p1: { x: 250, y: 142 } },
  { type: 'Q', p0: { x: 250, y: 142 }, c: { x: 250, y: 126 }, p1: { x: 266, y: 126 } },
  { type: 'L', p0: { x: 266, y: 126 }, p1: { x: 300, y: 70 } },
]

function buildRoutePoints(samplesPerSegment = 40, resampleCount = 200) {
  const raw: Pt[] = []
  for (const seg of ROUTE_SEGMENTS) {
    for (let i = 0; i <= samplesPerSegment; i++) {
      const t = i / samplesPerSegment
      raw.push(seg.type === 'L' ? { x: lerp(seg.p0.x, seg.p1.x, t), y: lerp(seg.p0.y, seg.p1.y, t) } : quadPoint(seg.p0, seg.c, seg.p1, t))
    }
  }
  const deduped: Pt[] = []
  for (const p of raw) {
    const last = deduped[deduped.length - 1]
    if (!last || dist(last, p) > 0.001) deduped.push(p)
  }
  const cum: number[] = [0]
  for (let i = 1; i < deduped.length; i++) cum.push(cum[i - 1] + dist(deduped[i - 1], deduped[i]))
  const total = cum[cum.length - 1]

  const out: { x: number; y: number; angle: number }[] = []
  let seg = 0
  for (let i = 0; i < resampleCount; i++) {
    const targetLen = (i / (resampleCount - 1)) * total
    while (seg < cum.length - 2 && cum[seg + 1] < targetLen) seg++
    const segLen = cum[seg + 1] - cum[seg] || 1
    const localT = (targetLen - cum[seg]) / segLen
    const a = deduped[seg]
    const b = deduped[seg + 1]
    out.push({ x: lerp(a.x, b.x, localT), y: lerp(a.y, b.y, localT), angle: 0 })
  }
  for (let i = 0; i < out.length; i++) {
    const a = out[Math.max(0, i - 1)]
    const b = out[Math.min(out.length - 1, i + 1)]
    out[i].angle = Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI)
  }
  return { points: out, total }
}

const { points: ROUTE_POINTS, total: ROUTE_TOTAL_LENGTH } = buildRoutePoints()

/** Drives the vehicle marker + ETA tag position/heading along ROUTE_POINTS on the UI thread. */
function useRideAlongPath(active: boolean) {
  const progress = useSharedValue(0)
  useEffect(() => {
    if (active) {
      progress.value = 0
      progress.value = withRepeat(withTiming(1, { duration: RIDE_DURATION_MS, easing: Easing.linear }), -1, false)
    } else {
      progress.value = 0
    }
  }, [active, progress])

  const sample = (p: number) => {
    'worklet'
    const idx = p * (ROUTE_POINTS.length - 1)
    const i0 = Math.floor(idx)
    const i1 = Math.min(ROUTE_POINTS.length - 1, i0 + 1)
    const t = idx - i0
    const a = ROUTE_POINTS[i0]
    const b = ROUTE_POINTS[i1]
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: a.angle + (b.angle - a.angle) * t }
  }

  const markerProps = useAnimatedProps(() => {
    const { x, y, angle } = sample(progress.value)
    return { transform: `translate(${x} ${y}) rotate(${angle})` } as any
  })

  const etaGroupProps = useAnimatedProps(() => {
    const { x, y } = sample(progress.value)
    return { transform: `translate(${x} ${y - 22})` } as any
  })

  return { markerProps, etaGroupProps }
}

/** ETA minutes label — plain JS-thread rAF loop (mirrors the web version), updates React state only when the rounded minute value changes so re-renders stay rare. */
function useRideEta(active: boolean) {
  const [etaMin, setEtaMin] = useState(6)
  useEffect(() => {
    if (!active) return
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const progress = ((now - start) % RIDE_DURATION_MS) / RIDE_DURATION_MS
      const min = Math.max(1, Math.round((1 - progress) * 6))
      setEtaMin((prev) => (prev !== min ? min : prev))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active])
  return etaMin
}

/**
 * Drives the route "draw-on" reveal (strokeDashoffset from the full path
 * length down to 0, once on mount) plus the glow-stand-in pulse underneath
 * the crisp route line.
 *
 * Web uses `pathLength="1"` + `strokeDasharray="1 1"` so dash units are
 * normalized to 0–1 regardless of the path's real length. react-native-svg
 * (15.15.4, checked against its bundled TypeScript defs) has no `pathLength`
 * prop — it isn't in CommonPathProps/Shape at all. Fallback used here:
 * reuse the arc-length walk already done for the ride-along animation
 * (`ROUTE_TOTAL_LENGTH`, summed from the same 200 resampled points) as the
 * real dash length, and animate `strokeDashoffset` in absolute SVG units
 * from that total down to 0 with a fixed `strokeDasharray={[total, total]}`.
 * Visually equivalent to the web version's normalized approach.
 *
 * The glow itself: web uses CSS `filter: drop-shadow(...)` with animated
 * opacity 0.5→1→0.5, which react-native-svg doesn't support (no CSS filter
 * support). Approximated with a second, wider stroke drawn underneath the
 * crisp line, opacity looping 0.3→0.6→0.3.
 */
function useRouteDrawOn(active: boolean) {
  const drawProgress = useSharedValue(0)
  const glowProgress = useSharedValue(0)
  useEffect(() => {
    if (!active) {
      drawProgress.value = 0
      glowProgress.value = 0
      return
    }
    drawProgress.value = withTiming(1, { duration: DRAW_ON_DURATION_MS, easing: Easing.bezier(0.16, 1, 0.3, 1) })
    glowProgress.value = withDelay(
      DRAW_ON_DURATION_MS,
      withRepeat(withSequence(withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }), withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })), -1, false),
    )
  }, [active, drawProgress, glowProgress])

  const drawOnProps = useAnimatedProps(() => ({
    strokeDashoffset: ROUTE_TOTAL_LENGTH * (1 - drawProgress.value),
  }))
  const glowProps = useAnimatedProps(() => ({
    strokeOpacity: interpolate(glowProgress.value, [0, 1], [0.3, 0.6]),
  }))
  return { drawOnProps, glowProps }
}

/**
 * React Native port of MockMap.tsx from the web app-preview — same
 * illustrated-city language (streets, blocks, park, water, route, pins,
 * you-are-here pulse), plus the floating zoom/recenter controls and the
 * bike-follows-the-route animation, both now ported (see useRideAlongPath
 * above for why the route-following technique differs from the web's
 * `getPointAtLength()` approach — RN SVG has no equivalent API).
 */
export default function MockMap({
  showRoute = false,
  animateVehicle = false,
  showYouAreHere = false,
  showNearbyVehicles = false,
  focus = 'wide',
}: {
  showRoute?: boolean
  animateVehicle?: boolean
  showYouAreHere?: boolean
  showNearbyVehicles?: boolean
  focus?: Focus
}) {
  const rideActive = showRoute && animateVehicle
  const { markerProps, etaGroupProps } = useRideAlongPath(rideActive)
  const etaMin = useRideEta(rideActive)
  const { drawOnProps, glowProps } = useRouteDrawOn(showRoute)

  const dot1Props = useAmbientDot([40, 250], [120, 120], 9000, 0)
  const dot2Props = useAmbientDot([250, 250], [420, 60], 11000, 1500)
  const dot3Props = useAmbientDot([0, 400], [481, 480], 13000, 3000)

  // 'wide' opens fully zoomed out (index 0); any other focus opens already
  // framed in a stop closer (index 1), matching the web version.
  const initialZoom = focus === 'wide' ? 0 : 1
  const [zoomIndex, setZoomIndex] = useState(initialZoom)

  const zoomIn = () => setZoomIndex((z) => Math.min(z + 1, ZOOM_SCALES.length - 1))
  const zoomOut = () => setZoomIndex((z) => Math.max(z - 1, 0))
  const recenter = () => setZoomIndex(initialZoom)

  const scale = ZOOM_SCALES[zoomIndex]
  const vbW = 400 * scale
  const vbH = 700 * scale
  const [cx, cy] = FOCUS_CENTER[focus]
  const vbX = Math.min(Math.max(cx - vbW / 2, 0), 400 - vbW)
  const vbY = Math.min(Math.max(cy - vbH / 2, 0), 700 - vbH)

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} preserveAspectRatio="xMidYMid slice">
        <Defs>
          <RadialGradient id="vignette" cx="50%" cy="35%" r="75%">
            <Stop offset="0%" stopColor="#000" stopOpacity={0} />
            <Stop offset="100%" stopColor="#000" stopOpacity={0.08} />
          </RadialGradient>
          {/* Soft directional wash — a diagonal light-to-clear gradient laid
              over the whole illustration so it reads as lit from one corner
              rather than flat, uniformly-shaded vector art. */}
          <LinearGradient id="map-light-wash" x1="0%" y1="0%" x2="70%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.32} />
            <Stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.06} />
            <Stop offset="100%" stopColor="#00205C" stopOpacity={0.05} />
          </LinearGradient>
          {/* Top-to-bottom sheen applied to every building block for a touch
              of glassy dimension instead of a flat fill. */}
          <LinearGradient id="block-sheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.4} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </LinearGradient>
          {/* Cross-hatch fill used on every third non-core block so this
              reads as a sketched illustration rather than flat map-SDK
              tiles. */}
          <Pattern id="map-hatch" width={6} height={6} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <Line x1={0} y1={0} x2={0} y2={6} stroke="#0057E7" strokeOpacity={0.18} strokeWidth={1.4} />
          </Pattern>
        </Defs>
        <Rect width={400} height={700} fill="#E7EEFC" />

        {/* Park — illustrated tree canopy dabs instead of a flat green blob. */}
        <Path d="M-20,80 C40,50 90,90 60,150 C30,210 -30,190 -20,80 Z" fill="#D7EEDD" stroke="#0057E7" strokeOpacity={0.15} strokeWidth={1.5} />
        {[[10, 90], [30, 70], [45, 110], [15, 130], [55, 90]].map(([tx, ty], i) => (
          <Circle key={`tree-${i}`} cx={tx} cy={ty} r={7} fill="#BFE3C9" stroke="#0057E7" strokeOpacity={0.12} strokeWidth={1} />
        ))}

        {/* Second, smaller green space — a traffic-circle park, so greenery
            reads as "distributed through the city" rather than one corner
            park being the whole story. */}
        <Circle cx={140} cy={481} r={17} fill="#D7EEDD" stroke="#0057E7" strokeOpacity={0.15} strokeWidth={1.5} />
        {[[135, 476], [147, 478], [138, 488], [148, 489]].map(([tx, ty], i) => (
          <Circle key={`circle-tree-${i}`} cx={tx} cy={ty} r={4} fill="#BFE3C9" stroke="#0057E7" strokeOpacity={0.12} strokeWidth={1} />
        ))}

        {/* Water — a couple of hand-drawn wave squiggles instead of a flat fill. */}
        <Path
          d="M330,420 C400,390 430,460 400,540 C370,620 300,600 300,520 C300,470 300,440 330,420 Z"
          fill="#CFE3F9"
          stroke="#0057E7"
          strokeOpacity={0.15}
          strokeWidth={1.5}
        />
        <Path d="M320,460 C340,455 350,465 370,460" fill="none" stroke="#0057E7" strokeOpacity={0.2} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M320,500 C340,495 350,505 370,500" fill="none" stroke="#0057E7" strokeOpacity={0.2} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M320,540 C340,535 350,545 365,540" fill="none" stroke="#0057E7" strokeOpacity={0.2} strokeWidth={1.5} strokeLinecap="round" />

        {/* City blocks — full 18-block set with per-block rotation, hatch
            texture on every third non-core block, a top-to-bottom sheen, and
            (for the denser "core" cluster) a second offset shadow layer plus
            rooftop unit dots. */}
        {BLOCKS.map(([x, y, w, h, r, core], i) => (
          <G key={i} transform={`rotate(${r} ${x + w / 2} ${y + h / 2})`}>
            {core && <Rect x={x + 5} y={y + 8} width={w} height={h} rx={10} fill="#00205C" fillOpacity={0.07} />}
            <Rect x={x + 3} y={y + 5} width={w} height={h} rx={10} fill="#00205C" fillOpacity={0.1} />
            <Rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={10}
              fill={core ? '#C3D3F4' : i % 3 === 0 ? 'url(#map-hatch)' : '#D7E2F7'}
              stroke="#0057E7"
              strokeOpacity={core ? 0.22 : 0.14}
              strokeWidth={1.5}
            />
            <Rect x={x} y={y} width={w} height={h} rx={10} fill="url(#block-sheen)" opacity={core ? 0.55 : 0.35} />
            {core &&
              [0.3, 0.55, 0.75].map((f, di) => (
                <Circle key={di} cx={x + w * f} cy={y + h * 0.25} r={2.2} fill="#0057E7" fillOpacity={0.18} />
              ))}
          </G>
        ))}

        {/* Roadside greenery — small tree dabs lining the two busiest roads. */}
        <G fill="#BFE3C9" stroke="#0057E7" strokeOpacity={0.14} strokeWidth={1}>
          {[40, 90, 300, 350].map((tx) => (
            <Circle key={`tree-y120-${tx}`} cx={tx} cy={108} r={4} />
          ))}
          {[40, 90, 260, 310, 360].map((tx) => (
            <Circle key={`tree-y358-${tx}`} cx={tx} cy={370} r={4} />
          ))}
        </G>

        {/* Landmarks — market, hospital, school, mall, filling station as
            small hand-drawn glyphs in white-backed circles, at web's exact
            translate() coordinates. */}
        <G opacity={0.4}>
          {/* Market — three stall dots under a small awning arc */}
          <G transform="translate(55 300)">
            <Circle r={10} fill="white" stroke="#0057E7" strokeWidth={1.5} />
            <Path d="M-5,-2 A5,5 0 0 1 5,-2" fill="none" stroke="#0057E7" strokeWidth={1.5} strokeLinecap="round" />
            <Circle cx={-4} cy={3} r={1.6} fill="#0057E7" />
            <Circle cx={0} cy={3} r={1.6} fill="#0057E7" />
            <Circle cx={4} cy={3} r={1.6} fill="#0057E7" />
          </G>
          {/* Hospital — medical cross */}
          <G transform="translate(345 230)">
            <Circle r={10} fill="white" stroke="#0057E7" strokeWidth={1.5} />
            <Path d="M0,-5 L0,5 M-5,0 L5,0" stroke="#0057E7" strokeWidth={2} strokeLinecap="round" />
          </G>
          {/* School — simplified mortarboard */}
          <G transform="translate(55 555)">
            <Circle r={10} fill="white" stroke="#0057E7" strokeWidth={1.5} />
            <Path d="M-6,-1 L0,-4 L6,-1 L0,2 Z" fill="#0057E7" fillOpacity={0.85} />
            <Line x1={6} y1={-1} x2={6} y2={3} stroke="#0057E7" strokeWidth={1.2} />
          </G>
          {/* Mall — shopping bag */}
          <G transform="translate(170 460)">
            <Circle r={10} fill="white" stroke="#0057E7" strokeWidth={1.5} />
            <Path d="M-4,-1 L-4,-3 A4,4 0 0 1 4,-3 L4,-1" fill="none" stroke="#0057E7" strokeWidth={1.3} />
            <Rect x={-5} y={-1} width={10} height={7} rx={1.2} fill="#0057E7" fillOpacity={0.85} />
          </G>
          {/* Filling station — fuel pump */}
          <G transform="translate(250 560)">
            <Circle r={10} fill="white" stroke="#0057E7" strokeWidth={1.5} />
            <Rect x={-4} y={-4} width={6} height={8} rx={1} fill="#0057E7" fillOpacity={0.85} />
            <Path d="M2,-2 L5,-2 L5,3 A1.5,1.5 0 0 1 2,3" fill="none" stroke="#0057E7" strokeWidth={1.3} />
          </G>
        </G>

        {/* Street name labels — same rotation transforms as web for the
            vertical ones. */}
        <G fill="#00205C" fillOpacity={0.32} fontSize={8} fontWeight="600" letterSpacing={0.4}>
          <SvgText x={130} y={116}>INDEPENDENCE AVE</SvgText>
          <SvgText x={140} y={354}>LIBERATION AVE</SvgText>
          <SvgText x={110} y={477}>OXFORD ST</SvgText>
          <SvgText x={100} y={390} transform="rotate(-90 100 390)">RING ROAD CENTRAL</SvgText>
          <SvgText x={250} y={210} transform="rotate(-90 250 210)">SPINTEX RD</SvgText>
        </G>

        {/* Ambient background traffic — a few faint, slow-moving dots on side
            streets (not the hero route), independent of showRoute, so the
            map feels alive on every screen, not just active trips. */}
        <G fill="#0057E7" fillOpacity={0.28}>
          <AnimatedCircle r={3.2} animatedProps={dot1Props} />
          <AnimatedCircle r={3} animatedProps={dot2Props} />
          <AnimatedCircle r={2.8} animatedProps={dot3Props} />
        </G>

        {/* Riders nearby — the same overhead motorbike photo used for the
            animated marker, at a fraction of the size/opacity, with a slow
            breathing halo. */}
        {showNearbyVehicles &&
          NEARBY_VEHICLE_SPOTS.map((spot, i) => (
            <G key={i} transform={`translate(${spot.x} ${spot.y})`}>
              <Pulse cx={0} cy={0} r={9} color="#0057E7" />
              <G transform={`rotate(${spot.rotate + 90})`} opacity={0.55}>
                <SvgImage href={okaMotorbikeTopDown} x={-7} y={-12} width={14} height={24} />
              </G>
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
        <Rect width={400} height={700} fill="url(#map-light-wash)" />
        <Rect width={400} height={700} fill="url(#vignette)" />

        {/* Compass */}
        <G transform="translate(368 44)" opacity={0.4}>
          <Circle r={13} fill="white" stroke="#0057E7" strokeWidth={1.3} />
          <Path d="M0,-8 L3,0 L0,3 L-3,0 Z" fill="#0057E7" />
          <SvgText x={0} y={-16} textAnchor="middle" fontSize={7} fontWeight="700" fill="#00205C">
            N
          </SvgText>
        </G>

        {showYouAreHere && (
          <G>
            <Pulse cx={180} cy={400} r={10} color="#0057E7" />
            <Circle cx={180} cy={400} r={7} fill="#0057E7" stroke="white" strokeWidth={3} />
          </G>
        )}

        {showRoute && (
          <>
            {/* Traffic tint — a stretch of the route drawn under everything
                else in amber, the "congestion ahead" convention. */}
            <Path d="M100,470 L100,300" fill="none" stroke="#F5A623" strokeWidth={7} strokeLinecap="round" strokeOpacity={0.55} />

            <Path d={ROUTE_D} fill="none" stroke="#0057E7" strokeWidth={5} strokeLinecap="round" strokeOpacity={0.22} />

            {/* Glow stand-in — see useRouteDrawOn's comment for why this
                replaces web's CSS drop-shadow filter. */}
            <AnimatedPath
              d={ROUTE_D}
              fill="none"
              stroke="#0057E7"
              strokeWidth={11}
              strokeLinecap="round"
              animatedProps={glowProps}
            />

            {/* Draws the route on rather than having it appear instantly —
                see useRouteDrawOn's comment for the pathLength fallback. */}
            <AnimatedPath
              d={ROUTE_D}
              fill="none"
              stroke="#0057E7"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={[ROUTE_TOTAL_LENGTH, ROUTE_TOTAL_LENGTH]}
              animatedProps={drawOnProps}
            />
            <Circle cx={90} cy={620} r={8} fill="#0057E7" stroke="white" strokeWidth={3} />
            <Circle cx={300} cy={70} r={8} fill="#0057E7" stroke="white" strokeWidth={3} />

            {animateVehicle && (
              <AnimatedG animatedProps={etaGroupProps}>
                <Rect x={-19} y={-10} width={38} height={18} rx={9} fill="white" />
                <SvgText x={0} y={3} textAnchor="middle" fontSize={9} fontWeight="700" fill="#0057E7">
                  {etaMin} min
                </SvgText>
              </AnimatedG>
            )}

            {animateVehicle && (
              // Positioned every frame by useRideAlongPath. The source photo's
              // nose points up (-Y); the inner rotate(90) re-bases that to +X
              // once, matching the per-frame tangent rotation the outer
              // animated group already assumes (0deg = facing +X) — same
              // convention as the web version.
              <AnimatedG animatedProps={markerProps}>
                <G rotation={90}>
                  <SvgImage href={okaMotorbikeTopDown} x={-13.5} y={-23.3} width={27} height={46.6} />
                </G>
              </AnimatedG>
            )}
          </>
        )}
      </Svg>

      {/* Map controls — zoom in/out and recenter, floating on the map so it
          reads as an interactive surface instead of a fixed illustration. */}
      <View style={styles.controls} pointerEvents="box-none">
        <View style={styles.zoomGroup}>
          <Pressable
            onPress={zoomIn}
            disabled={zoomIndex === ZOOM_SCALES.length - 1}
            accessibilityLabel="Zoom in"
            style={({ pressed }) => [styles.zoomBtn, pressed && styles.btnPressed]}
          >
            <Plus size={16} color={zoomIndex === ZOOM_SCALES.length - 1 ? 'rgba(11,11,15,0.25)' : colors.ink.DEFAULT} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            onPress={zoomOut}
            disabled={zoomIndex === 0}
            accessibilityLabel="Zoom out"
            style={({ pressed }) => [styles.zoomBtn, pressed && styles.btnPressed]}
          >
            <Minus size={16} color={zoomIndex === 0 ? 'rgba(11,11,15,0.25)' : colors.ink.DEFAULT} />
          </Pressable>
        </View>
        <Pressable onPress={recenter} accessibilityLabel="Recenter map" style={({ pressed }) => [styles.recenterBtn, pressed && { transform: [{ scale: 0.88 }] }]}>
          <LocateFixed size={16} color={colors.primary.DEFAULT} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  controls: { position: 'absolute', right: 16, top: '42%', alignItems: 'center', gap: 8 },
  zoomGroup: { borderRadius: 16, backgroundColor: '#fff', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  zoomBtn: { height: 36, width: 36, alignItems: 'center', justifyContent: 'center' },
  btnPressed: { backgroundColor: 'rgba(11,11,15,0.06)' },
  divider: { height: 1, backgroundColor: 'rgba(11,11,15,0.1)' },
  recenterBtn: { height: 36, width: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
})
