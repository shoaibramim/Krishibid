import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Linking,
  TextInput,
  Button,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome, Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import { AirbnbRating, Rating } from "react-native-ratings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/app";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  aggregate,
  addDoc,
  where,
  updateDoc,
} from "firebase/firestore";
import "firebase/auth";
import { getAuth } from "firebase/auth";

export default function About(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [userInfo, setUserInfo] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [hasGivenReview, setHasGivenReview] = useState(false);
  const [currentUserReviewId, setCurrentUserReviewId] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal2Visible, setIsModal2Visible] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

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

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  const fetchRatingsAndReviews = async () => {
    try {
      setLoading(true);
      const reviewsSnapshot = await getDocs(
        query(collection(db, "reviews"), orderBy("timestamp", "desc"))
      );

      const reviewsData = reviewsSnapshot.docs.map((doc) => {
        const newDoc = doc.data();
        newDoc.id = doc.id;
        return newDoc;
      });

      let totalRatings = 0;
      reviewsData.forEach((item) => {
        totalRatings += item.rating;
        if (item.user_id == userInfo.user_id) {
          setHasGivenReview(true);
          setRating(item.rating);
          setReview(item.review);
          setCurrentUserReviewId(item.id);
        }
      });
      const averageRating =
        reviewsData.length > 0 ? totalRatings / reviewsData.length : 0;
      setAverageRating(averageRating);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRatingsAndReviews();
  }, []);
  useEffect(() => {
    fetchRatingsAndReviews();
  }, [userInfo]);

  const handleSubmitReview = async () => {
    try {
      setLoading(true);
      const reviewDesc = {
        user_id: userInfo.user_id,
        rating: rating,
        review: review,
        timestamp: new Date(),
      };
      const reviewsRef = collection(db, "reviews");
      if (!hasGivenReview) {
        await addDoc(reviewsRef, reviewDesc);
        Alert.alert("Thanks for your review!");
      } else {
        await updateDoc(doc(db, "reviews", currentUserReviewId), reviewDesc);
        Alert.alert("Your review has been updated!");
      }
      fetchRatingsAndReviews();
      setLoading(false);
    } catch (error) {
      console.error("Error submitting review and rating:", error);
      Alert.alert("Error submitting your review. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.textHeadline}>About Krishibid</Text>
            <Text style={styles.textDescription}>
              An ML enhanced mobile app that can detect common crop diseases
              from images. (Based on common Bangladeshi crops)
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.textHeadline}>Machine Learning Basics</Text>
            <View
              style={{
                borderWidth: 2,
                borderRadius: 6,
                borderColor: "#002D02",
                overflow: "hidden",
                height: 200,
                width: Dimensions.get("window").width - 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <WebView
                style={styles.videoPlayer}
                javaScriptEnabled={true}
                source={{
                  uri: "https://www.youtube.com/embed/ukzFI9rgwfU?si=iH4ggdur47i1CXr8",
                }}
              />
            </View>
          </View>
          <View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  fontFamily: "DMBold",
                  fontSize: 24,
                  color: "#002D02",
                  padding: 10,
                  textAlign: "left",
                }}
              >
                Find Our Location:
              </Text>
              <TouchableOpacity
                style={styles.buttonFlexBox}
                onPress={() => {
                  setIsModalVisible(true);
                }}
              >
                <Entypo name="location" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Modal
              visible={isModalVisible}
              animationType="slide"
              transparent={true}
            >
              <View
                style={{
                  flex: 1,
                  marginTop: 190,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={styles.modalContainer}>
                  <MapView
                    style={styles.mapView}
                    initialRegion={{
                      latitude: 22.4716,
                      longitude: 91.7877,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }}
                  >
                    <Marker
                      coordinate={{ latitude: 22.4716, longitude: 91.7877 }}
                      title="Krishibid"
                    />
                  </MapView>
                </View>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    marginHorizontal: 150,
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    flexDirection: "row",
                    backgroundColor: "#002D02",
                    borderRadius: 10,
                    alignSelf: "stretch",
                    padding: 10,
                  }}
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                >
                  <AntDesign name="closecircle" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
          <View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  fontFamily: "DMBold",
                  fontSize: 24,
                  color: "#002D02",
                  padding: 10,
                  textAlign: "left",
                }}
              >
                Check Your Location:
              </Text>
              <TouchableOpacity
                style={styles.buttonFlexBox}
                onPress={() => {
                  setIsModal2Visible(true);
                }}
              >
                <Entypo name="location" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Modal
              visible={isModal2Visible}
              animationType="slide"
              transparent={true}
            >
              <View
                style={{
                  flex: 1,
                  marginTop: 190,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={styles.modalContainer}>
                  {initialRegion && (
                    <MapView
                      style={styles.mapView}
                      initialRegion={initialRegion}
                    >
                      {currentLocation && (
                        <Marker
                          coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                          }}
                          title="Your Location"
                        />
                      )}
                    </MapView>
                  )}
                </View>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    marginHorizontal: 150,
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    flexDirection: "row",
                    backgroundColor: "#002D02",
                    borderRadius: 10,
                    alignSelf: "stretch",
                    padding: 10,
                  }}
                  onPress={() => {
                    setIsModal2Visible(false);
                  }}
                >
                  <AntDesign name="closecircle" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
          <View>
            <Text style={styles.textHeadline}>Review Krishibid</Text>
           <View style={styles.reviewingOptionContainer}>
           {loading ? (
              <ActivityIndicator size={50} color={"#002D02"} />
            ) : (
              <View style={{ alignItems: "center"}}>
                <Text style={styles.textHeadline}>
                  Average Rating: {averageRating.toFixed(2)}
                </Text>
                <Text style={styles.textDescription}>Your Review</Text>
                <AirbnbRating
                  count={10}
                  reviewColor="#002D02"
                  selectedColor="#002D02"
                  unSelectedColor="#D8EBD9"
                  reviews={[
                    "Terrible",
                    "Bad",
                    "Meh",
                    "OK",
                    "Good",
                    "Hmm...",
                    "Very Good",
                    "Wow",
                    "Amazing",
                    "Unbelievable",
                  ]}
                  defaultRating={rating}
                  size={20}
                  reviewSize={40}
                  onFinishRating={(rating) => {
                    setRating(rating);
                  }}
                />
                <TextInput
                  value={review}
                  multiline={true}
                  placeholder="What do you think about the App?"
                  style={styles.input}
                  onChangeText={(text) => {
                    setReview(text);
                  }}
                ></TextInput>
                <TouchableOpacity
                  onPress={() => handleSubmitReview()}
                  style={styles.buttonFlexBox}
                >
                  <Text style={styles.buttonText}>
                    {hasGivenReview ? "Update Review" : "Submit Review"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
           </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    backgroundColor: "#002D02",
    borderRadius: 10,
    alignSelf: "stretch",
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  textHeadline: {
    fontFamily: "DMBold",
    fontSize: 24,
    color: "#002D02",
    padding: 10,
    textAlign: "center",
  },
  textDescription: {
    fontFamily: "DMMedium",
    fontSize: 18,
    color: "#002D02",
    padding: 10,
    textAlign: "left",
  },
  videoPlayer: {
    backgroundColor: "#002D02",
    height: 200,
    width: Dimensions.get("window").width - 20,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  mapView: {
    marginHorizontal: 0,
    padding: 10,
    height: 200,
  },
  modalContainer: {
    backgroundColor: "white",
    width: "80%",
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#BAE3BB",
  },
  reviewingOptionContainer: {
    marginBottom: 10,
    marginHorizontal: 3,
    padding: 10,
    borderWidth: 2,
    borderColor: "#002D02",
    borderRadius: 6,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    minHeight: 50,
    minWidth: 285,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#D8EBD9",
    color: "#002D02",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 16,
    fontFamily: "DMMedium",
  },
  submitReviewButton: {
    textAlign: "center",
    marginHorizontal: "auto",
    alignSelf: "center",
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: "#002D02",
    borderRadius: 6,
    marginBottom: 10,
  },
});
