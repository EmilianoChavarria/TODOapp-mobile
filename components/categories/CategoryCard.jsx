import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CategoryCard({category}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: category.color }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CategoryScreen', { 
                categoryId: category.id,
                categoryName: category.name,
                categoryColor: category.color,
                activityCount: category.activityCount
            })}
        >
            <Text style={styles.tasks}>{category.activityCount} actividades</Text>
            <Text style={styles.title}>{category.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 16,
        marginVertical: 8,
        flexDirection: 'column',
        width: 200,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
    },
    iconContainer: {
        backgroundColor: '#3700b3',
        borderRadius: 24,
        padding: 8,
        marginRight: 12,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'GoogleSans-Medium',
        marginTop: 10,
    },
    tasks: {
        // Color girs pero un tono más blanco
        color: '#f0f0f0',
        fontSize: 14,
        fontFamily: 'GoogleSans-Regular',
        marginTop: 4,
    },
});