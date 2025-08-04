import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ActivityCard({
    title = "Actividad de ejemplo",
    color = "#3251a2",
    completed = false
}) {
    return (
        <TouchableOpacity
            style={styles.card}
        >
            <View style={[styles.checkboxContainer, { borderColor: color }]}>
                {completed && (
                    <Ionicons
                        name="checkmark"
                        size={20}
                        color={color}
                        style={styles.checkIcon}
                    />
                )}
            </View>
            <Text style={[
                styles.title,
                completed && styles.completedTitle
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 20,
        marginBottom: 7,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    checkboxContainer: {
        borderRadius: 100,
        borderWidth: 2,
        height: 24,
        width: 24,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        marginLeft: 1,
    },
    title: {
        color: '#000',
        fontSize: 19,
        fontFamily: 'GoogleSans-Regular',
        flexShrink: 1,
    },
    completedTitle: {
        color: '#888', // Gris medio
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        textDecorationColor: '#888',
        opacity: 0.7, // Ligera transparencia
    },
    completedCard: {
        backgroundColor: '#f9f9f9', // Fondo ligeramente gris para cards completadas
    }
});