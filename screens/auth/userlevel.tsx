import { useSignup } from '@/app/context/SignupContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight } from 'react-native-reanimated';

export default () => {
  const { signupData, setSignupData } = useSignup();
  const [playstyle, setPlaystyle] = useState(signupData.playstyle);
  const [level, setLevel] = useState(signupData.user_level ? signupData.user_level.toString() : '');

  const handleComplete = async () => {
    if (!playstyle || !level) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSignupData(prev => ({ ...prev, playstyle, user_level: parseInt(level, 10) }));

    // Insert user data into user_records table
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;

    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    const { error } = await supabase.from('user_records').insert([{
      user_id: userId,
      email: signupData.email,
      password: signupData.password,
      username: signupData.username,
      game_uid: signupData.game_uid,
      user_level: parseInt(level, 10),
      playstyle: playstyle,
      avatar: signupData.avatar || null,
    }]);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    router.push('/(tabs)');
  };

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
            value={playstyle}
            onChangeText={setPlaystyle}
            accessibilityLabel="Playstyle input"
          />
          <Text style={styles.label}>Enter your ID level</Text>
          <TextInput
            placeholder="Enter Your Level"
            placeholderTextColor={'white'}
            style={styles.textInput}
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            value={level}
            onChangeText={setLevel}
            accessibilityLabel="Level input"
          />
          <TouchableOpacity onPress={handleComplete} style={
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
