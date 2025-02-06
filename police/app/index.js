import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import userDetails from './components/userData';
import { serverURL } from "./ServerIP/ipAddress";
import Loading from "./loadingScreen/loading";

export default function AadhaarValidationPage() {
  const [policeId, setPoliceId] = useState("");
  const [isReadonly, setIsReadonly] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [position, setPosition] = useState("");
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
    if (policeId.length !== 5) {
      Alert.alert("Invalid Police Id", "Police ID must be 5 digits.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${serverURL}/api/police/getData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policeId }),
      });
      const data = await response.json();
      console.log("Inside validateAadhaar : ", data)

      if (response.status !== 200) {
        Alert.alert("Error", `${data.message}`);
      } else {
        setIsReadonly(true);
        setName(data.name);
        setDob(data.dob.substring(0, 10));
        setPosition(data.position);
      }
    } catch (error) {
      Alert.alert("Server Error", "Unable to validate Police Id.");
    } finally {
      setLoading(false);
    }
  };

  // Function to generate OTP
  const generateOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${serverURL}/api/police/generateOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policeId }),
      });

      if (response.status !== 200) {
        Alert.alert("Error", `Server error in sending OTP.`);
      } else {
        Alert.alert("Success", "OTP sent to the email successfully.");
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
      const response = await fetch(`${serverURL}/api/police/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policeId, otp }),
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

      await userDetails.login(policeId);

      const user = await userDetails.getUserData();
      console.log("User stored in ", user);

      router.replace('./components/home');
      // router.push("./components/home");
    } catch (error) {
      console.log("Error in otp verification", error);
      Alert.alert("Server Error", `Unable to verify OTP.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Police Id Verification</Text>
      <TextInput
        style={[styles.input, isReadonly && styles.readonlyInput]}
        placeholder="Enter Police Id"
        value={policeId}
        onChangeText={setPoliceId}
        maxLength={5}
        editable={!isReadonly}
      />
      {!isReadonly && (
        <Button title="Validate Police Id" onPress={validateAadhaar} />
      )}
      {isReadonly && (
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Name: {name}</Text>
          <Text style={styles.label}>DOB: {dob}</Text>
          <Text style={styles.label}>position: {position}</Text>
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

      <Button title="Navigate" onPress={() => router.push("./components/about")} />
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
