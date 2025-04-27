import React, { useEffect, useState, useContext } from 'react';
import { OrderContext } from '../../../context/orderContext';

const AdminOrderPage = () => {
    const { orders, handleStatusChange, updateOrderStatus, fetchOrders } = useContext(OrderContext);
    
    // Paginación
    const itemsPerPage = 8; 
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [startDate, setStartDate] = useState(''); // Fecha de inicio
    const [endDate, setEndDate] = useState(''); // Fecha de fin
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    useEffect(() => {
        fetchOrders(); // Llama a fetchOrders al cargar la página
    }, []);

    // Filtrar ordenes por estado
    const filteredOrders = selectedStatus === 'ALL' ? orders : orders.filter(order => order.status === selectedStatus);

    // Filtrar por fechas
    const dateFilteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.dateCreated);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Comprobar si el orden cae dentro del rango de fechas (inclusivo)
        const isAfterStart = !startDate || orderDate >= start;
        const isBeforeEnd = !endDate || orderDate <= end;

        return isAfterStart && isBeforeEnd;
    });

    // Obtener las ordenes de la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = dateFilteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    // Función para cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{ width: '80%', padding: '20px', overflowX: 'auto' }}>
                <h1 style={{ textAlign: 'center', color: '#333' }}>Ordenes</h1>
                {/* Contenedor para filtros */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    {/* Filtro por estado */}
                    <div style={{ textAlign: 'left' }}>
                        <label htmlFor="statusFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>Filtrar por estado:</label>
                        <select 
                            id="statusFilter" 
                            value={selectedStatus} 
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setCurrentPage(1); // Reiniciar a la primera página al filtrar
                            }}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="ALL">TODOS</option>
                            <option value="CREATED">CREADO</option>
                            <option value="IN_REVIEW">EN REVISIÓN</option>
                            <option value="PAID">PAGADO</option>
                            <option value="FINISHED">FINALIZADO</option>
                        </select>
                    </div>

                    {/* Filtro por fechas */}
                    <div style={{ textAlign: 'right' }}>
                        <label htmlFor="startDate" style={{ marginRight: '10px', fontWeight: 'bold' }}>Fecha de inicio:</label>
                        <input 
                            type="date" 
                            id="startDate" 
                            value={startDate} 
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setCurrentPage(1); // Reiniciar a la primera página al filtrar
                            }}
                            style={{ marginRight: '20px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <label htmlFor="endDate" style={{ marginRight: '10px', fontWeight: 'bold' }}>Fecha de fin:</label>
                        <input 
                            type="date" 
                            id="endDate" 
                            value={endDate} 
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setCurrentPage(1); // Reiniciar a la primera página al filtrar
                            }}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                </div>

                {currentOrders.length > 0 ? (
                    <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                        <thead style={{ backgroundColor: '#007bff', color: '#fff' }}>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>ID</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>FECHA</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>PRODUCTOS</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>DIRECCIÓN</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>TOTAL</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>COMPROBANTE</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>ESTADO</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>RETIRA</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id} style={{ backgroundColor: '#f9f9f9', transition: 'background-color 0.3s' }}>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{order.id}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{new Date(order.dateCreated).toLocaleDateString()}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                        {order.products.map(product => (
                                            <div key={product.id}>
                                                {product.name} (x{product.quantity})
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                        {order.pickup ? " - " : `${order.address.street} ${order.address.number}, ${order.address.city}, ${order.address.state}`}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>${order.amount}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                        {order.comprobanteUrl ? (
                                            <a href={order.comprobanteUrl} target="_blank" rel="noopener noreferrer">
                                                <button style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 12px' }}>Ver comprobante</button>
                                            </a>
                                        ) : (
                                            <span>No tiene</span>
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'center' }}
                                        >
                                            <option value="CREATED">CREADO</option>
                                            <option value="IN_REVIEW">EN REVISIÓN</option>
                                            <option value="PAID">PAGADO</option>
                                            <option value="FINISHED">FINALIZADO</option>
                                        </select>
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{order.pickup ? "SI" : "NO"}</td>
                                    <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => updateOrderStatus(order.id)}
                                            style={{ backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer' }}
                                        >
                                            Actualizar Estado
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ textAlign: 'center', color: '#555' }}>No hay ordenes disponibles</p>
                )}
                {/* Paginación */}
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                Anterior
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                Siguiente
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default AdminOrderPage;
