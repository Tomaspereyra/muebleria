import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Button } from 'react-bootstrap';
import { useSpinner } from '../context/spinnerContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const RegisterForm = () => {
    const { showSpinner, hideSpinner } = useSpinner();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        documentNumber: '',
        email: '',
        password: '',
        confirmPassword: '',

    });

    const [addressData, setAddressData] = useState({
        street: '',
        number: '',
        zipCode: '',
        city: '',
        state: '',
    });

    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // Controla el paso del formulario
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleAddressChange = (e) => {
        setAddressData({
            ...addressData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, lastName, documentNumber, email, password, confirmPassword } = formData;

        if (step === 1) {
            // Validación básica para la primera parte del formulario
            if (!name || !email || !password || !confirmPassword || !lastName || !documentNumber) {
                setError('Por favor, completa todos los campos.');
                return;
            }

            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden.');
                return;
            }

            setError('');
            setStep(2); // Ir a la segunda parte del formulario
        } else if (step === 2) {
            // Validación para la segunda parte (dirección)
            /* if (!address || !city || !state || !zip) {
                 setError('Por favor, completa toda la información de la dirección.');
                 return;
             }*/

            setError('');

            // Enviar los datos al backend
            try {
                showSpinner();
                const response = await fetch(`${backendUrl}/api/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        lastName,
                        documentNumber,
                        email,
                        password,
                        address: addressData, // Añadimos la dirección
                    }),
                });

                if (!response.ok) {
                    // Manejo de errores en caso de respuesta no exitosa
                    const errorData = await response.json();
                    setError(errorData.message || 'Error en el registro');
                    return;
                }
                try {
                    const responseLogin = await fetch(`${backendUrl}/api/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email,
                            password,
                        }),
                    });

                    if (!responseLogin.ok) {
                        // Manejo de errores en caso de respuesta no exitosa
                        const errorData = await responseLogin.json();
                        setError('Tuvimos un problema para iniciar sesion');
                        return;
                    }
                    // Convertir la respuesta en JSON
                    const data = await responseLogin.json();

                    // Acceder al atributo 'jwt' del body
                    const jwt = data.jwt;
                    login(jwt);

                    // Redireccionar al home después del registro exitoso
                    navigate('/');
                }
                catch (error) {
                    setError('Tuvimos un problema para iniciar sesion. Te redireccionaremos al login');

                }
                finally {
                    hideSpinner();
                }
        
            
                // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
            } catch (error) {
                setError('Error al conectar con el servidor. Inténtalo nuevamente más tarde.');

            }
            finally {
                hideSpinner();
            }
    


            // Aquí manejarías el envío completo del formulario
            console.log('Datos completos del usuario:', formData);
        }
    };

    return (
        <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title text-center mb-4">
                            {step === 1 ? 'Tus datos' : 'Tu dirección'}
                        </h3>
                        {error && <div className="alert alert-danger text-center">{error}</div>}

                        <form onSubmit={handleSubmit} className="w-100"> {/* Asegúrate de que el formulario ocupe el ancho completo */}
                            {step === 1 ? (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label fw-semibold">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu nombre"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label fw-semibold">Apellido</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu apellido"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="documentNumber" className="form-label fw-semibold">Número de documento</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="documentNumber"
                                            name="documentNumber"
                                            value={formData.documentNumber}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu número de documento"
                                            required
                                        />
                                    </div>
                                    <hr />
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu correo"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Crea una contraseña"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirmar contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Repite la contraseña"
                                            required
                                        />
                                    </div>
                                    <Button type="button" onClick={handleSubmit} className="btn btn-primary w-100 mt-3">
                                        Siguiente
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="street" className="form-label fw-semibold">Calle</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="street"
                                            name="street"
                                            value={addressData.street}
                                            onChange={handleAddressChange}
                                            placeholder="Ingresa tu dirección"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="number" className="form-label fw-semibold">Número</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="number"
                                            name="number"
                                            value={addressData.number}
                                            onChange={handleAddressChange}
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="zipCode" className="form-label fw-semibold">Código postal</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="zipCode"
                                            name="zipCode"
                                            value={addressData.zipCode}
                                            onChange={handleAddressChange}
                                            placeholder="Ingresa tu código postal"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="state" className="form-label fw-semibold">Localidad</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="state"
                                            name="state"
                                            value={addressData.state}
                                            onChange={handleAddressChange}
                                            placeholder="Ingresa tu localidad"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="city" className="form-label fw-semibold">Provincia</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            name="city"
                                            value={addressData.city}
                                            onChange={handleAddressChange}
                                            placeholder="Ingresa tu provincia"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="btn btn-success w-100 mt-3">
                                        Registrarme
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn btn-secondary w-100 mt-2"
                                    >
                                        Volver
                                    </Button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default RegisterForm;
