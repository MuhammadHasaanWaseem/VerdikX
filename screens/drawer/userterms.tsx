import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

const UserTermsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Terms and Conditions</Text>
      <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        By using this application, you agree to comply with and be bound by these terms and conditions.
      </Text>
      <Text style={styles.sectionTitle}>Use of the Application</Text>
      <Text style={styles.paragraph}>
        You agree to use the app only for lawful purposes and in a way that does not infringe the rights of others.
      </Text>
      <Text style={styles.sectionTitle}>User Responsibilities</Text>
      <Text style={styles.paragraph}>
        You are responsible for maintaining the confidentiality of your account and password.
      </Text>
      <Text style={styles.sectionTitle}>Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        We are not liable for any damages arising from the use or inability to use the application.
      </Text>
      <Text style={styles.sectionTitle}>Changes to Terms</Text>
      <Text style={styles.paragraph}>
        We reserve the right to modify these terms at any time. Continued use of the app constitutes acceptance of the changes.
      </Text>
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions about these terms, please contact us at support@example.com.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3bff31',
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3bff31',
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#ddd',
  },
});

export default UserTermsScreen;
