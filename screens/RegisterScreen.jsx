import React from 'react';
import { View, Text, Button } from 'react-native';

export default function RegisterScreen(params) {
    const handleLogin = () => {
        // Aquí iría tu lógica de autenticación
        navigation.replace('Home');
    };

    return (
        <View>
            <Text>Login</Text>
            <Button title="Entrar" onPress={handleLogin} />
        </View>
    );
};
