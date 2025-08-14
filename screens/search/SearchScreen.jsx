import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityService } from "../../services/ActivityService";
import ActivityCard from "../../components/activities/ActivityCard";

export default function SearchScreen() {
    const navigation = useNavigation();

    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Obtener usuario desde AsyncStorage
    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem("data");
            if (userData) {
                const parsedData = JSON.parse(userData);
                return parsedData.id;
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
        return null;
    };

    // Traer todas las actividades del usuario
    const fetchUserActivities = async () => {
        try {
            const id = await getUserData();
            if (id) {
                const response = await ActivityService.getByUser(id);
                console.log("Actividades del usuario:", response);

                const mapped = Array.isArray(response)
                    ? response.map(act => ({
                        id: act.id,
                        title: act.titulo,
                        category: act.categoria_id,
                        color: "#327efb", // color genérico
                        time: act.fecha_vencimiento
                            ? new Date(act.fecha_vencimiento).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "Sin hora",
                        completed: act.estado === "completada",
                    }))
                    : [];

                setActivities(mapped);
            }
        } catch (error) {
            console.error("Error al obtener actividades:", error);
            Alert.alert("Error", "No se pudieron cargar las actividades");
        } finally {
            setLoading(false);
        }
    };

    // Filtrar actividades al escribir
    const handleSearch = (text) => {
        setSearch(text);

        if (text.trim() === "") {
            setFilteredActivities([]); // 🔹 vacío si no hay búsqueda
        } else {
            const lowerText = text.toLowerCase();
            const filtered = activities.filter((act) =>
                act.title.toLowerCase().includes(lowerText)
            );
            setFilteredActivities(filtered);
        }
    };

    // --- dentro del componente SearchScreen ---
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

            setFilteredActivities(prevFiltered =>
                prevFiltered.map(activity =>
                    activity.id === id
                        ? { ...activity, completed: !activity.completed }
                        : activity
                )
            );

            // Llamar al servicio para actualizar en el backend
            await ActivityService.toggleState(id);

        } catch (error) {
            console.error("Error al cambiar estado:", error);

            // Revertir cambios si falla
            setActivities(prevActivities =>
                prevActivities.map(activity =>
                    activity.id === id
                        ? { ...activity, completed: !activity.completed }
                        : activity
                )
            );

            setFilteredActivities(prevFiltered =>
                prevFiltered.map(activity =>
                    activity.id === id
                        ? { ...activity, completed: !activity.completed }
                        : activity
                )
            );

            Alert.alert("Error", "No se pudo actualizar el estado");
        }
    };


    useEffect(() => {
        fetchUserActivities();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con buscador */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Buscar actividad..."
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Lista de actividades */}
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {search.trim() === "" ? (
                    <Text style={styles.noActivitiesText}>Escribe para buscar actividades</Text>
                ) : filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            title={activity.title}
                            color={activity.color}
                            time={activity.time}
                            completed={activity.completed}
                            onToggle={() => toggleActivity(activity.id)}
                        />

                    ))
                ) : (
                    <Text style={styles.noActivitiesText}>No se encontraron actividades</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 50,
        backgroundColor: "#fff",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
    },
    input: {
        flex: 1,
        height: 40,
    },
    noActivitiesText: {
        textAlign: "center",
        marginTop: 20,
        color: "#666",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
