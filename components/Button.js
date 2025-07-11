import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native';

const Button = ({ isButtonDisabled, text, onButtonClicked, isLoading }) => {
  return (
    <TouchableOpacity
      style={[buttonStyles.button, isButtonDisabled && buttonStyles.disabledButton]}
      disabled={isButtonDisabled}
      onPress={onButtonClicked}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[buttonStyles.buttonText, isButtonDisabled && buttonStyles.disabledButton]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};
const buttonStyles = StyleSheet.create({
    button: {
      width: '100%',
      height: RFValue(40),
      backgroundColor: '#8C52FF',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 11,
      alignSelf: 'center',
    },
    disabledButton: {
      color: '#A3A3A3',
      backgroundColor: '#6D3CCF',
    },
    buttonText: {
      color: '#fff',
      fontSize: RFValue(18),
      fontFamily: 'RedHatDisplay_800ExtraBold',
    },
  });

export default Button;