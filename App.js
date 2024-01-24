import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import StarterScreen from './pages/StarterScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {

  const [fontsLoaded, fontError] = useFonts({
    'DMBold': require('./assets/fonts/DMSans-Bold.ttf'),
    'DMMedium': require('./assets/fonts/DMSans-Medium.ttf'),
    'DMRegular': require('./assets/fonts/DMSans-Regular.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar />

      <StarterScreen />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAE3BB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
