import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import RootApp from './src/navigation/RootApp'
import ErrorBoundary from './src/components/ErrorBoundary'

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  // Previously this only checked `fontsLoaded` and returned null while
  // waiting — if font loading ever errors instead of resolving (which
  // `useFonts` reports via a *separate* `fontError` value, not by making
  // `fontsLoaded` true), the app was stuck returning null forever: a blank
  // white screen with nothing logged, since nothing ever threw. Proceeding
  // once either settles means a font-load failure degrades to system fonts
  // instead of hanging the whole app.
  const ready = fontsLoaded || !!fontError

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {})
  }, [ready])

  if (fontError) {
    // eslint-disable-next-line no-console
    console.error('okA app: font loading failed, continuing with system fonts:', fontError)
  }

  if (!ready) return null

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.flex}>
        <SafeAreaProvider>
          <View style={styles.flex}>
            <StatusBar style="light" />
            <RootApp />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
})
