import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const Loading = ({ message = "Loading..." }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default Loading;
