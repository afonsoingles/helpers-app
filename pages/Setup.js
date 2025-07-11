import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import BackgroundWrapper from '../components/BackgroundWrapper';
import HeaderBig from '../components/HeaderBig';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold, RedHatDisplay_300Light, RedHatDisplay_800ExtraBold } from '@expo-google-fonts/red-hat-display';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { account, proccessAuthState } from '../utils/AuthManager';

const Setup = ({ }) => {

  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_700Bold,
    RedHatDisplay_600SemiBold,
    RedHatDisplay_800ExtraBold,
    RedHatDisplay_300Light,
  });

  useEffect(() => {
    proccessAuthState(navigation);
  }, []);

  if (!fontsLoaded) return null;

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <HeaderBig subtitle="Welcome!" style={{fontFamily: 'RedHatDisplay_800ExtraBold'}} />
        <View style={[styles.AlignBottom, { marginBottom: RFValue(15) }]}>
          <TouchableOpacity
            style={[buttonStyles.button]}
            disabled={false}
            onPress={() => navigation.navigate('AuthRoutes', { screen: 'Signup' })}
          >
            <Text style={[buttonStyles.buttonText]}>Sign up!</Text>
          </TouchableOpacity>

          <View style={{ marginTop: RFValue(0) }} id="loginBottomSetup">
            <Text
              style={{
                color: 'white',
                fontSize: RFValue(14),
                fontFamily: 'RedHatDisplay_400Regular',
                textAlign: 'center',
              }}
            >
              Aready have an account? {' '}
              <Text
                style={{ color: '#8c52ff', textDecorationLine: 'underline' }}
                onPress={() => navigation.navigate('AuthRoutes', { screen: 'Login' })}
                suppressHighlighting={true}
              >
                Log in
              </Text>
            </Text>
          </View>

        </View>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  AlignBottom: {
    position: 'relative',
    marginTop: Platform.OS === 'android' ? RFPercentage(60) : RFPercentage(20),
    gap: 10
  },
});

const buttonStyles = StyleSheet.create({
  button: {
    width: '62%',
    height: RFValue(40),
    backgroundColor: '#8c52ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: RFValue(20),
    fontFamily: 'RedHatDisplay_800ExtraBold',
  },
});

export default Setup;
