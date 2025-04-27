import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProductProvider } from './context/productContext';
import './index.css';
import './styles/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './context/cartContext';
import { AuthProvider } from './context/authContext';
import { SpinnerProvider } from './context/spinnerContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SpinnerProvider> 
       <CartProvider>
      <ProductProvider>
        <AuthProvider>
    <App />
    </AuthProvider>
    </ProductProvider>
    </CartProvider>
    </SpinnerProvider>,
);

