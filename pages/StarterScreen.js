import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const StarterScreen = () => {
  return (
    <View style={styles.starterScreen}>
        <Image
          style= {styles.logoStarterScreen}
          contentFit= "cover"
          source={require("../assets/Brand-logo.png")}
        />
        <TouchableOpacity style={styles.buttonFlexBox}>
          <Image 
            style={styles.cameraIcon}
            contentFit="cover"
            source={require("../assets/icons/photo-camera.png")}
          />
          <Text style={styles.buttonText}>&nbsp; Detect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonFlexBox}>
          <Image 
            style={styles.userIcon}
            contentFit="cover"
            source={require("../assets/icons/user.png")}
          />
          <Text style={styles.buttonText}>&nbsp; Sign In</Text>
        </TouchableOpacity>
    
    </View>
  )
}

export default StarterScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#BAE3BB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoStarterScreen: {
      maxWidth: "100%",
      height: 125,
      alignSelf: "stretch",
      overflow: "hidden",
      width: "100%"
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
      fontFamily: 'DMBold',
      fontSize: 24,
      color: "#F9FAFB",
      lineHeight: 26,
      fontWeight: "500",
      textAlign: "center",
      marginTop: 4
  },
    cameraIcon: {
      width: 30,
      height: 30,
      justifyContent: "flex-start",
    },
    userIcon: {
      width: 30,
      height: 30,
      justifyContent: "flex-start"
    },
  });
  