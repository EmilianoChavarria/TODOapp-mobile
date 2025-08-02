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
import { AuthService } from '../../services/AuthService';
import { useToast } from '../../components/ToastContext';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();
    }, []);

    // Función para validar si el formulario es válido
    const isFormValid = () => {
        // Validar que todos los campos tengan contenido
        const isNameValid = name.trim().length > 0;
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = password.length >= 6;

        return isNameValid && isEmailValid && isPasswordValid;
    };

    const { showToast } = useToast();
    const handleRegister = () => {
        if (!isFormValid()) {
            // Esto no debería ocurrir porque el botón estará deshabilitado
            return;
        }

        const register = async () => {
            try {
                const response = await AuthService.register(name, email, password);
                // Alert.alert('Registro exitoso', '¡Tu cuenta ha sido creada!');
                showToast({ message: '¡Tu cuenta ha sido creada!', type: 'success' });
                navigation.replace('Login');
            } catch (error) {
                console.error('Error en el registro:', error);
                // Alert.alert('Error', error.message || 'Ocurrió un error al registrar usuario');
                showToast({ message: error.message || 'Error al registrar usuario', type: 'error' });

            }
        };

        register();
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
                        <Text style={styles.title}>Únete :)</Text>
                        <Text style={styles.subtitleHeader}>Crea tu cuenta en TODO App</Text>
                    </Animated.View>

                    <View style={styles.form}>
                        <Text style={styles.subtitle}>Ingresa tus datos</Text>

                        <View>
                            <Text style={styles.inputName}>Nombre completo:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Aldrick Chavarría"
                                placeholderTextColor="#aaa"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View>
                            <Text style={styles.inputName}>Correo electrónico:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ejemplo@gmail.com"
                                placeholderTextColor="#aaa"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={{ position: 'relative' }}>
                            <Text style={styles.inputName}>Contraseña:</Text>
                            <TextInput
                                style={styles.input}
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

                        <TouchableOpacity
                            style={[styles.button, !isFormValid() && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={!isFormValid()}
                        >
                            <Text style={styles.buttonText}>Registrarme</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
        height: '30%',
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
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingTop: 40,
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
        marginBottom: 20,
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
    buttonDisabled: {
        backgroundColor: '#a0c0f8',
        opacity: 0.7,
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
        top: 42,
        zIndex: 1,
    },
});