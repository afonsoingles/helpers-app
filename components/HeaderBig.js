import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import HeaderImage from '../assets/logos/banner.png';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold } from '@expo-google-fonts/red-hat-display';

const HeaderBig = ({ subtitle }) => {
    let [fontsLoaded] = useFonts({
        RedHatDisplay_400Regular,
        RedHatDisplay_700Bold,
        RedHatDisplay_600SemiBold,
    });

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <Image
                source={HeaderImage}
                style={styles.image}
            />
            <Text style={[styles.subtitle, { fontFamily: 'RedHatDisplay_700Bold' }]}>{subtitle}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        marginTop: RFPercentage(3),
        alignItems: 'center',
        justifyContent: 'top',
        flex: 1,
        
    },
    image: {
        width: '100%',
        height: RFValue(130),
        resizeMode: 'contain',
        maxWidth: '95%',
    },
    subtitle: {
        marginTop: RFValue(-20),
        fontSize: RFValue(25),
        color: '#fff',
        fontFamily: 'RedHatDisplay_600SemiBold',
        textAlign: 'center', 

    },
});

export default HeaderBig;