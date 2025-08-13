import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList } from "react-native";
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ActivityService } from '../../services/ActivityService';
import { useToast } from '../../components/ToastContext';
import { CategoryService } from "../../services/CategoryService";


export default function AddScreen() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        titulo: '',
        fecha_vencimiento: new Date(),
        prioridad: 'media',
        estado: 'pendiente',
        usuario_id: null,
        categoria_id: null,
        categoria_nombre: ''
    });
    const { showToast } = useToast();


    const route = useRoute();
    // Obtener los parámetros de navegación
    const { categoryId, categoryName } = route.params || {};

    const [showDatePicker, setShowDatePicker] = useState({
        vencimiento: false
    });

    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showPriorityPicker, setShowPriorityPicker] = useState(false);
    const [showStatusPicker, setShowStatusPicker] = useState(false);

    // Datos de ejemplo
    const [categorias, setCategorias] = useState([]);

    const prioridades = [
        { id: 'baja', nombre: 'Baja', color: '#4CAF50' },
        { id: 'media', nombre: 'Media', color: '#FFC107' },
        { id: 'alta', nombre: 'Alta', color: '#F44336' }
    ];

    const estados = [
        { id: 'pendiente', nombre: 'Pendiente', color: '#9E9E9E' },
        { id: 'completada', nombre: 'Completada', color: '#2196F3' }
    ];

    useEffect(() => {
        const getUserDataAndCategories = async () => {
            try {
                const userData = await AsyncStorage.getItem('data');
                if (userData) {
                    const parsedData = JSON.parse(userData);

                    setFormData(prev => ({
                        ...prev,
                        usuario_id: parsedData.id
                    }));

                    // Cargar categorías del servicio
                    const categoriasFromAPI = await CategoryService.getByUser(parsedData.id);

                    const categoriasFormateadas = categoriasFromAPI.map(cat => ({
                        id: cat.id,
                        nombre: cat.nombre,
                        color: cat.color || '#327efb'
                    }));

                    setCategorias(categoriasFormateadas);

                    // Si hay un categoryId en los parámetros, establecerlo en el formData
                    if (categoryId) {
                        const categoriaPreseleccionada = categoriasFormateadas.find(cat => cat.id === categoryId);
                        if (categoriaPreseleccionada) {
                            setFormData(prev => ({
                                ...prev,
                                categoria_id: categoryId,
                                categoria_nombre: categoriaPreseleccionada.nombre
                            }));
                        }
                    }
                }
            } catch (error) {
                console.error('Error al obtener datos o categorías:', error);
            }
        };

        getUserDataAndCategories();
    }, [categoryId]);

    const handleChange = (name, value, displayValue = null) => {
        setFormData({
            ...formData,
            [name]: value,
            ...(displayValue && { [`${name}_nombre`]: displayValue })
        });
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker({ vencimiento: false });
        if (selectedDate) {
            handleChange('fecha_vencimiento', selectedDate);
        }
    };

    const handleSubmit = async () => {
        try {
            const dataToSend = {
                titulo: formData.titulo,
                fecha_creacion: new Date().toISOString(), // ISO igual que Postman
                fecha_vencimiento: formData.fecha_vencimiento.toISOString(),
                prioridad: formData.prioridad,
                estado: formData.estado,
                usuario_id: formData.usuario_id,
                categoria_id: formData.categoria_id
            };

            console.log('Datos a enviar:', dataToSend);

            const response = await ActivityService.create(dataToSend);
            console.log('Respuesta del servidor:', response);
            showToast({ message: response.mensaje, type: 'success' });


            // Si quieres navegar de vuelta después de guardar
            navigation.goBack();

        } catch (error) {
            console.error('Error al guardar la actividad:', error);
        }
    };

    const renderPickerItem = (items, selectedId, onSelect, showPicker, setShowPicker) => {
        const selectedItem = items.find(item => item.id === selectedId);

        return (
            <>
                <TouchableOpacity
                    style={styles.customPicker}
                    onPress={() => setShowPicker(true)}
                >
                    {selectedItem ? (
                        <View style={styles.selectedItem}>
                            <View style={[styles.colorDot, { backgroundColor: selectedItem.color }]} />
                            <Text style={styles.selectedItemText}>{selectedItem.nombre}</Text>
                        </View>
                    ) : (
                        <Text style={styles.placeholderText}>Selecciona una opción</Text>
                    )}
                </TouchableOpacity>

                <Modal
                    visible={showPicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowPicker(false)}

                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                Selecciona una opción:
                            </Text>
                            <FlatList
                                data={items}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.pickerItem}
                                        onPress={() => {
                                            onSelect(item.id, item.nombre);
                                            setShowPicker(false);
                                        }}
                                    >
                                        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                        <Text style={styles.pickerItemText}>{item.nombre}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => {
                                        setShowPicker(false);
                                        navigation.navigate('AddCategory')
                                    }}
                                >
                                    <Text style={styles.closeButtonText}>Registrar nueva</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setShowPicker(false)}
                                >
                                    <Text style={styles.closeRedButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainContentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Nueva tarea</Text>
                    </View>

                    {/* Campo Título */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputName}>Título:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Título de la tarea"
                            placeholderTextColor="#aaa"
                            value={formData.titulo}
                            onChangeText={(text) => handleChange('titulo', text)}
                            maxLength={100}
                        />
                    </View>

                    {/* Fecha de Vencimiento */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputName}>Fecha de vencimiento:</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowDatePicker({ vencimiento: true })}
                        >
                            <Text>{formData.fecha_vencimiento.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker.vencimiento && (
                            <DateTimePicker
                                value={formData.fecha_vencimiento}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </View>

                    {/* Prioridad (Select personalizado) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputName}>Prioridad:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.prioridad}
                                onValueChange={(itemValue) => handleChange('prioridad', itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Baja" value="baja" />
                                <Picker.Item label="Media" value="media" />
                                <Picker.Item label="Alta" value="alta" />
                            </Picker>
                        </View>
                    </View>

                    {/* Categoría (Select personalizado) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputName}>Categoría:</Text>
                        {renderPickerItem(
                            categorias,
                            formData.categoria_id,
                            (value, displayValue) => handleChange('categoria_id', value, displayValue),
                            showCategoryPicker,
                            setShowCategoryPicker
                        )}
                    </View>

                    {/* Botón de Envío */}
                    <TouchableOpacity
                        style={[styles.submitButton, (!formData.usuario_id || !formData.categoria_id) && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={!formData.usuario_id || !formData.categoria_id}
                    >
                        <Text style={styles.submitButtonText}>Guardar Tarea</Text>
                    </TouchableOpacity>
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
    title: {
        fontSize: 32,
        color: '#333',
        fontFamily: 'GoogleSans-Medium',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputName: {
        fontSize: 16,
        fontFamily: 'GoogleSans-Medium',
        color: '#000',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#327efb',
        borderWidth: 1.2,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: 'GoogleSans-Regular',
        color: '#000',
    },
    dateInput: {
        height: 50,
        borderColor: '#327efb',
        borderWidth: 1.2,
        borderRadius: 12,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    customPicker: {
        height: 50,
        borderColor: '#327efb',
        borderWidth: 1.2,
        borderRadius: 12,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    pickerContainer: {
        borderColor: '#327efb',
        borderWidth: 1.2,
        borderRadius: 12,
        overflow: 'hidden',
    },

    picker: {
        height: 50,
        width: '100%',
        color: '#000',
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedItemText: {
        fontSize: 16,
        fontFamily: 'GoogleSans-Regular',
        color: '#000',
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 10,
    },
    placeholderText: {
        fontSize: 16,
        fontFamily: 'GoogleSans-Regular',
        color: '#aaa',
    },
    submitButton: {
        backgroundColor: '#327efb',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonDisabled: {
        backgroundColor: '#cccccc',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'GoogleSans-Medium',
    },
    userIdText: {
        fontSize: 16,
        fontFamily: 'GoogleSans-Regular',
        color: '#555',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'GoogleSans-Medium',
        marginBottom: 15,
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    pickerItemText: {
        fontSize: 16,
        fontFamily: 'GoogleSans-Regular',
        marginLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    closeButton: {
        marginTop: 15,
        padding: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#327efb',
        fontSize: 16,
        fontFamily: 'GoogleSans-Medium',
    },
    // close red button text
    closeRedButtonText: {
        color: '#F44336',
        fontSize: 16,
        fontFamily: 'GoogleSans-Medium',
    },


});