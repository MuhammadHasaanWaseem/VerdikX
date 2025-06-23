import { useAuth } from '@/app/context/AuthProvider';
import { UserProfile } from '@/inteface/userprofile';
import { supabase } from '@/lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const appIcon = require('../../assets/Appicons/VerdikX.png');
const gameIcon = require('../../assets/images/icon.png'); // Default icon

const TournamentCard = ({ tournament, onApply }: { tournament: any; onApply: (id: string) => void }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.card, tournament.applied && styles.appliedCard]}>
    <View style={styles.cardHeader}>
      <Text style={styles.tournamentName}>{tournament.name}</Text>
    </View>
    <Text style={styles.gameName}>{tournament.gameName}</Text>
    <Text style={styles.organizer}>Organizer: {tournament.organizer}</Text>
    <Text style={styles.description}>{tournament.description}</Text>
    <Text style={styles.playersRequired}>Players Required: {tournament.playersRequired}</Text>
    <Text style={styles.dueDate}>Due Date: {tournament.dueDate}</Text>
    {!tournament.applied ? (
      <TouchableOpacity style={styles.applyButton} onPress={() => onApply(tournament.id)}>
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    ) : (
      <Text style={styles.appliedText}>Applied</Text>
    )}
  </Animated.View>
);

export default function HomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const router = useRouter();

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('user_records')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (data) setProfile(data);
  };

  const fetchTournaments = async () => {
  try {
    const { data: userApps, error: appError } = await supabase
      .from('tournament_applications')
      .select('tournament_id')
      .eq('applicant_id', user?.id);

    if (appError) throw appError;

    const appliedIds = userApps?.map((app) => app.tournament_id) || [];

    const { data: tournamentsData, error: tourError } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });

    if (tourError) throw tourError;

    const filtered = tournamentsData.filter((t) => !appliedIds.includes(t.id));

    setTournaments(
      filtered.map((t) => ({
        ...t,
        id: t.id,
        name: t.title,
        organizer: profile?.username || 'Unknown',
        description: t.description || 'No description provided.',
        playersRequired: t.match_type,
        dueDate: 'TBD',
        gameName: t.game,
        gameIcon: gameIcon,
        applied: false,
      }))
    );
  } catch (error) {
    console.error('Tournament fetch error:', error);
  }
};

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        setLoading(true);
        fetchUserData().then(() => {
          fetchTournaments().finally(() => setLoading(false));
        });
      }
    }, [user])
  );

  const handleApply = (id: string) => {
    router.push({
      pathname: '/apply',
      params: { tournamentId: id },
    });

    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, applied: true } : t))
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image source={appIcon} style={styles.appIcon} />

      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.userCard}>
        <View style={styles.userCardHeader}>
          {profile?.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <Image source={require('../../assets/Appicons/default-avatar.png')} style={styles.avatar} />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.username}>{profile?.username}</Text>
            {profile?.game_uid && <Text style={styles.userLevel}>UID: {profile.game_uid}</Text>}
            {profile?.user_level != null && (
              <Text style={styles.playstyle}>Level: {profile.user_level}</Text>
            )}
          </View>
        </View>
        <View style={styles.favouriteGamesContainer}>
          <Text style={styles.sectionTitle}>Favourite Games</Text>
          <View style={styles.gamesList}>
            {profile?.favourite_games?.map((game, index) => (
              <View key={index} style={styles.gameBadge}>
                <Text style={styles.gameBadgeText}>{game}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.tournamentsParticipated}>
          Tournaments Participated: {profile?.tournaments_participated}
        </Text>
      </Animated.View>

      <Text style={styles.headerTitle}>Available Tournaments</Text>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TournamentCard tournament={item} onApply={handleApply} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Join now and compete with the best!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    paddingTop: 20,
  },
  appIcon: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  userCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    marginHorizontal: 15,
    shadowColor: '#00ff99',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#3bff31',
  },
  userInfo: {
    marginLeft: 15,
  },
  username: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userLevel: {
    color: '#c0ffc0',
    fontSize: 14,
    marginTop: 3,
  },
  playstyle: {
    color: '#d0d0d0',
    fontSize: 14,
    marginTop: 2,
    fontStyle: 'italic',
  },
  favouriteGamesContainer: {
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#3bff31',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  gamesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameBadge: {
    backgroundColor: '#292929',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
    borderColor: '#3bff31',
    borderWidth: 1,
  },
  gameBadgeText: {
    color: '#fff',
    fontSize: 13,
  },
  tournamentsParticipated: {
    color: '#c0c0c0',
    fontSize: 15,
    marginTop: 6,
  },

  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#3bff31',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  appliedCard: {
    backgroundColor: '#252525',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tournamentName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  gameIcon: {
    width: 40,
    height: 40,
    marginLeft: 12,
  },
  gameName: {
    color: '#3bff31',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  organizer: {
    color: '#bbbbbb',
    fontSize: 13,
    marginTop: 2,
  },
  description: {
    color: '#cfcfcf',
    fontSize: 14,
    marginTop: 6,
    fontStyle: 'italic',
  },
  playersRequired: {
    color: '#eeeeee',
    marginTop: 6,
    fontSize: 13,
  },
  dueDate: {
    color: '#cccccc',
    marginTop: 4,
    fontSize: 13,
  },
  applyButton: {
    marginTop: 12,
    backgroundColor: '#3bff31',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#3bff31',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  applyButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
  },
  appliedText: {
    marginTop: 12,
    color: '#3bff31',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#3bff31',
    fontSize: 16,
    fontWeight: '600',
  },
});
