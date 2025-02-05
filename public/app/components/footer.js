import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function Footer() {
  const handleLinkPress = (url) => {
    router.push(`./${url}`);
  };

  return (
    <View style={styles.footer}>
      {/* Contact Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>l Contact Info</Text>
        <Text style={styles.text}>
        <Ionicons name="location-outline" size={15} color="#f0a500" />
          <Text style={styles.bold}> Address: </Text>
          BBMP Office building, N. R. Square, Bangalore
        </Text>
        <Text style={styles.text}>
        <FontAwesome name="phone" size={15} color="#f0a500" />
          <Text style={styles.bold}> Phone: </Text>080 - 22975586, 22975587,
          22975589
        </Text>
        <Text style={styles.text}>
        <FontAwesome name="envelope" size={15} color="#f0a500" />
          <Text style={styles.bold}> Email: </Text>thefttory@gmail.com</Text>
      </View>

      {/* Quick Links Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>l Quick Links</Text>
        <TouchableOpacity onPress={() => handleLinkPress("home")}>
          <Text style={styles.link}>O Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLinkPress("Complaint")}>
          <Text style={styles.link}>O Register Complaint</Text>
        </TouchableOpacity>
      </View>

      {/* Legal Section
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <TouchableOpacity onPress={() => handleLinkPress("privacy-policy")}>
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLinkPress("terms-and-conditions")}
        >
          <Text style={styles.link}>Terms And Conditions</Text>
        </TouchableOpacity>
      </View> */}

      {/* Contact Us Button */}
      <TouchableOpacity onPress={() => handleLinkPress("Contact")}>
          <Text style={styles.sectionTitle}>l Contact Us</Text>
        </TouchableOpacity>

        <View style={styles.copyRight}>
          <Text style={styles.copyText}>&copy; COPYRIGHT THEFTTORY 2025 | WEBSITE DEVELOPED BY PRAJWAL THE DEVELOPED</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#1d1d1d",
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#f0a500",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  link: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 5,
    paddingLeft: 10,
  },
  copyRight: {
    marginBottom: 0,
    marginTop: 20,
  },
  copyText: {
    color: "#ffffff",
    fontSize: 12,
    marginBottom: 5,
    paddingLeft: 10,
  },
});
