import { useAuth } from '@/app/context/AuthProvider';
import Toast from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight } from 'react-native-reanimated';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);

async function verifyOtp() {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'signup',
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setIsOtpModalVisible(false); // Close modal
      router.push('/(auth)/Username'); // Navigate to next page
    }

    setLoading(false);
  }


  const signUpWithEmail = async () => {
       if (password !== confirmPassword) {
      setToastMessage('Passwords do not match');
      return;
    }
    if(password.length ==0 || email.length==0){
      setToastMessage('Please fill in both fields');
    }
    

    else if (password.length < 8) {
      setToastMessage('Password should be at least 8 characters long');
      return;
    }
    setLoading(true);

      setToastMessage('Please check your inbox for email verification!');
            setIsOtpModalVisible(true); // Close modal

      
    
  };

  return (
    <Animated.View entering={SlideInRight.duration(500).damping(2)} style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.innerContainer}>
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
            keyboardType='email-address'
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email input"
          />
          <Text style={styles.label}>Enter Your Password</Text>
          <TextInput
            placeholder="Enter Your Password"
            placeholderTextColor={'white'}
            style={styles.textInput}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password input"
          />
          <Text style={styles.label}>Confirm Your Password</Text>
          <TextInput
            placeholder="Confirm Your Password"
            placeholderTextColor={'white'}
            style={styles.textInput}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            accessibilityLabel="Confirm Password input"
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
          <TouchableOpacity onPress={signUpWithEmail} disabled={loading}>
            <ArrowRight color={'#3bff31'} strokeWidth={3} size={33} />
          </TouchableOpacity>
        </View>
        <View style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          marginTop: 10,
        }}>
          <Text style={{
            fontSize: 15,
            color: 'white',
          }}>
            Already have an account?
          </Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#3bff31',
              textDecorationLine: 'underline',
            }}>
              Sign in
            </Text>
          </Pressable>
        </View>
            {/* OTP Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isOtpModalVisible}
          onRequestClose={() => setIsOtpModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#999"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={verifyOtp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 
                  <ActivityIndicator size={24} color={'black'}/> : 'Verify OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {toastMessage && <Toast message={toastMessage} onHide={() => setToastMessage(null)} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  }, 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'black',
    marginBottom: 15,
  }, button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3bff31',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
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
