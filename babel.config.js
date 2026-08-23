module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    // react-native-reanimated v4 moved its worklet compiler into
    // react-native-worklets — this plugin MUST be listed last, per the
    // library's own setup docs, since it needs to run after every other
    // transform. Without it, any use of useSharedValue/useAnimatedStyle/etc
    // (MockMap's pulsing dots, DriverHomeScreen's online indicator) fails
    // at runtime, which is the most likely cause of a blank white screen on
    // first load if this file was missing.
    plugins: ['react-native-worklets/plugin'],
  }
}
