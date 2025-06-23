import { useAuth } from "@/app/context/AuthProvider";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const DrawerScreen = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
  };

  return (
    <LinearGradient
      colors={["#000000", "#0a0a0a", "#3bff31"]}
      style={styles.container}
    >
      <StatusBar hidden />
      <SafeAreaView style={styles.safeArea}>
        <Animated.Text entering={FadeInUp.duration(600)} style={styles.title}>
          Menu
        </Animated.Text>

        <View style={styles.menuContainer}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.menuItem}>
            <DrawerButton
              onPress={() => router.push("/Editprofile")}
              icon={<Feather name="user" size={24} color="#fff" />}
              label="Edit Profile"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.menuItem}>
            <DrawerButton
              onPress={() => router.push("/(drawer)/PrivacyPolicy")}
              icon={<Ionicons name="shield-checkmark-outline" size={24} color="#fff" />}
              label="Privacy Policy"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.menuItem}>
            <DrawerButton
              onPress={() => router.push("/(drawer)/UserTerms")}
              icon={<MaterialIcons name="gavel" size={24} color="#fff" />}
              label="User Terms"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.menuItem}>
            <DrawerButton
              onPress={() => router.push("/Avatar")}
              icon={<MaterialIcons name="sports-esports" size={24} color="#fff" />}
              label="Top Games To Play"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500)} style={styles.menuItem}>
            <DrawerButton
              onPress={() => router.push("/CreateTour")}
              icon={<MaterialIcons name="emoji-events" size={24} color="#fff" />}
              label="Organize a Tournament"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)} style={styles.menuItem}>
            <DrawerButton
              onPress={() => router.push("/Applications")}
              icon={<MaterialIcons name="description" size={24} color="#fff" />}
              label="Applications"
            />
          </Animated.View>
        </View>

        <View style={{ flex: 1 }} />

        <Animated.View entering={FadeInDown.delay(800)} style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Feather name="log-out" size={22} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const DrawerButton = ({ onPress, icon, label }:any) => (
  <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.8}>
    {icon}
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#ffffff",
    marginTop: 40,
    marginBottom: 30,
  },
  menuContainer: {
    gap: 16,
  },
  menuItem: {
    shadowColor: "#3bff31",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 14,
  },
  logoutWrapper: {
    marginBottom: 40,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    justifyContent: "center",
  },
  logoutText: {
    color: "#3bff31",
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 10,
  },
});

export default DrawerScreen;
