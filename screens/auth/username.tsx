import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight } from 'react-native-reanimated';

export default () => {
  const [username, setUsername] = useState('');
  

  return (
    <Animated.View entering={SlideInRight.duration(500).damping(2)} style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../../assets/Appicons/VerdikX.png')}
          style={styles.logo}
        />
        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter your in game Username</Text>
          <TextInput
            placeholder="Enter Your Username"
            placeholderTextColor={'white'}
            style={styles.textInput}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
            accessibilityLabel="Username input"
          />
          <TouchableOpacity onPress={()=>router.push('/(auth)/UserId')} style={
          {
            backgroundColor:'#3bff31',
            paddingVertical:10,
            borderRadius:12,
            paddingHorizontal:10
          }}>
            <Text style={{
                color: 'black',
                fontSize: 16,
                fontWeight:'900'
            }}>
                Continue Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 12,
    width: '80%',
  },
  label: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  textInput: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 15,
    width: '100%',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
});
