import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import HeaderBig from '../../components/HeaderBig';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold, RedHatDisplay_300Light } from '@expo-google-fonts/red-hat-display';
import { useNavigation } from '@react-navigation/native';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { DeleteAccount } from '../../utils/AuthManager';

const DeleteScreen = () => {
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
  const processDeletion = async () => {
    setIsButtonLoading(true);
    setErrorMessage('');
    if (passwordInput.trim() === '') {
      setErrorMessage('Plase fill all the fields.');
      setIsButtonLoading(false);
      return;
    }
    const DeleteResponse = await DeleteAccount(passwordInput);
    if (DeleteResponse.success === true) {
      navigation.navigate('MainRoutes', { screen: 'Setup' });
    } else {
      switch (DeleteResponse.type) {
        case 'invalid_password':
          setErrorMessage('The password is invalid');
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
            setErrorMessage(`Oh Uh! An unexpected error occurred. [${JSON.stringify(DeleteResponse)}]`);
          setTimeout(() => setErrorMessage(''), 5000);
          setIsButtonLoading(false);
          break;
      }

    }
  };
  const StartDeletion = async () => {
    Alert.alert(
        "Delete account",
        "Do you want to delete the account?",
        [
          {
            text: "No",
            onPress: () => setIsButtonLoading(false),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: processDeletion,
          },
        ],
        { cancelable: false }
      );
  }

  return (
    <BackgroundWrapper>
      <HeaderBig subtitle="Delete Account" />
      <View style={styles.container}>
        <View style={styles.inputContainers}>
          <InputBox placeholder='Password' icon={require('../../assets/icons/key.png')} isPassword={true} onChangeText={(text) => setPasswordInput(text)} />
        </View>
        <View style={styles.submitButton}>
          <Button 
            text={isButtonLoading ? "" : "Delete"}
            onButtonClicked={() => !isButtonLoading && StartDeletion()}
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


export default DeleteScreen;
