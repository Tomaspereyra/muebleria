import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
const Footer = () => {

    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER;

    return (
        <footer className="bg-light text-center text-lg-start mt-auto footer">
            <div className="text-center p-4">
                <span className="text-muted">&copy; {new Date().getFullYear()} ElectroSHA. Todos los derechos reservados.</span>
               {/*<br />
                <a href="/privacy" className="text-muted footer-link">Política de privacidad</a> | 
                <a href="/terms" className="text-muted footer-link"> Términos de servicio</a>
                <br />
                <br />*/}
                <div className="social-icons">
                   { /*<a href="https://facebook.com" className="social-icon text-muted m-1" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-facebook"></i>
                    </a>
                    <a href="https://instagram.com" className="social-icon text-muted m-1" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-instagram"></i>
                    </a>*/}
                    <a href={`https://wa.me/${whatsappNumber}`} className="social-icon text-muted m-1" target="_blank" rel="noopener noreferrer">
                       ¡Hablemos! <i className="bi bi-whatsapp"></i> 
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
