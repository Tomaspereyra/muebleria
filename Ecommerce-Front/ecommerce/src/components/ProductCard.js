import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product,className }) => {
    const navigate = useNavigate(); // Hook para la navegación

    // Función para manejar la navegación al hacer clic en "Comprar"
    const handleBuyClick = () => {
        // Navega a la página de detalles del producto con el ID del producto
        navigate(`/product/${product.id}`);
    };
    const description = product.description.replace(/\\n/g, '\n');
       return (
        <div className={`card mb-4 shadow-sm w-100 ${className}`} >
            <img
                src={product.mainImage}
                className="card-img-top"
                alt={product.name}
                style={{
                    height: '12rem',
                    width: '100%',    // Ajusta el ancho al contenedor
                    objectFit: 'cover'
                }}
            />        <div className="card-body d-flex flex-column" style={{ height: '100%' }}>
                <h5 className="card-title">{product.name}</h5>
                <p class="card-text" style={{ textAlign: 'left' }}><small class="text-muted">{product.quantity > 0 ? `Stock disponible: ${product.quantity}` : 'Producto agotado'}</small></p>

                <pre className="card-text font" style={{ textAlign: 'left' }} >{description}</pre>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="text-muted">${product.price}</span>
                    <button className="btn btn-success" onClick={handleBuyClick}>Ver mas</button>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
