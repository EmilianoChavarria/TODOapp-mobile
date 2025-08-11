import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView as MainScrollView, TouchableOpacity, ScrollView } from 'react-native';
import CategoryCard from '../../components/categories/CategoryCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ActivityCard from '../../components/activities/ActivityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');

  const deleteAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage borrado exitosamente");
      navigation.navigate('Splash'); // Redirigir al login después de borrar
    } catch (error) {
      console.error("Error al borrar AsyncStorage:", error);
    }
  };

  // Array de ejemplo para categorías
  const categories = [
    {
      name: "Trabajo",
      activityCount: 5,
      color: "#6200ee"
    },
    {
      name: "Personal",
      activityCount: 3,
      color: "#4CAF50"
    },
    {
      name: "Estudio",
      activityCount: 7,
      color: "#2196F3"
    }
  ];

  const [activities, setActivities] = useState([
    {
      id: 1,
      title: "Revisar informe mensual",
      category: "Trabajo",
      color: "#6200ee",
      time: "09:00 AM",
      completed: false
    },
    {
      id: 2,
      title: "Ir al gimnasio",
      category: "Personal",
      color: "#4CAF50",
      time: "07:30 AM",
      completed: true
    },
    {
      id: 3,
      title: "Estudiar React Native",
      category: "Estudio",
      color: "#2196F3",
      time: "06:00 PM",
      completed: false
    },
    {
      id: 4,
      title: "Comprar víveres",
      category: "Personal",
      color: "#4CAF50",
      time: "05:30 PM",
      completed: false
    },
    {
      id: 5,
      title: "Llamar a cliente",
      category: "Trabajo",
      color: "#6200ee",
      time: "11:00 AM",
      completed: true
    }
  ]);

  const toggleActivity = (id) => {
    setActivities(prevActivities =>
      prevActivities.map(activity =>
        activity.id === id
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );

    // Aquí podrías también guardar el cambio en tu API o AsyncStorage
  };

  useEffect(() => {
    const getUserName = async () => {
      try {
        const userData = await AsyncStorage.getItem('data');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setName(parsedData.nombre.split(' ')[0] || 'Usuario'
          );
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    getUserName();
  }, []);


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

      {/* <Text onPress={
        deleteAsyncStorage
      }>
        Borrar AsyncStorage
      </Text> */}

      {/* Sección categorías */}
      <View style={styles.section1}>
        <Text style={styles.sectionTitle}>CATEGORÍAS</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {categories.map((category, index) => (
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
      {/* Sección actividades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TAREAS PARA HOY</Text>
        <View>
          {activities.map(activity => (
            <ActivityCard
              key={activity.id}
              title={activity.title}
              color={activity.color}
              time={activity.time}
              completed={activity.completed}
              onToggle={() => toggleActivity(activity.id)} // Pasar la función de toggle
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.viewMoreButton}
        >
          <Text style={styles.viewMoreText}>Ver más actividades</Text>
          <Ionicons name="arrow-redo-outline" size={20} color="#327efb" />
        </TouchableOpacity>
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
});