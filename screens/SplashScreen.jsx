import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native"
import LottieView from 'lottie-react-native';


const Splash = () => {

    const navigation = useNavigation();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            navigation.replace('Welcome')
        }, 2000)
        return () => clearTimeout(timeoutId);
    }, [navigation])
    return (
        <View style={style.container}>
            {/* <Image source={require('../assets/images/logo.svg')} style={style.loadingAnimation} /> */}
            <LottieView source={require('../assets/images/splash2.json')} autoPlay={true} loop={true} style={style.loadingAnimation} />

            <Text style={{  fontSize: 36, fontWeight: 'bold', color: '#000' }}>TODO App</Text>
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