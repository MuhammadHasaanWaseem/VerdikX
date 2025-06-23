import { useAuth } from '@/app/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Gamepad2, Trophy, UserPlus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function ApplyScreen() {
  const { tournamentId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTournament = async () => {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (data) setTournament(data);
    if (error) console.error('Error fetching tournament:', error.message);
    setLoading(false);
  };

  useEffect(() => {
    if (tournamentId) fetchTournament();
  }, [tournamentId]);

  const handleApply = async () => {
    if (!user?.id) return;

    const { error: insertError } = await supabase.from('tournament_applications').insert({
      tournament_id: tournamentId,
      applicant_id: user.id,
    });

    if (insertError) {
      console.error('Application Error:', insertError.message);
      return;
    }

    await supabase.rpc('increment_tournament_count', { user_id_input: user.id });
    setModalVisible(true);
  };

  const closeModalAndGoBack = () => {
    setModalVisible(false);
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3bff31" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading tournament...</Text>
      </View>
    );
  }

  if (!tournament) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Tournament not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#3bff31', marginTop: 12 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.card}>
        <Trophy color="#3bff31" size={36} style={{ marginBottom: 15 }} />
        <Text style={styles.title}>{tournament.title}</Text>
        <View style={styles.row}><Gamepad2 color="#aaa" size={20} /><Text style={styles.info}> {tournament.game}</Text></View>
        <View style={styles.row}><UserPlus color="#aaa" size={20} /><Text style={styles.info}> {tournament.match_type} players</Text></View>
        <Text style={styles.info}>Skill Level: {tournament.required_skill_level}</Text>
        <Text style={styles.description}>{tournament.description || 'No description provided.'}</Text>

        <Text style={styles.confirmText}>Are you sure you want to apply?</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.yesButton} onPress={handleApply}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noButton} onPress={() => router.back()}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModalAndGoBack}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalText}>🎉 Application Successful!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModalAndGoBack}>
              <Text style={styles.modalButtonText}>Return</Text>
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
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#3bff31',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  title: {
    color: '#3bff31',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  info: {
    color: 'white',
    fontSize: 16,
    marginLeft: 4,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 20,
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