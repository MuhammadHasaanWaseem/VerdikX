import { useAuth } from "@/app/context/AuthProvider";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const DrawerScreen = () => {
const {signOut} =useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut()
  };

  return (
    <LinearGradient
      colors={["black", "black", "#3bff31"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
        <Animated.Text entering={FadeInUp.duration(600)} style={styles.title}>
           Menu
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(100)} style={styles.menuItem}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/Editprofile")}
          >
            <Feather name="user" size={24} color="#fff" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.menuItem}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(drawer)/PrivacyPolicy")}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Privacy Policy</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.menuItem}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(drawer)/UserTerms")}
          >
            <MaterialIcons name="gavel" size={24} color="#fff" />
            <Text style={styles.buttonText}>User Terms</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ flex: 1 }} />

        <Animated.View entering={FadeInDown.delay(600)} style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Feather name="log-out" size={22} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 40,
    marginBottom: 40,
  },
  menuItem: {
    marginBottom: 20,
    shadowColor: "#3bff31",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderRadius: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backdropFilter: "blur(10px)", // Not supported on native, but conceptually glass-like
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
    backgroundColor: "black",
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
