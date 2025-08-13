import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityCard from '../../../components/activities/ActivityCard';
import { ActivityService } from '../../../services/ActivityService';

export default function ActivityHistory() {
    const navigation = useNavigation();
    const [completedActivities, setCompletedActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // Obtener datos del usuario
    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('data');
            if (userData) {
                const parsedData = JSON.parse(userData);
                setUserId(parsedData.id);
                return parsedData.id;
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
        return null;
    };

    // Obtener actividades completadas
    const fetchCompletedActivities = async () => {
        try {
            const id = await getUserData();
            if (id) {
                const response = await ActivityService.getCompletedByUser(id);

                const activities = Array.isArray(response) ? response : [];

                setCompletedActivities(activities.map(act => ({
                    id: act.id,
                    title: act.titulo,
                    category: act.categoria_id,
                    color: getCategoryColor(act.categoria_id),
                    time: act.fecha_completado ?
                        new Date(act.fecha_completado).toLocaleDateString() : 'Sin fecha',
                    completed: true
                })));
            }
        } catch (error) {
            console.error('Error al obtener actividades completadas:', error);
            Alert.alert('Error', 'No se pudieron cargar las actividades completadas');
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener colores de categoría (ajusta según tu implementación)
    const getCategoryColor = (categoryId) => {
        const colors = ['#6200ee', '#4CAF50', '#2196F3', '#FF9800'];
        return colors[categoryId % colors.length] || '#6200ee';
    };

    // Función para recuperar actividad
    const handleRecoverActivity = (activityId) => {
        Alert.alert(
            'Recuperar actividad',
            '¿Estás seguro que quieres recuperar esta actividad?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Recuperar',
                    onPress: () => recoverActivity(activityId)
                }
            ]
        );
    };

    // Lógica para recuperar actividad
    const recoverActivity = async (activityId) => {
        try {
            await ActivityService.toggleState(activityId);
            fetchCompletedActivities(); // Recargar la lista
            Alert.alert('Éxito', 'La actividad ha sido recuperada');
        } catch (error) {
            console.error('Error al recuperar actividad:', error);
            Alert.alert('Error', 'No se pudo recuperar la actividad');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await getUserData();
            await fetchCompletedActivities();
        };

        loadData();

        const unsubscribe = navigation.addListener('focus', () => {
            fetchCompletedActivities();
        });

        return unsubscribe;
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#327efb" />
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Historial de Actividades</Text>
                </View>

                <View style={styles.activitiesContainer}>
                    {completedActivities.length > 0 ? (
                        completedActivities.map(activity => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}  // pasar el objeto completo
                                onToggle={() => handleRecoverActivity(activity.id)}
                            />
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No hay actividades completadas</Text>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60
    },
    title: {
        fontSize: 24,
        fontFamily: 'GoogleSans-Medium',
        marginLeft: 15,
        color: '#333'
    },
    activitiesContainer: {
        paddingHorizontal: 15,
        marginTop: 10
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#666',
        fontFamily: 'GoogleSans-Regular'
    }
});