import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const appIcon = require('../../assets/Appicons/VerdikX.png');
const gameIcon = require('../../assets/images/icon.png'); // Placeholder game icon

const initialTournaments = [
  {
    id: '1',
    name: 'Champions Cup',
    organizer: 'Gaming League',
    description: 'An intense tournament for top players.',
    playersRequired: '5v5',
    dueDate: '2024-07-15',
    gameName: 'Valorant',
    gameIcon: gameIcon,
    applied: false,
  },
  {
    id: '2',
    name: 'Pro Showdown',
    organizer: 'Esports Org',
    description: 'Show your skills in this competitive event.',
    playersRequired: '3v3',
    dueDate: '2024-08-01',
    gameName: 'CS:GO',
    gameIcon: gameIcon,
    applied: false,
  },
  {
    id: '3',
    name: 'Battle Royale Bash',
    organizer: 'BR Events',
    description: 'Survive and win in this battle royale tournament.',
    playersRequired: 'Solo',
    dueDate: '2024-07-30',
    gameName: 'Fortnite',
    gameIcon: gameIcon,
    applied: false,
  },
  {
    id: '4',
    name: 'Battle Royale Bash',
    organizer: 'BR Events',
    description: 'Survive and win in this battle royale tournament.',
    playersRequired: 'Solo',
    dueDate: '2024-07-30',
    gameName: 'Fortnite',
    gameIcon: gameIcon,
    applied: false,
  },
  {
    id: '5',
    name: 'Battle Royale Bash',
    organizer: 'BR Events',
    description: 'Survive and win in this battle royale tournament.',
    playersRequired: 'Solo',
    dueDate: '2024-07-30',
    gameName: 'Fortnite',
    gameIcon: gameIcon,
    applied: false,
  },
  {
    id: '7',
    name: 'Battle Royale Bash',
    organizer: 'BR Events',
    description: 'Survive and win in this battle royale tournament.',
    playersRequired: 'Solo',
    dueDate: '2024-07-30',
    gameName: 'Fortnite',
    gameIcon: gameIcon,
    applied: false,
  }
];

const TournamentCard = ({ tournament, onApply }: { tournament: any; onApply: (id: string) => void }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.card, tournament.applied && styles.appliedCard]}>
    <View style={styles.cardHeader}>
      <Text style={styles.tournamentName}>{tournament.name}</Text>
      <Image source={tournament.gameIcon} style={styles.gameIcon} />
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
  const router = useRouter();
  const [tournaments, setTournaments] = useState(initialTournaments);

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
    backgroundColor: 'black',
    paddingTop: 20,
  },
  appIcon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  appliedCard: {
    backgroundColor: '#2a2a2a',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tournamentName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  gameIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  gameName: {
    color: '#3bff31',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  organizer: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
  },
  description: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
  },
  playersRequired: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
  },
  dueDate: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: '#3bff31',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  appliedText: {
    marginTop: 10,
    color: '#3bff31',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    color: '#3bff31',
    fontSize: 16,
    fontWeight: '600',
  },
});
