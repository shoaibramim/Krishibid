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
import RenderComment from "./RenderComment";

const storageBucket = process.env.EXPO_PUBLIC_storageBucket;

const PostCard = ({ item }) => {
  const [userInfo, setUserInfo] = useState({});
  const [posterInfo, setPosterInfo] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [bottomSheetStatus, setBottomSheetStatus] = useState(false);
  const [liked, setLiked] = useState(false);
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [likes, setLikes] = useState([]);
  const [commentatorImage, setCommentatorImage] = useState(null);
  const [commentatorName, setCommentatorName] = useState("");
  const [likeIcon, setLikeIcon] = useState("heart-outlined");
  const [likeIconColor, setLikeIconColor] = useState("#002D02");

  //likeIcon = liked ? "heart" : "heart-outlined";
  // likeIconColor = liked ? "#510600" : "#002D02";
  const usersRef = collection(db, "users");


  if (likes.length == 1) {
    likeText = "1 Like";
  } else if (likes.length > 1) {
    likeText = likes.length + " Likes";
  } else {
    likeText = "Like";
  }

  if (comments.length == 1) {
    commentText = "1 Comment";
  } else if (comments.length > 1) {
    commentText = comments.length + " Comments";
  } else {
    commentText = "Comment";
  }

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

  const { user_id } = userInfo;

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
      } catch (error) {
        console.error("Error fetching post data: " + error + " " + item.id);
      }
    };
    fetchPostData();
  }, [item.id]);

  const updateLikeIcon = async (likes, user_id) => {
    if (likes.includes(user_id) == true) {
      setLikeIcon("heart");
      setLikeIconColor("#510600");
    }
    else {
      setLikeIcon("heart-outlined");
      setLikeIconColor("#002D02");
    }
  }

  useEffect(() => {
    if (likes.length > 0) {
      updateLikeIcon(likes, userInfo.user_id);
    }
    else {
      setLikeIcon("heart-outlined");
      setLikeIconColor("#002D02");
    }
  }, [likes]);


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

  const newLikeOrRemoveLike = () => {
    if (likes.includes(user_id) == true) {
      ///Remove the Like
      removeLike();
    } else {
      ///new Like + remove dislike
      addLike();
    }
  };

  const AddANewComment = async () => {
    const date = new Date();
    const commentId = user_id + date.getTime();
    console.log(commentId);

    const newCommentInfo = {
      "comment_id": commentId,
      "commentDescription": commentInput,
      "user_id": user_id,
      "timestamp": date,
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

  useEffect(() => {
    const fetchCommentData = async ()=>{
    
      if(comments.length>0){
        try{
          
            comments.map(async (comment, index)=>{
              let tempComments = comments;
              let tempUserData = await fetchCommentAuthor(comment.user_id)
              if(Object.keys(tempUserData).length>0){
                const tempComment = {
                  "comment_id":comment.comment_id,
                  "commentDescription":comment.commentDescription,
                  "timestamp":comment.timestamp,
                  "commentAuthor": tempUserData
                }
                tempComments[index] = tempComment
                // console.log(tempComments)
                setComments(tempComments)
              }
            })
          }
        catch(e){
          console.log(e.error)
        }
      }
        
        // console.log(tempComments[0])
    }
    if(Object.keys(item).length>0) fetchCommentData()
    
  }, [])
  const fetchCommentAuthor = async (user_id)=>{
    try{
      const q = query(usersRef, where("user_id", "==", user_id));
      const querySnapshot = await getDocs(q);
      let userDataTemp;
      querySnapshot.forEach((doc) => {
          userDataTemp = doc.data();
      });
      
      // console.log(userDataTemp)
      
      return userDataTemp
    }
    catch(e){
      console.log(e.error)
    }
    
  }

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
            <Entypo name={likeIcon} size={25} color={likeIconColor} />
            <InteractionText>{likeText}</InteractionText>
          </Interaction>
          <Interaction
            onPress={() => {setBottomSheetStatus(true)
            }}
          >
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
            <FlatList
              data={comments}
              renderItem={({ item }) => <View style={styles.singleCommentContainerWithoutProfile}>
                <Text style={styles.commentMessage}>
                  {item.commentDescription} {"  " + item.commentAuthor.firstName}
                </Text>
                <Text style={styles.commentTime}>
                  {moment(item.timestamp.toDate()).fromNow()}
                </Text>
              </View>}
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
