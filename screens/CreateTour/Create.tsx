import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

const Create = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [game, setGame] = useState('');
  const [matchType, setMatchType] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [loading, setLoading] = useState(false);
    const [rules, setrules] = useState('');


  const handleCreateTournament = async () => {
    if (!title || !game || !matchType || !maxParticipants) {
      Alert.alert('❌ Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user_id = authData?.user?.id;

    if (!user_id) {
      setLoading(false);
      Alert.alert('❌ Auth Error', 'You must be logged in to create a tournament');
      return;
    }

    const { error, data } = await supabase
      .from('tournaments')
      .insert({
        organizer_id: user_id,
        title,
        description,
        game,
        rules,
        match_type: matchType,
        required_skill_level: parseInt(skillLevel || '0'),
        max_participants: parseInt(maxParticipants),
      })
      .select();

    setLoading(false);

    if (error) {
      console.error('Insert Error:', error);
      Alert.alert(' Error', error.message);
    } else {
      console.log('Success', 'Tournament created!');
      setTitle('');
      setDescription('');
      setGame('');
      setMatchType('');
      setSkillLevel('');
      setrules(''),
      setMaxParticipants('');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.heading}> Create Tournament</Text>

      <Text style={styles.label}>Title*</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Tournament Title"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Game*</Text>
      <TextInput
        style={styles.input}
        value={game}
        onChangeText={setGame}
        placeholder="e.g., PUBG, Valorant"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Match Type*</Text>
      <TextInput
        style={styles.input}
        value={matchType}
        onChangeText={setMatchType}
        placeholder="solo, duo, squad must be one of these"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Required Skill Level</Text>
      <TextInput
        style={styles.input}
        value={skillLevel}
        onChangeText={setSkillLevel}
        keyboardType="numeric"
        placeholder="e.g., 3"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Max Participants*</Text>
      <TextInput
        style={styles.input}
        value={maxParticipants}
        onChangeText={setMaxParticipants}
        keyboardType="numeric"
        placeholder="e.g., 16"
        placeholderTextColor="#888"
      />
      <Text style={styles.label}>Match Rules</Text>
      <TextInput
        style={styles.input}
        value={rules}
        onChangeText={setrules}
        keyboardType="default"
        placeholder="rules"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the tournament..."
        placeholderTextColor="#888"
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#999' }]}
        onPress={handleCreateTournament}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating...' : 'Create Tournament'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContent: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3bff31',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    backgroundColor: '#3bff31',
    paddingVertical: 14,
    marginTop: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
