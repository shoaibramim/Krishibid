import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, Entypo, Feather } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Feed(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo(user);
      } else {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserInfo(userData);
        });
      }
    };
    getUser();
  }, []);

  const goToClickOrSelectImage = () => {
    navigation.push("ClickOrSelectImage");
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={[styles.greetingCard, styles.flexRow]}>
        <Text style={styles.textStyle}>
          Greetings,{" "}
          <Text style={{ fontFamily: "DMBold" }}>
            {Object.keys(userInfo).length > 0 ? (
              userInfo.firstName
            ) :""}
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.classifyButtonBox}
          onPress={goToClickOrSelectImage}
        >
          <Entypo name="camera" size={32} color="white" />
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
  greetingCard: {
    height: 60,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 16,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  classifyButtonBox: {
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#002D02",
    borderRadius: 12,
    padding: 5,
    height: 50,
    width: 50,
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
    fontFamily: "DMMedium",
    fontSize: 26,
    color: "#002D02",
    padding: 10,
    textAlign: "left",
  },
});
