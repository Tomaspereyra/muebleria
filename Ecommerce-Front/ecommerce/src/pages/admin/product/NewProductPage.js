import React, { useState } from 'react';
import { useProducts } from '../../../context/productContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const NewProductPage = () => {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();
    const { createProduct, loading, error } = useProducts();
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        mainImage: '',
        images: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const urlMainImage = await handleUpload(productData.mainImage);
            productData.mainImage = urlMainImage
            const uploadedImages = await Promise.all(
                productData.images.map(image => handleUpload(image))
            );
            productData.images = uploadedImages
            const newProduct = await createProduct(productData);
            alert(`Producto creado: ${newProduct.name}`);
            setProductData({
                name: '',
                description: '',
                price: '',
                quantity: '',
                mainImage: ''
            });
            navigate('/admin/products');
        } catch (err) {
            console.error('Error al crear el producto:', err);
        }
    };

    const handleMainImageChange = (e) => {
        setProductData({
            ...productData,
            mainImage: e.target.files[0],
        });
    };

    const handleSecondaryImageChange = (index, e) => {
        const files = [...productData.images];
        files[index] = e.target.files[0];
        setProductData({
            ...productData,
            images: files,
        });
    };


    const handleUpload = async (image) => {
        const formData = new FormData();
        formData.append("file", image);
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
        const urlImage = await response.text();

        return urlImage;
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="card p-4 shadow-sm">
                <h1 className="text-center mb-4">Crear Nuevo Producto</h1>
                {loading && <p className="text-center text-primary">Cargando...</p>}
                {error && <p className="text-center text-danger">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre:</label>
                        <input
                            type="text"
                            name="name"
                            value={productData.name}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripción:</label>
                        <textarea
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                            required
                            className="form-control"
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Precio:</label>
                        <input
                            type="number"
                            name="price"
                            value={productData.price}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Cantidad:</label>
                        <input
                            type="number"
                            name="quantity"
                            value={productData.quantity}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Imagen Principal:</label>
                        <input
                            type="file"
                            onChange={handleMainImageChange}
                            className="form-control"
                        />
                    </div>

                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="mb-3">
                            <label className="form-label">Imagen Secundaria {index + 1}:</label>
                            <input
                                type="file"
                                onChange={(e) => handleSecondaryImageChange(index, e)}
                                accept="image/*"
                                className="form-control"
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-success w-100"
                    >
                        {loading ? 'Creando...' : 'Crear Producto'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewProductPage;
