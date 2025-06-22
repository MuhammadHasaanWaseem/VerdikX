import { useAuth } from '@/app/context/AuthProvider';
import { UserProfile } from '@/inteface/userprofile';
import { supabase } from '@/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SeperateUser() {
  const { user } = useAuth();
  const { user_id } = useLocalSearchParams();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState<boolean>(false);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('user_records')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (data) setProfile(data);
    setLoading(false);
  };

  const checkFriendStatus = async () => {
    const { data } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', user?.id)
      .eq('friend_id', user_id)
      .single();

    setIsFriend(!!data);
  };

  const sendFriendRequest = async () => {
    if (!user?.id || !profile?.user_id) return;

    const { error } = await supabase.from('friend_requests').insert({
      sender_id: user.id,
      receiver_id: profile.user_id,
    });

    if (error) {
      console.error('Failed to send friend request:', error.message);
      return;
    }

    setToastMessage('Friend request sent!');
  };

  const unfriendUser = async () => {
    await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${user?.id},friend_id.eq.${profile?.user_id}),and(user_id.eq.${profile?.user_id},friend_id.eq.${user?.id})`);

    setIsFriend(false);
    setToastMessage('Unfriended successfully.');
  };

  useEffect(() => {
    if (user_id) {
      fetchUserData();
      checkFriendStatus();
    }
  }, [user_id]);

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
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#3bff31" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {profile?.user_id === user?.id ? 'My Profile' : 'User Profile'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profileCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image
            source={
              profile?.avatar
                ? { uri: profile.avatar }
                : require('../../assets/Appicons/default-avatar.png')
            }
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>{profile?.username}</Text>
            <Text style={styles.email}>{profile?.email}</Text>
            <Text style={styles.userid}>UID: {profile?.user_id}</Text>
          </View>
        </View>

        {profile?.user_id !== user?.id && (
          <View style={styles.actionButtons}>
            {isFriend ? (
              <TouchableOpacity style={styles.button} onPress={unfriendUser}>
                <MaterialIcons name="person-remove" size={20} color="black" />
                <Text style={styles.buttonText}>Unfriend</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={sendFriendRequest}>
                <MaterialIcons name="person-add" size={20} color="black" />
                <Text style={styles.buttonText}>Add Friend</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                          try {
                            const shareOptions = {
                              message: `Check out my profile on VerdikX! Username: ${profile?.username}, UID: ${profile?.user_id}`,
                            };
                            await Share.share(shareOptions);
                          } catch (error) {
                            console.log('Error sharing profile:', error);
                          }
                        }}
            >
              <MaterialIcons name="share" size={20} color="black" />
              <Text style={styles.buttonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {profile?.user_id == user?.id && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/freinds')}>
              <MaterialIcons name="group" size={20} color="black" />
              <Text style={styles.buttonText}>Your Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={async () => {
                        try {
                          const shareOptions = {
                            message: `Check out my profile on VerdikX! Username: ${profile?.username}, UID: ${profile?.user_id}`,
                          };
                          await Share.share(shareOptions);
                        } catch (error) {
                          console.log('Error sharing profile:', error);
                        }
                      }}>
              <MaterialIcons name="share" size={20} color="black" />
              <Text style={styles.buttonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        )}

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
  actionButtons: {
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
    width:'50%',
    gap: 6,
  },
  buttonText: {
    fontSize: 16,
    textAlign:'center',
    fontWeight: '600',
    color: 'black',
  },
  profileCard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'white',
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
