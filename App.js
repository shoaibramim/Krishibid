import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, SafeAreaView} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import StarterScreen from './pages/StarterScreen';
import ClickOrSelectImage from './pages/ClickOrSelectImage';
import Login from './pages/Login';
import Feed from './pages/Feed';
import SignUp from './pages/SignUp';


SplashScreen.preventAutoHideAsync();

export default function App() {


  const Stack = createNativeStackNavigator();

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

    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="StarterScreen" component={StarterScreen} options={{headerShown:false}} initialParams={{'onLayoutRootView':onLayoutRootView}} />
        <Stack.Screen name="ClickOrSelectImage" component={ClickOrSelectImage} options={{headerShown:false}} initialParams={{'onLayoutRootView':onLayoutRootView}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}} initialParams={{'onLayoutRootView':onLayoutRootView}}/>
        <Stack.Screen name="Feed" component={Feed} options={{headerShown:false}} initialParams={{'onLayoutRootView':onLayoutRootView}}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}} initialParams={{'onLayoutRootView':onLayoutRootView}}/>

      </Stack.Navigator>
    </NavigationContainer>
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
