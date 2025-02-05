import React, { useState } from "react";
import { 
  View, 
  Text, 
  Button, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from "react-native";
import Header from "./header";
import Footer from "./footer";
import BlockCellPhone from "./cellPhone/blockCellPhone";

const ComplaintPage = () => {
    const [propertyType, setPropertyType] = useState("");
    const [activeForm, setActiveForm] = useState("");

    const handlePropertyTypeChange = (type) => {
        setPropertyType(type);
        setActiveForm("");
    };

    const activateForm = (formName) => setActiveForm(formName);

    return (
        <ScrollView>
            <Header />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headingBox}>
                    <Text style={styles.headingText}>Online Complaint Registration</Text>
                </View>

                <View style={styles.instructionsBox}>
                    <Text style={styles.title}>How to Fill Your Complaints Registration</Text>
                    <Text style={styles.fillText}>1. Keep the documents ready that are required to fill the form.</Text>
                    <Text style={styles.fillText}>2. Enter the details of the product owner.</Text>
                    <Text style={styles.fillText}>3. Re-check the entered form data.</Text>
                    <Text style={styles.fillText}>4. Submit the form.</Text>
                </View>

                <Text style={[styles.title, styles.bottomBorder]}>Complaint Registration Form</Text>

                <View style={styles.propertySelectionBox}>
                    <Text style={styles.title}>Select Property Type</Text>
                    {['Cell Phone', 'Bike', 'Car'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => handlePropertyTypeChange(type)}
                            style={[
                                styles.radioButton,
                                propertyType === type && styles.radioButtonSelected,
                            ]}
                        >
                            <Text style={styles.radioButtonText}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {propertyType === "Cell Phone" && (
                    <View style={styles.cellBtns}>
                        <Button
                            title="Block Stolen/Lost Mobile"
                            color="red"
                            onPress={() => activateForm("block")}
                        />
                        <Button
                            title="Unblock Found Mobile"
                            color="green"
                            onPress={() => activateForm("unblock")}
                        />
                        <Button
                            title="Check Request Status"
                            color="blue"
                            onPress={() => activateForm("checkStatus")}
                        />
                    </View>
                )}

                {propertyType === "Cell Phone" && activeForm === "block" && (
                    <View style={styles.formBox}>
                        <Text style={styles.title}>Request for Blocking Lost/Stolen Mobile</Text>
                        <BlockCellPhone />
                    </View>
                )}

                {propertyType === "Bike" && <Text>Bike Form Coming Soon...</Text>}
                {propertyType === "Car" && <Text>Car Form Coming Soon...</Text>}
            </ScrollView>
            <Footer />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f9f9f9",
        flexGrow: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    headingBox: {
        margin: 5,
        borderBottomColor: "orange",
        borderBottomWidth: 7,
        marginBottom: 10,
    },
    headingText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 24,
        textAlign: "center",
    },
    fillText: {
        fontSize: 16,
        color: "#333",
        margin: 5,
    },
    radioButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    radioButtonSelected: {
        backgroundColor: "#007bff",
        borderColor: "#0056b3",
    },
    radioButtonText: {
        color: "#333",
        fontSize: 16,
    },
    bottomBorder: {
        borderBottomColor: "orange",
        borderBottomWidth: 2,
        marginTop: 10,
    },
    cellBtns: {
        padding: 40,
        gap: 10,
    },
    formBox: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        alignItems: "center",
        marginBottom: 10,
    },
});

export default ComplaintPage;
