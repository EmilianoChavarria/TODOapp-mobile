import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    
    return (
        <View style={styles.container}>
            <Text style={styles.titleSmall}>TODO APP</Text>
            <Image source={require("../../assets/images/Task-amico.png")} style={{ width: 300, height: 300 }} />
            <View>
                <Text style={styles.title}>Organiza tu día, conquista tus <Text style={styles.titleBlue}>metas.</Text> </Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>Empezar...</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 70,
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    titleSmall: {
        fontSize: 20,
        marginBottom: 20,
        fontFamily: 'GoogleSans-Medium',
        textAlign: 'center',
        color: '#000'
    },
    title: {
        fontSize: 40,
        marginBottom: 20,
        fontFamily: 'GoogleSans-Regular',
    },
    titleBlue: {
        fontSize: 40,
        marginBottom: 20,
        color: '#327efb',
        fontFamily: 'GoogleSans-Regular',
    },
    button: {
        backgroundColor: '#327efb',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'GoogleSans-Medium',
    },
});
