import * as Notifications from 'expo-notifications';
import { Platform, Linking } from 'react-native';
import { account } from '../utils/AuthManager';







/**
 * Requests notification permissions for the app.
 * @returns {Promise<void>}
 */
export async function requestNotificationPermission() {
    try {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status === 'granted') {
            console.log('Notification permissions granted.');
        } else if (status === 'denied') {
            console.log('Notification permissions denied.');
            Linking.openSettings();
        } else {
            console.log('Notification permissions request failed.');
        }
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
    }
}

/**
 * Requests critical alert permissions (iOS only).
 * @returns {Promise<boolean>} True if granted, false otherwise.
 */
export async function requestCriticalAlertPermission() {
    if (Platform.OS !== 'ios') {
        console.log('Critical alert permissions are only available on iOS.');
        return false;
    }

    try {
        const { ios } = await Notifications.requestPermissionsAsync({
            ios: { allowCriticalAlerts: true },
        });

        const allowsCriticalAlerts = ios?.allowsCriticalAlerts;
        console.log(allowsCriticalAlerts);
        if (allowsCriticalAlerts) {
            console.log('Critical alert permissions granted.');
            return true;
        } else {
            console.log('Critical alert permissions denied or not supported.');
            Linking.openSettings();
            return false;
        }
    } catch (error) {
        console.error('Error requesting critical alert permissions:', error);
        return false;
    }
}

//* Auth: login account 

export async function loginAccount(email, password) {
    try {
        await account.createEmailPasswordSession(email, password);
        const userDetails = await account.get();
        
        if (userDetails.emailVerification === false) {
            const JWTToken = await account.createJWT();
            console.log("JWT Token:", JWTToken);
            return "email_not_verified";
        }
        console.log("login success - User signed in:", userDetails);
        const JWTToken = await account.createJWT();
        console.log("JWT Token:", JWTToken);
        return "signedIn";
    } catch (error) {
        console.log(error);
        return error.type;
        
    }
}