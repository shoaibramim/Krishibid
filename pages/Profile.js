import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import {
  FontAwesome,
  Entypo,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { auth, db } from "../firebase";

export default function Profile(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;
  const [loading, setloading] = useState(false);

  const handleSignOut = () => {
    setloading(true);
    auth.signOut();
    navigation.replace("StarterScreen");
    setloading(false);
  };

  const goToEditProfile = () => {
    navigation.push("EditProfile");
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.profileInfo}>
        <TouchableOpacity>
          <ImageBackground
            style={{ height: 120, width: 120 }}
            imageStyle={{
              borderRadius: 100,
              borderWidth: 3,
              borderColor: "#002D02",
            }}
            source={require("../assets/ThomasShelby Square.jpg")}
          >
            <View style={styles.editProfilePic}>
              <Entypo name="camera" size={24} color="white" />
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <Text style={styles.profileName}>Thomas Shelby</Text>
        <Text style={styles.profileUsername}>@tommyshelby</Text>
        <View style={{ flexDirection: "row", padding: 5 }}>
          <TouchableOpacity style={styles.buttonFlexBox} onPress={goToEditProfile}>
            <MaterialCommunityIcons name="pencil" size={18} color="white" />
            <Text style={styles.buttonText}>
              {loading ? (
                <ActivityIndicator size={22} color={"#fff"} />
              ) : (
                "Edit Profile"
              )}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonFlexBox}
            onPress={handleSignOut}
          >
            <AntDesign name="logout" size={18} color="white" />
            <Text style={styles.buttonText}>
              {loading ? (
                <ActivityIndicator size={22} color={"#fff"} />
              ) : (
                "Log Out"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.detailStyle}>
        <View style={{ flexDirection: "row", paddingBottom: 5, gap: 17 }}>
          <MaterialIcons name="location-pin" size={20} color="#002D02" />
          <Text style={styles.detailTextStyle}>Birmingham, England</Text>
        </View>
        <View style={{ flexDirection: "row", paddingBottom: 5, gap: 10 }}>
          <FontAwesome name="graduation-cap" size={20} color="#002D02" />
          <Text style={styles.detailTextStyle}>
            Military Academy, Birmingham
          </Text>
        </View>
        <View style={{ flexDirection: "row", paddingBottom: 5, gap: 15 }}>
          <FontAwesome name="birthday-cake" size={20} color="#002D02" />
          <Text style={styles.detailTextStyle}>25 May, 1890</Text>
        </View>
        <View style={{ flexDirection: "row", paddingBottom: 5, gap: 10 }}>
          <FontAwesome5 name="user-clock" size={20} color="#002D02" />
          <Text style={styles.detailTextStyle}>Joined 93 years ago</Text>
        </View>
      </View>
      <View style={styles.postContainer}>
      <Text style={styles.recentPostsText}>Recent Posts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE3BB",
    //alignItems: "center",
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
  profileInfo: {
    // flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
  },
  editProfilePic: {
    backgroundColor: "#002D02",
    borderRadius: 20,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 40,
    width: 40,
    marginHorizontal: 80,
    marginTop: 80,
  },
  profileName: {
    fontFamily: "DMBold",
    fontSize: 28,
    padding: 5,
  },
  profileUsername: {
    fontFamily: "DMMedium",
    fontSize: 20,
    paddingBottom: 5,
  },
  buttonFlexBox: {
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    backgroundColor: "#002D02",
    borderRadius: 20,
    alignSelf: "stretch",
    height: 35,
    width: 150,
    gap: 10,
  },
  buttonText: {
    fontFamily: "DMMedium",
    fontSize: 18,
    color: "#F9FAFB",
    lineHeight: 20,
    //fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
  textStyle: {
    fontFamily: "DMBold",
    fontSize: 50,
    color: "#002D02",
    padding: 10,
    textAlign: "center",
  },
  detailStyle: {
    justifyContent: "left",
    marginHorizontal: 30,
  },
  detailTextStyle: {
    fontFamily: "DMMedium",
    fontSize: 20,
    color: "#002D02",
  },
  postContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  recentPostsText: {
    fontFamily: "DMBold",
    fontSize: 28,
    color: "#002D02",
  },
});
