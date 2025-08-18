import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
import { API_URL } from '@env';
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import { getAccountData } from './AuthManager';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


async function setupPushConfig() {

  const notificationPermissionStatus = await Notifications.getPermissionsAsync();
  if (notificationPermissionStatus.status === 'denied') {
    return "manualAuthorizationRequired";
  }
  
  if (notificationPermissionStatus.status === 'undertermined') {
    const permissionResponse = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
        allowCriticalAlerts: true,
      },
    });

    if (permissionResponse.status !== 'granted') {
      return "manualAuthorizationRequired";
    }
  }

  Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
  });

  Notifications.setNotificationChannelAsync('critical', {
    name: 'Critical Alerts',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'sos.wav',
    vibrationPattern: [0, 1000, 1000, 1000],
    enableVibrate: true,
    enableLights: true,
    lightColor: '#FF0000',
    showBadge: true,
    bypassDnd: true,
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
      flags: {
        enforceAudibility: true,
      },
    },

  });

  const pushToken = await Notifications.getExpoPushTokenAsync();
  const authToken = await AsyncStorage.getItem('authToken');


  try {
    const ApiResponse = await axios.post(`${API_URL}/v2/notifications/devices`, {
      name: Device.modelName || "Unknown Device",
      pushToken: pushToken.data,
      platform: Platform.OS === 'android' ? 'android' : 'ios',
      allowsCritical: true // decrapted since i was able to make critical alerts work on android
    }, {
      headers: {
      authorization: `Bearer ${authToken}`
      }
    });

    if (ApiResponse.status !== 200) {
      console.log("Unable to register device: ", ApiResponse.data);
      return "error";
    }
  } catch (error) {
    console.error("Failed to setup push configuration:", error.response.data);
    return "error";
  }

  AsyncStorage.setItem('notificationDeviceToken', pushToken.data);
  AsyncStorage.setItem('notificationDeviceId', ApiResponse.data.deviceId)

  return "ok";
}

async function updatePushConfig() {
  const authToken = await AsyncStorage.getItem('authToken');
  if (!authToken) return;

  const pushToken = await Notifications.getExpoPushTokenAsync();
  const notificationDeviceId = await AsyncStorage.getItem('notificationDeviceId');

  try {
    const ApiResponse = await axios.put(`${API_URL}/v2/notifications/devices/${notificationDeviceId}`, {
      pushToken: pushToken.data,
    }, {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });

    if (ApiResponse.status !== 200) {
      console.log("Unable to update device: ", ApiResponse.data);
      return "error";
    }
  } catch (error) {

    return "error";
  }

  AsyncStorage.setItem('notificationDeviceStatus', 'ok');
  AsyncStorage.setItem('notificationDeviceToken', pushToken.data);

  return "ok";
}

async function loadUserNotifications(page, limit) {
  const authToken = await AsyncStorage.getItem('authToken');
  if (!authToken) return;

  try {
    const response = await axios.get(`${API_URL}/v2/notifications`, {
      headers: {
        authorization: `Bearer ${authToken}`
      },
      params: {
        page: page || 1,
        limit: limit || 10,
      },
    });
    return response.data.notifications;
  } catch (error) {
    return [];
  }
}

async function registerToken(token) {
  const authToken = await AsyncStorage.getItem('authToken');

  try {
    const ApiResponse = await axios.post(
      `${API_URL}/v2/notifications/devices`,
      {
        name: Device.modelName || "Unknown Device",
        pushToken: token,
        platform: Platform.OS === 'android' ? 'android' : 'ios',
        allowsCritical: true // deprecated since I was able to make critical alerts work on android
      },
      {
        headers: {
          authorization: `Bearer ${authToken}`
        }
      }
    );

    if (ApiResponse.status !== 200) {
      console.log("Unable to register device: ", ApiResponse.data);
      return "error";
    }
  } catch (error) {
    console.error("Failed to setup push configuration:", error);
    return "error";
  }

  AsyncStorage.setItem('notificationDeviceToken', pushToken.data);
  AsyncStorage.setItem('notificationDeviceId', ApiResponse.data.deviceId);
}

async function getNotificationDeviceStatus() {
  const notificationDeviceId = await AsyncStorage.getItem('notificationDeviceId');

  if (!notificationDeviceId) {
    return "requireSetup"
  }

  const realDeviceToken = await Notifications.getExpoPushTokenAsync();
  const registeredDeviceToken = await AsyncStorage.getItem('notificationDeviceToken');
  if (realDeviceToken !== registeredDeviceToken) {
    await updatePushConfig();
    return "ok";
  }

  const userData = await getAccountData();

  const pushConfiguration = userData?.pushConfiguration || [];
  const isTokenRegistered = pushConfiguration.some(
    (config) => config.pushToken === realDeviceToken.data
  );

  if (!isTokenRegistered) { // handle when admin removes token in admin dash
    registerToken(realDeviceToken.data);
    return "tokenNotRegistered";
  }
  
  return "ok";
}


// check in. remove push config.

export { setupPushConfig, loadUserNotifications, getNotificationDeviceStatus, updatePushConfig, registerToken };