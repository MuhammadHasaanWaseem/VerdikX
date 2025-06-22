import { useAuth } from '@/app/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FriendRequestType {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  requested_at: string;
  responded_at: string | null;
  sender: {
    username: string;
    avatar: string | null;
  } | null;
}

export default function FriendRequest() {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequestType[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (user?.id) {
      fetchFriendRequests();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [user]);

  const fetchFriendRequests = async () => {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        id,
        sender_id,
        receiver_id,
        status,
        requested_at,
        responded_at,
        sender:user_records!friend_requests_sender_id_fkey (
          username,
          avatar
        )
      `)
      .eq('receiver_id', user?.id)
      .eq('status', 'pending');

    if (error) {
      console.error('Fetch Error:', error.message);
      return;
    }

    if (data) {
      // Map sender from array to object
      setFriendRequests(
        data.map((item: any) => ({
          ...item,
          sender: Array.isArray(item.sender) ? item.sender[0] : item.sender,
        }))
      );
    }
  };

  const handleAccept = async (id: string, senderId: string) => {
    await supabase
      .from('friend_requests')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (user?.id) {
      await supabase.from('friends').insert([
        { user_id: user.id, friend_id: senderId },
        { user_id: senderId, friend_id: user.id },
      ]);
    }

    fetchFriendRequests();
  };

  const handleDecline = async (id: string) => {
    await supabase
      .from('friend_requests')
      .update({
        status: 'declined',
        responded_at: new Date().toISOString(),
      })
      .eq('id', id);

    fetchFriendRequests();
  };

  const renderItem = ({ item }: { item: FriendRequestType }) => (
    <Animated.View style={[styles.requestItem, { opacity: fadeAnim }]}>
      <View style={styles.requestInfo}>
        <Image
          source={
            item.sender?.avatar
              ? { uri: item.sender.avatar }
              : require('../../assets/Appicons/default-avatar.png')
          }
          style={styles.avatar}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.username}>
            {item.sender?.username || 'Unknown Name'}
          </Text>
          <Text style={styles.requestedAt}>
            {new Date(item.requested_at).toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(item.id, item.sender_id)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleDecline(item.id)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      {friendRequests.length === 0 ? (
        <Text style={styles.noRequests}>No pending friend requests</Text>
      ) : (
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  noRequests: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  requestItem: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#3bff31',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3bff31',
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  requestedAt: {
    color: '#888',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  acceptButton: {
    backgroundColor: '#3bff31',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  declineButton: {
    backgroundColor: '#ff3b3b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 14,
  },
});
