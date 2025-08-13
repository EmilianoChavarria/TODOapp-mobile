import { URL } from "../global";

export const CategoryService = {
    getByUser: async (userId) => {
        
        try {
            const response = await fetch(`${URL}/categorias/usuario/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log('Categorías obtenidas:', data);
            return data;
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw error; 
        }
    }
}