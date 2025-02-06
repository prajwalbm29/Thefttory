import React, { useEffect, useState } from 'react';
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
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { serverURL } from '../../apiData/data';
import userDetails from '../userData';
import Loading from '../loadingScreen/loading';

const BlockCellPhone = () => {
    const [formData, setFormData] = useState({
        aadhaarNo: '',
        mobile1: '',
        mobile2: '',
        imei: '',
        brand: '',
        model: '',
        invoice: null,
        lostLocation: '',
        lostDescription: '',
        lostDate: new Date(),
    });

    const handleChange = (name, value) => {
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        const getAadhaarNo = async () => {
            const user = await userDetails.getUserData();
            console.log("Stored User Id ", user);
            handleChange('aadhaarNo', user);
        }

        getAadhaarNo();
    }, [])

    const [otpGenerated, setOtpGenerated] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [otp, setOtp] = useState(null);
    const [loading, setLoading] = useState(false);

    if (loading) {
        return (
            <Loading />
        )
    }

    const clearForm = () => {
        setFormData({
            mobile1: '',
            mobile2: '',
            imei: '',
            brand: '',
            model: '',
            invoice: null,
            lostLocation: '',
            lostDescription: '',
            lostDate: new Date(),
        })
        setOtp(null);
        setOtpGenerated(false);
    }

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
        if (!formData.lostDate) {
            Alert.alert('Validation Error', 'Lost date is required.');
            return false;
        }
        return true;
    };

    const handleUploadInvoice = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({});

            console.log("Raw Result:", result);

            if (!result.canceled && result.assets.length > 0) {
                const file = result.assets[0]; // Access first item

                const base64Data = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });

                const formattedInvoice = {
                    name: file.name,
                    type: file.mimeType || 'application/octet-stream',
                    uri: file.uri,
                    base64: base64Data,
                    uploadedAt: new Date().toISOString(),
                };

                handleChange('invoice', formattedInvoice); // Fix handleChange usage
            }
        } catch (error) {
            console.error('Error uploading invoice:', error);
            Alert.alert('Error', 'Failed to upload invoice.');
        }
    };

    const handleGetOtp = async () => {
        if (!validateForm()) return;
        try {
            setLoading(true);
            const response = await fetch(`${serverURL}/api/public/generateOTPByPhone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNo: formData.mobile1 }),
            });

            if (response.status === 200) {
                Alert.alert('OTP Sent', 'An OTP has been sent to your Aadhaar registered Email.');
                setOtpGenerated(true);
            } else {
                Alert.alert('Error', `Enter Aadhaar Registered Mobile Number.`);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (otp.length !== 4) {
            Alert.alert('Validation Error', 'Please enter the 4 digit OTP.');
            return;
        }
        // Call API to verify OTP and submit form
        console.log("Submiting", formData.aadhaarNo);
        try {
            setLoading(true);
            const otpResponse = await fetch(`${serverURL}/api/public/verifyOTPByPhone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: otp, phoneNo: formData.mobile1 }),
            });

            if (otpResponse.status === 200) {
                const submitResponse = await fetch(`${serverURL}/api/public/savePhoneComplaint`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ formData: formData }),
                });

                if (submitResponse.status === 200) {
                    clearForm();
                    Alert.alert('Success', 'Form submitted successfully!');
                } else {
                    Alert.alert('Error', 'Failed to submit form.');
                }
            } else {
                Alert.alert('Error', 'Invalid OTP.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setLoading(false);
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
                placeholder="Aadhaar Registered Number"
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.mobile1}
                onChangeText={(value) => handleChange('mobile1', value)}
            />

            <Text style={styles.label}>Mobile Number 2</Text>
            <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.mobile2}
                onChangeText={(value) => handleChange('mobile2', value)}
            />

            <Text style={styles.label}>IMEI Number*</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter IMEI Number'
                value={formData.imei}
                onChangeText={(value) => handleChange('imei', value)}
            />

            <Text style={styles.label}>Device Brand*</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter Device Brand'
                value={formData.brand}
                onChangeText={(value) => handleChange('brand', value)}
            />

            <Text style={styles.label}>Device Model*</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter Device Model'
                value={formData.model}
                onChangeText={(value) => handleChange('model', value)}
            />

            <Text style={styles.label}>Mobile Invoice*</Text>
            <TouchableOpacity onPress={() => handleUploadInvoice(setFormData)} style={styles.uploadButton}>
                <Text style={styles.uploadText}>
                    {formData.invoice ? 'Invoice Uploaded' : 'Upload Mobile Invoice'}
                </Text>
            </TouchableOpacity>


            <Text style={styles.title}>Lost Information</Text>
            <Text style={styles.label}>Lost Location*</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.lostLocation}
                placeholder='Enter Lost location Address'
                onChangeText={(value) => handleChange('lostLocation', value)}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
            />

            <Text style={styles.label}>Lost Description*</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.lostDescription}
                placeholder='Enter Lost Description'
                onChangeText={(value) => handleChange('lostDescription', value)}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
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
                onChangeText={(value) => setOtp(value)}
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
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
        color: "#2C3E50",
    },
    label: {
        fontSize: 16,
        color: "#34495E",
        marginBottom: 5,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#D0D0D0",
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        width: 200,
    },
    inputFocused: {
        borderColor: "#007AFF", // Change border when focused
    },
    uploadButton: {
        marginBottom: 15,
        padding: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    uploadText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: "600",
    },
    textArea: {
        height: 100,
        paddingTop: 10,
    },
});


export default BlockCellPhone;
