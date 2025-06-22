import { useAuth } from '@/app/context/AuthProvider';
import { UserProfile } from '@/inteface/userprofile';
import { supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const searchparam =useLocalSearchParams();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProfiles(searchTerm.trim());
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const searchProfiles = async (term: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_records')
      .select('*')
      .ilike('username', `%${term}%`);

    if (error) {
      console.error('Search error:', error.message);
    } else {
      setResults(data || []);
    }

    setLoading(false);
  };

  const renderUser = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity onPress={() => router.push({
      pathname: '/SeperateUser', 
      params: { user_id: item.user_id } })}>
      <View style={styles.userCard}>
        <Image
          source={{
            uri:
              item.avatar ||
              'https://cdn.pixabay.com/photo/2020/06/26/17/36/gamer-5344701_960_720.jpg',
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.about}>
            {item.User_about || 'No description provided.'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.searchBar}>
        <Search color={'#3bff31'} size={20} />
        <TextInput
          placeholder="Search users by username..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.input}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <X color={'#999'} size={20} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3bff31" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          ListEmptyComponent={
            searchTerm.length > 0 ? (
              <Text style={styles.emptyText}>No users found.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
  },
  searchBar: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  userCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3bff31',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#3bff31',
    marginRight: 12,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  about: {
    color: '#ccc',
    fontSize: 14,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
