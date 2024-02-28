// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKy25xrbJBxLFZbRB8ZQ0w3-0i0Xlt3NQ",
  authDomain: "krishibid-react-native.firebaseapp.com",
  projectId: "krishibid-react-native",
  storageBucket: "krishibid-react-native.appspot.com",
  messagingSenderId: "1053414041759",
  appId: "1:1053414041759:web:97535c50a191ccedc2daaa",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
