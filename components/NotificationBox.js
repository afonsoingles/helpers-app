import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Linking, AppState, Platform } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold } from '@expo-google-fonts/red-hat-display';
import { requestNotificationPermission, requestCriticalAlertPermission } from '../utils/ButtonHandlers';
import * as Notifications from 'expo-notifications';
import { MaterialIcons } from '@expo/vector-icons';
import { account, AppwriteException } from '../utils/AuthManager';


const NotificationBox = ({ onPermissionsChanged }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isGranted, setIsGranted] = useState(false);
    const [isDenied, setIsDenied] = useState(false);


    let [fontsLoaded] = useFonts({
        RedHatDisplay_400Regular,
        RedHatDisplay_700Bold,
        RedHatDisplay_600SemiBold,
    });

    const checkPermissions = async () => {
        // Check general notification permissions
        const notificationSettings = await Notifications.getPermissionsAsync();
        const status = notificationSettings.status;

        setIsGranted(status === 'granted');
        setIsDenied(notificationSettings.canAskAgain === false);
        if (status === 'granted') {
            const devicePushToken = await Notifications.getDevicePushTokenAsync();
            console.log('Device push token: ', devicePushToken.data);

            if (Platform.OS === 'android') {
                try {
                    const _targetId = devicePushToken.data.substring(0, 12);
                    const registerProvider = await account.createPushTarget(targetId=_targetId, identifier=devicePushToken.data, providerId="fcm");
                    console.log('Register provider: ', registerProvider);
                } catch (error) {
                    if (error instanceof AppwriteException && error.type === "user_target_already_exists") {
                        return;
                    }
                    console.log('Error registering provider: ', error);
                }
            } else {
                try {
                    const _targetId = devicePushToken.data.substring(0, 12);
                    const registerProvider = await account.createPushTarget(targetId=_targetId, identifier=devicePushToken.data, providerId="apns");
                    console.log('Register provider: ', registerProvider);
                } catch (error) {
                    console.log('Error registering provider: ', error);
                }
            }
        }


    };

    useEffect(() => {
        // Initial permissions check
        checkPermissions();

        // Update permissions when app returns to foreground
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                checkPermissions();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleButtonPress = async () => {
        
        if (isDenied) {
            Linking.openSettings();
        } else {
            setIsLoading(true);
            await requestNotificationPermission();
            checkPermissions();
            setIsLoading(false);

            if (onPermissionsChanged) {
                onPermissionsChanged(isGranted);
            }
        }
    };

    
    if (!fontsLoaded) return null;

    return (
        <View style={styles.permissionsBox}>



            <View style={[styles.horizontalContainer, { marginTop: '5%' }]}>
                <Image source={require('../assets/icons/bell.png')} style={styles.icon} />
                <Text style={styles.optionText}>Notificações</Text>
                <TouchableOpacity
                    style={[
                        styles.optionButton,
                        isGranted ? styles.optionButtonGranted : null,
                        isDenied ? styles.optionButtonDenied : null,
                    ]}
                    onPress={handleButtonPress}
                    disabled={isGranted || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : isGranted ? (
                        <MaterialIcons name="check" size={RFValue(18)} color="#fff" />
                    ) : isDenied ? (
                        <MaterialIcons name="close" size={RFValue(18)} color="#fff" />
                    ) : (
                        <Text style={styles.optionButtonText}>Allow</Text>
                    )}
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    permissionsBox: {
        backgroundColor: '#333333',
        borderRadius: 15,
        width: '90%',
        paddingBottom: '5%',
        paddingRight: '2%',
        alignSelf: 'center',
        marginTop: '10%',
    },
    horizontalContainer: {
        marginTop: '2%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '2%',
    },
    icon: {
        width: RFValue(25),
        height: RFValue(25),
        marginRight: '1.5%',
    },
    text: {
        fontSize: RFValue(17),
        color: 'white',
        fontFamily: 'RedHatDisplay_700Bold',
    },
    descriptionContainer: {
        marginTop: '3%',
        marginLeft: '2%',
    },
    descriptionText: {
        fontSize: RFValue(14),
        color: 'white',
        fontFamily: 'RedHatDisplay_400Regular',
    },
    optionText: {
        fontSize: RFValue(15),
        color: 'white',
        fontFamily: 'RedHatDisplay_400Regular',
    },
    optionButton: {
        backgroundColor: '#8C52FF',
        borderRadius: 30,
        marginLeft: 'auto',
        marginRight: '2%',
        padding: '2%',
        paddingRight: '5%',
        paddingLeft: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        width: RFValue(90),
        height: RFValue(30),
    },
    optionButtonGranted: {
        backgroundColor: '#5e3ba3',
    },
    optionButtonDenied: {
        backgroundColor: '#8C52FF',
    },
    optionButtonText: {
        fontSize: RFValue(12),
        color: '#fff',
        fontFamily: 'RedHatDisplay_600SemiBold',
    },
});

export default NotificationBox;
