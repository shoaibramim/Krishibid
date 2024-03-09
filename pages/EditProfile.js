import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  FontAwesome,
  Entypo,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
  Feather
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

export default function EditProfile(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState(["", ""]);
  const [birthDate, setBirthDate] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [birthDateModalStatus, setBirthDateModalStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const usernameMessages = [
    ["Username available", "green"],
    ["Username is not available", "red"],
    ["", ""],
  ];

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username != "") {
        try {
          const userRef = collection(db, "users");
          const q = query(userRef, where("username", "==", username));
          const querySnapshot = await getDocs(q);
          if (querySnapshot.size == 0) setUsernameError(usernameMessages[0]);
          else setUsernameError(usernameMessages[1]);
        } catch (e) {
          console.log(e);
        }
      } else setUsernameError(usernameMessages[2]);
    };
    checkUniqueUsername();
  }, [username]);

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text style={styles.textStyle}>Edit Profile</Text>
      <TouchableOpacity style={{ marginBottom: 10 }}>
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
      <View style={styles.flexRow}>
        <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
          <Text style={styles.textInputText}>First Name</Text>
          <TextInput style={styles.textInputFlexBox} placeholder="Peter" />
        </View>
        <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
          <Text style={styles.textInputText}>Last Name</Text>
          <TextInput style={styles.textInputFlexBox} placeholder="Parker" />
        </View>
      </View>
      <View style={styles.textInputStyle}>
        <Text style={styles.textInputText}>Username</Text>
        <TextInput
          style={styles.textInputBox}
          placeholder="spider_man"
          autoCapitalize="none"
        />
      </View>
      {usernameError[0].length > 0 && username.length > 0 && (
          <Text
            style={{
              color: usernameError[1],
              paddingLeft: 20,
              fontSize: 13,
              fontFamily: "DMMedium",
            }}
          >
            {usernameError[0]}
          </Text>
        )}
      <View style={styles.textInputStyle}>
        <Text style={styles.textInputText}>Educational Institute</Text>
        <TextInput
          style={styles.textInputBox}
          placeholder="Empire State University"
        />
      </View>
      <View style={styles.textInputStyle}>
        <Text style={styles.textInputText}>Location</Text>
        <TextInput style={styles.textInputBox} placeholder="Country" />
        <View style={styles.flexRow}>
          <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
            <TextInput style={styles.textInputFlexBox} placeholder="State" />
          </View>
          <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
            <TextInput style={styles.textInputFlexBox} placeholder="District" />
          </View>
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
            {birthDate}
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
      <TouchableOpacity style={styles.buttonFlexBox}>
      <Feather name="upload" size={22} color="white" />
            <Text style={styles.buttonText}>
              {loading ? (
                <ActivityIndicator size={18} color={"#fff"} />
              ) : (
                "Update"
              )}
            </Text>
          </TouchableOpacity>
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
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    color: "#002D02",
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
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
});
