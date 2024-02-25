import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import StarterScreen from "./pages/StarterScreen";
import ClickOrSelectImage from "./pages/ClickOrSelectImage";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import SignUp from "./pages/SignUp";
import BottomTabs from "./pages/BottomTabs";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import CreatePost from "./pages/CreatePost";
import Notifications from "./pages/Notifications";
import About from "./pages/About";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const Stack = createNativeStackNavigator();

  const [fontsLoaded, fontError] = useFonts({
    DMBold: require("./assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("./assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("./assets/fonts/DMSans-Regular.ttf"),
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
      <Stack.Navigator
        initialRouteName="StarterScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="StarterScreen"
          component={StarterScreen}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
        <Stack.Screen
          name="ClickOrSelectImage"
          component={ClickOrSelectImage}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabs}
          initialParams={{onLayoutRootView: onLayoutRootView}}
        />
        <Stack.Screen
          name="Feed"
          component={Feed}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
        <Stack.Screen
          name="About"
          component={About}
          initialParams={{ onLayoutRootView: onLayoutRootView }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE3BB",
    alignItems: "center",
    justifyContent: "center",
  },
});
