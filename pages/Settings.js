import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BackgroundWrapper from '../components/BackgroundWrapper';
import HeaderBig from '../components/HeaderBig';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold } from '@expo-google-fonts/red-hat-display';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { logOff } from '../utils/AuthManager';

const SettingsScreen = () => {
  const [isButtonLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_700Bold,
    RedHatDisplay_600SemiBold,
  });


  const navigation = useNavigation();
  if (!fontsLoaded) return null;
  return (
    <BackgroundWrapper>
      <HeaderBig subtitle="Settings" />
      <View style={styles.container}>
        <View style={styles.submitButton}>
          <Button
            text={isButtonLoading ? "" : "Logoff"}
            onButtonClicked={() => {
                if (!isButtonLoading) {
                    logOff();
                    navigation.navigate('MainRoutes', { screen: 'Setup' });
                }
            }}
            isLoading={isButtonLoading}
            isButtonDisabled={isButtonLoading}
          />
        <Button
            text={isButtonLoading ? "" : "Go back"}
            onButtonClicked={() => {
                if (!isButtonLoading) {
                    logOff();
                    navigation.navigate('MainRoutes', { screen: 'Home' });
                }
            }}
            isLoading={isButtonLoading}
            isButtonDisabled={isButtonLoading}
        />
        </View>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  submitButton: {
    marginTop: RFValue(35),
    width: '85%',
    alignSelf: 'center',
    gap: 10,
  },
});


export default SettingsScreen;
