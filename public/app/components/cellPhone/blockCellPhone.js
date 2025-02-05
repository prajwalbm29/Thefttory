import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Button,
    Alert,
    Platform
} from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {serverURL} from '../../apiData/data';

const BlockCellPhone = () => {
    const [formData, setFormData] = useState({
        mobile1: '',
        mobile2: '',
        imei: '',
        brand: '',
        model: '',
        invoice: null,
        lostLocation: '',
        lostDescription: '',
        lostDate: new Date(),
        otp: '',
    });

    const [otpGenerated, setOtpGenerated] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (name, value) => {
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.mobile1.trim() || !/^(\d{10})$/.test(formData.mobile1)) {
            Alert.alert('Validation Error', 'Mobile Number 1 is required and must be 10 digits.');
            return false;
        }
        if (!formData.imei.trim()) {
            Alert.alert('Validation Error', 'IMEI number is required.');
            return false;
        }
        if (!formData.brand.trim()) {
            Alert.alert('Validation Error', 'Device brand is required.');
            return false;
        }
        if (!formData.model.trim()) {
            Alert.alert('Validation Error', 'Device model is required.');
            return false;
        }
        if (!formData.invoice) {
            Alert.alert('Validation Error', 'Please upload the invoice.');
            return false;
        }
        if (!formData.lostLocation.trim()) {
            Alert.alert('Validation Error', 'Lost location is required.');
            return false;
        }
        if (!formData.lostDescription.trim()) {
            Alert.alert('Validation Error', 'Lost description is required.');
            return false;
        }
        return true;
    };

    const handleUploadInvoice = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({});
            if (result.type === 'success') {
                setFormData((prevState) => ({ ...prevState, invoice: result }));
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload invoice.');
        }
    };

    const handleGetOtp = async () => {
        if (!validateForm()) return;
        try {
            const response = await fetch(`${serverURL}/api/public/generateOTPByPhone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNo: formData.mobile1 }),
            });

            if (response.status === 200) {
                Alert.alert('OTP Sent', 'An OTP has been sent to your Aadhaar registered Email.');
                setOtpGenerated(true);
            } else {
                Alert.alert('Error', `Enter aadaar registered mobile number.`);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    const handleSubmit = async () => {
        if (!formData.otp.trim()) {
            Alert.alert('Validation Error', 'Please enter the OTP.');
            return;
        }
        // Call API to verify OTP and submit form
        try {
            const otpResponse = await fetch(`${serverURL}/api/public/verifyOTPByPhone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: formData.otp, phoneNo: formData.mobile1 }),
            });

            if (otpResponse.status === 200) {
                const submitResponse = await fetch('https://example.com/api/submit-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (submitResponse.status === 200) {
                    Alert.alert('Success', 'Form submitted successfully!');
                } else {
                    Alert.alert('Error', 'Failed to submit form.');
                }
            } else {
                Alert.alert('Error', 'Invalid OTP.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    const renderDatePicker = () => {
        return showDatePicker && (
            <DateTimePicker
                value={formData.lostDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    handleChange('lostDate', selectedDate || formData.lostDate);
                }}
            />
        );
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.title}>Device Information</Text>
            <Text style={styles.label}>Mobile Number 1*</Text>
            <TextInput
                style={styles.input}
                placeholder="Aadhar Registered"
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.mobile1}
                onChangeText={(value) => handleChange('mobile1', value)}
            />

            <Text style={styles.label}>Mobile Number 2</Text>
            <TextInput
                style={styles.input}
                placeholder="Optional"
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.mobile2}
                onChangeText={(value) => handleChange('mobile2', value)}
            />

            <Text style={styles.label}>IMEI Number*</Text>
            <TextInput
                style={styles.input}
                value={formData.imei}
                onChangeText={(value) => handleChange('imei', value)}
            />

            <Text style={styles.label}>Device Brand*</Text>
            <TextInput
                style={styles.input}
                value={formData.brand}
                onChangeText={(value) => handleChange('brand', value)}
            />

            <Text style={styles.label}>Device Model*</Text>
            <TextInput
                style={styles.input}
                value={formData.model}
                onChangeText={(value) => handleChange('model', value)}
            />

            <TouchableOpacity onPress={handleUploadInvoice} style={styles.uploadButton}>
                <Text style={styles.uploadText}>
                    {formData.invoice ? 'Invoice Uploaded' : 'Upload Invoice (Required)'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.title}>Lost Information</Text>
            <Text style={styles.label}>Lost Location*</Text>
            <TextInput
                style={styles.input}
                value={formData.lostLocation}
                onChangeText={(value) => handleChange('lostLocation', value)}
            />

            <Text style={styles.label}>Lost Description*</Text>
            <TextInput
                style={styles.input}
                value={formData.lostDescription}
                onChangeText={(value) => handleChange('lostDescription', value)}
            />

            <Text style={styles.label}>Lost Date*</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.uploadButton}>
                <Text style={styles.uploadText}>
                    {formData.lostDate ? formData.lostDate.toLocaleDateString() : 'Choose Date (Required)'}
                </Text>
            </TouchableOpacity>

            {renderDatePicker()}

            {!otpGenerated && <Button title="Generate OTP" onPress={handleGetOtp} />}
            {otpGenerated && <Button title="Re-generate OTP" onPress={handleGetOtp} />}

            {otpGenerated && <Text style={styles.label}>Enter OTP</Text>}
            {otpGenerated && <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
                value={formData.otp}
                onChangeText={(value) => handleChange('otp', value)}
            />}

            {otpGenerated && <Button title="Submit" onPress={handleSubmit} />}
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        width: '100%',
    },
    uploadButton: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
    },
    uploadText: {
        fontSize: 16,
        color: '#333',
    },
});

export default BlockCellPhone;
