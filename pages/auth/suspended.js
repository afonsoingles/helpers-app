import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import HeaderBig from '../../components/HeaderBig';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold, RedHatDisplay_300Light, RedHatDisplay_800ExtraBold } from '@expo-google-fonts/red-hat-display';
import { useNavigation } from '@react-navigation/native';
import { proccessAuthState } from '../../utils/AuthManager';

const SuspendedScreen = ({ route }) => {

  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_700Bold,
    RedHatDisplay_600SemiBold,
    RedHatDisplay_800ExtraBold,
    RedHatDisplay_300Light,
  });
  if (!fontsLoaded) return null;
  const { accountData } = route.params;
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <HeaderBig subtitle="Suspended!" style={{fontFamily: 'RedHatDisplay_800ExtraBold'}} />
        <View style={[styles.AlignBottom, { marginBottom: RFValue(15) }]}>
          <View>
          <Text style={[styles.Text]}>
          This account has been suspended for {' '}
          </Text>
              <Text style={[{fontFamily: 'RedHatDisplay_800ExtraBold'}, styles.BottomText]}>
              {accountData.moderationReason}
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
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  BottomText: {
    color: "#fff",
    fontSize: RFValue(17),
    fontFamily: "RedHatDisplay_800ExtraBold",
    textAlign: "center",
    marginBottom: "10%"
  },
  Text: {
    color: "#fff",
    fontSize: RFValue(17),
    textAlign: "center",
    fontFamily: "RedHatDisplay_700Bold",
  },
});
export default SuspendedScreen;
