import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ActivityCard from '../../../components/activities/ActivityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityService } from "../../../services/ActivityService";

export default function CategoryScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    // Obtener parámetros de navegación
    const {
        categoryId,
        categoryName = 'Categoría',
        categoryColor = '#327efb',
    } = route.params || {};

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

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

    const fetchCategoryActivities = async () => {
        try {
            const id = await getUserData();
            console.log(`ID del usuario: ${id}`);
            console.log(`ID de la categoría: ${categoryId}`);
            if (id && categoryId) {
                const response = await ActivityService.getByCategory(categoryId);
                console.log(`Actividades de la categoría ${categoryId}:`, response);

                const categoryActivities = Array.isArray(response)
                    ? response
                    : [];

                setActivities(categoryActivities.map(act => ({
                    id: act.id,
                    title: act.titulo,
                    category: act.categoria_id,
                    color: categoryColor, // Usamos el color de la categoría
                    time: act.fecha_vencimiento
                        ? new Date(act.fecha_vencimiento).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Sin hora',
                    completed: act.estado === 'completada'
                })));
            }
        } catch (error) {
            console.error('Error al obtener actividades de la categoría:', error);
            Alert.alert('Error', 'No se pudieron cargar las actividades');
        } finally {
            setLoading(false);
        }
    };

    const toggleActivity = async (id) => {
        try {
            // Optimistic UI update
            setActivities(prevActivities =>
                prevActivities.map(activity =>
                    activity.id === id
                        ? { ...activity, completed: !activity.completed }
                        : activity
                )
            );

            // Llamar al servicio para actualizar en el backend
            await ActivityService.toggleState(id);

        } catch (error) {
            console.error('Error al cambiar estado:', error);
            // Revertir cambios si falla
            setActivities(prevActivities =>
                prevActivities.map(activity =>
                    activity.id === id
                        ? { ...activity, completed: !activity.completed }
                        : activity
                )
            );
            Alert.alert('Error', 'No se pudo actualizar el estado');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await getUserData();
            await fetchCategoryActivities();
        };

        loadData();

        // Recargar al enfocar la pantalla
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCategoryActivities();
        });

        return unsubscribe;
    }, [navigation, categoryId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainContentContainer}>
                    <View style={[styles.header, { backgroundColor: categoryColor }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.categoryTitle}>{categoryName}</Text>
                            <Text style={styles.activityCount}>{activities.length} actividades</Text>
                        </View>
                    </View>

                    {/* Lista de actividades */}
                    <View style={styles.activitiesSection}>
                        {activities.length > 0 ? (
                            activities.map(activity => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}        // <-- pasamos todo el objeto
                                    title={activity.title}
                                    color={activity.color}
                                    time={activity.time}
                                    completed={activity.completed}
                                    onToggle={() => toggleActivity(activity.id)}
                                />

                            ))
                        ) : (
                            <Text style={styles.noActivitiesText}>No hay actividades en esta categoría</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Botón flotante */}
            <TouchableOpacity
                style={[styles.floatingButton, { backgroundColor: categoryColor }]}
                onPress={() => {
                    navigation.navigate('Add', {
                        categoryId: categoryId, 
                        categoryName: categoryName 
                    });
                }}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20
    },
    mainContentContainer: {
        paddingTop: 60,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    headerTextContainer: {
        marginLeft: 15,
    },
    categoryTitle: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'GoogleSans-Medium',
    },
    activityCount: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'GoogleSans-Regular',
        opacity: 0.9,
    },
    activitiesSection: {
        marginTop: 10,
    },
    noActivitiesText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        fontFamily: 'GoogleSans-Regular',
    },
    floatingButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#327efb',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 30,
        right: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});