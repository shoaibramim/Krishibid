import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import React, {useState, useEffect} from 'react';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { BottomSheet, ListItem } from '@rneui/base';


const ClickOrSelectImage = (props) => {

  const {navigation,route} = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const [imageUri, setImageUri] = useState(null);
  const [bottomSheetStatus,setBottomSheetStatus] = useState(false);
  const [logoMargin, setLogoMargin] = useState(0);



  const openCamera = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  const { status: mediaPermissionStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status === 'granted' && mediaPermissionStatus === 'granted') {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:[3,4],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setBottomSheetStatus(true)
    }
  } else {
    alert('Camera permission not granted');
  }
  };

  const openGallery = async () => {
    try{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setBottomSheetStatus(true)
      }
    }
    catch(error){
      console.log(error);
    }
    
  };

  const changeLogoMargin = ()=> {
    if(bottomSheetStatus==true){
      setLogoMargin(300);
    }
    else{
      setLogoMargin(0);
    }
  }
  
  useEffect(() => {
    changeLogoMargin()
  }, [bottomSheetStatus])
  

  return (
    <View style={styles.starterScreen}  onLayout={onLayoutRootView}>
        <Image
          style= {[styles.logoStarterScreen,{marginBottom:logoMargin}]}
          source={require("../assets/Brand-logo.png")}
        />
        <View style={styles.backgorund}>
          <Text style={styles.textStyle}> Choose </Text>
          <View style={styles.flexRow}>
          <TouchableOpacity style={styles.buttonBackgorund} onPress={openCamera}>
          <Entypo name="camera" size={35} color="#002D02" />
          </TouchableOpacity >

          <TouchableOpacity style={styles.buttonBackgorund} onPress={openGallery}>
          <FontAwesome name="photo" size={35} color="#002D02" />
          </TouchableOpacity>
          </View>
        </View>

        <BottomSheet isVisible={bottomSheetStatus}  style={styles.bottomSheetWhiteBG}>
          <ListItem>
            <Image style={styles.imageStyle}  source={{uri:imageUri}}/>
          </ListItem>
          <ListItem>
            <ListItem.Content style={styles.basicFlexStyle}> 
             <Text style={styles.resultText}>Result will be shown here.</Text>
            </ListItem.Content>
          </ListItem>
          <ListItem >
            <ListItem.Content style={[styles.basicFlexStyle]}>
              <TouchableOpacity style={styles.closeBtnStyle} onPress={()=>{setBottomSheetStatus(false)}}>
                    <FontAwesome name="close" size={20} color="#F9FAFB" />
                    <Text style={styles.closeTextStyle}>&nbsp; Close</Text>
                  </TouchableOpacity>
            </ListItem.Content>
          </ListItem>
          
        </BottomSheet>
    
    </View>
  )
}

export default ClickOrSelectImage;


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
      margin:'auto'
    },
    starterScreen: {
      borderRadius: null,
      backgroundColor: "#BAE3BB",
      flex: 1,
      justifyContent: "center",
      alignItems: 'center',
      alignContent: 'center',
      paddingHorizontal: 80,
      paddingTop: 240,
      paddingBottom: 280,
      overflow: "hidden",
      width: "100%",
    },
    backgorund: {
      borderRadius: 12,
      backgroundColor: '#F3F8F3',
      display:'flex',
      height:'auto',
      width: 'auto',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      fontFamily: 'DMMedium',
      fontSize: 20,
      color: "#002D02",
      paddingTop: 10,

    },
    flexRow: {
      flexDirection: 'row',
      justifyContent:'space-between',
    },
    buttonBackgorund: {
      borderRadius: 12,
      backgroundColor: '#D8EBD9',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: 75,
      height: 75,
      margin: 20,
    },
    buttonFlexBox: {
      marginTop: 23,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: "#002D02",
      borderRadius: 20,
      alignSelf: "stretch",
      paddingHorizontal: 50,
      paddingVertical: 20,
    },
    buttonText: {
      fontFamily: 'DMBold',
      fontSize: 24,
      color: "#F9FAFB",
      lineHeight: 26,
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
    bottomSheetWhiteBG:{
      backgroundColor:"white",
      height:'80%',
      width:'100%',
      position:'absolute',
      bottom:'0%',
      padding: 0,
      borderBottomLeftRadius:0,
      borderBottomRightRadius:0,
      borderRadius: 30,
      overflow: 'hidden',
    },
    imageStyle:{
      minHeight: 400,
      height:'100%',
      width:'100%',
      borderWidth:1,
      borderColor:'#BAE3BB',
      borderRadius: 20,
      resizeMode: 'cover',
      backgroundColor:'white',
  },
  closeBtnStyle: {
    backgroundColor: '#002D02',
    width:'auto',
    height: 'auto',
    padding: 10,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 10,

  },
  closeTextStyle: {
    fontFamily: 'DMMedium',
    fontSize: 15,
    color: "#F9FAFB",
  },
  resultText: {
    fontFamily: 'DMMedium',
    fontSize: 20,
    color: "#002D02",
  },

  });
  