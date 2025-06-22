import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.sectionTitle}>Introduction</Text>
      <Text style={styles.paragraph}>
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
      </Text>
      <Text style={styles.sectionTitle}>Information We Collect</Text>
      <Text style={styles.paragraph}>
        We may collect personal information such as your name, email address, and usage data to provide and improve our services.
      </Text>
      <Text style={styles.sectionTitle}>How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        Your information is used to personalize your experience, improve our app, and communicate with you.
      </Text>
      <Text style={styles.sectionTitle}>Disclosure of Your Information</Text>
      <Text style={styles.paragraph}>
        We do not sell your personal information. We may share information with trusted partners to help operate our services.
      </Text>
      <Text style={styles.sectionTitle}>Security</Text>
      <Text style={styles.paragraph}>
        We use administrative, technical, and physical security measures to protect your information.
      </Text>
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions about this Privacy Policy, please contact us at support@example.com.
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

export default PrivacyPolicyScreen;
