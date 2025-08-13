import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CategoryService } from "../../../services/CategoryService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "../../../components/ToastContext";

export default function CategoriesScreen() {
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [userId, setUserId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);
    const { showToast } = useToast();
    const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#F3FF33",
        "#FF33A8", "#33FFF5", "#A833FF", "#FF8F33"
    ];

    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('data');
            if (userData) {
                const parsedData = JSON.parse(userData);
                setUserId(parsedData.id);
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    const fetchCategories = async () => {
        if (!userId) return;
        try {
            const response = await CategoryService.getByUser(userId);
            if (Array.isArray(response)) {
                setCategories(response);
            }
        } catch (error) {
            console.error('Error al obtener categorías:', error);
        }
    };

    const handleSave = async () => {
        if (!nombre || !selectedColor) {
            showToast({ message: 'Debes ingresar un nombre y seleccionar un color', type: 'error' });
            // alert("Debes ingresar un nombre y seleccionar un color");
            return;
        }

        const nuevaCategoria = {
            nombre,
            color: selectedColor,
            usuarioId: userId 
        };

        console.log("Datos a guardar:", nuevaCategoria);
        // Aquí llamas a tu servicio para guardar:
        // await CategoryService.create(nuevaCategoria);
    };

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [userId]);

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainContentContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back-outline" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Nueva categoría</Text>
                    </View>

                    {/* Input nombre */}
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe el nombre"
                        value={nombre}
                        onChangeText={setNombre}
                    />

                    {/* Selector de color */}
                    <Text style={styles.label}>Color</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
                        {colors.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorCircle,
                                    { backgroundColor: color },
                                    selectedColor === color && styles.selectedCircle
                                ]}
                                onPress={() => setSelectedColor(color)}
                            />
                        ))}
                    </ScrollView>

                    {/* Botón guardar */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Guardar Categoría</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff"
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
        justifyContent: 'flex-start',
        marginBottom: 20
    },
    title: {
        fontSize: 32,
        color: '#333',
        fontFamily: 'GoogleSans-Medium',
        marginLeft: 10,
    },
    label: {
        fontSize: 16,
        fontFamily: 'GoogleSans-Medium',
        marginBottom: 8,
        marginTop: 15,
        color: "#333"
    },
    input: {
        height: 50,
        borderColor: '#327efb',
        borderWidth: 1.2,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: 'GoogleSans-Regular',
        color: '#000'
    },
    colorPicker: {
        flexDirection: "row",
        marginTop: 10,
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 25,
        marginHorizontal: 5
    },
    selectedCircle: {
        borderColor: "#000",
        borderWidth: 2
    },
    saveButton: {
        backgroundColor: "#327efb",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 30
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "GoogleSans-Medium"
    }
});
