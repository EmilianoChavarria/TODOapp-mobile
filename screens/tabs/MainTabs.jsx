import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../home/HomeScreen';
import AddScreen from '../home/AddScreen';
import SearchScreen from '../search/SearchScreen';
import CustomTabBar from '../../components/CustomTabBar';
import CalendarScreen from '../home/CalendarScreen';
import SettingsScreen from '../home/SettingsScreen';
import CategoriesScreen from '../home/categories/CategoriesScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Inicio" component={HomeScreen} />
            <Tab.Screen name="Categorias" component={CategoriesScreen} />
            <Tab.Screen name="Add" component={AddScreen} />
            <Tab.Screen name="Buscar" component={SearchScreen} />
            <Tab.Screen name="Perfil" component={SettingsScreen} />
        </Tab.Navigator>
    );
}
