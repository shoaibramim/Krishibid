import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import PostCard from "../components/PostCard";

export default function Feed(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [posts, setPosts] = useState([]);

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
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const list = [];
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("postedTime", "desc"));
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
        setPosts(list);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    if (Object.keys(userInfo).length > 0) fetchPosts();
  }, [isFocused, userInfo]);

  const goToClickOrSelectImage = () => {
    navigation.push("ClickOrSelectImage");
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <SafeAreaView>
        {loading ? (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={50} color={"#002D02"} />
            <Text style={styles.loadingTextStyle}>Loading posts...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.greetingCard, styles.flexRow]}>
              <Text style={styles.textStyle}>
                Greetings,{" "}
                <Text style={{ fontFamily: "DMBold" }}>
                  {Object.keys(userInfo).length > 0 ? userInfo.firstName : ""}
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.classifyButtonBox}
                onPress={goToClickOrSelectImage}
              >
                <Entypo name="camera" size={32} color="white" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={posts}
              renderItem={({ item }) => <PostCard item={item} />}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
            <View style={{ marginTop: 60 }}></View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE3BB",
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
  greetingCard: {
    height: 60,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 16,
    margin: 5,
    marginLeft: 9,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  classifyButtonBox: {
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#002D02",
    borderRadius: 12,
    padding: 5,
    height: 50,
    width: 50,
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
  textStyle: {
    fontFamily: "DMMedium",
    fontSize: 26,
    color: "#002D02",
    padding: 10,
    textAlign: "left",
  },
  loadingTextStyle: {
    fontFamily: "DMMedium",
    fontSize: 16,
    color: "#002D02",
    padding: 10,
    textAlign: "center",
  },
});
