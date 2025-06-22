import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const gameIcon = require('../../assets/images/icon.png'); // Placeholder game icon

export default function ApplyScreen() {
  const { tournamentId } = useLocalSearchParams();
  const router = useRouter();

  const [applied, setApplied] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Static Tournament Details (fetch by ID in real app)
  const tournament = {
    id: tournamentId,
    name: 'Champions Cup',
    organizer: 'Gaming League',
    description: 'An intense tournament for top players.',
    playersRequired: '5v5',
    dueDate: '2024-07-15',
    gameName: 'Valorant',
    gameIcon: gameIcon,
  };

  const handleApply = () => {
    setApplied(true);
    setModalVisible(true);
  };

  const handleYes = () => {
    setApplied(true);
    setModalVisible(true);
  };

  const handleNo = () => {
    router.back();
  };

  const closeModalAndGoBack = () => {
    setModalVisible(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.card}>
        <Image source={tournament.gameIcon} style={styles.gameIcon} />

        <Text style={styles.title}>{tournament.name}</Text>
        <Text style={styles.info}>Organizer: {tournament.organizer}</Text>
        <Text style={styles.info}>Game: {tournament.gameName}</Text>
        <Text style={styles.info}>Players Required: {tournament.playersRequired}</Text>
        <Text style={styles.info}>Due Date: {tournament.dueDate}</Text>
        <Text style={styles.description}>{tournament.description}</Text>

        {!applied ? (
          <>
            <Text style={styles.confirmText}>Are you sure you want to apply?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.yesButton} onPress={handleYes}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.noButton} onPress={handleNo}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModalAndGoBack}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalText}>Application Successful!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModalAndGoBack}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  gameIcon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    color: '#3bff31',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  info: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    color: 'white',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  yesButton: {
    backgroundColor: '#3bff31',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  noButton: {
    backgroundColor: '#ff3b3b',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#121212',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    color: '#3bff31',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#3bff31',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
