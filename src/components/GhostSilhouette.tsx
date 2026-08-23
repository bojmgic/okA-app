import { Image, type ImageSourcePropType } from 'react-native'
import Svg, { Rect, Circle, Text as SvgText, Line } from 'react-native-svg'

interface VehicleGhostProps {
  src: ImageSourcePropType
  top: number
  left: number
  width: number
  rotate: number
  opacity: number
}

/**
 * Faint brand-texture watermark, ported from GhostSilhouette.tsx's
 * VehicleGhost on the web app-preview. The web version turns the source
 * photo into a pure white silhouette via a CSS `brightness(0) invert(1)`
 * filter — React Native's <Image> has no filter API, so this renders the
 * logo itself at low opacity instead of a true white cutout. Visually
 * softer than the web version but the same "ambient brand texture in the
 * background" idea; worth revisiting with a pre-baked white-silhouette PNG
 * asset if the flat-opacity look reads too literal in practice.
 */
export function VehicleGhost({ src, top, left, width, rotate, opacity }: VehicleGhostProps) {
  return (
    <Image
      source={src}
      resizeMode="contain"
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height: width,
        opacity,
        transform: [{ rotate: `${rotate}deg` }],
      }}
    />
  )
}

/**
 * Old-style banknote silhouette — ornate double-border rectangle with a
 * medallion holding the cedi sign (₵). Direct port of CediGhost from the web
 * app-preview (pure SVG there, so it ports without any filter limitations).
 */
export function CediGhost({ top, left, width, rotate, opacity }: { top: number; left: number; width: number; rotate: number; opacity: number }) {
  const height = width * 0.56
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 56"
      style={{ position: 'absolute', top, left, opacity, transform: [{ rotate: `${rotate}deg` }] }}
    >
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
  )
}
