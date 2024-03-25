import React, { useEffect, useState } from "react";
import { FontAwesome, Entypo } from "@expo/vector-icons";
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
import { Image, View } from "react-native";

const PostCard = ({ item }) => {
  const [userInfo, setUserInfo] = useState({});

  likeIcon = item.liked ? "heart" : "heart-outlined";
  likeIconColor = item.liked ? "#510600" : "#002D02";

  if (item.likes == 1) {
    likeText = "1 Like";
  } else if (item.likes > 1) {
    likeText = item.likes + " Likes";
  } else {
    likeText = "Like";
  }

  if (item.comments == 1) {
    commentText = "1 Comment";
  } else if (item.comments > 1) {
    commentText = item.comments + " Comments";
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
      });
    };
    getUser();
  }, []);

  return (
    <View style={{ alignItems: "center" }}>
      <Card
        key={item.id}
        style={{
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <UserInfo>
          <UserImg source={item.userImg} />
          <UserInfoText>
            <UserName>{item.userName}</UserName>
            {/* <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime> */}
            <PostTime>{item.postTime}</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText>{item.post}</PostText>
        {/* {item.postImg != null ? <PostImg source={{uri: item.postImg}} /> : <Divider />} */}
        {item.postImg != null ? (
          <Image
            source={item.postImg}
            style={{ width: "100%", height: 250 }}
            resizeMode="cover"
          />
        ) : (
          <Divider />
        )}

        <InteractionWrapper>
          <Interaction>
            <Entypo name={likeIcon} size={25} color={likeIconColor} />
            <InteractionText>{likeText}</InteractionText>
          </Interaction>
          <Interaction>
            <FontAwesome name="commenting" size={24} color="#002D02" />
            <InteractionText>{commentText}</InteractionText>
          </Interaction>
        </InteractionWrapper>
      </Card>
    </View>
  );
};

export default PostCard;
