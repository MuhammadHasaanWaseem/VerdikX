import { useAuth } from '@/app/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ApplicationIo = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicationsForMyTournaments = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('tournament_applications')
      .select(`
        id,
        status,
        submitted_at,
        applicant_id,
        team_name,
        tournaments (title, organizer_id),
        user_records!applicant_id (username, game_uid)
      `)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Fetch Error:', error.message);
      setLoading(false);
      return;
    }

    const filtered = data.filter((app) => app.tournaments?.organizer_id === user?.id);
    setApplications(filtered);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('tournament_applications')
      .update({ status, responded_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      Alert.alert(' Update Failed', error.message);
    } else {
      fetchApplicationsForMyTournaments();
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchApplicationsForMyTournaments();
      }
    }, [user])
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.tournamentTitle}>{item.tournaments?.title || 'Untitled Tournament'}</Text>
      <Text style={styles.label}>Applicant: {item.user_records?.username || 'Unknown'}</Text>
      {item.user_records?.game_uid && (
        <Text style={styles.label}>Game UID: {item.user_records.game_uid}</Text>
      )}
      {item.team_name && <Text style={styles.label}>Team Name: {item.team_name}</Text>}
      <Text style={styles.statusText}>
        Status: <Text style={[styles.statusValue, getStatusColor(item.status)]}>{item.status}</Text>
      </Text>

      {item.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#3bff31' }]}
            onPress={() => updateStatus(item.id, 'accepted')}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#ff4d4d' }]}
            onPress={() => updateStatus(item.id, 'rejected')}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return { color: '#3bff31' };
      case 'rejected':
        return { color: '#ff4d4d' };
      case 'pending':
      default:
        return { color: '#ffa500' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Applications for Your Tournaments</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3bff31" />
      ) : applications.length === 0 ? (
        <Text style={styles.noData}>No applications found for your tournaments.</Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default ApplicationIo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3bff31',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  tournamentTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
  statusText: {
    marginTop: 6,
    fontSize: 14,
    color: '#fff',
  },
  statusValue: {
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noData: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
});
