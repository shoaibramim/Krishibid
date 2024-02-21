import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, {useState} from 'react';
import { FontAwesome, Entypo, AntDesign } from '@expo/vector-icons';
import {auth, db} from '../firebase';

export default function Feed(props){
    const {navigation,route} = props;
    const onLayoutRootView = route.params.onLayoutRootView;

    const [loading, setloading] = useState(false);

    const handleSignOut = ()=>{
      setloading(true);
      auth.signOut();
      navigation.replace('StarterScreen');
      setloading(false);
    }

     return(<View style={styles.container} onLayout={onLayoutRootView}>
        <Text style={styles.textStyle}>
            Feeeeeeeed
        </Text>
        <TouchableOpacity style={styles.buttonFlexBox} onPress={handleSignOut}>
          <AntDesign name="logout" size={24} color="white" />
            <Text style={styles.buttonText}>
              {loading? <ActivityIndicator size={22} color={"#fff"}/>: "Log Out"}
            </Text>
        </TouchableOpacity>
    </View>
    )}

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
      marginHorizontal: 80,
      justifyContent: "center",
      alignItems: "center",
      alignContent: 'center',
      flexDirection: "row",
      backgroundColor: "#002D02",
      borderRadius: 20,
      alignSelf: "stretch",
      paddingHorizontal: 50,
      paddingVertical: 20,
      gap: 15
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
  textStyle: {
    fontFamily: 'DMBold',
    fontSize: 50,
    color: "#002D02",
    padding: 10,
    textAlign: 'center',

  },
   
  });
  