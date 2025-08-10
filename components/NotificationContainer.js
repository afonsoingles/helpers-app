import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import warningIcon from '../assets/icons/warning.png';
import eyeIcon from '../assets/icons/eye.png'; // Add the eye icon

const NotificationContainer = ({ title, body, critical, onPress, onEyePress }) => {
    return (
        <View
            style={[
                styles.notification,
                critical ? styles.criticalBorder : styles.normalBorder,
            ]}
        >
            <View style={styles.titleContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {critical && (
                        <Image source={warningIcon} style={styles.criticalIconImage} />
                    )}
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                </View>
                <TouchableOpacity onPress={onEyePress}>
                    <Image source={eyeIcon} style={styles.eyeIcon} />
                </TouchableOpacity>
            </View>
            <Text style={styles.body} numberOfLines={4}>{body}</Text>
            
        </View>
    );
};

const styles = StyleSheet.create({
    notification: {
        padding: RFValue(15),
        borderRadius: RFValue(10),
        marginBottom: RFValue(10),
        borderLeftWidth: RFValue(4),
        marginTop: RFValue(5),
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: RFValue(5.5),
    },
    criticalIcon: {
        color: '#FF3B30',
        fontSize: RFValue(18),
        marginRight: RFValue(8),
    },
    title: {
        fontSize: RFValue(16),
        fontWeight: 'bold',
        color: '#fff',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    body: {
        textAlign: 'justify',
        fontSize: RFValue(14),
        color: '#e0e0e0',
        marginBottom: RFValue(5),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    moreBtn: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
        borderRadius: RFValue(6),
        paddingHorizontal: RFValue(12),
        paddingVertical: RFValue(6),
        marginTop: RFValue(5),
    },
    moreBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    criticalBorder: {
        borderLeftColor: '#FF3B30',
        backgroundColor: '#1c1a1a',
    },
    normalBorder: {
        borderLeftColor: '#035ab9',
        backgroundColor: '#1c1a1a',
    },
    criticalIconImage: {
        marginRight: RFValue(2.5),
        width: RFValue(30),
        height: RFValue(30),
        resizeMode: 'contain',
    },
    eyeIcon: {
        width: RFValue(20),
        height: RFValue(20),
        resizeMode: 'contain',
        opacity: 0.5,
    },
});

export default NotificationContainer;
