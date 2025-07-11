import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native';

const ErrorMessage = ({ text, isVisible }) => {
    
    if (!isVisible) {
        return null;
    }
    return (
        <Text style={{ color: "#FF5255", textAlign: 'center', fontSize: RFValue(15), maxWidth: '85%', overflow: 'hidden', alignSelf: 'center' }}>
            {text}
        </Text>
    );
    };




export default ErrorMessage;