import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "./header";
import Footer from "./footer";

export default function About() {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.heading}>About Us</Text>
        <Text style={styles.text}>
          Welcome to our About Us page! Here we describe our mission and vision
          to serve the community better.
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
