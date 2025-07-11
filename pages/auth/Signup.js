import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BackgroundWrapper from '../../components/old/BackgroundWrapper';
import HeaderBig from '../../components/HeaderBig';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold, RedHatDisplay_300Light } from '@expo-google-fonts/red-hat-display';
import { useNavigation } from '@react-navigation/native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { signUp } from '../../utils/AuthManager';

const SignupScreen = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [displaynameInput, setDisplayNameInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_700Bold,
    RedHatDisplay_600SemiBold,
  });


  const navigation = useNavigation();
  if (!fontsLoaded) return null;


  const processLogin = async () => {
    setIsButtonLoading(true);
    setErrorMessage('');
    if (emailInput.trim() === '' || passwordInput.trim() === '' || displaynameInput.trim() === '') {
      setErrorMessage('Plase fill all the fields.');
      setIsButtonLoading(false);
      return;
    }

    const signInResponse = await signUp(nameInput, emailInput, passwordInput, nameInput);
    if (signInResponse.status === 'success') {
      navigation.navigate('MainRoutes', { screen: 'Home' });
    } else {
      switch (signInResponse.type) {
        case 'invalid_credentials':
          setErrorMessage('Credentials is invalid.');
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
          break;
        default:
          setErrorMessage('Oh Uh! An unexpected error occurred. ['+signInResponse.type+']');
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
          break;
      }

    }
  };

  return (
    <BackgroundWrapper>
      <HeaderBig subtitle="Signup" />
      <View style={styles.container}>
        <View style={styles.inputContainers}>
          <InputBox placeholder='Display name' icon={require('../../assets/icons/bell.png')} onChangeText={(text) => setDisplayNameInput(text)} />
          <InputBox placeholder='Username' icon={require('../../assets/icons/user.png')} onChangeText={(text) => setNameInput(text)} />
          <InputBox placeholder='Email' icon={require('../../assets/icons/user.png')} onChangeText={(text) => setEmailInput(text)} />
          <InputBox placeholder='Password' icon={require('../../assets/icons/key.png')} isPassword={true} onChangeText={(text) => setPasswordInput(text)} />
        </View>
        <View style={styles.submitButton}>
          <Button
            text={isButtonLoading ? "" : "Enter"}
            onButtonClicked={() => !isButtonLoading && processLogin()}
            isLoading={isButtonLoading}
            isButtonDisabled={isButtonLoading}
          />
        </View>
        <View style={{ marginTop: RFPercentage(2.5)}}>
          <ErrorMessage isVisible={true} text={errorMessage}/>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainers: {
    marginTop: RFValue(30),
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    gap: RFValue(15),
  },
  submitButton: {
    marginTop: RFValue(35),
    width: '85%',
    alignSelf: 'center',
  },
});


export default SignupScreen;
