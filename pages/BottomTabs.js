
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";

import Feed from "./Feed";
import Profile from "./Profile";
import Search from "./Search";
import CreatePost from "./CreatePost";
import Notifications from "./Notifications";

export default function BottomTabs(props) {
  const { navigation, route } = props;
  const onLayoutRootView = route.params.onLayoutRootView;

  const Tab = createBottomTabNavigator();

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
