import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                // Íconos para las rutas
                const iconName = {
                    Inicio: 'home-outline',
                    Categorias: 'shapes-outline',
                    Add: 'add-circle-outline',
                    Buscar: 'search-outline',
                    Perfil: 'person-circle-outline',
                }[route.name];

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[styles.tabItem, isFocused && styles.focused]}
                    >
                        <Ionicons
                            name={iconName}
                            size={route.name === 'Add' ? 48 : 24}
                            color={route.name === 'Add' ? '#327efb' : isFocused ? '#327efb' : '#999'}
                            style={route.name === 'Add' && styles.addButton}
                        />

                        {route.name !== 'Add' && (
                            <Text style={{ color: isFocused ? '#327efb' : '#999', fontSize: 12 }}>
                                {label}
                            </Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        
        paddingHorizontal: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: 20,

        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    addButton: {
        marginBottom: 15,
    },
});
