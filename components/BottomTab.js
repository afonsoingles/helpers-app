import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Setup from '../pages/Setup';
import Login from '../pages/auth/Login';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTab() {
    const navigation = useNavigation();

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="home-outline" size={24} color="black" />
                    <Text style={styles.tabText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Setup')}>
                    <Ionicons name="settings-outline" size={24} color="black" />
                    <Text style={styles.tabText}>Setup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Login')}>
                    <Ionicons name="log-in-outline" size={24} color="black" />
                    <Text style={styles.tabText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    tabButton: {
        alignItems: 'center',
    },
    tabText: {
        fontSize: 12,
        color: 'black',
    },
});
