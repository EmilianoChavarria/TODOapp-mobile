import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthService } from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    // Animated value para opacidad
    const fadeAnim = useRef(new Animated.Value(0)).current;



    useEffect(() => {
        
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogin = () => {
        if (email && password) {

            const login = async () => {
                try {
                    const response = await AuthService.login(email, password);

                    if (response.success) {
                        await AsyncStorage.setItem('data', JSON.stringify(response.data));
                        console.log("🚀 ~ login ~ response.data:", response.data)
                        navigation.replace('Home');
                    } else {
                        Alert.alert('Error', response.detalles || 'Credenciales incorrectas');
                    }
                } catch (error) {
                    console.error('Error en el inicio de sesión:', error);
                }
            }
            login();


            // navigation.replace('Home');
        } else {
            Alert.alert('Campos vacíos', 'Por favor, completa todos los campos.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>

                    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                        <Text style={styles.title}>Hola!</Text>
                        <Text style={styles.subtitleHeader}>Bienvenido a TODO App</Text>
                    </Animated.View>

                    <View style={styles.form}>
                        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

                        <View>
                            <Text style={styles.inputName}>Correo electrónico:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ejemplo@gmail.com"
                                placeholderTextColor="#aaa"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={{ position: 'relative' }}>
                            <Text style={styles.inputName}>Contraseña:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="#aaa"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={24}
                                    color="#999"
                                />
                            </TouchableOpacity>
                        </View>



                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Entrar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        backgroundColor: '#FFF'
    },
    container: {
        backgroundColor: '#327efb',
        minHeight: '100%',
    },
    header: {
        height: '33%',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 50,
        fontFamily: 'GoogleSans-Regular',
        color: 'white',
    },
    subtitleHeader: {
        marginTop: 10,
        fontSize: 20,
        fontFamily: 'GoogleSans-Regular',
        color: 'white',
    },
    form: {
        height: '73%',
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingTop: 70,
        marginTop: -30,
        paddingBottom: 40,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    subtitle: {
        fontSize: 20,
        fontFamily: 'GoogleSans-Regular',
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
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
    button: {
        backgroundColor: '#327efb',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'GoogleSans-Medium',
    },
    linkText: {
        color: '#327efb',
        textAlign: 'center',
        marginTop: 15,
        fontFamily: 'GoogleSans-Medium',
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 42, // ajusta según tu padding o tamaño
        zIndex: 1,
    },
});
