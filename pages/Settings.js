import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import BackgroundWrapper from '../components/BackgroundWrapper';
import HeaderBig from '../components/HeaderBig';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold } from '@expo-google-fonts/red-hat-display';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { logOff, getAccountData } from '../utils/AuthManager';
import NavigationBar from '../components/NavigationBar';

const SettingsScreen = () => {
  const [user, setUser] = useState(null);
  const [isButtonLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_700Bold,
    RedHatDisplay_600SemiBold,
  });

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getAccountData();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!fontsLoaded) return null;

  if (!user) {
    return (
      <BackgroundWrapper>
        <HeaderBig subtitle="Settings" />
        <View style={styles.container}>
          <Text>Loading user data...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <HeaderBig subtitle="Settings" />
      <View style={styles.container}>
        {/* User Icon */}
        <Image source={require('../assets/icons/user.png')} style={styles.userIcon} />

        {/* User Name */}
        <Text style={styles.userName}>{user.name}</Text>

        {/* User Email */}
        <Text style={styles.userEmail}>{user.email}</Text>

        {/* Logout Button */}
        <Button
          text="Logout"
          onButtonClicked={() => {
            if (!isButtonLoading) {
              logOff();
              navigation.navigate('MainRoutes', { screen: 'Setup' });
            }
          }}
          isLoading={isButtonLoading}
          isButtonDisabled={isButtonLoading}
        />
      </View>
      <View style={[styles.AlignBottom, { paddingHorizontal: RFValue(20) }]}>
        <NavigationBar tab="settings" userInfo={user || null} />
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(20),
  },
  userIcon: {
    width: RFValue(100),
    height: RFValue(100),
    marginBottom: RFValue(20),
  },
  userName: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#FFFFFF', // Set user name color to white
    marginBottom: RFValue(10),
  },
  userEmail: {
    fontSize: RFValue(16),
    color: 'gray',
    marginBottom: RFValue(20),
  },
  AlignBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default SettingsScreen;
