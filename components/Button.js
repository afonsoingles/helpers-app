import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator } from 'react-native';

const Button = ({ isButtonDisabled, text, onButtonClicked, isLoading, icon }) => {
  return (
    <TouchableOpacity
      style={[buttonStyles.button, isButtonDisabled && buttonStyles.disabledButton]}
      disabled={isButtonDisabled}
      onPress={onButtonClicked}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View style={buttonStyles.content}>
          {icon && <Image source={icon} style={buttonStyles.icon} />}
          <Text style={[buttonStyles.buttonText, isButtonDisabled && buttonStyles.disabledButton]}>
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
const buttonStyles = StyleSheet.create({
  button: {
    width: '100%',
    height: RFValue(40),
    backgroundColor: '#419FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    alignSelf: 'center',
  },
  disabledButton: {
    color: '#A3A3A3',
    backgroundColor: '#366ba3',
  },
  buttonText: {
    color: '#fff',
    fontSize: RFValue(20),
    fontFamily: 'RedHatDisplay_800ExtraBold',
  },
  icon: {
    width: RFValue(25),
    height: RFValue(25),
    marginRight: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;