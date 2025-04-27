// src/context/userContext.js

import React, { createContext, useContext, useState } from 'react';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Aquí puedes manejar el usuario si lo necesitas

    //funcion para cambiar la contraseña desde my-account
    const changePassword = async (email, contrasenaActual, contrasenaNueva, confirmaNuevaContrasena) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/user/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email,
                    contrasenaActual,
                    contrasenaNueva,
                    confirmaNuevaContrasena,
                }),
            });

    
             // Aquí verificamos el tipo de respuesta
            const contentType = response.headers.get('content-type');
            const data = contentType && contentType.includes('application/json')
            ? await response.json()
            : await response.text();
            
            return data; // Devuelve la respuesta del backend
        } catch (error) {
            throw new Error(error.message);
        }
    };

    //funcion para recuperar la contraseña desde el login
    const resetPassword = async (email) => {
        try {
            // Realizamos la solicitud a la API
            const response = await fetch(`${backendUrl}/api/auth/reset-password?email=${email}`, {
                method: 'POST',
            });

    
            // Si la respuesta es correcta, devolvemos el mensaje esperado
            // Aquí verificamos el tipo de respuesta
            const contentType = response.headers.get('content-type');
            const data = contentType && contentType.includes('application/json')
            ? await response.json()
            : await response.text();

            return data;
        } catch (error) {
            console.error("Error en resetPassword:", error);
            throw new Error('Error al intentar restablecer la contraseña.');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, changePassword, resetPassword }}>
            {children}
        </UserContext.Provider>
    );
};
