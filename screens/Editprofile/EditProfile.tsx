import { useAuth } from '@/app/context/AuthProvider';
import Toast from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfile() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    avatar: '',
    game_uid: '',
    user_level: '',
    playstyle: '',
    favourite_games: '',
    User_about: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('user_records')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        setToastMessage('Failed to fetch profile data');
        setShowToast(true);
      } else if (data) {
        setProfile({
          username: data.username || '',
          email: data.email || '',
          avatar: data.avatar || '',
          game_uid: data.game_uid || '',
          user_level: data.user_level ? String(data.user_level) : '',
          playstyle: data.playstyle || '',
          favourite_games: data.favourite_games ? data.favourite_games.join(', ') : '',
          User_about: data.User_about || '',
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    // Update user profile fields
    const updates = {
      username: profile.username,
      avatar: profile.avatar,
      game_uid: profile.game_uid,
      user_level: parseInt(profile.user_level) || null,
      playstyle: profile.playstyle,
      favourite_games: profile.favourite_games.split(',').map(s => s.trim()),
      User_about: profile.User_about,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('user_records')
      .update(updates)
      .eq('user_id', user?.id);

    if (error) {
      setToastMessage('Failed to update profile');
      setShowToast(true);
      setLoading(false);
      return;
    }

    // Handle password change if requested
    if (passwords.newPassword) {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setToastMessage('New password and confirm password do not match');
        setShowToast(true);
        setLoading(false);
        return;
      }
      // Supabase does not provide current password verification on client side,
      // so we just update the password here.
      const { error: passError } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      });
      if (passError) {
        setToastMessage('Failed to update password');
        setShowToast(true);
        setLoading(false);
        return;
      }
    }

    setToastMessage('Profile updated successfully');
    setShowToast(true);
    setLoading(false);
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3bff31" />
        <StatusBar hidden />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={profile.username}
        onChangeText={text => setProfile({ ...profile, username: text })}
      />

      <Text style={styles.label}>Avatar URL</Text>
      <TextInput
        style={styles.input}
        value={profile.avatar}
        onChangeText={text => setProfile({ ...profile, avatar: text })}
      />

      <Text style={styles.label}>Game UID</Text>
      <TextInput
        style={styles.input}
        value={profile.game_uid}
        onChangeText={text => setProfile({ ...profile, game_uid: text })}
      />

      <Text style={styles.label}>User Level</Text>
      <TextInput
        style={styles.input}
        value={profile.user_level}
        keyboardType="numeric"
        onChangeText={text => setProfile({ ...profile, user_level: text })}
      />

      <Text style={styles.label}>Playstyle</Text>
      <TextInput
        style={styles.input}
        value={profile.playstyle}
        onChangeText={text => setProfile({ ...profile, playstyle: text })}
      />

      <Text style={styles.label}>Favourite Games (comma separated)</Text>
      <TextInput
        style={styles.input}
        value={profile.favourite_games}
        onChangeText={text => setProfile({ ...profile, favourite_games: text })}
      />

      <Text style={styles.label}>About Me</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={profile.User_about}
        onChangeText={text => setProfile({ ...profile, User_about: text })}
      />

      <Text style={styles.sectionTitle}>Change Password</Text>

      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={passwords.currentPassword}
        onChangeText={text => setPasswords({ ...passwords, currentPassword: text })}
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={passwords.newPassword}
        onChangeText={text => setPasswords({ ...passwords, newPassword: text })}
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={passwords.confirmPassword}
        onChangeText={text => setPasswords({ ...passwords, confirmPassword: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      {showToast && <Toast message={toastMessage} onHide={() => setShowToast(false)} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3bff31',
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3bff31',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3bff31',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 18,
  },
});
