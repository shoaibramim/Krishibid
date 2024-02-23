import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { Timestamp, addDoc, collection, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, {FadeInUp, FadeInDown} from 'react-native-reanimated';
import moment from 'moment';

export default function SignUp(props) {
    const { navigation, route } = props;
    const onLayoutRootView = route.params.onLayoutRootView;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState(['', '']);
    const [birthDate, setBirthDate] = useState(moment(new Date()).format('DD/MM/YYYY'));
    const [birthDateModalStatus, setBirthDateModalStatus] = useState(false);
    const [loading, setLoading] = useState(false);

    const viewRef = useRef(null);

    const usernameMessages = [
        ["Username available", 'green'],
        ["Username is not available", 'red'],
        ['', '']
    ]

    const setAllNone = () => {
        setError('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setBirthDate('');
        setUsernameError(['', '']);
    }

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if (username != '') {
                try {
                    const userRef = collection(db, "users");
                    const q = query(userRef, where('username', '==', username));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.size == 0) setUsernameError(usernameMessages[0]);
                    else setUsernameError(usernameMessages[1]);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else setUsernameError(usernameMessages[2]);
        }
        checkUniqueUsername();

    }, [username]);

    const doFireBaseUpdate = async () => {
        const usersRef = collection(db, 'users');
        try {

            const docRef = await addDoc(usersRef, {
                "firstName": firstName,
                "lastName": lastName,
                "username": username,
                "email": email,
                "profile_url": "images/placeholder.png",
                "joiningDate": Timestamp.fromDate(new Date()),
                'dob': birthDate,
                "user_id": ''
            });

            updateDoc(doc(db, "users", docRef.id), { "user_id": docRef.id });
        }
        catch (e) {
            console.log(e);
        }
    }

    const registerWithEmail = async () => {
        try {
            setLoading(true);
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            try {
                await sendEmailVerification(user);
                alert('Verification link sent successfully');
            }
            catch (e) {
                alert("Something went wrong");
                console.log(e);
            }
            setAllNone();
            doFireBaseUpdate();
            setLoading(false);
            alert("Account Created! Complete email Verification.");
            navigation.navigate("Login");
        }
        catch (e) {
            if (e.code === 'auth/email-already-in-use') setError("Email already in use.");
            else if (e.code === 'auth/weak-password') setError("Weak Password");
            else if (e.code === 'auth/invalid-email') setError("Invalid Email");
            //alert(error);
            setLoading(false);
        }
    }

    const handleSingUp = async () => {
        if (email.length == 0 || password.length == 0 || username.length == 0) {
            setError("All credentials are not provided.");
        }
        else if (email.length > 0 && password.length > 0 && confirmPassword.length > 0 && username.length > 0) {
            if (password === confirmPassword && usernameError[1] == 'green') registerWithEmail();
            else if (password !== confirmPassword) setError("Passwords do not match");
            else setError("Invalid username");
        }
        else {
            setError("Something is missing!");
        }
    }

    const goToLogIn = () => {
        navigation.push("Login");
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
                <Animated.Text entering={FadeInUp.delay(100).duration(1000).springify()} style={styles.textStyle}>Create Account</Animated.Text>
                <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={styles.flexRow}>
                    <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
                        <Text style={styles.textInputText}>First Name</Text>
                        <TextInput style={styles.textInputBox} placeholder='Peter'
                            onChangeText={(text) => { setFirstName(text.trim()); }} value={firstName} />
                    </View>
                    <View style={[styles.textInputStyle, styles.textInputStyleWidth50]}>
                        <Text style={styles.textInputText}>Last Name</Text>
                        <TextInput style={styles.textInputBox} placeholder='Parker'
                            onChangeText={(text) => { setLastName(text.trim()); }} value={lastName} />
                    </View>
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(300).duration(1000).springify()} style={styles.textInputStyle}>
                    <Text style={styles.textInputText}>Username</Text>
                    <TextInput style={styles.textInputBox} placeholder='spider_man' autoCapitalize="none"
                        onChangeText={(text) => { setUsername(text.trim()); }} value={username} />
                </Animated.View>
                {usernameError[0].length > 0 && username.length > 0 && <Text style={{ color: usernameError[1], paddingLeft: 20, fontSize: 13, fontFamily: 'DMMedium' }}>{usernameError[0]}</Text>}
                <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={styles.textInputStyle}>
                    <Text style={styles.textInputText}>E-mail</Text>
                    <TextInput style={styles.textInputBox} placeholder='your_email@xyz.com' autoCapitalize="none"
                        onChangeText={(text) => { setEmail(text); setError(''); }}
                        value={email} />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(500).duration(1000).springify()} style={styles.textInputStyle}>
                    <Text style={styles.textInputText}>Date of Birth</Text>
                    <TouchableOpacity style={styles.textInputBox}
                        onPress={() => setBirthDateModalStatus(true)}>
                        <Text style={styles.birthDate}>
                            <FontAwesome name="birthday-cake" size={20} color="#002D02" />&nbsp; &nbsp;
                            {birthDate}
                        </Text>
                    </TouchableOpacity>
                    {birthDateModalStatus && <DateTimePicker
                        testID="dateTimePicker"
                        value={moment(birthDate, 'DD/MM/YYYY').toDate()}
                        mode="date"
                        onChange={(e, date) => {
                            const day = date.getDate();
                            const month = date.getMonth();
                            const year = date.getFullYear();

                            const formattedDate = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year.toString()}`;

                            setBirthDate(formattedDate);
                            setBirthDateModalStatus(false);
                        }}
                    />}
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500).duration(1000).springify()} style={styles.textInputStyle}>
                    <Text style={styles.textInputText}>Password</Text>
                    <TextInput style={styles.textInputBox} placeholder='yourpassword' autoCapitalize="none"
                        secureTextEntry onChangeText={(text) => { setPassword(text); setError('') }}
                        value={password} />
                </Animated.View>
                <Animated.View entering={FadeInUp.delay(400).duration(1000).springify()} style={styles.textInputStyle}>
                    <Text style={styles.textInputText}>Confirm Password</Text>
                    <TextInput style={styles.textInputBox} placeholder='yourpassword' autoCapitalize="none"
                        secureTextEntry onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
                        value={confirmPassword} />
                </Animated.View>
                {error.length > 0 && <Text style={{ fontFamily: 'DMMedium', color: '#510600', textAlign: 'center' }}>{error}</Text>}
                <Animated.View entering={FadeInDown.delay(300).duration(1000).springify()}>
                    <TouchableOpacity style={styles.buttonFlexBox} onPress={handleSingUp}>
                        <FontAwesome name="user" size={24} color="#ffffff" />
                        <Text style={styles.buttonText}>
                            {loading ? <ActivityIndicator size={18} color={"#fff"} /> : "Sign Up"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()} style={styles.footerStyle}>
                    <Text style={styles.textInputText}>Already have an account?
                        <Text style={styles.footerLink} onPress={goToLogIn}>&nbsp; Sign In</Text>
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
        paddingBottom: 550,
        overflow: "hidden",
        width: "100%",
    },
    backgorund: {
        backgroundColor: "white",
        height: '82%',
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
        paddingHorizontal: 10,
    },
    textInputStyleWidth50: {
        width: '50%'
    },
    textInputText: {
        fontFamily: 'DMMedium',
        color: '#002D02',
        fontSize: 16,
        marginHorizontal: 20,
    },
    birthDate: {
        margin: 10,
        fontFamily: 'DMRegular',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#002D02',
        fontSize: 16,
    },
    textInputBox: {
        fontFamily: 'DMRegular',
        height: 40,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#D8EBD9',
        color: '#002D02',
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        paddingLeft: 10,
    },
    birthdayPicker: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        color: 'blue',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        paddingLeft: 16
    },
    footerStyle: {
        paddingHorizontal: 20,
        margin: 0,
        //marginBottom: 60,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerLink: {
        fontFamily: 'DMBold',
        color: '#510600'
    },
    flexRow: {
        display: 'flex',
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
