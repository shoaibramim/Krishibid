import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StarterScreen = (props) => {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [loading, setLoading] = useState(false);

  const goToClickOrSelectImage = () => {
    navigation.push("ClickOrSelectImage");
  };

  const goToLogIn = () => {
    navigation.push("Login");
  };

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        if (navigation.canGoBack() == true) {
          navigation.popToTop();
        }
        navigation.replace("BottomTabs");
      }
    };
    getUser();
    setLoading(false);
  }, []);

  return (
    <View style={styles.starterScreen} onLayout={onLayoutRootView}>
      {loading ? (
        <ActivityIndicator size={50} color={"#002D02"} />
      ) : (
        <View>
          <Animated.Image
            entering={FadeInDown.delay(200).duration(1000).springify()}
            style={styles.logoStarterScreen}
            contentFit="cover"
            source={require("../assets/Brand-logo.png")}
          />
          <Animated.View
            entering={FadeInUp.delay(100).duration(1000).springify()}
          >
            <TouchableOpacity
              style={styles.buttonFlexBox}
              onPress={goToClickOrSelectImage}
            >
              <Entypo name="camera" size={30} color="#ffffff" />
              <Text style={[styles.buttonText]}>Detect</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonFlexBox]}
              onPress={goToLogIn}
            >
              <FontAwesome name="user" size={30} color="#ffffff" />
              <Text style={[styles.buttonText]}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

export default StarterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE3BB",
    alignItems: "center",
    justifyContent: "center",
  },
  logoStarterScreen: {
    maxWidth: "100%",
    height: 125,
    alignSelf: "stretch",
    overflow: "hidden",
    width: "100%",
  },
  starterScreen: {
    borderRadius: null,
    backgroundColor: "#BAE3BB",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 80,
    paddingTop: 240,
    paddingBottom: 280,
    overflow: "hidden",
    width: "100%",
  },
  buttonFlexBox: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    backgroundColor: "#002D02",
    borderRadius: 20,
    alignSelf: "stretch",
    paddingHorizontal: 50,
    paddingVertical: 20,
    gap: 15,
  },
  buttonText: {
    fontFamily: "DMBold",
    fontSize: 24,
    color: "#F9FAFB",
    lineHeight: 26,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
});
