import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
import { API_URL } from '@env';
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {

      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      const authToken = await AsyncStorage.getItem('authToken');
      const addPhone = await axios.post(`${API_URL}/v2/notifications/devices`, {
        name: Device.modelName,
        pushToken: pushTokenString,
        platform: Device.osName,
        allowsCritical: false
      }, {
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });
      await AsyncStorage.setItem('deviceID', addPhone.data.deviceId);
      return addPhone.data;
        } catch (e) {
          const response = e.response;
          if (response && response.data) {
            if (response.data.type === 'duplicate_device') {
              return
            }
          return;
        }
      }
  }
}
export { registerForPushNotificationsAsync }