import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import Animated, {FadeInUp, FadeInDown} from 'react-native-reanimated';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login(props) {
    const { navigation, route } = props;
    const onLayoutRootView = route.params.onLayoutRootView;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setloading] = useState(false);

    const loginUser = async () => {
        try {
            setloading(true);
            setEmail(email.trim());
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            if (user.emailVerified) {
                navigation.popToTop();
                navigation.replace("Feed");
            }
            else {
                alert("Please Verfiy email first.");
            }
            setloading(false);
        }
        catch (e) {
            if (e.code === 'auth/invalid-credential') setError("Invalid Credential");
            if (e.code === 'auth/user-not-found') setError('User not found.');
            else console.log(e);
            setloading(false);
            console.log(e.code)
        }
    };

    const handleLogin = () => {
        loginUser();
    }

    const goToSignUp = () => {
        navigation.push("SignUp");
    }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.starterScreen}>
                <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()}
                    style={[styles.logoStarterScreen]}
                    source={require("../assets/Brand-logo.png")}
                />
            </View>
            <Animated.View entering={FadeInDown.duration(1000).springify()} style={styles.backgorund}>
                <Animated.Text entering={FadeInUp.delay(100).duration(1000).springify()} style={styles.textStyle}>Welcome</Animated.Text>
                <View style={styles.textInputStyle}>
                    <Animated.Text entering={FadeInUp.delay(200).duration(1000).springify()} style={styles.textInputText}>E-mail</Animated.Text>
                    <Animated.View entering={FadeInDown.delay(500).duration(1000).springify()}>
                        <TextInput style={styles.textInputBox} placeholder='your_email@xyz.com' autoCapitalize="none"
                            onChangeText={(text) => { setEmail(text); setError(''); }} value={email} />
                    </Animated.View>

                </View>
                <View style={styles.textInputStyle}>
                    <Animated.Text entering={FadeInUp.delay(300).duration(1000).springify()} style={styles.textInputText}>Password</Animated.Text>
                    <Animated.View entering={FadeInDown.delay(500).duration(1000).springify()}>
                        <TextInput style={styles.textInputBox} placeholder='yourpassword' autoCapitalize="none"
                            secureTextEntry onChangeText={(text) => { setPassword(text); setError('') }} value={password} />
                    </Animated.View>

                </View>
                {error.length > 0 && <Text style={{ fontFamily: 'DMMedium', color: '#510600', textAlign: 'center' }}>{error}</Text>}
                <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()}>
                    <TouchableOpacity style={styles.buttonFlexBox}
                        onPress={handleLogin}>
                        <FontAwesome name="user" size={24} color="#ffffff" />
                        <Text style={styles.buttonText}>
                            {loading ? <ActivityIndicator size={18} color={"#fff"} /> : "Log in"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400).duration(1000).springify()} style={styles.footerStyle}>
                    <Text style={styles.textInputText}>Don't have an account?
                        <Text style={styles.footerLink} onPress={goToSignUp}>&nbsp; Sign up</Text>
                    </Text>
                </Animated.View>
            </Animated.View>
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
        backgroundColor: "white",
        height: '55%',
        width: '100%',
        position: 'absolute',
        bottom: '0%',
        padding: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
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
        color: '#002D02',
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 10,
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
        justifyContent: 'space-between',
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
    basicFlexStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

});
