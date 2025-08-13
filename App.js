import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/splash/SplashScreen';
import WelcomeScreen from './screens/auth/WelcomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import MainTabs from './screens/tabs/MainTabs';
import { ToastProvider } from './components/ToastContext';
import CategoriesScreen from './screens/home/categories/CategoriesScreen';
import AddCategory from './screens/home/categories/AddCategory';
import CategoryScreen from './screens/home/categories/CategoryScreen';
import ActivityHistory from './screens/home/activities/ActivityHistory';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'GoogleSans-Regular': require('./assets/fonts/GoogleSans-Regular.ttf'),
        'GoogleSans-Medium': require('./assets/fonts/GoogleSans-Medium.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);


  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={MainTabs} />
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="AddCategory" component={AddCategory} />
          <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
          <Stack.Screen name="ActivityHistory" component={ActivityHistory} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}
