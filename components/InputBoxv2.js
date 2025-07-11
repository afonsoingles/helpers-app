import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const InputBoxV2 = ({ title, placeholder, value, onChangeText, isPassword, height }) => {
    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, height && { height, textAlignVertical: 'top' }]}
                    placeholder={placeholder}
                    placeholderTextColor="#5C5C5C"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isPassword}
                    autoComplete="off"
                    textContentType="none"
                    autoCapitalize="none"
                    multiline={!!height}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%', // Ensures the title and input box take the full width of the parent container
        marginVertical: RFValue(10),
    },
    title: {
        fontSize: RFValue(14),
        color: 'white',
        fontFamily: 'RedHatDisplay_500Medium',
        marginBottom: RFValue(5),
        textAlign: 'left', // Explicitly ensures left alignment
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Center the input within the container
        backgroundColor: '#333333',
        borderRadius: RFValue(10),
        paddingHorizontal: RFValue(15),
        paddingVertical: RFValue(10),
    },
    input: {
        flex: 1,
        fontSize: RFValue(16),
        color: 'white',
        fontFamily: 'RedHatDisplay_400Regular',
    },
});

export default InputBoxV2;
