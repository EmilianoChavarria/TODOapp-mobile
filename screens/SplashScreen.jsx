import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native"
import LottieView from 'lottie-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Splash = () => {

    const navigation = useNavigation();

    const mostrarTodoAsyncStorage = async () => {
        try {
            // Obtienes todas las claves almacenadas

            const keys = await AsyncStorage.getAllKeys();
            // Obtienes todos los valores de esas claves
            const stores = await AsyncStorage.multiGet(keys);

            // stores es un array de arrays: [[key, value], [key, value], ...]
            stores.forEach(([key, value]) => {
                console.log(`${key} : ${value}`);
            });
        } catch (error) {
            console.error('Error leyendo AsyncStorage:', error);
        }
    };

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const userData = await AsyncStorage.getItem('data');  
                if (userData) {
                    navigation.replace('Home');
                } else {
                    navigation.replace('Welcome');
                }
            } catch (error) {
                console.error('Error leyendo AsyncStorage:', error);
                navigation.replace('Welcome'); // fallback
            }
        };

        mostrarTodoAsyncStorage();

        const timeoutId = setTimeout(() => {
            checkLogin();
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [navigation]);

    return (
        <View style={style.container}>
            {/* <Image source={require('../assets/images/logo.svg')} style={style.loadingAnimation} /> */}
            <LottieView source={require('../assets/images/splash2.json')} autoPlay={true} loop={true} style={style.loadingAnimation} />

            <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#000' }}>TODO App</Text>
        </View>

    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingAnimation: {
        width: 300,
        height: 300,
        resizeMode: 'contain'
    }

})

export default Splash;