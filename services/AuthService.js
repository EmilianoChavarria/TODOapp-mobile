import { URL } from "../global";

export const AuthService = {
    // Peticiones con fetch
    login: async(email, contraseña) => {
        try {
            const response = await fetch(`${URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contraseña }),
            });

            if (!response.ok) {
                throw new Error('Error en la autenticación');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en el login:', error);
            throw error; 
        }
    },
    register: async (name, email, contraseña) => {
        try {
            const response = await fetch(`${URL}/usuarios/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: name, email, contraseña }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                
                throw new Error(data.error || 'Error en el registro');
            }
    
            return data; 
        } catch (error) {
            throw error;
        }
    }
    
}