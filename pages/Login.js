import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';   
import { FontAwesome, Entypo } from '@expo/vector-icons';
import {auth, db} from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login (props){
    const {navigation,route} = props;
    const onLayoutRootView = route.params.onLayoutRootView;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setloading] = useState(false);

    const loginUser = async () => {
        try {
            setloading(true);
            setEmail(email.trim());
            const { user } =await signInWithEmailAndPassword(auth, email, password);
            if(user.uid.length>0){
                navigation.popToTop();
                navigation.replace("Feed");
            }
            setloading(false);
        } 
        catch (e) {
            if(e.code==='auth/invalid-credential') setError("Invalid Credential");
            if(e.code==='auth/user-not-found') setError('User not found.');
            else console.log(e);
            setloading(false);
            console.log(e.code)
        }
      };

      const handleLogin = () => {
        loginUser();
    }

    return(
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.starterScreen}>
                <Image
                    style= {[styles.logoStarterScreen]}
                    source={require("../assets/Brand-logo.png")}
                />
            </View>
            <View style={styles.backgorund}>
                <Text style={styles.textStyle}>Welcome</Text>
                <View style={styles.textInputStyle}>
                    <Text style={styles.textInputText}>E-mail</Text>
                    <TextInput style={styles.textInputBox} placeholder='your_email@xyz.com' autoCapitalize="none" 
                    onChangeText={(text) => {setEmail(text);  setError('');}} value={email} />
                </View>
                <View style={styles.textInputStyle}>
                    <Text style={styles.textInputText}>Password</Text>
                    <TextInput style={styles.textInputBox} placeholder='yourpassword' autoCapitalize="none"
                    secureTextEntry onChangeText={(text) => {setPassword(text); setError('')}} value={password} />
                </View>
                {error.length>0 && <Text style={{color:'red',textAlign:'center'}}>*{error}*</Text>}
                <TouchableOpacity style={styles.buttonFlexBox}
                    onPress={handleLogin}>
                    <FontAwesome name="user" size={24} color="#ffffff" />
                    <Text style={styles.buttonText}>
                    {loading? <ActivityIndicator size={18} color={"#fff"}/>: "Log in"}
                    </Text>
                </TouchableOpacity>
                <View style={styles.footerStyle}>
                <Text style={styles.textInputText}>Don't have an account? 
                    <Text style={styles.footerLink}>&nbsp; Sign up</Text>
                </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#BAE3BB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoStarterScreen: {
      height: 100,
      width: '100%',
      margin: 200
    },
    starterScreen: {
      borderRadius: null,
      backgroundColor: "#BAE3BB",
      flex: 1,
      justifyContent: "center",
      alignItems: 'center',
      alignContent: 'center',
      paddingHorizontal: 100,
      paddingTop: 0,
      paddingBottom: 170,
      overflow: "hidden",
      width: "100%",
    },
    backgorund: {
        backgroundColor:"white",
        height:'55%',
        width:'100%',
        position:'absolute',
        bottom:'0%',
        padding: 0,
        borderBottomLeftRadius:0,
        borderBottomRightRadius:0,
        borderRadius: 30,
        overflow: 'hidden',

    },
    textStyle: {
      fontFamily: 'DMBold',
      fontSize: 24,
      color: "#002D02",
      padding: 10,
      textAlign: 'center',
    },
    textInputStyle: {
        paddingHorizontal: 20,
    },
    textInputText: {
        fontFamily: 'DMMedium',
        color: '#002D02',
        fontSize: 16,
        marginHorizontal: 20,
    },
    textInputBox: {
        fontFamily: 'DMRegular',
        height: 45,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#D8EBD9',
        color:'#002D02',
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal:10,
        paddingLeft: 20,
    },
    footerStyle: {
        paddingHorizontal: 20,
        margin: 10,
        marginBottom: 60,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerLink: {
        fontFamily: 'DMBold',
        color: '#510600'
    }, 
    flexRow: {
      flexDirection: 'row',
      justifyContent:'space-between',
    },
    buttonFlexBox: {
        margin: 10,
        marginHorizontal: 120,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
        alignContent: 'center',
        flexDirection: "row",
        backgroundColor: "#002D02",
        borderRadius: 16,
        padding: 12,
        paddingHorizontal: 20,
        gap: 10
    },
    buttonText: {
      fontFamily: 'DMBold',
      fontSize: 20,
      color: "#F9FAFB",
      lineHeight: 20,
      fontWeight: "500",
      textAlign: "center",
      marginTop: 4
  },
  basicFlexStyle:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },

  });
  