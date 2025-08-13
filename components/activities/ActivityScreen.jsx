import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActivityService } from '../../services/ActivityService'; // tu servicio
import { useToast } from '../ToastContext';

export default function ActivityScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { showToast } = useToast();


  // Estado local para la actividad
  const [activity, setActivity] = useState(route.params.activity);
  const [loading, setLoading] = useState(false);

  // Función para cambiar el estado
  const toggleActivity = async () => {
    setLoading(true);
    try {
      // Optimistic UI update
      setActivity(prev => ({
        ...prev,
        completed: !prev.completed,
        estado: prev.completed ? 'pendiente' : 'completada'
      }));

      // Llamada al servicio para actualizar en backend
      await ActivityService.toggleState(activity.id);

      showToast({ message: 'Actividad completada correctamente', type: 'success' });

    } catch (error) {
      console.error('Error al cambiar estado:', error);
      // Revertimos si falla
      setActivity(prev => ({
        ...prev,
        completed: !prev.completed,
        estado: prev.completed ? 'pendiente' : 'completada'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles de la actividad</Text>
      </View>

      {/* Título */}
      <Text style={[styles.title, { color: activity.color || '#327efb' }]}>
        {activity.title || activity.titulo}
      </Text>

      {/* Estado */}
      <View style={styles.section}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={[styles.value, activity.estado === 'completada' ? styles.completed : styles.pending]}>
          {activity.estado}
        </Text>
      </View>

      {/* Prioridad */}
      <View style={styles.section}>
        <Text style={styles.label}>Prioridad:</Text>
        <Text style={styles.value}>{activity.prioridad}</Text>
      </View>

      {/* Fecha de creación */}
      <View style={styles.section}>
        <Text style={styles.label}>Fecha de creación:</Text>
        <Text style={styles.value}>{new Date(activity.fecha_creacion).toLocaleString()}</Text>
      </View>

      {/* Fecha de vencimiento */}
      <View style={styles.section}>
        <Text style={styles.label}>Fecha de vencimiento:</Text>
        <Text style={styles.value}>{new Date(activity.fecha_vencimiento).toLocaleString()}</Text>
      </View>

      {/* Descripción */}
      {activity.descripcion && (
        <View style={styles.section}>
          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.value}>{activity.descripcion}</Text>
        </View>
      )}

      {/* Categoria */}
      <View style={styles.section}>
        <Text style={styles.label}>Categoría:</Text>
        <Text style={[styles.value, { color: activity.color || '#327efb' }]}>
          {activity.category || activity.categoria_id}
        </Text>
      </View>

      {/* Botón de toggle */}
      <TouchableOpacity
        style={[styles.button, activity.completed && styles.completedButton]}
        onPress={toggleActivity}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {activity.completed ? "Completada" : "Marcar como completada"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'GoogleSans-Medium',
    marginLeft: 15,
    color: '#333',
  },
  title: {
    fontSize: 26,
    fontFamily: 'GoogleSans-Medium',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: 'GoogleSans-Medium',
    color: '#666',
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    fontFamily: 'GoogleSans-Regular',
    color: '#000',
  },
  completed: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  pending: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#327efb',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'GoogleSans-Medium',
  },
});
