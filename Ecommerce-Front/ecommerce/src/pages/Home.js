import React, { useState } from 'react';
import ProductCard from '../components/ProductCard.js';
import { useProducts } from '../context/productContext';

const Home = () => {
    
 // Paginación
 const itemsPerPage = 8; // Número de productos por página
 const [currentPage, setCurrentPage] = useState(1);
 const { filteredProducts } = useProducts(); 

 const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

 // Obtener los productos de la página actual
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

 // Función para cambiar de página
 const paginate = (pageNumber) => setCurrentPage(pageNumber);

 return (
    <div className="container custom-card-container mb-4 mt-4">
   

        {/* Listado de productos */}
        <div className="row">
            {currentItems.map(product => (
                <div className="col-md-3 mb-4 d-flex justify-content-center" key={product.id}>
                    <ProductCard product={product} className="product-card shadow-sm" />
                </div>
            ))}
        </div>

        {/* Paginación */}
        <nav className="mt-4">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link rounded-pill" onClick={() => paginate(currentPage - 1)}>
                        Anterior
                    </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link rounded-pill" onClick={() => paginate(i + 1)}>
                            {i + 1}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link rounded-pill" onClick={() => paginate(currentPage + 1)}>
                        Siguiente
                    </button>
                </li>
            </ul>
        </nav>
    </div>
);
};

export default Home;