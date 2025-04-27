import React from 'react';

const CartItem = ({ item,onRemove }) => {
   return (
        <div className="card mb-3"> {/* Asegúrate de que haya un margen inferior */}
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={item.mainImage} className="img-fluid rounded-start" alt={item.name} />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">Precio: ${item.price}</p>
                        <p className="card-text">Cantidad: {item.quantity}</p>
                        <div className="d-flex justify-content-between">
                            <span>Total: ${(item.price * item.quantity).toFixed(2)}</span>
                            <button className="btn btn-danger btn-sm"  onClick={() => onRemove(item.id)} >Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;