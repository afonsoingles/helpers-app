import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import BackgroundWrapper from '../components/BackgroundWrapper';
import HeaderBig from '../components/HeaderBig';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold, RedHatDisplay_300Light, RedHatDisplay_800ExtraBold } from '@expo-google-fonts/red-hat-display';
import { useNavigation } from '@react-navigation/native';
import { proccessAuthState } from '../utils/AuthManager';
import Button from '../components/Button';

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
          <View style={{ width: '80%', alignSelf: 'center' }}>
            <Button text={"Sign up"}/>
          </View>

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
                style={{ color: '#53A7FF', textDecorationLine: 'underline' }}
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


export default Setup;
