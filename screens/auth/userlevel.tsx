import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight } from 'react-native-reanimated';

export default () => {
  const [Playstyle, setPlaystyle] = useState('');
    const [level, setlevel] = useState('');
  return (
    <Animated.View entering={SlideInRight.duration(500).damping(2)} style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../../assets/Appicons/VerdikX.png')}
          style={styles.logo}
        />
        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter your Playstyle</Text>
          <TextInput
            placeholder="Enter Your Playstyle"
            placeholderTextColor={'white'}
            style={styles.textInput}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            value={Playstyle}
            onChangeText={setPlaystyle}
            accessibilityLabel="Username input"
          />
          <Text style={styles.label}>Enter your ID level</Text>
          <TextInput
            placeholder="Enter Your Playstyle"
            placeholderTextColor={'white'}
            style={styles.textInput}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            value={level}
            onChangeText={setlevel}
            accessibilityLabel="Username input"
          />
          <TouchableOpacity onPress={()=>router.push('/(tabs)')} style={
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
                Complete
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
