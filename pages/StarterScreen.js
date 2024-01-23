import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const StarterScreen = () => {
  return (
    <View>
        <Image />
      <Text style={styles.regularText}>Starter Screen</Text>
    </View>
  )
}

export default StarterScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#BAE3BB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    regularText: {
        fontFamily: "DMMedium",
        fontSize: 30,
        color: "#002D02"
    }
  });
  