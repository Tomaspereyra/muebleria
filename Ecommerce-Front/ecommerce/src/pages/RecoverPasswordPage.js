import React, { useState } from 'react';
import { useUser } from '../context/userContext'; // Para acceder a la función de resetPassword
import { useNavigate } from 'react-router-dom';

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { resetPassword } = useUser(); // Obtener la función de resetPassword del context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Por favor, ingresa tu correo para recuperar tu contraseña.');
            return;
        }

        try {
            const response = await resetPassword(email); // Llamamos a la función de resetPassword del context
            if (typeof response === 'string') {
                if (response.includes('Password reset successfully. Please check your email.')) {
                    alert('La contraseña se ha restablecido correctamente. Por favor, revise su correo electrónico.');
                    setError(null); // Limpiamos cualquier error previo
                    navigate('/login');
                } else {
                    setError('Error inesperado al cambiar la contraseña');
                }
            }
        } catch (err) {
            setError('Error al intentar recuperar la contraseña.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <div className="card shadow border-0 rounded-3 p-4">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4 fw-bold" style={{ color: "#495057" }}>Recuperar contraseña</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Ingresa tu correo"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Recuperar contraseña
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecoverPassword;
