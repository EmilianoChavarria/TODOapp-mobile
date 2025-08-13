import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SettingsScreen({ navigation }) {
    const [user, setUser] = useState(null);



    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem("data");
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("data");
        navigation.replace("Login"); // Ajusta según tu ruta de login
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Perfil */}
            <View style={styles.profileContainer}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={50} color="#fff" />
                </View>
                <Text style={styles.userName}>{user?.nombre || "Usuario"}</Text>
            </View>

            {/* Opciones */}
            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.option} onPress={
                    () => navigation.navigate("ActivityHistory")
                }>
                    <Ionicons name="newspaper-outline" size={24} color="#000" />
                    <Text style={styles.optionText}>Historial de tareas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#ff4d4d" />
                    <Text style={styles.optionText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 60
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 30
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#327efb",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    userName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333"
    },
    optionsContainer: {
        borderTopWidth: 1,
        borderTopColor: "#eee",
        marginTop: 20
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333"
    }
});
