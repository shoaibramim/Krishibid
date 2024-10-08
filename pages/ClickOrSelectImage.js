import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { BottomSheet, ListItem } from "@rneui/base";
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeInRight,
  FadeInLeft,
} from "react-native-reanimated";
import * as tf from "@tensorflow/tfjs";
import * as FileSystem from "expo-file-system";
import {
  bundleResourceIO,
  decodeJpeg,
} from "@tensorflow/tfjs-react-native";

const modelJson = require("../assets/trained_model/model.json");
const modelWeights = require("../assets/trained_model/weights.bin");

const datasetClasses = [
  "Invalid",
  "Corn_Common_Rust",
  "Corn_Gray_Leaf_Spot",
  "Corn_Healthy",
  "Corn_Northern_Leaf_Blight",
  "Potato_Early_Blight",
  "Potato_Healthy",
  "Potato_Late_Blight",
  "Rice_Brown_Spot",
  "Rice_Healthy",
  "Rice_Leaf_Blast",
  "Rice_Neck_Blast",
  "Wheat_Brown_Rust",
  "Wheat_Healty",
  "Wheat_Yellow_Rust",
];

const transformImageToTensor = async (uri) => {
  //read the image as base64
  const img64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const imgBuffer = tf.util.encodeString(img64, "base64").buffer;
  const raw = new Uint8Array(imgBuffer);
  let imgTensor = decodeJpeg(raw);
  const scalar = tf.scalar(255);
  //resize the image
  imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224]);
  //normalize; if a normalization layer is in the model, this step can be skipped
  const tensorScaled = imgTensor.div(scalar);
  //final shape of the tensor
  const img = tf.reshape(tensorScaled, [1, 224, 224, 3]);
  return img;
};

const ClickOrSelectImage = (props) => {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [imageUri, setImageUri] = useState(null);
  const [bottomSheetStatus, setBottomSheetStatus] = useState(false);
  const [logoMargin, setLogoMargin] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const [model, setModel] = useState();
  const [tfReady, setTfReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaPermissionStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted" && mediaPermissionStatus === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setBottomSheetStatus(true);

        setLoading(true);
        await tf.ready();
        const model = await tf.loadLayersModel(
          bundleResourceIO(modelJson, modelWeights)
        );
        setModel(model);
        setTfReady(true);

        const imageTensor = await transformImageToTensor(result.assets[0].uri);
        const predictions = model.predict(imageTensor);
        const highestPredictionIndex = predictions.argMax(1).dataSync();
        const predictedClass = `${datasetClasses[highestPredictionIndex]}`;
        console.log(predictedClass);
        setPrediction(predictedClass);
        setLoading(false);
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
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setBottomSheetStatus(true);

        setLoading(true);
        await tf.ready();
        const model = await tf.loadLayersModel(
          bundleResourceIO(modelJson, modelWeights)
        );
        setModel(model);
        setTfReady(true);

        const imageTensor = await transformImageToTensor(result.assets[0].uri);
        const predictions = model.predict(imageTensor);
        const highestPredictionIndex = predictions.argMax(1).dataSync();
        const predictedClass = `${datasetClasses[highestPredictionIndex]}`;
        console.log(predictedClass);
        setPrediction(predictedClass);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeLogoMargin = () => {
    if (bottomSheetStatus == true) {
      setLogoMargin(150);
    } else {
      setLogoMargin(0);
    }
  };

  useEffect(() => {
    changeLogoMargin();
  }, [bottomSheetStatus]);

  return (
    <View style={styles.starterScreen} onLayout={onLayoutRootView}>
      <Animated.Image
        entering={FadeInUp.delay(200).duration(1000).springify()}
        style={[styles.logoStarterScreen, { marginBottom: logoMargin }]}
        source={require("../assets/Brand-logo.png")}
      />
      <Animated.View
        entering={FadeInDown.delay(100).duration(1000).springify()}
        style={styles.backgorund}
      >
        <Text style={styles.textStyle}> Choose </Text>
        <View style={styles.flexRow}>
          <Animated.View
            entering={FadeInRight.delay(300).duration(1000).springify()}
          >
            <TouchableOpacity
              style={styles.buttonBackgorund}
              onPress={openCamera}
            >
              <Entypo name="camera" size={35} color="#002D02" />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            entering={FadeInLeft.delay(400).duration(1000).springify()}
          >
            <TouchableOpacity
              style={styles.buttonBackgorund}
              onPress={openGallery}
            >
              <FontAwesome name="photo" size={35} color="#002D02" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      <BottomSheet
        isVisible={bottomSheetStatus}
        style={styles.bottomSheetWhiteBG}
      >
        <ListItem>
          <Image style={styles.imageStyle} source={{ uri: imageUri }} />
        </ListItem>
        <ListItem>
          <ListItem.Content style={styles.basicFlexStyle}>
            <Text style={styles.resultText}>
              {loading ? (
                <ActivityIndicator size={24} color={"#002D02"} />
              ) : (
                prediction
              )}
            </Text>
          </ListItem.Content>
        </ListItem>
        <ListItem>
          <ListItem.Content style={[styles.basicFlexStyle]}>
            <TouchableOpacity
              style={styles.closeBtnStyle}
              onPress={() => {
                setBottomSheetStatus(false);
              }}
            >
              <FontAwesome name="close" size={20} color="#F9FAFB" />
              <Text style={styles.closeTextStyle}>&nbsp; Close</Text>
            </TouchableOpacity>
          </ListItem.Content>
        </ListItem>
      </BottomSheet>
    </View>
  );
};

export default ClickOrSelectImage;

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
    margin: "auto",
  },
  starterScreen: {
    borderRadius: null,
    backgroundColor: "#BAE3BB",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 80,
    paddingTop: 240,
    paddingBottom: 280,
    overflow: "hidden",
    width: "100%",
  },
  backgorund: {
    borderRadius: 12,
    backgroundColor: "#F3F8F3",
    display: "flex",
    height: "auto",
    width: "auto",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: "DMMedium",
    fontSize: 20,
    color: "#002D02",
    paddingTop: 10,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonBackgorund: {
    borderRadius: 12,
    backgroundColor: "#D8EBD9",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 75,
    height: 75,
    margin: 20,
  },
  buttonFlexBox: {
    marginTop: 23,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#002D02",
    borderRadius: 20,
    alignSelf: "stretch",
    paddingHorizontal: 50,
    paddingVertical: 20,
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
  basicFlexStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheetWhiteBG: {
    backgroundColor: "white",
    height: "80%",
    width: "100%",
    position: "absolute",
    bottom: "0%",
    padding: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 30,
    overflow: "hidden",
  },
  imageStyle: {
    minHeight: 400,
    height: "100%",
    width: "100%",
    borderWidth: 1,
    borderColor: "#BAE3BB",
    borderRadius: 20,
    resizeMode: "cover",
    backgroundColor: "white",
  },
  closeBtnStyle: {
    backgroundColor: "#002D02",
    width: "auto",
    height: "auto",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  closeTextStyle: {
    fontFamily: "DMMedium",
    fontSize: 15,
    color: "#F9FAFB",
  },
  resultText: {
    fontFamily: "DMMedium",
    fontSize: 20,
    color: "#002D02",
  },
});
