import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { useSpinner } from '../context/spinnerContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER;
const ProductDetailPage = () => {
    const { showSpinner, hideSpinner } = useSpinner();
    const { addToCart } = useCart(); // Obtener la función para agregar al carrito
    const [product, setProduct] = useState(null); // Estado para el producto
    const [selectedImage, setSelectedImage] = useState(''); // Estado para la imagen seleccionada
    const [quantity, setQuantity] = useState(1); // Estado para la cantidad
    const { id } = useParams(); // Obtener el ID de la URL
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    // Función para obtener el producto desde el backend
    const fetchProduct = async (productId) => {
        try {
            showSpinner();
            const response = await fetch(`${backendUrl}/api/product/${productId}`);
            const data = await response.json();
            setProduct(data); // Actualizar el estado con los datos del producto
            setSelectedImage(data.mainImage); // Establecer la imagen principal
        } catch (error) {
            console.error('Error fetching product:', error);
        }
        finally {
            hideSpinner();
        }
    };

    // Función para cambiar la imagen seleccionada
    const handleImageClick = (image) => {
        setSelectedImage(image);
    };
    // Ejecutar la función para obtener el producto cuando el componente se monte
    useEffect(() => {
        fetchProduct(id); // Llamar a la función con el ID del producto
    }, [id]);

    // Función para manejar el cambio de cantidad
    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity); // Agregar el producto al carrito
        setShowModal(true);
    };

    // Función para ir al carrito
    const goToCart = () => {
        setShowModal(false); // Cerrar el modal
        navigate('/cart'); // Redirigir al carrito
    };

    // Función para volver a la página principal
    const goToHome = () => {
        setShowModal(false); // Cerrar el modal
        navigate('/'); // Redirigir a la home
    };



    // Si no se encuentra el producto
    if (!product) {
        return <div>Producto no encontrado.</div>;
    }
    const description = product.description.replace(/\\n/g, '\n');
    return (
        <div className="container mt-5 mb-5 shadow-sm">
            <div className="row mb-4">
                <div className="col text-center">
                    <h1>{product.name}</h1>
                </div>
            </div>
            <div className="row">
                {/* Columna para imágenes */}
                <div className="col-md-6">

                    <div className="mb-3 d-flex justify-content-center">
                        {/* Imagen principal del producto */}
                        <img
                            src={selectedImage}
                            className="img-fluid"
                            alt={product.name}
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </div>

                    <div
                        className="d-flex overflow-auto bg-white p-2 rounded  mb-4"
                        style={{ gap: '10px' }}
                    >
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Imagen ${index + 1}`}
                                className="img-thumbnail rounded"
                                onClick={() => handleImageClick(image)}
                                style={{
                                    cursor: 'pointer',
                                    maxHeight: '140px',
                                    width: '140px',
                                    objectFit: 'cover',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                        ))}
                    </div>
                </div>

                {/* Columna para los detalles del producto */}
                <div className="col-md-6">

                    {/*  <p className="text-muted">Categoría: {product.category}</p>*/}

                    <pre className="card-text font">{description}</pre>

                    <div className="my-4">
                        {/* Mostrar el stock del producto */}
                        <p className="text-muted">
                            {product.quantity > 0 ? `Stock disponible: ${product.quantity}` : 'Producto agotado'}
                        </p>
                        <h4 className="text-success">${product.price}</h4>
                        {/* Input para seleccionar la cantidad */}
                        <div className="mt-3">
                            <label htmlFor="quantity" className="form-label">Cantidad:</label>
                            <input
                                type="number"
                                id="quantity"
                                className="form-control"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max={product.quantity} // Limitar según el stock disponible
                            />
                        </div>
                    </div>


                    {/* Botón para agregar al carrito */}
                    <button
  className="btn btn-success btn-lg w-100"
  onClick={() => {
    const message = encodeURIComponent(`Hola, estoy interesado en el producto: ${product.name}, necesito  ${quantity}.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  }}
>
  Comprar
</button>
<p className="mt-2 text-muted">
        Al hacer click te redireccionaremos a nuestro WhatsApp.
      </p>
                
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Sumaste un producto al carrito</h5>
                                <button type="button" className="close" style={{ position: 'absolute', right: '15px', top: '10px' }} onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Has agregado {quantity} {quantity > 1 ? 'productos' : 'producto'} de {product.name} al carrito.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={goToCart}>Ir al carrito</button>
                                <button type="button" className="btn btn-secondary" onClick={goToHome}>Seguir comprando</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;