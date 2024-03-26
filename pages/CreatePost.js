import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, Entypo, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/app";
import { auth, db } from "../firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "firebase/auth";
import { getAuth } from "firebase/auth";

const storageBucket = process.env.EXPO_PUBLIC_storageBucket;

export default function CreatePost(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [imageUri, setImageUri] = useState(null);
  const [postDesc, setPostDesc] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

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

  const { user_id } = userInfo;

  const openGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadOnFirebaseStorage = async (fileName, image) => {
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
          console.log("Photo uploaded in PostPhotos folder.");
        } catch (error) {
          console.error(error);
        }
      } else {
        Alert.alert("Failed to upload photo.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostSubmit = async () => {
    if (postDesc.trim().length > 0 || imageUri != null) {
      setLoading(true);

      let fileName = null;
      if (imageUri) {
        const timestamp = new Date().getTime();
        fileName = `images/PostPhotos/${user_id}_${timestamp}_post_photo.jpg`;
        await uploadOnFirebaseStorage(fileName, imageUri);
      }
      const postsRef = collection(db, "posts");
      try {
        const docRef = await addDoc(postsRef, {
          post_id: "",
          user_id: user_id,
          postDescription: postDesc,
          postImg: fileName,
          postedTime: new Date(),
          likes: [],
          comments: [
            {
              comment_id: "",
              user_id: "",
              commentDescription: "",
              timestamp: new Date(),
            },
          ],
        });
        updateDoc(doc(db, "posts", docRef.id), { post_id: docRef.id });

        Alert.alert("Your post has been published..");
        setPostDesc("");
        setImageUri(null);
        setLoading(false);
        navigation.navigate("Feed");
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    } else {
      Alert.alert(
        "Please provide a description or select a photo to be posted."
      );
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
        <TextInput
          style={styles.inputBox}
          multiline={true}
          placeholder="What's in your mind?"
          onChangeText={(text) => {
            setPostDesc(text);
          }}
          value={postDesc}
        />
        <Image style={styles.imageStyle} source={{ uri: imageUri }} />
        {imageUri ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.btnStyleSelected}
              onPress={openGallery}
            >
              <MaterialIcons name="change-circle" size={24} color="white" />
              <Text style={styles.btnTextStyle}>&nbsp; Change Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnStyleSelected}
              onPress={() => {
                setImageUri(null);
              }}
            >
              <FontAwesome name="remove" size={24} color="white" />
              <Text style={styles.btnTextStyle}>&nbsp; Remove Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity style={styles.btnStyle} onPress={openGallery}>
              <FontAwesome name="image" size={22} color="white" />
              <Text style={styles.btnTextStyle}>&nbsp; Select Photo</Text>
            </TouchableOpacity>
          </View>
        )}
        {loading ? (
          <ActivityIndicator size={30} color={"#002D02"} />
        ) : (
          <TouchableOpacity style={styles.btnStyle} onPress={handlePostSubmit}>
            <Text style={styles.btnTextStyle}>&nbsp; Post</Text>
            <MaterialIcons name="file-upload" size={22} color="white" />
          </TouchableOpacity>
        )}
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
    marginTop: 40,
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
    alignItems: "center",
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
    alignItems: "center",
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
  btnStyleSelected: {
    backgroundColor: "#510600",
    width: "auto",
    height: "auto",
    padding: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 3,
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
