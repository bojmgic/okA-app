import { useEffect } from 'react'
import { Image } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated'
import Svg, { Rect, Circle, Text as SvgText, Line } from 'react-native-svg'

// Pre-baked true white silhouette (RGB forced to white, original alpha
// preserved) — a real port of the web version's CSS `brightness(0)
// invert(1)` filter, which React Native's <Image> has no equivalent for at
// runtime. Baked once with PIL instead of approximated with flat opacity on
// the full-color logo.
// v3 = regenerated from the new official brand wordmark (replaces the old
// oka-logo-v2 source); new filename since this mount can't overwrite
// existing files in place this session.
const okaSilhouette = require('../assets/brand/oka-logo-v3-silhouette.png')

// Real pixel dimensions of oka-logo-v3-silhouette.png (815x343). The
// container below is sized to the asset's real aspect ratio (rather than
// forced square) so resizeMode="contain" fills it edge-to-edge instead of
// letterboxing down and rendering every call site smaller/fainter than its
// `width` prop implies — see the size-audit note this fixed originally.
const SILHOUETTE_ASPECT = 815 / 343

interface VehicleGhostProps {
  top: number
  left: number
  width: number
  rotate: number
  opacity: number
}

/**
 * Faint brand-texture watermark — direct port of VehicleGhost from the web
 * app-preview's GhostSilhouette.tsx, including the slow drift/wobble float
 * (web: `.animate-oka-ghost-float` CSS keyframe) reproduced here with
 * Reanimated so the mark reads as gently alive rather than a static sticker,
 * matching the web version. Always renders the okA wordmark silhouette —
 * every call site on the web version points at the same logo, so this no
 * longer takes a `src` prop; callers just pass position/size/rotate/opacity.
 */
export function VehicleGhost({ top, left, width, rotate, opacity }: VehicleGhostProps) {
  const height = width / SILHOUETTE_ASPECT
  const drift = useGhostFloat(top, left, rotate)
  return (
    <Animated.View style={[{ position: 'absolute', top, left, width, height, opacity }, drift]}>
      <Image source={okaSilhouette} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
    </Animated.View>
  )
}

/**
 * Reanimated equivalent of the web's `--ghost-drift-x/y` + `--ghost-wobble`
 * CSS custom properties driving `.animate-oka-ghost-float`: a slow, seeded
 * (not random-per-mount) looping drift + rotation wobble so every ghost
 * mark gets its own stable rhythm without extra props per call site, same
 * as the web version's deterministic string-hash seeding.
 */
function useGhostFloat(top: number, left: number, rotate: number) {
  const seed = `${top}-${left}-${rotate}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  const seeded = (salt: number, min: number, max: number) => min + (((hash + salt) % 1000) / 1000) * (max - min)
  const duration = seeded(1, 7000, 14000)
  const driftX = seeded(2, -10, 10)
  const driftY = seeded(3, -14, -6)
  const wobble = seeded(4, -3, 3)

  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * driftX },
      { translateY: progress.value * driftY },
      { rotate: `${rotate + progress.value * wobble}deg` },
    ],
  }))
}

/**
 * Old-style banknote silhouette — ornate double-border rectangle with a
 * medallion holding the cedi sign (₵). Direct port of CediGhost from the web
 * app-preview (pure SVG there, so it ports without any filter limitations),
 * now with the same drift/wobble float as VehicleGhost for parity.
 */
export function CediGhost({ top, left, width, rotate, opacity }: { top: number; left: number; width: number; rotate: number; opacity: number }) {
  const height = width * 0.56
  const drift = useGhostFloat(top, left, rotate)
  return (
    <Animated.View style={[{ position: 'absolute', top, left, width, height, opacity }, drift]}>
      <Svg width={width} height={height} viewBox="0 0 100 56">
        <Rect x={2} y={2} width={96} height={52} rx={5} fill="none" stroke="white" strokeWidth={2.5} />
        <Rect x={7} y={7} width={86} height={42} rx={2} fill="none" stroke="white" strokeWidth={1} strokeDasharray="2.5,3" strokeOpacity={0.7} />
        <Circle cx={50} cy={28} r={15} fill="none" stroke="white" strokeWidth={1.75} />
        <SvgText x={50} y={35} textAnchor="middle" fontSize={20} fontWeight="700" fill="white">
          ₵
        </SvgText>
        <Line x1={12} y1={12} x2={24} y2={12} stroke="white" strokeWidth={2} strokeLinecap="round" />
        <Line x1={76} y1={44} x2={88} y2={44} stroke="white" strokeWidth={2} strokeLinecap="round" />
        <Circle cx={14} cy={42} r={2.5} fill="white" />
        <Circle cx={86} cy={14} r={2.5} fill="white" />
      </Svg>
    </Animated.View>
  )
}
