import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  FontAwesome,
  Entypo,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
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
  orderBy,
  limit,
  startAfter,
  limitToLast,
  endBefore,
} from "firebase/firestore";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import { BottomSheet, ListItem } from "@rneui/base";
import { useIsFocused } from "@react-navigation/native";
import PostCard from "../components/PostCard";

const storageBucket = process.env.EXPO_PUBLIC_storageBucket;

export default function Profile(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [loadingForUpload, setLoadingForUpload] = useState(false);
  const [loadingForEditProfile, setLoadingForEditProfile] = useState(false);
  const [loadingForLogOut, setLoadingForLogOut] = useState(false);
  const [loadingForFetchPosts, setloadingForFetchPosts] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [bottomSheetStatus, setBottomSheetStatus] = useState(false);

  const [currentUserPosts, setCurrentUserPosts] = useState([]);
  const [pageLastPostPostedTime, setPageLastPostPostedTime] = useState(null);
  const [pageFirstPostPostedTime, setPageFirstPostPostedTime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsNumber, setTotalPostsNumber] = useState(0);

  const isFocused = useIsFocused();

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
      const timestamp = userInfo.joiningDate;
      const dateObj = new Timestamp(timestamp.seconds, timestamp.nanoseconds);
      const date = dateObj.toDate();
      setFormattedDate(moment(date).format("DD MMM YYYY"));
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
        setBottomSheetStatus(false);

        setLoadingForUpload(true);
        const timestamp = new Date().getTime();
        const fileName = `images/ProfilePhotos/${userInfo.user_id}_${timestamp}.jpg`;
        await updateOnFirebase(
          fileName,
          result.assets[0].uri,
          userInfo.user_id
        );
        setLoadingForUpload(false);
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
        setBottomSheetStatus(false);

        setLoadingForUpload(true);
        const timestamp = new Date().getTime();
        const fileName = `images/ProfilePhotos/${userInfo.user_id}_${timestamp}.jpg`;
        await updateOnFirebase(
          fileName,
          result.assets[0].uri,
          userInfo.user_id
        );
        setLoadingForUpload(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postsPerPage = 2;
  useEffect(() => {
    const countTotalPosts = async () => {
      try {
        setloadingForFetchPosts(true);
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("user_id", "==", userInfo.user_id));
        const querySnapshot = await getDocs(q);
        setTotalPostsNumber(querySnapshot.size);

        setloadingForFetchPosts(false);
      } catch (error) {
        console.error("Error counting posts:", error);
        setloadingForFetchPosts(false);
      }
    };
    if (isFocused && Object.keys(userInfo).length > 0) {
      countTotalPosts();
    }
  }, [isFocused, userInfo]);

  const fetchPosts = async () => {
    if (Object.keys(userInfo).length > 0) {
      try {
        setloadingForFetchPosts(true);
        setCurrentPage(currentPage + 1);
        let list = [];
        const postsRef = collection(db, "posts");
        let q = query(
          postsRef,
          where("user_id", "==", userInfo.user_id),
          orderBy("postedTime", "desc"),
          limit(postsPerPage)
        );
        if (pageLastPostPostedTime) {
          q = query(q, startAfter(pageLastPostPostedTime));
        }
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const {
            post_id,
            user_id,
            postDescription,
            postImg,
            postedTime,
            likes,
            dislikes,
            comments,
          } = doc.data();
          list.push({
            id: post_id,
            user_id,
            postDescription,
            postImg,
            postedTime,
            likes,
            dislikes,
            comments,
          });
        });

        setCurrentUserPosts(list);
        setPageFirstPostPostedTime(list[0].postedTime);
        setPageLastPostPostedTime(list[list.length - 1].postedTime);
        setloadingForFetchPosts(false);
      } catch (error) {
        console.error("Error fetching posts: ", error);
        setloadingForFetchPosts(false);
      }
    }
  };

  const fetchPrevPosts = async () => {
    if (Object.keys(userInfo).length > 0) {
      try {
        setloadingForFetchPosts(true);
        setCurrentPage(currentPage - 1);
        let list = [];
        const postsRef = collection(db, "posts");
        let q = query(
          postsRef,
          where("user_id", "==", userInfo.user_id),
          orderBy("postedTime", "desc"),
          limitToLast(postsPerPage)
        );
        if (pageLastPostPostedTime) {
          q = query(q, endBefore(pageFirstPostPostedTime));
        }
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const {
            post_id,
            user_id,
            postDescription,
            postImg,
            postedTime,
            likes,
            dislikes,
            comments,
          } = doc.data();
          list.push({
            id: post_id,
            user_id,
            postDescription,
            postImg,
            postedTime,
            likes,
            dislikes,
            comments,
          });
        });
        setCurrentUserPosts(list);
        setPageFirstPostPostedTime(list[0].postedTime);
        setPageLastPostPostedTime(list[list.length - 1].postedTime);
        setloadingForFetchPosts(false);
      } catch (error) {
        console.error("Error fetching previous posts: ", error);
        setloadingForFetchPosts(false);
      }
    }
  };

  useEffect(() => {
    setPageFirstPostPostedTime(null);
    setPageLastPostPostedTime(null);
    setCurrentPage(1);

    const fetchFirstFewPosts = async () => {
      try {
        setloadingForFetchPosts(true);
        let list = [];
        const postsRef = collection(db, "posts");
        let q = query(
          postsRef,
          where("user_id", "==", userInfo.user_id),
          orderBy("postedTime", "desc"),
          limit(postsPerPage)
        );
        if (pageLastPostPostedTime) {
          q = query(q, startAfter(pageLastPostPostedTime));
        }
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const {
            post_id,
            user_id,
            postDescription,
            postImg,
            postedTime,
            likes,
            dislikes,
            comments,
          } = doc.data();
          list.push({
            id: post_id,
            user_id,
            postDescription,
            postImg,
            postedTime,
            likes,
            dislikes,
            comments,
          });
        });

        setCurrentUserPosts(list);
        setPageFirstPostPostedTime(list[0].postedTime);
        setPageLastPostPostedTime(list[list.length - 1].postedTime);
        setloadingForFetchPosts(false);
      } catch (error) {
        console.error("Error fetching first few posts: ", error);
        setloadingForFetchPosts(false);
      }
    };

    if (isFocused && Object.keys(userInfo).length > 0 && totalPostsNumber) fetchFirstFewPosts();
  }, [isFocused, userInfo, totalPostsNumber]);

  const handleSignOut = async () => {
    setLoadingForLogOut(true);
    await AsyncStorage.removeItem("userData");
    await auth.signOut();
    navigation.replace("StarterScreen");
    setLoadingForLogOut(false);
  };

  const goToEditProfile = () => {
    navigation.push("EditProfile");
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <TouchableOpacity
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
                {loadingForUpload ? (
                  <ActivityIndicator size={24} color={"white"} />
                ) : (
                  <Entypo name="camera" size={24} color="white" />
                )}
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
                  <Text style={styles.bottomSheetBtnTextStyle}>
                    &nbsp; Close
                  </Text>
                </TouchableOpacity>
              </ListItem.Content>
            </ListItem>
          </BottomSheet>

          <Text style={styles.profileName}>
            {Object.keys(userInfo).length > 0
              ? userInfo.firstName + " " + userInfo.lastName
              : ""}
          </Text>
          <Text style={styles.profileUsername}>
            {Object.keys(userInfo).length > 0 ? `@${userInfo.username}` : ""}
          </Text>
          <View style={{ flexDirection: "row", padding: 5 }}>
            {loadingForEditProfile ? (
              <ActivityIndicator size={22} color={"#002D02"} />
            ) : (
              <TouchableOpacity
                style={styles.buttonFlexBox}
                onPress={goToEditProfile}
              >
                <MaterialCommunityIcons name="pencil" size={18} color="white" />
                <Text style={styles.buttonText}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            )}
            {loadingForLogOut ? (
              <ActivityIndicator size={22} color={"#002D02"} />
            ) : (
              <TouchableOpacity
                style={styles.buttonFlexBox}
                onPress={handleSignOut}
              >
                <AntDesign name="logout" size={18} color="white" />
                <Text style={styles.buttonText}>
                  Log Out
                </Text>
              </TouchableOpacity>
            )}

          </View>
        </View>
        <View style={styles.detailStyle}>
          <View style={{ flexDirection: "row", paddingBottom: 5, gap: 17 }}>
            <MaterialIcons name="location-pin" size={20} color="#002D02" />
            <Text style={styles.detailTextStyle}>
              {Object.keys(userInfo).length > 0
                ? userInfo.location.state + ", " + userInfo.location.country
                : ""}
            </Text>
          </View>
          <View style={{ flexDirection: "row", paddingBottom: 5, gap: 10 }}>
            <FontAwesome name="graduation-cap" size={20} color="#002D02" />
            <Text style={styles.detailTextStyle}>
              {Object.keys(userInfo).length > 0
                ? userInfo.educationalInstitute
                : ""}
            </Text>
          </View>
          <View style={{ flexDirection: "row", paddingBottom: 5, gap: 15 }}>
            <FontAwesome name="birthday-cake" size={20} color="#002D02" />
            <Text style={styles.detailTextStyle}>
              {Object.keys(userInfo).length > 0 ? userInfo.dob : ""}
            </Text>
          </View>
          <View style={{ flexDirection: "row", paddingBottom: 5, gap: 10 }}>
            <FontAwesome5 name="user-clock" size={20} color="#002D02" />
            <Text style={styles.detailTextStyle}>
              {formattedDate ? `Joined: ${formattedDate}` : ""}
            </Text>
          </View>
        </View>
        <Text style={styles.recentPostsText}>Recent Posts</Text>
        {loadingForFetchPosts ? (
          <ActivityIndicator size={40} color={"#002D02"} />
        ) : (
          <View>
            <FlatList
              data={currentUserPosts}
              renderItem={({ item }) => <PostCard item={item} />}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
            <View style={styles.flexRow}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 1 && { opacity: 0.5 },
                ]}
                disabled={currentPage === 1}
                onPress={fetchPrevPosts}
              >
                <Entypo name="chevron-left" size={32} color="#002D02" />
                <Text style={styles.detailTextStyle}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  (currentPage ===
                    Math.ceil(totalPostsNumber / postsPerPage) || totalPostsNumber <= postsPerPage) && {
                    opacity: 0.5,
                  },
                ]}
                disabled={
                  currentPage === Math.ceil(totalPostsNumber / postsPerPage)
                  || totalPostsNumber < postsPerPage
                }
                onPress={fetchPosts}
              >
                <Text style={styles.detailTextStyle}>Next</Text>
                <Entypo name="chevron-right" size={32} color="#002D02" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{ marginTop: 60 }}></View>
      </ScrollView>
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
    textAlign: "center",
    marginBottom: 5,
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
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});
