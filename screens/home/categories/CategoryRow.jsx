import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CategoryRow({ category, onPress }) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            <View style={[styles.colorIndicator, { backgroundColor: category.color || '#327efb' }]} />
            <Text style={styles.name}>{category.nombre}</Text>
            <Text style={{ color: '#999', fontSize: 14 }}>{category.count || 0} actividades</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    colorIndicator: {
        width: 15,
        height: 15,
        borderRadius: 100,
        marginRight: 15,
    },
    name: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
});
