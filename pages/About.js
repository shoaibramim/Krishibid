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
} from "react-native";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome, Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import firebase from "firebase/app";
import { db } from "../firebase";
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
} from "firebase/firestore";
import "firebase/auth";
import { getAuth } from "firebase/auth";

export default function About(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal2Visible, setIsModal2Visible] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

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

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.textHeadline}>About Krishibid</Text>
          <Text style={styles.textDescription}>
            An ML enhanced mobile app that can detect common crop diseases from
            images. (Based on common Bangladeshi crops)
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
              width: Dimensions.get("window").width-20,
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
                  <MapView style={styles.mapView} initialRegion={initialRegion}>
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
      </ScrollView>
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
});
