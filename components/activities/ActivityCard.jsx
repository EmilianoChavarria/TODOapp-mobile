import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ActivityCard({
    activity, // el objeto completo que recibes desde HomeScreen
    onToggle = () => {}
}) {
    const navigation = useNavigation();
    const { id: activityId, title, color = "#3251a2", completed = false } = activity;

    return (
        <TouchableOpacity
            style={[styles.card, completed && styles.completedCard]}
            onPress={() => {
                navigation.navigate('Activity', { activity }); // aquí mandas todo
            }} 
        >
            <TouchableOpacity 
                style={[styles.checkboxContainer, { borderColor: color }]}
                onPress={onToggle}
            >
                {completed && (
                    <Ionicons
                        name="checkmark"
                        size={20}
                        color={color}
                        style={styles.checkIcon}
                    />
                )}
            </TouchableOpacity>
            <Text style={[
                styles.title,
                completed && styles.completedTitle
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}


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
        color: '#888',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        textDecorationColor: '#888',
        opacity: 0.7,
    },
    completedCard: {
        backgroundColor: '#f9f9f9',
    }
});