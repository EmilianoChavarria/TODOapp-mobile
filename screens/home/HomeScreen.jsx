import React from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  // Función para limpiar el async storage
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared');
      navigation.replace('Splash');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <View>
      <Text>Bienvenido a la pantalla principal</Text>
      {/* Toucahble opacity que use funcion clear */}
      <Text onPress={clearAsyncStorage} style={{ color: 'blue', marginTop: 20 }}>
        Limpiar AsyncStorage
      </Text>
    </View>
  );
}
