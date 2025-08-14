import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ActivityService } from '../../services/ActivityService';
import { useToast } from '../ToastContext';

export default function ActivityScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { showToast } = useToast();

  const [activity, setActivity] = useState(route.params.activity);
  const [loading, setLoading] = useState(false);

  // Subactividades locales
  const [subActivities, setSubActivities] = useState([]);
  const [newSubTitle, setNewSubTitle] = useState('');

  // Cargar subactividades al abrir
  useEffect(() => {
    const loadSubActivities = async () => {
      try {
        const subs = await ActivityService.getByActivity(activity.id);
        setSubActivities(subs);
      } catch (error) {
        console.error('Error cargando subactividades:', error);
      }
    };
    loadSubActivities();
  }, [activity.id]);



  // Toggle actividad principal
  const toggleActivity = async () => {
    setLoading(true);
    try {
      setActivity(prev => ({
        ...prev,
        completed: !prev.completed,
        estado: prev.completed ? 'pendiente' : 'completada'
      }));

      await ActivityService.toggleState(activity.id);
      showToast({ message: 'Actividad actualizada', type: 'success' });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setActivity(prev => ({
        ...prev,
        completed: !prev.completed,
        estado: prev.completed ? 'pendiente' : 'completada'
      }));
    } finally {
      setLoading(false);
    }
  };

  // Agregar subactividad
  const addSubActivity = async () => {
    if (!newSubTitle.trim()) return;

    const subActivity = {
      titulo: newSubTitle,
      estado: 'pendiente',
      tarea_id: activity.id
    };

    try {
      const saved = await ActivityService.savesubActivity(subActivity);
      setSubActivities(prev => [...prev, saved.subtarea]);
      setNewSubTitle('');
      showToast({ message: 'Subactividad agregada', type: 'success' });
    } catch (error) {
      console.error('Error guardando subactividad:', error);
      showToast({ message: 'Error al agregar subactividad', type: 'error' });
    }
  };

  // Toggle subactividad

  const toggleSubActivity = async (index) => {
    const sub = subActivities[index];
    try {
      const updated = await ActivityService.toggleSubActivity(sub.id);
      setSubActivities(prev => {
        const newSubs = [...prev];
        newSubs[index].estado = updated.subtarea.estado; // usamos el estado actualizado del backend
        return newSubs;
      });
    } catch (error) {
      console.error('Error actualizando subactividad:', error);
      showToast({ message: 'Error actualizando subactividad', type: 'error' });
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

      {/* Fecha de vencimiento */}
      <View style={styles.section}>
        <Text style={styles.label}>Fecha de vencimiento:</Text>
        <Text style={styles.value}>
          {activity.fecha_vencimiento
            ? new Date(activity.fecha_vencimiento).toLocaleString()
            : "Sin fecha"}
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

      {/* Subactividades */}
      <View style={{ marginTop: 30 }}>
        <Text style={styles.subTitle}>Subactividades</Text>

        <View style={styles.addSubContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nueva subactividad"
            value={newSubTitle}
            onChangeText={setNewSubTitle}
          />
          <TouchableOpacity style={styles.addButton} onPress={addSubActivity}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {subActivities && subActivities.length > 0 ? (
          subActivities.map((sub, index) => (
            <TouchableOpacity
              key={sub.id}
              style={styles.subActivityItem}
              onPress={() => toggleSubActivity(index)}
            >
              <View style={[styles.checkbox, sub.estado === 'completada' && styles.checked]}>
                {sub.estado === 'completada' && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={[styles.subTitleText, sub.estado === 'completada' && styles.subCompleted]}>
                {sub.titulo}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: '#999', fontStyle: 'italic' }}>No hay subactividades</Text>
        )}


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', marginTop: 40 },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 20, marginLeft: 15, color: '#333' },
  title: { fontSize: 26, marginBottom: 20 },
  section: { marginBottom: 15 },
  label: { fontSize: 14, color: '#666', marginBottom: 3 },
  value: { fontSize: 16, color: '#000' },
  completed: { color: '#2196F3', fontWeight: 'bold' },
  pending: { color: '#F44336', fontWeight: 'bold' },
  button: { marginTop: 30, backgroundColor: '#327efb', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  completedButton: { backgroundColor: '#9E9E9E' },
  buttonText: { color: '#fff', fontSize: 16 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  addSubContainer: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, height: 40 },
  addButton: { marginLeft: 10, backgroundColor: '#327efb', padding: 10, borderRadius: 8 },
  subActivityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#327efb', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checked: { backgroundColor: '#327efb', borderColor: '#327efb' },
  subTitleText: { fontSize: 16 },
  subCompleted: { textDecorationLine: 'line-through', color: '#888' }
});
