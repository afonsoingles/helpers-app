import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import HeaderBig from '../../components/HeaderBig';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold, RedHatDisplay_300Light, RedHatDisplay_800ExtraBold } from '@expo-google-fonts/red-hat-display';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import Logout from '../../assets/icons/logout.png';
import { logOff } from '../../utils/AuthManager'

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
  const proccessLogout = () => {
    logOff().then(() => {
      navigation.navigate('MainRoutes', { screen: 'Setup' });
    }).catch((error) => {
      console.error("Logout failed:", error);
    });
  }
  return (
    <BackgroundWrapper>
      <HeaderBig subtitle="Account Suspended" />
      <View style={styles.container}>
        <View style={styles.AlignCenter}>
          <Text style={[styles.text, { fontFamily: 'RedHatDisplay_700Bold', marginBottom: RFValue(15)}, styles.textAlignLeft]}>
            Dear {accountData.name},
          </Text>
          <Text style={[styles.text, styles.textAlignLeft]}>
          Your account has been suspended due to a serious violation of our Terms of Service.{"\n\n"}
          Unfortunately, this means you no longer have access to your account and any helpers you were using will be stopped.{"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>Reason:</Text> <Text style={{fontStyle: "italic"}}>{accountData.moderationReason || 'No reason specified'}</Text>{"\n\n\n"}

          Please check your email for more details on the suspension and how to proceed.
          </Text>
        </View>
      </View>

      <View style={[styles.AlignBottom, {alignSelf: 'center'}]}>
        <Button icon={Logout} isButtonDisabled={false} text={"Logout"} onButtonClicked={() => {proccessLogout()}} isLoading={false} />
      </View>
    </BackgroundWrapper>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: RFPercentage(5),
    flex: 1,
    justifyContent: 'flex-start',
  },
  AlignCenter: {
    alignItems: 'center',
  },
  text: {
    fontSize: RFValue(16),
    color: '#fff',
    fontFamily: 'RedHatDisplay_400Regular',
    textAlign: 'justify',
  },
  textAlignLeft: {
    textAlign: 'justify',
    justifyContent: 'left',
    alignItems: 'flex-start',
    width: '100%',
    lineHeight: RFValue(20),
    paddingHorizontal: RFValue(20),
  },
  AlignBottom: {
    justifyContent: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? RFValue(35) : RFValue(25),
    width: '90%',
  },
});
export default SuspendedScreen;