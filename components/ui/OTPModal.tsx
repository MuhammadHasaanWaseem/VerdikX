import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResend: () => void;
  loading?: boolean;
  errorMessage?: string | null;
  resendLoading?: boolean;
  resendSuccessMessage?: string | null;
}

const OTPModal = ({ visible, onClose, onVerify, onResend, loading = false, errorMessage = null, resendLoading = false, resendSuccessMessage = null }: OTPModalProps) => {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    onVerify(otp);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter OTP</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
            placeholderTextColor="#999"
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {resendSuccessMessage ? <Text style={styles.successText}>{resendSuccessMessage}</Text> : null}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={onClose} disabled={loading || resendLoading}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resendButton]} onPress={onResend} disabled={loading || resendLoading}>
              <Text style={styles.buttonText}>{resendLoading ? 'Resending...' : 'Resend OTP'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.verifyButton]} onPress={handleVerify} disabled={loading || otp.length !== 6}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#3bff31',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#3bff31',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#3bff31',
    borderWidth: 1,
    borderRadius: 10,
    color: 'white',
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: '#3bff31',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#3bff31',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  resendButton: {
    backgroundColor: '#007bff',
  },
  verifyButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OTPModal;
