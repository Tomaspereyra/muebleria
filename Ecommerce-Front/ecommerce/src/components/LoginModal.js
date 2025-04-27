import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import LoginForm from './loginForm';

const LoginModal = ({ show, onHide }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>

            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ingresá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Pasamos `handleCloseModal` como `onClose` */}
                    <LoginForm onClose={onHide} />
                    <p className="text-center mb-3">
                        Debes iniciar sesión para poder realizar la compra.
                    </p>
                    <p className="text-center mb-3">
                        ¿No estás registrado?
                        <a href="/register" className="link-primary"> Registrate acá</a>
                    </p>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LoginModal;