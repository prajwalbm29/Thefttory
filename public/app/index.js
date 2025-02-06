import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import userDetails from './components/userData';
import { serverURL } from "./apiData/data";
import Loading from "./components/loadingScreen/loading";

export default function AadhaarValidationPage() {
  const [aadhaarNo, setAadhaarNo] = useState("");
  const [isReadonly, setIsReadonly] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <Loading />
    )
  }

  // Function to validate Aadhaar and fetch details
  const validateAadhaar = async () => {
    if (aadhaarNo.length !== 12) {
      Alert.alert("Invalid Aadhaar", "Aadhaar number must be 12 digits.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${serverURL}/api/getdata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarNo }),
      });
      const data = await response.json();
      console.log("Inside validateAadhaar : ", data)

      if (response.status !== 200) {
        Alert.alert("Error", "Aadhaar not found.");
      } else {
        setIsReadonly(true);
        setName(data.name);
        setDob(data.dob.substring(0, 10));
      }
    } catch (error) {
      Alert.alert("Server Error", "Unable to validate Aadhaar.");
    } finally {
      setLoading(false);
    }
  };

  // Function to generate OTP
  const generateOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${serverURL}/api/admin/generateOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarNo }),
      });

      console.log("Inside generate OTP : ", response.data)

      if (response.status !== 200) {
        Alert.alert("Error", `Server error in sending OTP.`);
      } else {
        Alert.alert("Success", "OTP sent successfully.");
        setShowOtpInput(true);
      }
    } catch (error) {
      Alert.alert("Server Error", "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${serverURL}/api/admin/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarNo, otp }),
      });

      const data = await response.json();
      console.log("Inside verify otp : ", data)

      if (response.status === 500) {
        Alert.alert("Error", "Server Error");
        return;
      }

      if (response.status === 400) {
        Alert.alert("Error", `Otp expired or Invalid Otp.`);
        return;
      }

      if (response.status === 401) {
        Alert.alert("Error", `OTP Timed out.`);
        return;
      }

      await userDetails.login(parseInt(aadhaarNo));
      
      const user = await userDetails.getUserData();
      console.log("User stored in ", user);

      router.push("./components/home");
    } catch (error) {
      Alert.alert("Server Error", `Unable to verify OTP. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aadhaar Verification</Text>
      <TextInput
        style={[styles.input, isReadonly && styles.readonlyInput]}
        placeholder="Enter Aadhaar Number"
        value={aadhaarNo}
        onChangeText={setAadhaarNo}
        keyboardType="numeric"
        maxLength={12}
        editable={!isReadonly}
      />
      {!isReadonly && (
        <Button title="Validate Aadhaar" onPress={validateAadhaar} />
      )}
      {isReadonly && (
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Name: {name}</Text>
          <Text style={styles.label}>DOB: {dob}</Text>
          <View style={styles.buttonGroup}>
            <Button title="Data is Correct" onPress={generateOtp} />
            <Button
              title="Data is Not Correct"
              onPress={() => {
                setIsReadonly(false);
                setName("");
                setDob("");
              }}
            />
          </View>
        </View>
      )}
      {showOtpInput && (
        <View style={styles.otpContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />
          <Button title="Verify OTP" onPress={verifyOtp} />
        </View>
      )}

      <Button title="Navigate" onPress={() => router.replace("./components/home")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  readonlyInput: {
    backgroundColor: "#e0e0e0",
  },
  detailsContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  otpContainer: {
    marginTop: 20,
  },
});
