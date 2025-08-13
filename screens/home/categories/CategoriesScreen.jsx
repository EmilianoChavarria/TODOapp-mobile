import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CategoryService } from "../../../services/CategoryService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CategoryRow from "./CategoryRow";

export default function CategoriesScreen() {
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [userId, setUserId] = useState(null);

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
            console.log('Categorías obtenidas:', response);
            if (Array.isArray(response)) {
                setCategories(response);
            }
        } catch (error) {
            console.error('Error al obtener categorías:', error);
        }
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
                        <Text style={styles.title}>Categorías</Text>
                    </View>

                    <View style={styles.catContainer}>
                        {categories.map((category) => (
                            <CategoryRow
                                key={category.id}
                                category={category}
                                onPress={() =>
                                    navigation.navigate('CategoryScreen', {
                                        categoryId: category.id,
                                        categoryName: category.nombre,
                                        categoryColor: category.color || '#327efb',
                                        categoryCount: category.count || 0
                                    })
                                }
                            />
                        ))}
                    </View>


                    <View>
                        <TouchableOpacity>
                            <Text style={styles.button}
                                onPress={() => navigation.navigate('AddCategory')}
                            >
                                Crear nueva categoría
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

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
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 32,
        color: '#333',
        fontFamily: 'GoogleSans-Medium',
        marginLeft: 10,
    },
    catContainer: {
        marginTop: 20,
        backgroundColor: '#FFF',
        borderRadius: 15,
        paddingHorizontal: 15,
    },
    button: {
        color: '#327efb',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20
    }

});
