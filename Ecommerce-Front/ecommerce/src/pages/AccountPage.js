import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AccountPage = () => {
    const { token } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const goToChangePassword = () => {
        navigate('/change-password', { state: { email: userData.email } }); // Enviar el email como parte del state
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const response = await fetch(`${backendUrl}/api/user/user-token`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);
                    } else {
                        throw new Error('Error en la respuesta del servidor');
                    }
                } catch (error) {
                    console.error("Error en fetch:", error);
                    setError("No se pudo obtener la información del usuario.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    if (loading) {
        return (
            <div className="container mt-5 mb-5 w-100 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 mb-5 w-100">
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="container mt-5 mb-5 w-100">
                <Alert variant="danger" className="text-center">
                    No se encontró información del usuario.
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4 text-center">Mi Cuenta</h2>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="border rounded-3 p-4" style={{ backgroundColor: "#f8f9fa" }}>
                        <div className="mb-4">
                            <h5>Nombre completo:</h5>
                            <p>{userData.firstName} {userData.lastName}</p>
                        </div>
                        <div className="mb-4">
                            <h5>DNI:</h5>
                            <p>{userData.documentNumber}</p>
                        </div>
                        <div className="mb-4">
                            <h5>Email:</h5>
                            <p>{userData.email}</p>
                        </div>
                        <div className="mb-4">
                            <h5>Direcciones cargadas</h5>
                            {userData.addresses && userData.addresses.length > 0 ? (
                                <ul className="list-unstyled">
                                    {userData.addresses.map(address => (
                                        <li key={address.id} className="p-3 mb-3 rounded-3" style={{ backgroundColor: "#e9ecef" }}>
                                            <p>{address.street} {address.number}</p>
                                            <p>{address.zipCode}, {address.city}, {address.state}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-muted">No tienes direcciones registradas.</p>
                            )}
                        </div>
                        <div className="d-flex justify-content-center justify-content-md-end mt-3">
                            <Button variant="primary" onClick={goToChangePassword}>
                                Cambiar contraseña
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
