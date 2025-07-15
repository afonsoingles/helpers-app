import React from 'react';
import { Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const ErrorMessage = ({ text, isVisible }) => {

    if (!isVisible) {
        return null;
    }
    return (
        <Text style={{ color: "#FF5255", textAlign: 'center', fontSize: RFValue(16), maxWidth: '85%', overflow: 'hidden', alignSelf: 'center' }}>
            {text}
        </Text>
    );
    };
export default ErrorMessage;