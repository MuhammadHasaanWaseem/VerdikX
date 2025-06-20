import { useAuth } from '@/app/context/AuthProvider';
import Toast from '@/components/ui/Toast';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight, SlideInUp } from 'react-native-reanimated';

export default () => {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setToastMessage('Please enter email and password');
      return;
    }
    const { error } = await signIn(username, password);
    if (error) {
      setToastMessage(error.message);
    } else {
      router.push('/(tabs)');
    }
  };

  return (
    <Animated.View entering={SlideInRight.duration(500).damping(2)} style={styles.container}>
      <StatusBar hidden={true} />
      <Animated.View entering={SlideInUp.duration(500)} style={styles.innerContainer}>
        <Image
          source={require('../../assets/Appicons/VerdikX.png')}
          style={styles.logo}
        />
        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter your Email</Text>
          <TextInput
            placeholder="Enter Your Email"
            placeholderTextColor={'white'}
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            accessibilityLabel="Email input"
          />
          <Text style={styles.label}>Enter Your Password</Text>
          <TextInput
            placeholder="Enter Your Password"
            placeholderTextColor={'white'}
            style={styles.textInput}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            accessibilityLabel="Password input"
          />
        </View>
        <View style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 19,
            fontWeight: '900',
            color: 'white',
          }}>
            Continue
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <ArrowRight color={'#3bff31'} strokeWidth={3} size={33} />
          </TouchableOpacity>
        </View>
        <View style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 15,
            color: 'white',
          }}>
            Doesn't have an account
          </Text>
          <Pressable onPress={() => router.push('/signup')}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: '#3bff31',
                textDecorationLine: 'underline',
              }}>
              Sign up
            </Text>
          </Pressable>
        </View>
      </Animated.View>
      {toastMessage && <Toast message={toastMessage} onHide={() => setToastMessage(null)} />}
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
    fontWeight:'900',
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
