import { useAuth } from '@/app/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchUserApplications = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('tournament_applications')
      .select(`
        id,
        status,
        submitted_at,
        tournament_id,
        tournaments (title, game, match_type, description, rules)
      `)
      .eq('applicant_id', user?.id)
      .order('submitted_at', { ascending: false });

    if (!error) setApplications(data || []);
    else console.error('Fetch Error:', error.message);

    setLoading(false);
  };

  const handleCancel = async () => {
    if (!selectedApplicationId) return;

    const { error } = await supabase
      .from('tournament_applications')
      .delete()
      .eq('id', selectedApplicationId);

    if (!error) {
      setModalVisible(false);
      setSelectedApplicationId(null);
      fetchUserApplications();
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.id) fetchUserApplications();
    }, [user])
  );

  const getStatusStyle = (status: string) => ({
    color:
      status === 'accepted'
        ? '#3bff31'
        : status === 'rejected'
        ? '#ff3b3b'
        : '#ffa500',
  });

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.tournaments?.title || 'Untitled Tournament'}</Text>
      <Text style={styles.label}>Game: {item.tournaments?.game}</Text>
      <Text style={styles.label}>Match Type: {item.tournaments?.match_type}</Text>
      <Text style={styles.label} numberOfLines={3}>Intro: {item.tournaments?.description || 'None'}</Text>
      <Text style={styles.label} numberOfLines={4}>Rules: {item.tournaments?.rules || 'None'}</Text>
      <Text style={[styles.status, getStatusStyle(item.status)]}>Status: {item.status}</Text>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          setSelectedApplicationId(item.id);
          setModalVisible(true);
        }}
      >
        <Text style={styles.cancelText}>Cancel Application</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.heading}> My Applications</Text>

      {loading ? (
        <Text style={styles.status}>Loading...</Text>
      ) : applications.length === 0 ? (
        <Text style={styles.status}>No applications found.</Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        /> 
      )}

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to cancel this application?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#3bff31' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ff3b3b' }]}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyApplications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3bff31',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#3bff31',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 2,
  },
  status: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f1f1f',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
