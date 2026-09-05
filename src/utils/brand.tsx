import { Fragment, type ReactNode } from 'react'
import { Text } from 'react-native'

/**
 * Matches the actual logo's own typographic treatment — a regular "o"
 * followed by an italic "kA" — wherever the brand name appears in rendered
 * copy, including inside compounds like "okAda", "okA k3k3(Tricycle)", or
 * "okA Points". Apply this at render sites instead of hand-styling
 * individual strings, so the wordmark and copy never drift apart. Safe to
 * nest inside any RN <Text> since it only ever returns strings/<Text>.
 */
export function brand(text: string): ReactNode {
  if (!text || !text.includes('okA')) return text
  const segments = text.split('okA')
  const nodes: ReactNode[] = [segments[0]]
  for (let i = 1; i < segments.length; i++) {
    nodes.push(
      <Fragment key={i}>
        o<Text style={{ fontStyle: 'italic' }}>kA</Text>
      </Fragment>,
    )
    nodes.push(segments[i])
  }
  return nodes
}
