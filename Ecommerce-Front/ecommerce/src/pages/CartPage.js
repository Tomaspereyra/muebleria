import React, { useEffect } from 'react';
import { useState } from 'react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/cartContext'; // Asumiendo que el contexto está implementado
import { Wallet } from "@mercadopago/sdk-react";
import { useAuth } from '../context/authContext';
import { FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import { useSpinner } from '../context/spinnerContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const CartPage = () => {
    const [orderId, setOrderId] = useState(null);
    const { showSpinner, hideSpinner } = useSpinner();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const { cart, setCart } = useCart(); // Obtener el carrito del contexto
    const { token, setToken } = useAuth();
    const [preferenceId, setPreferenceId] = useState();
    const [step, setStep] = useState(1); // Controla el paso actual
    const [pickupPreference, setPickupPreference] = useState(false);
    const [formData, setFormData] = useState({
        street: '',
        number: '',
        zipCode: '',
        city: '',
        state: '',
    });
    const navigate = useNavigate();
    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id)); // Filtrar los productos que no tienen el id a eliminar
    };
    const isLoggedIn = !!localStorage.getItem('token');
    const renderCheckoutButton = (preferenceId) => {
        if (!preferenceId) return null;
        return (
            <Wallet
                initialization={{ preferenceId: preferenceId, action: 'pay' }}
                customization={{ texts: { valueProp: 'smart_option' } }}
                onReady={true}
                onSubmit={() => {
                    updateOrderStatus("IN_REVIEW")
                }} />
        )
    }

    // Calcular el total del carrito
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    const handleCreateOrder = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        setStep(2); // Avanzar al siguiente paso
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressSubmit = async (event) => {
        event.preventDefault();


        const emptyFields = Object.keys(formData).filter((key) => !formData[key]);
        if (emptyFields.length > 0 && !pickupPreference) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        try {

            const { street, number, zipCode, city, state } = formData;

            const products = cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                name: item.name,
                description: item.description,
                price: item.price
            }));
            showSpinner();
            const responseOrder = await fetch(`${backendUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    address: {
                        street,
                        number,
                        zipCode,
                        city,
                        state
                    },
                    products: products,
                    pickup: pickupPreference
                }),
            });

            if (!responseOrder.ok) {
                console.log("error al crear la orden") //Agregar error
            }
            const responseOrderData = await responseOrder.json(); // Convierte la respuesta a JSON
            const { id } = responseOrderData; // Extrae el id del objeto JSON
            setOrderId(id);

            try {
                const responsePreference = await fetch(`${backendUrl}/api/mercadopago/create_preference`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: JSON.stringify({
                        address: {
                            street,
                            number,
                            zipCode,
                            city,
                            state
                        },
                        products: products,
                        documentNumber: 40897248

                    }),
                });
                const responseText = await responsePreference.text();

                setPreferenceId(responseText);

            } catch (error) {
                console.log(error)
            }

        }
        catch (error) {
            console.log(error)

        }
        finally {
            hideSpinner();
        }

        setStep(3); // Avanzar al paso 3: pago
    };

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [fileName, setFileName] = useState('');

    // Maneja la selección de archivo
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name); // Actualizar el estado con el nombre del archivo
            setFile(file);
        } else {
            setFileName(''); // Limpiar el nombre si no hay archivo
        }
    };
    const handleSetMyAddress = async () => {

        try {
            showSpinner();
            const responseUser = await fetch(`${backendUrl}/api/user/user-token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }

            });

            const responseBody = await responseUser.json();
            const address = responseBody.addresses[0]
            // Actualiza todos los valores de formData de una vez
            setFormData(prevFormData => ({
                ...formData,   // Conserva el estado anterior (opcional si estás reemplazando todos los valores)
                ...address      // Sobrescribe los valores con los del nuevo objeto
            }));



        } catch (error) {
            console.log(error)
        }
        finally {
            hideSpinner();
        }


    }

    // Maneja la subida de imagen
    const handleUpload = async () => {
        if (!file) {
            alert("Selecciona una imagen primero.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            showSpinner();
            const response = await fetch(`${backendUrl}/api/images`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData,
            });
            if (!response.ok) {
                // Manejo de errores en caso de respuesta no exitosa
                const errorData = await response.text();
                //  setError('Tuvimos un problema para iniciar sesion. Te redireccionaremos al login');
                console.log(errorData)
                return;
            }
            const result = await response.text();

            const responseUpdateOrder = await fetch(`${backendUrl}/api/orders/comprobante-url?comprobanteUrl=${result}`, {
                method: "PUT",
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(null)
            });
            if (!responseUpdateOrder.ok) {
                // Manejo de errores en caso de respuesta no exitosa
                const errorData = await responseUpdateOrder.json();
                //  setError('Tuvimos un problema para iniciar sesion. Te redireccionaremos al login');
                console.log(errorData)
                return;
            }


            setStep(5); // Avanzar al siguiente paso
            setCart([]);
        } catch (error) {
            setMessage("Error al subir la imagen");
        }
        finally {
            hideSpinner();
        }
    };

    // Funciones para manejar la apertura y cierre del modal
    const handleOpenModal = () => setShowLoginModal(true);
    const handleCloseModal = () => {
        setShowLoginModal(false);
        showSuccessAlert();
    }

    const showSuccessAlert = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 4000); // Duración del alert (en milisegundos)
    };

    const updateOrderStatus = async (status) => {
        try {
            showSpinner();
            const token = localStorage.getItem('token');

            const response = await fetch(`${backendUrl}/api/orders/${orderId}/status?status=${status}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(null) // `fetch` requiere un cuerpo explícito en `PUT`, aunque sea null
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

        } catch (error) {

        }
        finally {
            hideSpinner();
        }

    }

    return (
        <div className="container-sm justify-content-center mb-3">

            {/* Step 1: Ver carrito y crear pedido */}
            {step === 1 && (
                <>
                    <h1 className="my-4 text-center">Carrito</h1>

                    {cart.length === 0 ? (
                        <p className="text-center">No tenes productos en tu carrito.</p>
                    ) : (
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8 col-lg-6">
                                <div className="card shadow-sm border-0 p-3">
                                    <div className="card-body">
                                        <h4 className="card-title text-center mb-4">Productos en tu carrito</h4>

                                        {cart.map(item => (
                                            <CartItem item={item} key={item.id} onRemove={removeItem} />
                                        ))}

                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <h5 className="fw-bold text-success">Total: ${totalAmount}</h5>
                                            <button
                                                className="btn btn-primary btn-lg"
                                                onClick={handleCreateOrder}
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <LoginModal show={showLoginModal} onHide={handleCloseModal} />
                                {showAlert && (
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        Ya podes continuar con la compra.
                                        <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
                                    </div>
                                )}
                            </div>

                        </div>

                    )}
                </>
            )}

            {/* Step 2: Formulario de dirección de envío */}
            {step === 2 && (

                <div className="address-form px-3">
                    <h4 className="my-4 text-center">Decinos dónde queres recibir el pedido</h4>
                    <form className="row justify-content-center" onSubmit={handleAddressSubmit}>

                        <div className="col-12 col-md-8 col-lg-6">
                            <button
                                type="button"
                                className="btn btn-link p-0 mb-2"
                                onClick={handleSetMyAddress}
                                disabled={pickupPreference}
                            >
                                Quiero usar la direccion que cargue al registrarme
                            </button>

                            {[
                                { label: "Calle", id: "street", name: "street", type: "text" },
                                { label: "Número", id: "number", name: "number", type: "number" },
                                { label: "Código Postal", id: "postalCode", name: "zipCode", type: "text" },
                                { label: "Localidad", id: "localidad", name: "state", type: "text" },
                                { label: "Provincia", id: "provincia", name: "city", type: "text" }
                            ].map((field) => (
                                <div className="mb-3" key={field.id}>
                                    <label htmlFor={field.id} className="form-label">{field.label}</label>
                                    <input
                                        type={field.type}
                                        className={`form-control ${!formData[field.name] ? 'is-invalid' : ''}`}
                                        id={field.id}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        disabled={pickupPreference}
                                        required
                                    />
                                    {!formData[field.name] && !pickupPreference && <div className="invalid-feedback">Este campo es obligatorio</div>}
                                </div>
                            ))}

                            <p className="text-center my-3 mt-4">
                                Antes de continuar,{" "}
                                <a
                                    href="https://wa.me/5491165170107"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary">
                                    contactanos por WhatsApp
                                </a>{" "}
                                para validar el envío y conocer sus costos.
                            </p>

                            {/* Línea divisora */}
                            <hr className="my-4" />

                            {/* Checkbox de preferencia de retiro */}
                            <div className="form-check mb-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="pickupPreference"
                                    name="pickupPreference"
                                    onChange={(e) => setPickupPreference(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="pickupPreference">
                                    Prefiero retirar el pedido
                                </label>
                            </div>
                            <p className="text-muted mt-2">
                                Dirección de retiro: Av. Alsina 1960, Lomas de Zamora, Bs As.
                            </p>


                            <div className="d-flex justify-content-between mt-4">

                                <button type="submit" className="btn btn-primary">
                                    Continuar al pago
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={() => setStep(1)}
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            )}
            {step === 3 && (
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h3 className="text-center mb-4">Realizar Pago</h3>

                                <div className="text-center mb-4">
                                    <p className="display-6 fw-bold text-success">Total a pagar: ${totalAmount}</p>
                                    <p className="text-muted">Puedes pagar con transferencia bancaria o a través de MercadoPago</p>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-success btn-lg"
                                        onClick={() => setStep(4)}
                                    >
                                        Pagar con transferencia
                                    </button>
                                </div>

                                <div className="text-center mt-3">
                                    {renderCheckoutButton(preferenceId)}
                                </div>

                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setStep(2)} // Volver al formulario de dirección
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h3 className="text-center mb-4">Nuestros datos bancarios</h3>

                                <div className="text-center mb-4">
                                    <p className="display-6 fw-bold text-success">Total a pagar: ${totalAmount}</p>
                                </div>

                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <strong>Alias:</strong> tomas.tomas.tomas
                                    </li>
                                    <li className="list-group-item">
                                        <strong>CBU:</strong> 43587969493745897
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Titular:</strong> Tomas Agustin Pereyra
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Banco:</strong> BBVA
                                    </li>
                                </ul>

                                <p className="mt-4 text-center text-muted">
                                    Realiza la transferencia desde tu banco o billetera virtual y envíanos el comprobante.
                                </p>

                                <div className="d-grid gap-2 mt-4">

                                    <input
                                        id="fileInput"
                                        type="file"
                                        onChange={handleFileChange}
                                        className="form-control d-none" // Ocultamos el input
                                    />
                                    {fileName && ( // Mostrar el nombre del archivo si existe
                                        <div className="mt-2">
                                            <strong>Archivo seleccionado:</strong> {fileName}
                                        </div>
                                    )}
                                    <label htmlFor="fileInput" className="btn btn-primary ">
                                        <FaUpload className="me-2" /> Adjuntar comprobante {/* Icono en el botón */}
                                    </label>



                                    <button onClick={handleUpload} type="button" className="btn btn-success btn-lg" disabled={!fileName}>
                                        Enviar
                                    </button>
                                    {message && <p className="mt-3">{message}</p>}
                                </div>

                                <div className="text-center mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setStep(3)} // Volver al formulario de dirección
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 5 && ( // Nuevo paso de confirmación de orden
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h3 className="text-center mb-4 fw-bold text-success">¡Gracias por tu compra!</h3>
                                <p className="text-center">Estamos preparando tu pedido.</p>
                                <div className="text-center">
                                    <p>Te enviaremos mas informacion a tu correo.</p>
                                </div>
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => navigate('/orders')}
                                    >
                                        Ver mis ordenes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default CartPage;