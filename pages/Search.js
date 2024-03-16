import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput
} from "react-native";
import React, { useState } from "react";
import { FontAwesome, Entypo, Feather } from "@expo/vector-icons";

export default function Search(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text style={styles.textStyle}>Search</Text>
      <TextInput style={styles.searchBox} placeholder="search" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE3BB",
    alignItems: "center",
    //justifyContent: "center",
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
    marginHorizontal: 80,
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
  textStyle: {
    fontFamily: "DMBold",
    fontSize: 30,
    color: "#002D02",
    padding: 10,
    textAlign: "center",
    marginTop: 15
  },
  textInputText: {
    fontFamily: "DMMedium",
    color: "#002D02",
    fontSize: 16,
    marginHorizontal: 20,
  },
  searchBox: {
    fontFamily: "DMRegular",
    height: 45,
    width: "95%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#D8EBD9",
    color: "#002D02",
    paddingLeft: 20,
  },
});
