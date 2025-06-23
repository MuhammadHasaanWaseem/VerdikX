import { useAuth } from '@/app/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';
import { Gamepad2, Search, UserCircle, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SearchTournament = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');

  const fetchTournaments = async () => {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`*, user_records(username)`)
      .order('created_at', { ascending: false });

    if (!error) {
      const formatted = data.map((item) => ({
        ...item,
        title: item.title || 'Untitled',
        organizer: item.user_records?.username || 'Unknown',
      }));
      setTournaments(formatted);
      setFiltered(formatted);
    } else {
      console.error(error.message);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const lower = text.toLowerCase();
    const results = tournaments.filter((t) =>
      t.title.toLowerCase().includes(lower) ||
      t.game.toLowerCase().includes(lower) ||
      t.organizer.toLowerCase().includes(lower)
    );
    setFiltered(results);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setFiltered(tournaments);
  };

  const handleApply = (id: string) => {
    router.push({
      pathname: '/apply',
      params: { tournamentId: id },
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.id) fetchTournaments();
    }, [user])
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.heading}>  Search Tournaments</Text>

      <View style={styles.searchWrapper}>
        <Search color="#3bff31" size={20} style={{ marginRight: 6 }} />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search by title, game, or organizer..."
          placeholderTextColor="#888"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <X color="grey" size={20} />
          </TouchableOpacity>
        )}
      </View> 

      {filtered.length === 0 ? (
        <Text style={styles.noResults}>No tournaments found.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.info}><Gamepad2 size={14} color="#3bff31" /> Game: {item.game}</Text>
              <Text style={styles.info}>Match: {item.match_type}</Text>
              <Text style={styles.info}><UserCircle size={14} color="#3bff31" /> Organizer: {item.organizer}</Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleApply(item.id)}
              >
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
};

export default SearchTournament;

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
    marginBottom: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 10,
  },
  noResults: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  info: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: '#3bff31',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
