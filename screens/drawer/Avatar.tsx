import React, { useEffect } from 'react';
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const games = [
  "Fortnite", "League of Legends", "Valorant", "CS2", "Warzone", "Minecraft", "GTA V", "Apex Legends", "Dota 2", "PUBG",
  "Roblox", "Rust", "Elden Ring", "Zelda: TOTK", "Overwatch 2", "FIFA 24", "NBA 2K24", "Rocket League", "Destiny 2", "FFXIV",
  "Tarkov", "WoW", "Hearthstone", "Dead by Daylight", "Among Us", "Phasmophobia", "Sims 4", "ARK", "Sea of Thieves", "Monster Hunter",
  "Cyberpunk 2077", "RDR2", "Baldur’s Gate 3", "Starfield", "Palworld", "Hades", "Tekken 8", "Street Fighter 6", "MK1", "Witcher 3",
  "RE4 Remake", "RE Village", "Lies of P", "Alan Wake 2", "Dark Souls III", "Bloodborne", "Sekiro", "Hollow Knight", "Ori", "Celeste",
  "Genshin Impact", "Honkai Star Rail", "Tower of Fantasy", "Clash Royale", "Clash of Clans", "MLBB", "Brawl Stars", "CoD Mobile", "Free Fire", "PUBG Mobile",
  "Candy Crush", "Asphalt 9", "Pokémon S/V", "Pokémon Unite", "Smash Bros", "Splatoon 3", "Animal Crossing", "Mario Kart 8", "Odyssey", "Luigi’s Mansion 3",
  "Metroid Dread", "Bayonetta 3", "Silksong", "Little Nightmares II", "Inside", "Limbo", "Control", "Watch Dogs Legion", "AC Mirage", "AC Valhalla",
  "Far Cry 6", "Hitman 3", "Ghost of Tsushima", "Horizon FW", "Spider-Man 2", "Miles Morales", "Arkham Knight", "Jedi Survivor", "Battlefront II", "Hogwarts Legacy",
  "LEGO SW", "Fall Guys", "Tetris 99", "Slay the Spire", "Stardew Valley", "Terraria", "Don’t Starve", "Factorio", "RimWorld", "Civ VI"
];

const Avatar = () => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>🎮 Top 100 Popular Games</Text>
        {games.map((game, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.gameText}>{index + 1}. {game}</Text>
            
          </View>
        ))}
        <Text>
              
            </Text>
             <Text>
              
            </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3bff31',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#3bff31',
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    
  },
  gameText: {
    color: 'black',
    fontWeight:'900',
    fontSize: 16,
  },
});
