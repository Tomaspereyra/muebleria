import React, { useState } from 'react';
import { useUser } from '../context/userContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ChangePasswordPage = () => {
    const { changePassword } = useUser();
    const [contrasenaActual, setCurrentPassword] = useState('');
    const [contrasenaNueva, setNewPassword] = useState('');
    const [confirmaNuevaContrasena, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { email } = location.state || {};

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Verificar si las contraseñas coinciden
        if (contrasenaNueva !== confirmaNuevaContrasena) {
            setError('Las contraseñas nuevas no coinciden');
            setLoading(false);
            return;
        }
    
        try {
            const response = await changePassword(email, contrasenaActual, contrasenaNueva, confirmaNuevaContrasena);
            if (typeof response === 'string') {
                if (response.includes('Password updated successfully')) {
                    alert('Contraseña cambiada con éxito');
                    setError(null); // Limpiamos cualquier error previo
                    navigate('/my-account');
                } else if (response.includes('Current password is incorrect')) {
                    setError('La contraseña actual no es correcta');
                } else if (response.includes('New password must be at least 6 characters long and contain at least one uppercase letter.')) {
                    setError('La nueva contraseña debe tener al menos 6 caracteres y contener al menos una letra mayúscula.');
                } else {
                    setError('Error inesperado al cambiar la contraseña');
                }
            }
        } catch (error) {
            setError('Error al cambiar la contraseña');
            console.error('Error changing password:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>CAMBIAR CONTRASEÑA</h1>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input type="email" value={email} disabled />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="contrasenaActual">Contraseña Actual:</label>
                    <input
                        type="password"
                        id="contrasenaActual"
                        name="contrasenaActual"
                        value={contrasenaActual}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="contrasenaNueva">Nueva Contraseña:</label>
                    <input
                        type="password"
                        id="contrasenaNueva"
                        name="contrasenaNueva"
                        value={contrasenaNueva}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="confirmaNuevaContrasena">Confirmar Nueva Contraseña:</label>
                    <input
                        type="password"
                        id="confirmaNuevaContrasena"
                        name="confirmaNuevaContrasena"
                        value={confirmaNuevaContrasena}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    title: {
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
    },
    button: {
        backgroundColor: '#198754',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
    },
};

export default ChangePasswordPage;
