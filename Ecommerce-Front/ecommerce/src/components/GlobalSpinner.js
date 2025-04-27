import React from 'react';
import { useSpinner } from '../context/spinnerContext';

const GlobalSpinner = () => {
    const { loading } = useSpinner();

    if (!loading) return null; // Solo muestra el spinner si está cargando

    return (
        <div className="global-spinner-backdrop">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default GlobalSpinner;
