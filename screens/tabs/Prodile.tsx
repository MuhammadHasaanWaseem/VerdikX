import { useAuth } from '@/app/context/AuthProvider';
import { UserProfile } from '@/inteface/userprofile';
import { supabase } from '@/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('user_records')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (data) setProfile(data);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        setLoading(true);
        fetchUserData();
      }
    }, [user])
  );

  // Remove the previous useEffect that fetches data on user change

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <StatusBar hidden />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden={false} />
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        
        {/* <TouchableOpacity style={styles.editButton} onPress={() => router.push('/Editprofile')}>
          <MaterialIcons name="edit" size={24} color="#3bff31" />
        </TouchableOpacity> */}
          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/drawer')}>
          <MaterialIcons name="menu" size={24} color="#3bff31" />
        </TouchableOpacity> 
      </View>

      <View style={styles.profileCard}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10
        }}>
          <Image
            source={
              profile?.avatar
                ? { uri: profile.avatar }
                : require('../../assets/Appicons/default-avatar.png')
            }
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>{profile?.username || 'Username'}</Text>
            <Text style={styles.email}>{profile?.email || 'Email'}</Text>
            <Text style={styles.userid
            }>UID : {profile?.user_id || 'NA'}</Text>

          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/freinds')}>
            <MaterialIcons name="person" size={20} color="black" />
            <Text style={styles.buttonText}>Your Friends</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/freindreq')}>
            <MaterialIcons name="person-add" size={20} color="black" />
            <Text style={styles.buttonText}>Friend Requests</Text>
          </TouchableOpacity></View>
            
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>User Details</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="badge" size={20} color="#3bff31" />
            <Text style={styles.infoLabel}>Game UID:</Text>
            <Text style={styles.infoValue}>{profile?.game_uid || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="star" size={20} color="#3bff31" />
            <Text style={styles.infoLabel}>User Level:</Text>
            <Text style={styles.infoValue}>{profile?.user_level ?? 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="sports-esports" size={20} color="#3bff31" />
            <Text style={styles.infoLabel}>Playstyle:</Text>
            <Text style={styles.infoValue}>{profile?.playstyle || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="favorite" size={20} color="#3bff31" />
            <Text style={styles.infoLabel}>Favourite Games:</Text>
          </View>
          <Text style={styles.favGames}>
            {profile?.favourite_games?.length ? profile.favourite_games.join(', ') : 'None'}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>{profile?.User_about || 'No description provided.'}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Member Since</Text>
          <Text style={styles.joinedDate}>
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  editButton: {
    padding: 6,
  }, actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3bff31',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    gap: 6,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: 'black',
  },
  profileCard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,

    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#3bff31',
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: '#bbb',
  },
  userid: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 20,
  },
  infoSection: {
    width: '100%',
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    color: '#ccc',
    fontSize: 16,
    marginLeft: 8,
    width: 120,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
  favGames: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 28,
  },
  aboutText: {
    color: '#ddd',
    fontSize: 16,
    lineHeight: 22,
  },
  joinedDate: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
