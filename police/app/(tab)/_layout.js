import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';
import React from 'react';
import { Alert } from 'react-native';

const serverRouter = "192.168.1.6:7003";

export default function TabLayout() {
  const router = useRouter();

  // Logout Function
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://${serverRouter}/api/police/logout`, {
                method: 'POST',
                credentials: 'include', // Ensure cookies are sent with the request
              });
  
              if (response.status === 200) {
                router.replace('index'); // Navigate to index.js
              } else {
                alert(`Logout failed : ${response.status}`);
              }
            } catch (error) {
              console.error('Error logging out:', error);
              alert('An error occurred while logging out.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerRight: () => (
            <Button title="Logout" onPress={handleLogout} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
          headerRight: () => (
            <Button title="Logout" onPress={handleLogout} />
          ),
        }}
      />
    </Tabs>
  );
}
