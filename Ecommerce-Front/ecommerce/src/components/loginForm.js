import React, { useState } from 'react';
import { useAuth } from '../context/authContext'; // Importar el hook de autenticación
import { useSpinner } from '../context/spinnerContext';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LoginForm = ({ onClose }) => { // Recibe `onClose` como prop opcional
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { showSpinner, hideSpinner } = useSpinner();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Por favor, completa ambos campos.');
            return;
        }
        
        try {
            showSpinner();
            const responseLogin = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!responseLogin.ok) {
                setError('El correo o la contraseña son incorrectos');
                return;
            }

            const data = await responseLogin.json();
            login(data.jwt, data.userRole);
            if (onClose){
                onClose();
                return;
            }
            navigate('/');
        } catch (error) {
            setError('Tuvimos un problema para iniciar sesion.');
        }
        finally {
            hideSpinner();
        }

    };

    const handleRecoverPassword = () => {
      navigate('/recover-password'); // Redirige a la página de recuperar contraseña
  };

    return (
        <div className="container mt-5 mb-5 w-100">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow border-0 rounded-3 p-4">
              <div className="card-body">
                <h3 className="card-title text-center mb-4 fw-bold" style={{ color: "#495057" }}>Bienvenido</h3>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control border-light shadow-sm p-2"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingresa tu correo"
                      required
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
                    <input
                      type="password"
                      className="form-control border-light shadow-sm p-2"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      required
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>
               
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
                    <button
                      type="submit"
                      className="btn text-white fw-semibold w-100 w-md-auto mb-2 mb-md-0 me-md-2"
                      style={{
                        backgroundColor: "#5cb85c",
                        borderColor: "#5cb85c",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        width: "45%", // Ancho ajustado
                      }}
                    >
                      Iniciar sesión
                    </button>                 
                  </div>
                  <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mt-3">
                  <button
                                type="button"
                                className="btn btn-link p-0 mb-2"
                                onClick={handleRecoverPassword}
                            >
                                Olvidé mi contraseña
                            </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};


export default LoginForm;
