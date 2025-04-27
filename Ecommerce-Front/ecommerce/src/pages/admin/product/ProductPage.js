import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../../context/productContext';

const ProductPage = () => {
    const { filteredProducts, searchTerm, setSearchTerm, deleteProduct } = useProducts();

    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/admin/products/edit/${id}`);
    };
    const handleNew = () => {
        navigate(`/admin/products/new`);
    };
    

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await deleteProduct(id);
                alert('Producto eliminado con éxito');
            } catch (error) {
                alert('Error al eliminar el producto.');
            }
        }
    };

    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    // Calcular el índice de productos a mostrar
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Cambio de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ marginBottom: '20px' }}>PRODUCTOS</h1>
    
            {/* Contenedor para el buscador y el botón "Nuevo" */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginBottom: '20px' }}>
                {/* Campo de búsqueda */}
                <input 
                    type="text" 
                    placeholder="Buscar productos..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ padding: '10px', width: '300px' }}
                />
                {/* Botón "Nuevo" */}
                <button 
                    onClick={handleNew}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#28a745',
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                    }}
                >
                    Nuevo
                </button>
            </div>
    
            {/* Tabla de productos */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead style={{ backgroundColor: '#007bff', color: '#fff' }}>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>ID</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>Nombre</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>Descripción</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>Cantidad</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>Precio</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>Imagen Principal</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>Imágenes</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product) => (
                            <tr key={product.id} style={{ backgroundColor: '#f9f9f9', transition: 'background-color 0.3s' }}>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{product.id}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{product.name}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{product.description}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{product.quantity}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>${product.price.toFixed(2)}</td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                    {product.mainImage ? (
                                        <img 
                                            src={product.mainImage} 
                                            alt={product.name} 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        <span> - </span>
                                    )}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                    {product.images && product.images.length > 0 ? (
                                        product.images.map((image, index) => (
                                            <img 
                                                key={index} 
                                                src={image} 
                                                alt={`${product.name} - ${index + 1}`} 
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }} 
                                            />
                                        ))
                                    ) : (
                                        <span> - </span>
                                    )}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button 
                                            style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}
                                            onClick={() => handleEdit(product.id)}>Editar
                                        </button>
                                        <button 
                                            style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    
            {/* Paginación */}
            <Pagination
                productsPerPage={productsPerPage}
                totalProducts={filteredProducts.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );    
};

// Componente de Paginación
const Pagination = ({ productsPerPage, totalProducts, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div style={{ marginTop: '20px' }}>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => paginate(number)}
                    style={{
                        padding: '8px 12px',
                        margin: '0 5px',
                        backgroundColor: currentPage === number ? '#007bff' : '#f1f1f1',
                        color: currentPage === number ? '#fff' : '#333',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                    }}
                >
                    {number}
                </button>
            ))}
        </div>
    );
};

// Estilos en línea para la tabla
const tableHeaderStyle = {
    padding: '10px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
};

const tableRowStyle = {
    backgroundColor: '#f9f9f9',
    transition: 'background-color 0.3s',
};

const tableDataStyle = {
    padding: '10px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
};

const editButtonStyle = {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const deleteButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

export default ProductPage;
