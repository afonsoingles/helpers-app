import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import BackgroundWrapper from '../../components/old/BackgroundWrapper';
import HeaderBig from '../../components/HeaderBig';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold, RedHatDisplay_300Light } from '@expo-google-fonts/red-hat-display';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import { loginAccount } from '../../utils/ButtonHandlers';
import ErrorMessage from '../../components/ErrorMessage';
import { signIn } from '../../utils/AuthManager';

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
      setErrorMessage('Por favor, preencha todos os campos.');
      setIsButtonLoading(false);
      return;
    }

    const signInResponse = await signIn(emailInput, passwordInput);
    if (signInResponse.status === 'success') {
      navigation.navigate('MainRoutes', { screen: 'Home' });
    } else {
      switch (signInResponse.type) {
        case 'invalid_credentials':
          setErrorMessage('Email ou senha inválidos.');
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
          break;
        case 'user_blocked':
          setErrorMessage('Esta conta está suspensa.');
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
        default:
          setErrorMessage('Ocorreu um erro ao iniciar sessão. ['+signInResponse.type+']');
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
          break;
      }

    }
  };

  return (
    <BackgroundWrapper>
      <HeaderBig subtitle="Iniciar Sessão" />

      <View style={styles.container}>
        
        <View style={styles.inputContainers}>
          <InputBox placeholder='Email' icon={require('../../assets/icons/user.png')} onChangeText={(text) => setEmailInput(text)} />
          <InputBox placeholder='Password' icon={require('../../assets/icons/key.png')} isPassword={true} onChangeText={(text) => setPasswordInput(text)} />
        </View>
        <View style={styles.submitButton}>
          <Button 
            text={isButtonLoading ? "" : "Entrar"} 
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
