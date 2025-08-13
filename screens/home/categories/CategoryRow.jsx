import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CategoryRow({ category }) {
    return (
        <View style={styles.container}>
            {/* Bolita de color */}
            <View style={[styles.colorDot, { backgroundColor: category.color }]} />

            {/* Nombre de la categoría */}
            <Text style={styles.name}>{category.nombre}</Text>

            {/* Count de tareas */}
            <Text style={styles.count}>{category.count}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    colorDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    name: {
        flex: 1,
        fontSize: 20,
        color: '#333',
        fontFamily: 'GoogleSans-Regular',
    },
    count: {
        fontSize: 18,
        fontFamily: 'GoogleSans-Medium',
        color: '#666',
    },
});
