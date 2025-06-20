import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight } from 'react-native-reanimated';
import { supabase } from '../../lib/supabase';

export default () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateOtp = (input: string) => {
    // OTP should be exactly 6 digits numeric
    const otpRegex = /^[0-9]{6}$/;
    return otpRegex.test(input);
  };

  const onChangeOtp = (input: string) => {
    setOtp(input);
    if (input.length === 6) {
      if (!validateOtp(input)) {
        setError('OTP must be 6 digits numeric');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  const onProceed = async () => {
    if (!validateOtp(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Call Supabase function to verify OTP
      // Assuming OTP verification is done via a custom RPC or API
      // Replace 'verify_otp' with actual function or API call
      const { data, error: verifyError } = await supabase
        .rpc('verify_otp', { otp_code: otp });

      if (verifyError) {
        setError('OTP verification failed. Please try again.');
        setLoading(false);
        return;
      }

      if (data?.valid) {
        // OTP verified successfully, clear error and proceed to next screen
        setError('');
        router.push('/(auth)/Username');
      } else {
        setError('Invalid OTP. Please check your email and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
    setLoading(false);
  };

  const isProceedDisabled = otp.length !== 6 || error.length > 0 || loading;

  return (
    <Animated.View entering={SlideInRight.duration(500).damping(2)} style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../../assets/Appicons/VerdikX.png')}
          style={styles.logo}
        />
        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            placeholder="Enter OTP"
            placeholderTextColor={'white'}
            style={styles.textInput}
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            value={otp}
            onChangeText={onChangeOtp}
            maxLength={6}
            accessibilityLabel="OTP input"
            editable={!loading}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            onPress={onProceed}
            style={[
              styles.proceedButton,
              isProceedDisabled ? styles.proceedButtonDisabled : null,
            ]}
            disabled={isProceedDisabled}
          >
            <Text style={styles.proceedButtonText}>
              {loading ? 'Verifying...' : 'Proceed to Next'}
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
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontWeight: '700',
    marginBottom: 10,
  },
  proceedButton: {
    backgroundColor: '#3bff31',
    paddingVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  proceedButtonDisabled: {
    backgroundColor: '#7fff7f',
  },
  proceedButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
});
