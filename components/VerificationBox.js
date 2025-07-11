import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold } from '@expo-google-fonts/red-hat-display';

const VerificationBox = () => {
    let [fontsLoaded] = useFonts({
        RedHatDisplay_400Regular,
        RedHatDisplay_700Bold,
        RedHatDisplay_600SemiBold,
    });

    if (!fontsLoaded) return null;

    return (
        <View style={styles.verificationBox}>
            <View style={styles.header}>
                <Image source={require('../assets/icons/user.png')} style={styles.icon} />
                <Text style={styles.headerText}>Verification</Text>
            </View>
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    Status: <Text>Pending</Text>
                </Text>
                <Text style={styles.statusText}>Reason: <Text style={styles.statusText}>aaa</Text></Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    verificationBox: {
        backgroundColor: '#333333',
        borderRadius: 15,
        width: '90%',
        alignSelf: 'center',
        padding: RFValue(15),
        marginTop: RFValue(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: RFValue(10),
    },
    icon: {
        width: RFValue(25),
        height: RFValue(25),
        marginRight: RFValue(10),
    },
    headerText: {
        fontSize: RFValue(16),
        color: 'white',
        fontFamily: 'RedHatDisplay_600SemiBold',
    },
    statusContainer: {
        marginTop: RFValue(10),
    },
    statusText: {
        fontSize: RFValue(14),
        color: 'white',
        fontFamily: 'RedHatDisplay_600SemiBold',
        marginBottom: RFValue(5),
    },
});

export default VerificationBox;
