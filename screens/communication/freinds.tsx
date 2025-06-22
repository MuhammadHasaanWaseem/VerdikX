import { useAuth } from '@/app/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Friend {
  id: string;
  friend_id: string;
  friend: {
    username: string;
    avatar: string | null;
  } | null;
}

export default function FriendsList() {
  const { user } = useAuth();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFriends = async () => {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          friend_id,
          friend:user_records!friends_friend_id_fkey (
            username,
            avatar
          )
        `)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Fetch friends error:', error.message);
        return;
      }

      if (data) {
        setFriends(
          data.map((item: any) => ({
            ...item,
            friend: Array.isArray(item.friend) ? item.friend[0] ?? null : item.friend,
          }))
        );
      }
    };

    if (user?.id) {
      fetchFriends();
    }
  }, [user?.id]);

  const filteredFriends = friends.filter((f) =>
    f.friend?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start a Chat</Text>

      <TextInput
        placeholder="Search friends..."
        placeholderTextColor="#888"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() =>
                router.push({
                  pathname: '/dm',
                  params: { receiver_id: item.friend_id },
                })
              }
            >
              <Image
                source={
                  item.friend?.avatar
                    ? { uri: item.friend.avatar }
                    : require('@/assets/Appicons/default-avatar.png')
                }
                style={styles.avatar}
              />
              <Text style={styles.username}>
                {item.friend?.username || 'Unknown'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.messageIcon}
              onPress={() =>
                router.push({
                  pathname: '/dm',
                  params: { receiver_id: item.friend_id },
                })
              }
            >
              <MessageCircle size={22} color="#3bff31" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 12 },
  searchInput: {
    backgroundColor: '#1c1c1c',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3bff31',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    justifyContent: 'space-between',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3bff31',
    marginRight: 12,
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  messageIcon: {
    padding: 8,
  },
});
