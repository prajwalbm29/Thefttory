import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import Pdf from 'react-native-pdf';

const InvoiceViewer = ({ invoice }) => {
    const [visible, setVisible] = useState(false);

    if (!invoice || !invoice.base64) {
        return <Text>No invoice available</Text>;
    }

    return (
        <View style={{ padding: 20 }}>
            <Text>Invoice Name: {invoice.name}</Text>
            <Text>Invoice Type: {invoice.type}</Text>

            {/* Open Button */}
            <TouchableOpacity 
                onPress={() => setVisible(true)} 
                style={{
                    backgroundColor: '#007BFF',
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10,
                }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>View Invoice</Text>
            </TouchableOpacity>

            {/* Modal for Displaying Image or PDF */}
            <Modal visible={visible} animationType="slide" transparent={false}>
                <View style={{ flex: 1, padding: 20 }}>
                    {/* Close Button */}
                    <TouchableOpacity 
                        onPress={() => setVisible(false)} 
                        style={{
                            backgroundColor: 'red',
                            padding: 10,
                            borderRadius: 5,
                            alignSelf: 'flex-end',
                        }}>
                        <Text style={{ color: 'white' }}>Close</Text>
                    </TouchableOpacity>

                    {/* Render Image or PDF */}
                    {invoice.type.startsWith('image/') ? (
                        <Image
                            source={{ uri: `data:${invoice.type};base64,${invoice.base64}` }}
                            style={{ width: '100%', height: 400, resizeMode: 'contain', marginTop: 20 }}
                        />
                    ) : invoice.type === 'application/pdf' ? (
                        <Pdf
                            source={{ uri: `data:application/pdf;base64,${invoice.base64}` }}
                            style={{ flex: 1, width: '100%', marginTop: 20 }}
                        />
                    ) : (
                        <Text>Unsupported file type</Text>
                    )}
                </View>
            </Modal>
        </View>
    );
};

export default InvoiceViewer;
