import React, { useEffect, useState } from 'react';
import { useProducts } from '../../../context/productContext';
import { useParams, useNavigate } from 'react-router-dom';

const EditPage = () => {
    const { getProductById, updateProduct } = useProducts();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id);
                setProduct(productData);
            } catch (error) {
                setError('Error al cargar el producto');
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]); // Evita dependencias innecesarias para prevenir loops

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: name === 'quantity' ? parseInt(value) : value,
        }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const path = URL.createObjectURL(file); // Crea una URL temporal para la imagen
            setProduct((prevProduct) => ({
                ...prevProduct,
                mainImage: path, // Guarda la ruta completa
            }));
        }
    };
    
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const imagePaths = files.map(file => URL.createObjectURL(file)); // Crea URLs temporales
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: imagePaths, // Guarda las rutas completas
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedProduct = {
                ...product,
                mainImage: product.mainImage,
                images: product.images,
            };
    
            
            await updateProduct(updatedProduct);
            navigate('/admin/products');
        } catch (error) {
            setError('Error al actualizar el producto');
            console.error('Error updating product:', error);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>EDITAR PRODUCTO</h1>
            {product && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="name">Nombre:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="description">Descripción:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            required
                            style={styles.textarea}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="quantity">Cantidad:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="price">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Actualizar Producto</button>
                </form>
            )}
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
        maxWidth: '400px', // Limita el ancho del formulario
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
    textarea: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
        resize: 'vertical', // Permite cambiar el tamaño verticalmente
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
};

export default EditPage;
