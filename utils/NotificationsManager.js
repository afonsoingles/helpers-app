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
    shouldAllowAnnouncement: true,

  }),
});


async function setupPushConfig() {

  const notificationPermissionStatus = await Notifications.getPermissionsAsync();
  if (notificationPermissionStatus.status !== 'granted') {
    return "manualAuthorizationRequired";
  }
  

  Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
    showBadge: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
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
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,

    
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

    AsyncStorage.setItem('notificationDeviceToken', pushToken.data);
    AsyncStorage.setItem('notificationDeviceId', ApiResponse.data.deviceId)
  } catch (error) {
    if (error.response?.data?.type === 'duplicate_device') {
      console.log("Device already registered, fetching device ID from account data");
      // Device already exists, get the device ID from user's account data
      const { getAccountData } = await import('./AuthManager');
      const userData = await getAccountData();
      const pushConfiguration = userData?.pushConfiguration || [];
      
      // Find the device with matching push token
      const existingDevice = pushConfiguration.find(
        (config) => config.pushToken === pushToken.data
      );
      
      if (existingDevice) {
        AsyncStorage.setItem('notificationDeviceToken', pushToken.data);
        AsyncStorage.setItem('notificationDeviceId', existingDevice.deviceId);
        AsyncStorage.setItem('notificationDeviceStatus', 'ok');
      } else {
        console.log("Could not find device in account data");
        return "error";
      }
    } else {
     return "error";
    }
  }

  

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

  AsyncStorage.setItem('notificationDeviceToken', token);
  AsyncStorage.setItem('notificationDeviceId', ApiResponse.data.deviceId);
}

async function getNotificationDeviceStatus() {
  const notificationDeviceId = await AsyncStorage.getItem('notificationDeviceId');

  if (!notificationDeviceId) {
    return setupPushConfig();
  }

  const realDeviceToken = await Notifications.getExpoPushTokenAsync();
  const registeredDeviceToken = await AsyncStorage.getItem('notificationDeviceToken');
  if (realDeviceToken.data !== registeredDeviceToken) {
    console.log(realDeviceToken)
    console.log(registeredDeviceToken)
    return "tokenMismatch";
  }

  const { getAccountData } = await import('./AuthManager');
  const userData = await getAccountData();

  const pushConfiguration = userData?.pushConfiguration || [];
  const isTokenRegistered = pushConfiguration.some(
    (config) => config.pushToken === realDeviceToken.data
  );

  if (!isTokenRegistered) { // handle when admin removes token in admin dash
    return "tokenNotRegistered";
  }
  
  return "ok";
}


// Device check-in functionality
async function checkInDevice() {
  const authToken = await AsyncStorage.getItem('authToken');
  const deviceId = await AsyncStorage.getItem('notificationDeviceId');
  
  if (!authToken || !deviceId) {
    console.log('Check-in failed: Missing auth token or device ID');
    return false;
  }

  try {
    const response = await axios.post(`${API_URL}/v2/notifications/devices/${deviceId}/checkIn`, {}, {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });
    
    if (response.data.success) {
      console.log('Device check-in successful');
      return true;
    }
  } catch (error) {
    console.log('Device check-in failed:', error.response?.data?.message || error.message);
  }
  
  return false;
}


// Request push notification permissions
async function requestPushPermissions() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.log('Error requesting push permissions:', error);
    return false;
  }
}

// Unregister the current device from server and clear local storage
async function unregisterPushDevice() {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    const deviceId = await AsyncStorage.getItem('notificationDeviceId');
    if (authToken && deviceId) {
      try {
        await axios.delete(`${API_URL}/v2/notifications/devices/${deviceId}`, {
          headers: { authorization: `Bearer ${authToken}` }
        });
      } catch (err) {
        console.log('unregisterPushDevice error:', err?.response?.data || err.message);
      }
    }
  } finally {
    AsyncStorage.removeItem('notificationDeviceId');
    AsyncStorage.removeItem('notificationDeviceToken');
    AsyncStorage.removeItem('notificationDeviceStatus');
  }
}

export { 
  setupPushConfig, 
  loadUserNotifications, 
  getNotificationDeviceStatus, 
  updatePushConfig, 
  registerToken,
  checkInDevice,
  requestPushPermissions,
  unregisterPushDevice
};