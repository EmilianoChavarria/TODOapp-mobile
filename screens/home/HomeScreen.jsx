import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView as MainScrollView, TouchableOpacity, ScrollView } from 'react-native';
import CategoryCard from '../../components/categories/CategoryCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ActivityCard from '../../components/activities/ActivityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityService } from '../../services/ActivityService'; // Asegúrate de tener esta importación
import { CategoryService } from '../../services/CategoryService';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);





  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('data');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserId(parsedData.id);
        setName(parsedData.nombre.split(' ')[0] || 'Usuario');
        return parsedData.id; // Retornamos el ID para usarlo en fetchTodayActivities
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
    return null;
  };

  const fetchCategories = async () => {
    try {
      const id = await getUserData();
      if (id) {
        const response = await CategoryService.getByUser(id);
        if (Array.isArray(response)) {
          setCategories(response.map(cat => ({
            id: cat.id,
            name: cat.nombre,
            activityCount: cat.count || 0,
            color: cat.color || '#6200ee'
          })));
          console.log('Categorías obtenidas:', response);
        }
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const fetchTodayActivities = async () => {
    try {
      const id = await getUserData();
      if (id) {
        const response = await ActivityService.getToday(id);

        const todayActivities = Array.isArray(response)
          ? response
          : response.mensaje
            ? []
            : [];

        setActivities(todayActivities.map(act => ({
          ...act, // Esto trae todo: id, titulo, descripcion, fecha_vencimiento, etc.
          title: act.titulo,
          category: act.categoria_id,
          color: act.color || '#6200ee',
          time: act.fecha_vencimiento
            ? new Date(act.fecha_vencimiento).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Sin hora',
          completed: act.estado === 'completada'
        })));

      }
    } catch (error) {
      console.error('Error al obtener actividades de hoy:', error);
      // Mostrar mensaje al usuario si lo deseas
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

      // Opcional: recargar datos para asegurar sincronización
      // fetchTodayActivities();
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
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await getUserData();
      fetchCategories();
      await fetchTodayActivities();
    };

    loadData();

    // Recargar al enfocar la pantalla
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTodayActivities();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <MainScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.mainContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Hola, {name}!</Text>
      </View>


      {/* Sección categorías */}
      <View style={styles.section1}>
        <Text style={styles.sectionTitle}>CATEGORÍAS</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {categories.slice(0, 3).map((category, index) => (
            <CategoryCard
              key={index}
              category={category}
            />
          ))}

          {/* Botón "Ver todas" */}
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.viewAllText}>Ver todas</Text>
            <Ionicons name="chevron-forward" size={20} color="#327efb" />
          </TouchableOpacity>
        </ScrollView>

      </View>

      {/* Sección actividades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TAREAS PARA HOY</Text>
        <View>
          {activities.length > 0 ? (
            activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity} // ahora sí le pasas el objeto entero
                onToggle={() => toggleActivity(activity.id)}
              />
            ))

          ) : (
            <Text style={styles.noActivitiesText}>No hay tareas para hoy</Text>
          )}
        </View>
        {/* <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() => navigation.navigate('Activities')}
        >
          <Text style={styles.viewMoreText}>Ver más actividades</Text>
          <Ionicons name="arrow-redo-outline" size={20} color="#327efb" />
        </TouchableOpacity> */}
      </View>
    </MainScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  mainContentContainer: {
    paddingTop: 60,
    paddingLeft: 15,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    color: '#333',
    fontFamily: 'GoogleSans-Medium',
  },
  section1: {
    marginTop: 30
  },
  section: {
    marginTop: 25, // Aumentado para mejor separación
    paddingRight: 15,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'GoogleSans-Medium',
    marginBottom: 10,
  },
  scrollContainer: {
    paddingRight: 30,
    paddingBottom: 10,
  },
  viewAllButton: {
    width: 120,
    height: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 8,
  },
  viewAllText: {
    color: '#327efb',
    fontFamily: 'GoogleSans-Medium',
    marginRight: 5,
  },
  viewMoreButton: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f5f5f5', // Fondo gris claro
  },
  viewMoreText: {
    color: '#327efb',
    fontFamily: 'GoogleSans-Medium',
    marginRight: 8,
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noActivitiesText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  }
});