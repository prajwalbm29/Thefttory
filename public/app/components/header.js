import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [headerHeight] = useState(new Animated.Value(100));
  const [head, setHead] = useState("Home Page");

  const handleNavigation = (page) => {
    router.push(`./${page}`);
    setDropdownVisible(false);
    Animated.spring(headerHeight, {
      toValue: 100,
      useNativeDriver: false,
    }).start();
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    Animated.spring(headerHeight, {
      toValue: dropdownVisible ? 100 : 250, 
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[styles.header, { height: headerHeight }]}>
      <Image
        source={require('@/assets/images/Thefttory.png')} // Image URL
        style={styles.logo}
      />
      
      <TouchableOpacity onPress={toggleDropdown}>
        <Text style={styles.headerLink}>Menu</Text>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => handleNavigation("home")}>
            <Text style={styles.dropdownItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation("About")}>
            <Text style={styles.dropdownItem}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation("Contact")}>
            <Text style={styles.dropdownItem}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation("Complaint")}>
            <Text style={styles.dropdownItem}>Online Complaint Registration</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    elevation: 5,
    overflow: "hidden",
    transition: "height 0.3s ease-in-out",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  headerLink: {
    color: "#007BFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: 20,
    right: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    elevation: 5,
    padding: 10,
    width: 150,
    zIndex: 1,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
