import React, { useEffect, useState } from "react";
import { FontAwesome, Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc,
  getDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { BottomSheet, ListItem } from "@rneui/base";

const storageBucket = process.env.EXPO_PUBLIC_storageBucket;

const PostCard = ({ item }) => {
  const [userInfo, setUserInfo] = useState({});
  const [posterInfo, setPosterInfo] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [bottomSheetStatus, setBottomSheetStatus] = useState(false);
  const [postData, setPostData] = useState({});
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [likeIcon, setLikeIcon] = useState("like2");
  const [dislikeIcon, setDislikeIcon] = useState("dislike2");
  const [likeIconColor, setLikeIconColor] = useState("#002D02");
  const [dislikeIconColor, setDislikeIconColor] = useState("#002D02");

  const usersRef = collection(db, "users");

  useEffect(() => {
    const getCurrentUser = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo(user);
      } else {
        const q = query(usersRef, where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserInfo(userData);
        });
      }
    };
    getCurrentUser();
  }, []);

  const { user_id, username } = userInfo;

  useEffect(() => {
    const getUser = async () => {
      const q = query(usersRef, where("user_id", "==", item.user_id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setPosterInfo(userData);
        setProfileImage(preFetchImage(userData.profile_url));
      });
    };
    if (item.id) {
      getUser();
    }
  }, [item.id]);

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

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postDoc = await getDoc(doc(db, "posts", item.id));
        const tempPostData = postDoc.data();
        setPostData(tempPostData);
        setComments(tempPostData.comments);
        setLikes(tempPostData.likes);
        setDislikes(tempPostData.dislikes);
      } catch (error) {
        console.error("Error fetching post data: " + error + " " + item.id);
      }
    };
    fetchPostData();
  }, [item.id]);

  const updateLikeIcon = async (likes, user_id) => {
    if (likes.includes(user_id) == true) {
      setLikeIcon("like1");
      setLikeIconColor("#002D02");
    } else {
      setLikeIcon("like2");
      setLikeIconColor("#002D02");
    }
  };
  const updateDislikeIcon = async (dislikes, user_id) => {
    if (dislikes.includes(user_id) == true) {
      setDislikeIcon("dislike1");
      setDislikeIconColor("#510600");
    } else {
      setDislikeIcon("dislike2");
      setDislikeIconColor("#002D02");
    }
  };

  useEffect(() => {
    if (likes.length > 0) {
      updateLikeIcon(likes, userInfo.user_id);
    } else {
      setLikeIcon("like2");
      setLikeIconColor("#002D02");
    }
  }, [likes]);
  useEffect(() => {
    if (dislikes.length > 0) {
      updateDislikeIcon(dislikes, userInfo.user_id);
    } else {
      setDislikeIcon("dislike2");
      setDislikeIconColor("#002D02");
    }
  }, [dislikes]);

  const removeLike = async () => {
    try {
      await updateDoc(doc(db, "posts", item.id), {
        likes: arrayRemove(user_id),
      });
      const tempLikes = likes.filter((item) => item != user_id);
      setLikes(tempLikes);
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

  const addLike = async () => {
    try {
      await updateDoc(doc(db, "posts", item.id), {
        likes: arrayUnion(user_id),
      });
      setLikes([...likes, user_id]);
    } catch (error) {
      console.error("Error adding likes:", error);
    }
  };

  const removeDislike = async()=>{
    try {
      await updateDoc(doc(db, "posts", item.id), {
        dislikes: arrayRemove(user_id),
      });
      const tempDislikes = dislikes.filter(item=>item!= user_id)
      setDislikes(tempDislikes);
      
    } catch (error) {
      console.error('Error removing dislikes:', error);
    }
  }

  const addDislike =  async()=>{
    try {
      await updateDoc(doc(db, "posts", item.id), {
        dislikes: arrayUnion(user_id),
      })
      setDislikes([...dislikes, user_id]);
    } 
    catch (error) {
      console.error('Error adding dislikes:', error);
    }
  }

  const newLikeOrRemoveLike = () => {
    if (likes.includes(user_id) == true) {
      ///Remove the Like
      removeLike();
    } else {
      ///new Like + remove dislike
      addLike();
      removeDislike();
    }
  };

  const newDislikeOrRemoveDislike = ()=>{
    if(dislikes.includes(user_id)==true){
      removeDislike();
    }
    else{
      addDislike();
      removeLike();
    }
  }

  const AddANewComment = async () => {
    const date = Timestamp.fromDate(new Date());
    const commentId = user_id + date.toString();

    const newCommentInfo = {
      comment_id: commentId,
      commentDescription: commentInput,
      username: username,
      timestamp: date,
    };
    try {
      await updateDoc(doc(db, "posts", item.id), {
        comments: [...comments, newCommentInfo],
      });
      setComments([...comments, newCommentInfo]);
      setCommentInput("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      <Card key={item.id} style={styles.postShadow}>
        <UserInfo>
          {profileImage && <UserImg source={{ uri: profileImage }} />}
          <UserInfoText>
            <UserName>
              {posterInfo ? posterInfo.firstName : ""}{" "}
              {posterInfo ? posterInfo.lastName : ""}
            </UserName>
            <PostTime>{moment(item.postedTime.toDate()).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText>{item.postDescription}</PostText>
        {item.postImg != null ? (
          <PostImg
            source={{ uri: preFetchImage(item.postImg) }}
            resizeMode="cover"
          />
        ) : (
          <Divider />
        )}

        <InteractionWrapper>
          <Interaction onPress={newLikeOrRemoveLike}>
            <AntDesign name={likeIcon} size={25} color={likeIconColor} />
            <InteractionText>{likes.length}</InteractionText>
          </Interaction>
          <Interaction onPress={newDislikeOrRemoveDislike}>
            <AntDesign name={dislikeIcon} size={25} color={dislikeIconColor} />
            <InteractionText>{dislikes.length}</InteractionText>
          </Interaction>
          <Interaction
            onPress={() => {
              setBottomSheetStatus(true);
            }}
          >
            <FontAwesome name="commenting" size={24} color="#002D02" />
            <InteractionText>{comments.length}</InteractionText>
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
            <FlatList
              data={comments}
              renderItem={({ item }) => (
                <View style={styles.singleCommentContainerWithoutProfile}>
                  <Text style={styles.commentatorName}>@{item.username}</Text>
                  <Text style={styles.commentMessage}>
                    {item.commentDescription}
                  </Text>
                  <Text style={styles.commentTime}>
                    {moment(item.timestamp.toDate()).fromNow()}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.comment_id}
              scrollEnabled={false}
            />

            <ListItem>
              <ListItem.Content style={styles.addCommentContainer}>
                <TextInput
                  style={styles.commentTextInputBox}
                  placeholder="Write a comment..."
                  multiline={true}
                  value={commentInput}
                  onChangeText={(text) => setCommentInput(text)}
                />
                <TouchableOpacity
                  disabled={commentInput.trim().length == 0}
                  onPress={AddANewComment}
                  style={commentInput.trim().length == 0 && { opacity: 0.5 }}
                >
                  <Ionicons name="send" size={32} color="#002D02" />
                </TouchableOpacity>
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
    margin: 5,
    marginHorizontal: 20,
  },
  commentatorName: {
    fontFamily: "DMBold",
    fontSize: 14,
    color: "#002D02",
    marginBottom: 3,
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
    marginTop: 10,
    marginLeft: 10,
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
