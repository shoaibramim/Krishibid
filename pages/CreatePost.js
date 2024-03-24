import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, Entypo, MaterialIcons } from "@expo/vector-icons";

export default function CreatePost(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [imageUri, setImageUri] = useState(null);

  const openGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Image
        style={styles.logoStarterScreen}
        source={require("../assets/Brand-logo.png")}
      />
      <View style={styles.backgorund}>
        <Text style={styles.textStyle}>Create Post</Text>
        <TextInput style={styles.inputBox} multiline={true} placeholder="What's in your mind?" />
        <Image style={styles.imageStyle} source={{ uri: imageUri }} />
        <TouchableOpacity style={styles.btnStyle} onPress={openGallery}>
              <MaterialIcons name="change-circle" size={24} color= "white" />
              <Text style={styles.btnTextStyle}>&nbsp; {imageUri? "Change Photo": "Select Photo"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnStyle}>
              <Text style={styles.btnTextStyle}>&nbsp; Post</Text>
              <MaterialIcons name="file-upload" size={22} color="white" />
        </TouchableOpacity>
      </View>
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
    maxWidth: "50%",
    height: 80,
    overflow: "hidden",
    width: "50%",
    marginTop: 40
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
    fontSize: 24,
    color: "#002D02",
    padding: 10,
    textAlign: "center",
  },
  backgorund: {
    backgroundColor: "white",
    height: "82%",
    width: "100%",
    position: "absolute",
    bottom: "0%",
    padding: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 30,
    overflow: "hidden",
    alignItems: "center"
  },
  inputBox: {
    fontFamily: "DMRegular",
    height: 50,
    width: "90%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    color: "#002D02",
    paddingLeft: 20,
    alignItems: "center"
  },
  imageStyle: {
    minHeight: 300,
    width: "90%",
    borderWidth: 1,
    borderColor: "#BAE3BB",
    borderRadius: 20,
    resizeMode: "cover",
    backgroundColor: "white",
    margin: 5,
  },
  btnStyle: {
    backgroundColor: "#002D02",
    width: "auto",
    height: "auto",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
  },
  btnTextStyle: {
    fontFamily: "DMMedium",
    fontSize: 15,
    color: "#F9FAFB",
  },
  basicFlexStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
