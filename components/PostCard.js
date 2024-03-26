import React, { useEffect, useState } from "react";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from "../styles/PostStyle";
import moment from "moment";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { BottomSheet, ListItem } from "@rneui/base";

const storageBucket= process.env.EXPO_PUBLIC_storageBucket;

const PostCard = ({ item }) => {
  const [userInfo, setUserInfo] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [bottomSheetStatus, setBottomSheetStatus] = useState(false);
  const [liked, setLiked] = useState(false);

  likeIcon = item.liked ? "heart" : "heart-outlined";
  likeIconColor = item.liked ? "#510600" : "#002D02";

  if (item.likes.length == 1) {
    likeText = "1 Like";
  } else if (item.likes.length > 1) {
    likeText = item.likes.length + " Likes";
  } else {
    likeText = "Like";
  }

  if (item.comments.length == 1) {
    commentText = "1 Comment";
  } else if (item.comments.length > 1) {
    commentText = item.comments.length + " Comments";
  } else {
    commentText = "Comment";
  }

  useEffect(() => {
    const getUser = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("user_id", "==", item.user_id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setUserInfo(userData);
        setProfileImage(preFetchImage(userData.profile_url));
      });
    };
    getUser();
  }, []);

  const getImageUrlToShow = (image) => {
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(
      image
    )}?alt=media`;

    return imageUrl;
  };

  const preFetchImage = (image) => {
    const imageRef = getImageUrlToShow(image);

    return imageRef;
  };

  const renderComment = () => {
    setBottomSheetStatus(true);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <Card key={item.id} style={styles.postShadow}>
        <UserInfo>
          {profileImage&&(<UserImg source={{uri: profileImage}} />)}
          <UserInfoText>
            <UserName>{userInfo? userInfo.firstName: ""}{" "}{userInfo? userInfo.lastName: ""}</UserName>
            <PostTime>{moment(item.postedTime.toDate()).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText>{item.postDescription}</PostText>
        {item.postImg != null ? (
          <PostImg source={{uri: preFetchImage(item.postImg)}} resizeMode="cover" />
        ) : (
          <Divider />
        )}

        <InteractionWrapper>
          <Interaction>
            <Entypo name={likeIcon} size={25} color={likeIconColor} />
            <InteractionText>{likeText}</InteractionText>
          </Interaction>
          <Interaction onPress={renderComment}>
            <FontAwesome name="commenting" size={24} color="#002D02" />
            <InteractionText>{commentText}</InteractionText>
          </Interaction>
          <BottomSheet
            isVisible={bottomSheetStatus}
            style={styles.commentBottomSheetContainer}
          >
            <ListItem>
              <ListItem.Content style={styles.flexRowStart}>
                <TouchableOpacity
                  onPress={() => {
                    setBottomSheetStatus(false);
                  }}
                >
                  <Entypo name="chevron-left" size={28} color="#002D02" />
                </TouchableOpacity>

                <Text style={styles.commentViewHeadline}>Comments</Text>
              </ListItem.Content>
            </ListItem>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ListItem>
                <ListItem.Content style={styles.singleCommentContainer}>
                  <Image
                    style={styles.commentViewProfilePhoto}
                    source={require("../assets/placeholder.png")}
                  />
                  <ListItem.Content
                    style={styles.singleCommentContainerWithoutProfile}
                  >
                    <Text style={styles.commentatorName}>Mikasa Ackerman</Text>
                    <Text style={styles.commentMessage}>
                      Stunning Photo... Colors looks so accurate and feels like
                      refreshing no matter how long I keep looking at this
                      photo!!
                    </Text>
                    <Text style={styles.commentTime}>3 Hours ago</Text>
                  </ListItem.Content>
                </ListItem.Content>
              </ListItem>
            </ScrollView>
            <ListItem>
              <ListItem.Content style={styles.addCommentContainer}>
                  <TextInput style={styles.commentTextInputBox} placeholder="Write a comment..." multiline={true} />
                  <Ionicons name="send" size={32} color="#002D02" />
              </ListItem.Content>
            </ListItem>
          </BottomSheet>
        </InteractionWrapper>
      </Card>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE3BB",
    alignItems: "center",
    justifyContent: "center",
  },
  postShadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  commentBottomSheetContainer: {
    backgroundColor: "white",
    height: "60%",
    width: "100%",
    position: "absolute",
    bottom: "0%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 30,
    overflow: "hidden",
    padding: 5,
  },
  flexRowStart: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  commentViewHeadline: {
    fontFamily: "DMBold",
    fontSize: 20,
    color: "#002D02",
    textAlign: "center",
    justifyContent: "center",
    marginLeft: 85,
  },
  singleCommentContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 10,
  },
  commentViewProfilePhoto: {
    height: 40,
    width: 40,
    borderRadius: 30,
    marginRight: 5,
  },
  singleCommentContainerWithoutProfile: {
    flexDirection: "column",
    backgroundColor: "#E6E6E6",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
  },
  commentatorName: {
    fontFamily: "DMBold",
    fontSize: 14,
    color: "#002D02",
  },
  commentMessage: {
    fontFamily: "DMRegular",
    fontSize: 12,
    color: "black",
  },
  commentTime: {
    fontFamily: "DMMedium",
    fontSize: 10,
    color: "#510600",
    marginTop: 5,
    marginLeft: 190,
  },
  addCommentContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 10,
    alignItems: "center",
    gap: 10,
  },
  commentTextInputBox: {
    fontFamily: "DMRegular",
    fontSize: 14,
    backgroundColor: "#D8EBD9",
    minHeight: 50,
    minWidth: "80%",
    width: "80%",
    borderRadius: 15,
    padding: 10,
  },
});
