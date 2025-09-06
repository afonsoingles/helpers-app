import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import Button from './Button';
import { setupPushConfig, requestPushPermissions } from '../utils/NotificationsManager';

const PushNotificationSetup = ({ onSetupComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSetupPushNotifications = async () => {
    setIsLoading(true);
    setErrorMessage(''); // Clear any previous errors
    
    try {
      // First request permissions
      const hasPermission = await requestPushPermissions();
      if (!hasPermission) {
        setErrorMessage('Push notification permission was denied. Please enable notifications in your device settings.');
        onSetupComplete(false);
        return;
      }

      // Then setup push config using existing function
      const result = await setupPushConfig();
      
      if (result === "ok") {
        console.log('Push notifications set up successfully');
        onSetupComplete(true);
      } else if (result === "manualAuthorizationRequired") {
        setErrorMessage('Please enable push notifications in your device settings and try again.');
        onSetupComplete(false);
      } else {
        setErrorMessage('Failed to set up push notifications. Please try again.');
        onSetupComplete(false);
      }
    } catch (error) {
      console.log('Push notification setup error:', error);
      setErrorMessage('An unexpected error occurred while setting up push notifications.');
      onSetupComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.description}>
          Stay updated with important notifications from your helpers.
        </Text>
        
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>You are in control</Text>
          <Text style={styles.benefitItem}>You can choose what helpers you want to enable and receive notifications from them. You can also disable notifications from any helper at any time.</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          text="Enable Notifications"
          onButtonClicked={handleSetupPushNotifications}
          isLoading={isLoading}
          isButtonDisabled={isLoading}
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(20),
  },
  description: {
    fontSize: RFValue(16),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: RFValue(24),
    marginBottom: RFValue(30),
  },
  benefitsContainer: {
    backgroundColor: '#333333',
    borderRadius: RFValue(12),
    padding: RFValue(20),
    marginTop: RFValue(20),
  },
  benefitsTitle: {
    fontSize: RFValue(18),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
    marginBottom: RFValue(15),
  },
  benefitItem: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#e0e0e0',
    marginBottom: RFValue(8),
    lineHeight: RFValue(20),
  },
  buttonContainer: {
    paddingTop: RFValue(20),
  },
  errorText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: RFValue(10),
    lineHeight: RFValue(20),
  },
});

export default PushNotificationSetup;
