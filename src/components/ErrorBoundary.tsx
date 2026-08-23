import { Component, type ReactNode } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts } from '../theme'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Top-level safety net. Without this, any render-time error in a screen
 * unmounts the whole tree and React Native (especially on web) can leave a
 * blank white page with the real error only visible in the browser/Metro
 * console — easy to miss and hard to act on. This renders the actual error
 * message and stack on screen instead, so "blank white page" always turns
 * into an actionable report.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    // eslint-disable-next-line no-console
    console.error('okA app crashed:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <Text style={styles.title}>Something broke</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
          {!!this.state.error.stack && <Text style={styles.stack}>{this.state.error.stack}</Text>}
        </ScrollView>
      )
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingTop: 64 },
  title: { fontFamily: fonts.display, fontSize: 20, color: '#DC2626' },
  message: { marginTop: 12, fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink.DEFAULT },
  stack: { marginTop: 16, fontSize: 11, color: colors.ink.light },
})
