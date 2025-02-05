import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react';
import Header from './header';
import Footer from './footer';

export default function HomePage() {
  return (
    <ScrollView>
      <Header />
      <View style={styles.body}>
        <Text>HomePage</Text>
      </View>
      <Footer />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  body: {
    height: 300
  }
})
