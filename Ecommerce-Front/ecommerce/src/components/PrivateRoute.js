import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
    const isLoggedIn = !!localStorage.getItem('token'); // Devuelve true si hay token, false si no
    const userRole = localStorage.getItem('userRole');

    return (
        isLoggedIn && userRole === 'ADMIN' ? (
            element // Renderiza el elemento si el usuario está logueado y es ADMIN
        ) : (
            <Navigate to="/" /> // Redirige a la página de inicio si no
        )
    );
};

export default PrivateRoute;
