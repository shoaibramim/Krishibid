import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, Entypo, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import { BottomSheet, ListItem } from "@rneui/base";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const storageBucket = process.env.EXPO_PUBLIC_storageBucket;

export default function EditProfile(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [birthDateModalStatus, setBirthDateModalStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bottomSheetStatus, setBottomSheetStatus] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [eduInstitute, setEduInstitute] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const usersRef = collection(db, "users");

  const isFocused = useIsFocused();

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEduInstitute(user.educationalInstitute);
        setCountryName(user.location.country);
        setStateName(user.location.state);
        setCityName(user.location.city);
        setBirthDate(user.dob);
      } else {
        const q = query(usersRef, where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserInfo(userData);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEduInstitute(userData.educationalInstitute);
          setCountryName(userData.location.country);
          setStateName(userData.location.state);
          setCityName(userData.location.city);
          setBirthDate(userData.dob);
        });
      }
    };
    getUser();
  }, [isFocused]);

  const updateOnFirebase = async (fileName, image, userId) => {
    try {
      const response = await fetch(
        "https://firebasestorage.googleapis.com/v0/b/" +
          storageBucket +
          "/o?name=" +
          fileName,
        {
          method: "POST",
          headers: {
            "Content-Type": "image/jpeg" || "image/png" || "image/jpg",
          },
          body: await fetch(image).then((response) => response.blob()),
        }
      );
      if (response.ok) {
        try {
          await updateDoc(doc(db, "users", userId), { profile_url: fileName });
          updateAsyncData(fileName);
        } catch (error) {
          console.error(error);
          Alert.alert("Failed to upload photo.");
        }
        Alert.alert("Profile Picture Updated");
      } else {
        Alert.alert("Failed to upload photo.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateAsyncData = async (profile_url) => {
    let temp = userInfo;
    temp.profile_url = profile_url;
    AsyncStorage.setItem("userData", JSON.stringify(temp))
      .then(() => {
        console.log("Data stored successfully!");
      })
      .catch((error) => {
        console.log("Failed to store data locally: ", error);
      });
  };

  const getImageUrlToShow = (image) => {
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(
      image
    )}?alt=media`;

    return imageUrl;
  };

  const preFetchDP = (userProfilePic) => {
    const imageRef = getImageUrlToShow(userProfilePic);
    setImageUri(imageRef);
  };

  useEffect(() => {
    if (Object.keys(userInfo).length > 0) {
      preFetchDP(userInfo.profile_url);
    }
  }, [userInfo]);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaPermissionStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted" && mediaPermissionStatus === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageChanged(true);
        setBottomSheetStatus(false);
      }
    } else {
      alert("Camera permission not granted");
    }
  };

  const openGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageChanged(true);
        setBottomSheetStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    var config = {
      method: "get",
      url: `${BASE_URL}/countries`,
      headers: {
        "X-CSCAPI-KEY": API_KEY,
      },
    };

    axios(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let countryArray = [];
        for (var i = 0; i < count; i++) {
          countryArray.push({
            value: response.data[i].iso2,
            label: response.data[i].name,
          });
        }
        setCountryData(countryArray);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleState = (countryCode) => {
    var config = {
      method: "get",
      url: `${BASE_URL}/countries/${countryCode}/states`,
      headers: {
        "X-CSCAPI-KEY": API_KEY,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let stateArray = [];
        for (var i = 0; i < count; i++) {
          stateArray.push({
            value: response.data[i].iso2,
            label: response.data[i].name,
          });
        }
        setStateData(stateArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCity = (countryCode, stateCode) => {
    var config = {
      method: "get",
      url: `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
      headers: {
        "X-CSCAPI-KEY": API_KEY,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let cityArray = [];
        for (var i = 0; i < count; i++) {
          cityArray.push({
            value: response.data[i].id,
            label: response.data[i].name,
          });
        }
        setCityData(cityArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (imageChanged) {
        const timestamp = new Date().getTime();
        const fileName = `images/ProfilePhotos/${userInfo.user_id}_${timestamp}.jpg`;
        await updateOnFirebase(fileName, imageUri, userInfo.user_id);
      }
      const updatedData = {
        firstName: firstName,
        lastName: lastName,
        educationalInstitute: eduInstitute,
        location: {
          country: countryName,
          state: stateName,
          city: cityName,
        },
        dob: birthDate,
      };
      await updateDoc(doc(db, "users", userInfo.user_id), updatedData);
      let temp = userInfo;
      temp.firstName = firstName;
      temp.lastName = lastName;
      temp.educationalInstitute = eduInstitute;
      temp.location.country = countryName;
      temp.location.state = stateName;
      temp.location.city = cityName;
      temp.dob = birthDate;
      AsyncStorage.setItem("userData", JSON.stringify(temp))
        .then(() => {
          console.log("Data stored successfully!");
        })
        .catch((error) => {
          console.log("Failed to store data locally: ", error);
        });

      setLoading(false);
      navigation.replace("Profile");
    } catch (error) {
      console.error(error);
      Alert.alert("Failed to update data.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text style={styles.textStyle}>Edit Profile</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <TouchableOpacity
          style={{ marginBottom: 10 }}
          onPress={() => {
            setBottomSheetStatus(true);
          }}
        >
          <ImageBackground
            style={{ height: 120, width: 120 }}
            imageStyle={{
              borderRadius: 100,
              borderWidth: 3,
              borderColor: "#002D02",
            }}
            source={{ uri: imageUri }}
          >
            <View style={styles.editProfilePic}>
              <Entypo name="camera" size={24} color="white" />
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <BottomSheet
          isVisible={bottomSheetStatus}
          style={styles.profileBottomSheetBG}
        >
          <ListItem>
            <ListItem.Content style={[styles.basicFlexStyle]}>
              <TouchableOpacity
                style={styles.bottomSheetBtnStyle}
                onPress={openCamera}
              >
                <Entypo name="camera" size={28} color="#F9FAFB" />
                <Text style={styles.bottomSheetBtnTextStyle}>
                  &nbsp; Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomSheetBtnStyle}
                onPress={openGallery}
              >
                <FontAwesome name="photo" size={28} color="#F9FAFB" />
                <Text style={styles.bottomSheetBtnTextStyle}>
                  &nbsp; Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomSheetCloseBtnStyle}
                onPress={() => {
                  setBottomSheetStatus(false);
                }}
              >
                <FontAwesome name="close" size={28} color="#F9FAFB" />
                <Text style={styles.bottomSheetBtnTextStyle}>&nbsp; Close</Text>
              </TouchableOpacity>
            </ListItem.Content>
          </ListItem>
        </BottomSheet>

        <View style={styles.flexRow}>
          <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
            <Text style={styles.textInputText}>First Name</Text>
            <TextInput
              style={[styles.textInputFlexBoxHalf, { marginLeft: 16 }]}
              placeholder=""
              onChangeText={(text) => {
                setFirstName(text.trim());
              }}
            >
              {Object.keys(userInfo).length > 0 ? userInfo.firstName : ""}
            </TextInput>
          </View>
          <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
            <Text style={styles.textInputText}>Last Name</Text>
            <TextInput
              style={[styles.textInputFlexBoxHalf, { marginRight: 16 }]}
              placeholder=""
              onChangeText={(text) => {
                setLastName(text.trim());
              }}
            >
              {Object.keys(userInfo).length > 0 ? userInfo.lastName : ""}
            </TextInput>
          </View>
        </View>
        <View style={styles.textInputStyle}>
          <Text style={styles.textInputText}>Username</Text>
          <TextInput
            style={[styles.textInputBoxWithOpacity, styles.flexRow]}
            placeholder=""
            autoCapitalize="none"
            editable={false}
          >
            {Object.keys(userInfo).length > 0 ? userInfo.username : ""}
          </TextInput>
        </View>
        <View style={styles.textInputStyle}>
          <Text style={styles.textInputText}>Educational Institute</Text>
          <TextInput
            style={styles.textInputBox}
            placeholder=""
            onChangeText={(text) => {
              setEduInstitute(text.trim());
            }}
          >
            {Object.keys(userInfo).length > 0
              ? userInfo.educationalInstitute
              : ""}
          </TextInput>
        </View>
        <View style={styles.textInputStyle}>
          <Text style={styles.textInputText}>Location</Text>
          <Dropdown
            style={[styles.textInputBox]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={countryData}
            search
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder={
              !isFocus
                ? `${Object.keys(userInfo).length > 0 ? userInfo.country : ""}`
                : "..."
            }
            searchPlaceholder="Search..."
            value={country}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setCountry(item.value);
              handleState(item.value);
              setCountryName(item.label);
              setIsFocus(false);
            }}
          />
        </View>
        <View style={styles.flexRow}>
          <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
            <Dropdown
              style={[styles.textInputFlexBoxHalf, { marginLeft: 16 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={stateData}
              search
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={
                !isFocus
                  ? `${Object.keys(userInfo).length > 0 ? userInfo.state : ""}`
                  : "..."
              }
              searchPlaceholder="Search..."
              value={state}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setState(item.value);
                handleCity(country, item.value);
                setStateName(item.label);
                setIsFocus(false);
              }}
            />
          </View>
          <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
            <Dropdown
              style={[styles.textInputFlexBoxHalf, { marginRight: 16 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={cityData}
              search
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={
                !isFocus
                  ? `${Object.keys(userInfo).length > 0 ? userInfo.city : ""}`
                  : "..."
              }
              searchPlaceholder="Search..."
              value={city}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setCity(item.value);
                setCityName(item.label);
                setIsFocus(false);
              }}
            />
          </View>
        </View>
        <View style={styles.textInputStyle}>
          <Text style={styles.textInputText}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.textInputBox}
            onPress={() => setBirthDateModalStatus(true)}
          >
            <Text style={styles.birthDate}>
              <FontAwesome name="birthday-cake" size={20} color="#002D02" />
              &nbsp; &nbsp;
              {Object.keys(userInfo).length > 0 ? userInfo.dob : ""}
            </Text>
          </TouchableOpacity>
          {birthDateModalStatus && (
            <DateTimePicker
              testID="dateTimePicker"
              value={moment(birthDate, "DD/MM/YYYY").toDate()}
              mode="date"
              onChange={(e, date) => {
                const day = date.getDate();
                const month = date.getMonth();
                const year = date.getFullYear();

                const formattedDate = `${day.toString().padStart(2, "0")}-${(
                  month + 1
                )
                  .toString()
                  .padStart(2, "0")}-${year.toString()}`;

                setBirthDate(formattedDate);
                setBirthDateModalStatus(false);
              }}
            />
          )}
        </View>
        {loading ? (
          <ActivityIndicator size={22} color={"#002D02"} />
        ) : (
          <TouchableOpacity style={styles.buttonFlexBox} onPress={handleSubmit}>
            <Feather name="upload" size={22} color="white" />
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  textStyle: {
    fontFamily: "DMBold",
    fontSize: 24,
    color: "#002D02",
    padding: 5,
    textAlign: "center",
    marginTop: 25,
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
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInputStyle: {
    paddingHorizontal: 10,
  },
  textInputStyleWidth50: {
    width: "50%",
  },
  textInputText: {
    fontFamily: "DMMedium",
    color: "#002D02",
    fontSize: 16,
    marginHorizontal: 20,
  },
  textInputFlexBox: {
    fontFamily: "DMRegular",
    height: 40,
    width: "95%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    color: "#002D02",
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
    paddingLeft: 10,
  },
  textInputFlexBoxHalf: {
    fontFamily: "DMRegular",
    height: 40,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    color: "#002D02",
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
  },
  textInputBox: {
    fontFamily: "DMRegular",
    height: 40,
    width: 315,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    color: "#002D02",
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
    paddingLeft: 10,
  },
  textInputBoxWithOpacity: {
    fontFamily: "DMRegular",
    height: 40,
    width: 315,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    color: "rgba(0,0,0,0.4)",
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
    paddingLeft: 10,
  },
  birthDate: {
    margin: 10,
    fontFamily: "DMRegular",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    color: "#002D02",
    fontSize: 16,
  },
  birthdayPicker: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    color: "blue",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 16,
  },
  profileBottomSheetBG: {
    backgroundColor: "white",
    height: "40%",
    width: "100%",
    position: "absolute",
    bottom: "0%",
    padding: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 30,
    overflow: "hidden",
  },
  basicFlexStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheetBtnStyle: {
    backgroundColor: "#002D02",
    width: "90%",
    height: "auto",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 5,
  },
  bottomSheetCloseBtnStyle: {
    backgroundColor: "#510600",
    width: "90%",
    height: "auto",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 5,
  },
  bottomSheetBtnTextStyle: {
    fontFamily: "DMBold",
    fontSize: 28,
    color: "#F9FAFB",
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "DMRegular",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "DMRegular",
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  inputSearchStyle: {
    height: 35,
    fontSize: 16,
    fontFamily: "DMRegular",
  },
});
