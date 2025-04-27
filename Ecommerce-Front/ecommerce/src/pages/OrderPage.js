import React, { useState, useEffect, useContext  } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useSpinner } from '../context/spinnerContext';
import { OrderContext } from '../context/orderContext';
import { FaUpload } from 'react-icons/fa';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});
  const { showSpinner, hideSpinner } = useSpinner();
  const { handleUpload } = useContext(OrderContext);

  useEffect(() => {
    // trae las ordenes de un usuario por token
    const fetchOrdersData = async () => {
      try {
        const token = localStorage.getItem('token');
        showSpinner();
        const response = await fetch(`${backendUrl}/api/user/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error al cargar las órdenes');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError('Error al cargar las órdenes');
      }
      finally {
        hideSpinner();
      }
    };

    fetchOrdersData();
  }, []);
  const getFriendlyStatus = ((status) => {
    switch (status) {
      case 'CREATED':
        return 'Creada';
      case 'IN_REVIEW':
        return 'Estamos comprobando el pago';
      case 'PAID':
        return 'Pagada';
      case 'FINISHED':
        return 'Finalizada';
      default:
        return 'Desconocido';
    }
  })

  const handleFileChange = (event, orderId) => {
    const file = event.target.files[0];
    if (file) {
      setFiles(prevFiles => ({
        ...prevFiles,
        [orderId]: file,  // Guardamos el archivo con su orderId
      }));
      setFileNames(prevFileNames => ({
        ...prevFileNames,
        [orderId]: file.name,  // Guardamos el nombre del archivo
      }));
    } else {
      setFiles(prevFiles => {
        const { [orderId]: _, ...remainingFiles } = prevFiles;
        return remainingFiles;  // Eliminamos el archivo si no se selecciona nada
      });
      setFileNames(prevFileNames => {
        const { [orderId]: _, ...remainingFileNames } = prevFileNames;
        return remainingFileNames;  // Eliminamos el nombre si no hay archivo
      });
    }
  };

  const handleFileUpload = async (orderId) => {
    const file = files[orderId];
    if (file) {
      await handleUpload(orderId, file);
      
      // Mostrar alerta de éxito
      alert('Comprobante subido correctamente');
  
      // Recargar la página para reflejar la actualización de la orden
      window.location.reload();
  
      // Limpiar el archivo seleccionado después de subirlo
      setFiles(prevFiles => {
        const { [orderId]: _, ...remainingFiles } = prevFiles;
        return remainingFiles;
      });
      setFileNames(prevFileNames => {
        const { [orderId]: _, ...remainingFileNames } = prevFileNames;
        return remainingFileNames;
      });
    } else {
      alert('Selecciona una imagen primero.');
    }
  };
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Mis Pedidos</h2>
      {orders.length === 0 ? (
        <p className="text-center">No tienes ningún pedido.</p>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-12 col-md-6 col-lg-4 mb-4 d-flex">
              <Card className="shadow-sm border-0 w-100" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
                <Card.Header className="bg-primary text-white">
                  Pedido #{order.id}
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-success">Total: ${order.amount.toFixed(2)}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Fecha: {new Date(order.dateCreated).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Dirección:</strong>{' '}
                    {order.address ? (
                      <>
                        {order.address.street} {order.address.number}, {order.address.state}, {order.address.city}
                      </>
                    ) : (
                      'Sin dirección'
                    )}
                  </Card.Text>
                  <Card.Text>
                    <strong>Productos:</strong>
                    <ul className="ps-3">
                      {order.products.map((product, index) => (
                        <li key={index}>
                          {product.name} (x{product.quantity})
                        </li>
                      ))}
                    </ul>
                  </Card.Text>
                  <Card.Text className="mt-auto">
                    <strong>Estado:</strong> <span className="text">{getFriendlyStatus(order.status)}</span>
                  </Card.Text>
                  <div className="text-center mt-3">
                    {order.comprobanteUrl ? (
                      <Button variant="outline-primary" href={order.comprobanteUrl} target="_blank" rel="noopener noreferrer">
                        Ver Comprobante
                      </Button>
                    ) : (
                      <span className="text-muted">Comprobante no disponible</span>
                    )}
                  </div>
                  {!order.comprobanteUrl && (
                    <div className="mt-3 text-center">
                      <input
                        id={`fileInput-${order.id}`}
                        type="file"
                        onChange={(e) => handleFileChange(e, order.id)}
                        className="form-control d-none"
                      />
                      {fileNames[order.id] && (
                        <div className="mt-2">
                          <strong>Archivo seleccionado:</strong> {fileNames[order.id]}
                        </div>
                      )}
                      <label htmlFor={`fileInput-${order.id}`} className="btn btn-primary mt-2">
                        <FaUpload className="me-2" /> Adjuntar comprobante
                      </label>
                      {files[order.id] && (
                        <Button className="mt-2" onClick={() => handleFileUpload(order.id)} variant="success">
                          Subir Comprobante
                        </Button>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
