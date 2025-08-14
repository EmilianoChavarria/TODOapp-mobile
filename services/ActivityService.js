import { URL } from "../global";

export const ActivityService = {
    // Obtener todas las actividades
    getAll: async () => {
        try {
            const response = await fetch(`${URL}/actividades/`);
            
            return await response.json();
        } catch (error) {
            console.error('Error al obtener todas las actividades:', error);
            throw error;
        }
    },

    // Obtener actividades por usuario
    getByUser: async (usuarioId) => {
        try {
            const response = await fetch(`${URL}/actividades/usuario/${usuarioId}`);
            
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener actividades del usuario ${usuarioId}:`, error);
            throw error;
        }
    },

    // Obtener actividades por categoría
    getByCategory: async (categoriaId) => {
        try {
            const response = await fetch(`${URL}/actividades/categoria/${categoriaId}`);
            
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener actividades de la categoría ${categoriaId}:`, error);
            throw error;
        }
    },

    // Obtener tareas de hoy para un usuario
    getToday: async (usuarioId) => {
        try {
            const response = await fetch(`${URL}/actividades/tareas/hoy/${usuarioId}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener tareas de hoy para el usuario ${usuarioId}:`, error);
            throw error;
        }
    },

    // Obtener una actividad por ID
    getById: async (id) => {
        try {
            const response = await fetch(`${URL}/actividades/${id}`);
            
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener la actividad con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva actividad
    create: async (activityData) => {
        try {
            const response = await fetch(`${URL}/actividades/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(activityData),
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error al crear actividad:', error);
            throw error;
        }
    },

    // Actualizar una actividad
    update: async (id, activityData) => {
        try {
            const response = await fetch(`${URL}/actividades/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(activityData),
            });
            
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar actividad con ID ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una actividad
    delete: async (id) => {
        try {
            const response = await fetch(`${URL}/actividades/${id}`, {
                method: 'DELETE',
            });
            
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar actividad con ID ${id}:`, error);
            throw error;
        }
    },

    // Cambiar estado de una tarea
    toggleState: async (id) => {
        try {
            const response = await fetch(`${URL}/actividades/${id}/toggle`, {
                method: 'PUT',
            });
            
            return await response.json();
        } catch (error) {
            console.error(`Error al cambiar estado de actividad con ID ${id}:`, error);
            throw error;
        }
    },

    // Obtener tareas completadas por usuario
    getCompletedByUser: async (usuarioId) => {
        try {
            const response = await fetch(`${URL}/actividades/completadas/${usuarioId}`);
            
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener tareas completadas del usuario ${usuarioId}:`, error);
            throw error;
        }
    },

    getByActivity: async (actividadId) => {
        try {
            const response = await fetch(`${URL}/subtareas/activity/${actividadId}`);
            
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener subactividades de la actividad ${actividadId}:`, error);
            throw error;
        }
    },

    savesubActivity: async (subActivityData) => {
        try {
            const response = await fetch(`${URL}/subtareas/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subActivityData),
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error al crear subactividad:', error);
            throw error;
        }
    },
    toggleSubActivity: async (subActivityId) => {
        try {
            const response = await fetch(`${URL}/subtareas/${subActivityId}/toggle`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            return await response.json();
        } catch (error) {
            console.error(`Error al cambiar estado de la subactividad con ID ${subActivityId}:`, error);
            throw error;
        }
    }
};