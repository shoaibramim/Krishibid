
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";

import Feed from "./Feed";
import Profile from "./Profile";
import Search from "./Search";
import CreatePost from "./CreatePost";
import Notifications from "./Notifications";

function LogoTitle() {
  return (
    <Image
      style={{ width: 100, height: 60, marginTop: 10, justifyContent: 'center' }}
      source={require('../assets/Brand-logo.png')}
    />
  );
}

export default function BottomTabs(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const Tab = createBottomTabNavigator();

  const goToAbout = () => {
    navigation.push("About");
}

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveBackgroundColor: '#ffffff',
        tabBarInactiveBackgroundColor: '#ffffff',
        tabBarActiveTintColor: "#002D02",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: { position: 'absolute', height: 60, },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        initialParams={{onLayoutRootView: onLayoutRootView}}
        options={{
          headerShown: true,
          headerTitle: (props)=> <LogoTitle {...props} />,
          headerRight:()=> (<TouchableOpacity style={{paddingHorizontal: 15, marginTop: 10, justifyContent: 'center'}} onPress={goToAbout}><Entypo name="info-with-circle" size={30} color="#002D02" /></TouchableOpacity>),
          headerStyle: {backgroundColor: '#BAE3BB',},
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        initialParams={{onLayoutRootView: onLayoutRootView}}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CreatePost"
        component={CreatePost}
        initialParams={{onLayoutRootView: onLayoutRootView}}
        options={{
          tabBarLabel: "Create",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="squared-plus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        initialParams={{onLayoutRootView: onLayoutRootView}}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{onLayoutRootView: onLayoutRootView}}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
