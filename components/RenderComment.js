import React from "react";
import moment from "moment";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import {
    Image,
    Text,
    View,
    StyleSheet,
} from "react-native";

const storageBucket = process.env.EXPO_PUBLIC_storageBucket;

const RenderComment = async ({item}) => {

    console.log(item);
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("user_id", "==", item.user_id));
    const querySnapshot = await getDocs(q);
    let userData;
    querySnapshot.forEach((doc) => {
        userData = doc.data();
    });

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

    return (
        <View style={styles.singleCommentContainer}>
            {userData.profile_url && (
                <Image
                    style={styles.commentViewProfilePhoto}
                    source={{ uri: preFetchImage(userData.profile_url) }}
                />
            )}
            <View style={styles.singleCommentContainerWithoutProfile}>
                {userData.firstName.length > 0 && 
                    <Text style={styles.commentatorName}>{userData.firstName + " " + userData.lastName}</Text>
                }
                <Text style={styles.commentMessage}>
                    {item.commentDescription}
                </Text>
                <Text style={styles.commentTime}>
                    {moment(item.timestamp.toDate()).fromNow()}
                </Text>
            </View>
        </View>
    );

}

export default RenderComment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#BAE3BB",
        alignItems: "center",
        justifyContent: "center",
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
});