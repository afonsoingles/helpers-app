import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import HeaderBig from '../../components/HeaderBig';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold, RedHatDisplay_300Light } from '@expo-google-fonts/red-hat-display';
import { useNavigation } from '@react-navigation/native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { proccessAuthState, signIn } from '../../utils/AuthManager';

const LoginScreen = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
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
    if (emailInput.trim() === '' || passwordInput.trim() === '') {
      setErrorMessage('Plase fill all the fields.');
      setIsButtonLoading(false);
      return;
    }

    const signInResponse = await signIn(emailInput, passwordInput);
    if (signInResponse.success === true) {
      proccessAuthState(navigation)
    } else {
      switch (signInResponse.type) {
        case 'invalid_credentials':
          setErrorMessage('Credentials is invalid');
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
          break;
        case 'user_blocked':
          setErrorMessage('This account has been suspended');
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
        case 'missing_fields':
          setErrorMessage('Plase fill all the fields.');
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
        break;
        default:
            setErrorMessage(`Oh Uh! An unexpected error occurred. [${JSON.stringify(signInResponse)}]`);
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
          break;
      }

    }
  };

  return (
    <BackgroundWrapper>
      <HeaderBig subtitle="Login" />

      <View style={styles.container}>

        <View style={styles.inputContainers}>
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


export default LoginScreen;
