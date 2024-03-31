import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "react-native-paper";

export default function Login(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const loginUser = async () => {
    try {
      setloading(true);
      setEmail(email.trim());
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (user.emailVerified) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const loggedUserInfo = {
            user_id: userData.user_id,
            email: userData.email,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profile_url: userData.profile_url,
            dob: userData.dob,
            joiningDate: userData.joiningDate,
            educationalInstitute: userData.educationalInstitute,
            location: {
              country: userData.location.country,
              state: userData.location.state,
              city: userData.location.city,
            },
          };
          if (isRememberMeChecked) {
            const loggedUserInfoString = JSON.stringify(loggedUserInfo);
            AsyncStorage.setItem("userData", loggedUserInfoString)
              .then(() => {
                console.log("Data stored successfully!");
              })
              .catch((error) => {
                console.log("Failed to store data locally: ", error);
              });
          }
          setEmail("");
          setPassword("");
        });
        navigation.popToTop();
        navigation.replace("BottomTabs");
      } else {
        alert("Please Verfiy email first.");
      }
      setloading(false);
    } catch (e) {
      if (e.code === "auth/invalid-credential") setError("Invalid Credential");
      if (e.code === "auth/user-not-found") setError("User not found.");
      else console.log(e);
      setloading(false);
      console.log(e.code);
    }
  };

  const handleLogin = () => {
    loginUser();
  };

  const goToSignUp = () => {
    navigation.push("SignUp");
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.starterScreen}>
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={[styles.logoStarterScreen]}
          source={require("../assets/Brand-logo.png")}
        />
      </View>
      <Animated.View
        entering={FadeInDown.duration(1000).springify()}
        style={styles.backgorund}
      >
        <Animated.Text
          entering={FadeInUp.delay(100).duration(1000).springify()}
          style={styles.textStyle}
        >
          Welcome
        </Animated.Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.textInputStyle}>
            <Animated.Text
              entering={FadeInUp.delay(200).duration(1000).springify()}
              style={styles.textInputText}
            >
              E-mail
            </Animated.Text>
            <Animated.View
              entering={FadeInDown.delay(500).duration(1000).springify()}
            >
              <TextInput
                style={styles.textInputBox}
                placeholder="your_email@xyz.com"
                autoCapitalize="none"
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                value={email}
              />
            </Animated.View>
          </View>
          <View style={styles.textInputStyle}>
            <Animated.Text
              entering={FadeInUp.delay(300).duration(1000).springify()}
              style={styles.textInputText}
            >
              Password
            </Animated.Text>
            <Animated.View
              entering={FadeInDown.delay(500).duration(1000).springify()}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <TextInput
                style={styles.textInputBox}
                placeholder="yourPassword"
                autoCapitalize="none"
                secureTextEntry={hidePassword}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                value={password}
              />
              <TouchableOpacity
                onPress={() => setHidePassword(!hidePassword)}
                style={styles.hidePasswordIcon}
              >
                <Ionicons
                  name={hidePassword ? "eye" : "eye-off"}
                  size={22}
                  color="#510600"
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            style={styles.checkboxContainer}
          >
            <Checkbox
              style={styles.checkbox}
              status={isRememberMeChecked ? "checked" : "unchecked"}
              onPress={() => {
                setIsRememberMeChecked(!isRememberMeChecked);
              }}
              color={isRememberMeChecked ? "#002D02" : undefined}
            />
            <Text
              onPress={() => {
                setIsRememberMeChecked(!isRememberMeChecked);
              }}
              style={styles.checkboxLabel}
            >
              Keep Me Logged In
            </Text>
          </Animated.View>
          {error.length > 0 && (
            <Text
              style={{
                fontFamily: "DMMedium",
                color: "#510600",
                textAlign: "center",
              }}
            >
              {error}
            </Text>
          )}
          <Animated.View
            entering={FadeInDown.delay(300).duration(1000).springify()}
          >
            {loading ? (
              <ActivityIndicator size={22} color={"#002D02"} />
            ) : (
              <TouchableOpacity
                style={styles.buttonFlexBox}
                onPress={handleLogin}
                disabled={password.length < 1 || email.length < 1}
              >
                <FontAwesome name="user" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(1000).springify()}
            style={styles.footerStyle}
          >
            <Text style={styles.textInputText}>
              Don't have an account?
              <Text style={styles.footerLink} onPress={goToSignUp}>
                &nbsp; Sign up
              </Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE3BB",
    alignItems: "center",
    justifyContent: "center",
  },
  logoStarterScreen: {
    height: 100,
    width: "100%",
    margin: 200,
  },
  starterScreen: {
    borderRadius: null,
    backgroundColor: "#BAE3BB",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 100,
    paddingTop: 0,
    paddingBottom: 170,
    overflow: "hidden",
    width: "100%",
  },
  backgorund: {
    backgroundColor: "white",
    height: "55%",
    width: "100%",
    position: "absolute",
    bottom: "0%",
    padding: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 30,
    overflow: "hidden",
  },
  textStyle: {
    fontFamily: "DMBold",
    fontSize: 24,
    color: "#002D02",
    padding: 10,
    textAlign: "center",
  },
  textInputStyle: {
    paddingHorizontal: 20,
  },
  textInputText: {
    fontFamily: "DMMedium",
    color: "#002D02",
    fontSize: 16,
    marginHorizontal: 20,
  },
  textInputBox: {
    fontFamily: "DMRegular",
    height: 45,
    width: "95%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#D8EBD9",
    color: "#002D02",
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingLeft: 20,
  },
  footerStyle: {
    paddingHorizontal: 20,
    margin: 10,
    marginBottom: 60,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  footerLink: {
    fontFamily: "DMBold",
    color: "#510600",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonFlexBox: {
    margin: 10,
    marginHorizontal: 120,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    backgroundColor: "#002D02",
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 20,
    gap: 10,
  },
  buttonText: {
    fontFamily: "DMBold",
    fontSize: 20,
    color: "#F9FAFB",
    lineHeight: 20,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
  basicFlexStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    paddingLeft: 20,
    width: "auto",
    alignContent: "center",
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
    color: "#002D02",
  },
  checkboxLabel: {
    fontFamily: "DMMedium",
    color: "#002D02",
    fontSize: 16,
  },
  hidePasswordIcon: {
    marginLeft: -50,
  },
});
