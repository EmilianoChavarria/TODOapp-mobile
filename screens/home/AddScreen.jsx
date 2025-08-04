import { Text, View, StyleSheet, TextInput } from "react-native";
import React, { useState, useRef, useEffect } from 'react';

export default function AddScreen() {

    const [titulo, setTitulo] = useState('');

    return (
        <View style={styles.mainContainer}>
            <View style={styles.mainContentContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nueva tarea</Text>
                </View>
                <View>
                    <Text style={styles.inputName}>Nombre completo:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Aldrick Chavarría"
                        placeholderTextColor="#aaa"
                        value={titulo}
                        onChangeText={setTitulo}
                    />
                </View>
            </View>
        </View>
    );

};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    mainContentContainer: {
        paddingTop: 60,
        paddingLeft: 15,
        paddingBottom: 30,
    },
    title: {
        fontSize: 32,
        color: '#333',
        fontFamily: 'GoogleSans-Medium',
    },
    inputName: {
        fontSize: 16,
        fontFamily: 'GoogleSans-Medium',
        color: '#000',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#327efb',
        borderWidth: 1.2,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: 'GoogleSans-Regular',
        color: '#000',
        marginBottom: 20,
    },
})