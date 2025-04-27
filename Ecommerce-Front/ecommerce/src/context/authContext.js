// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el AuthContext
const AuthContext = createContext();

// Proveedor del AuthContext
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    // Cargar el token desde localStorage cuando la app se monta
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // Función para hacer login (guardar token en context y localStorage)
    const login = (userToken, userRole) => {
        setToken(userToken);
        localStorage.setItem('token', userToken); // Guardar en localStorage para persistencia
        localStorage.setItem('userRole', userRole); // Guardar el rol en localStorage
    };

    // Función para hacer logout (eliminar token del context y localStorage)
    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole'); // Eliminar rol del localStorage
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};