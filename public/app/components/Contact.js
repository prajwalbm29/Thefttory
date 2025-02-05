import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "./header";
import Footer from "./footer";

export default function Contact() {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.text}>
          Reach out to us via the details provided in the footer. We are here to
          assist you!
        </Text>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
