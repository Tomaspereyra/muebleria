import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginForm from './components/loginForm';
import RegisterForm from './components/RegisterForm';
import ProductDetailPage from './pages/DetailProduct';
import AdminOrderPage from './pages/admin/order/AdminOrderPage';
import { OrderProvider } from './context/orderContext';
import { SpinnerProvider } from './context/spinnerContext';
import { initMercadoPago } from "@mercadopago/sdk-react";
import ProductPage from './pages/admin/product/ProductPage';
import EditProductPage from './pages/admin/product/EditProductPage';
import NewProductPage from './pages/admin/product/NewProductPage';
import OrderPage from './pages/OrderPage';
import AccountPage from './pages/AccountPage';
import GlobalSpinner from './components/GlobalSpinner';
import { ProductProvider } from './context/productContext';
import PrivateRoute from './components/PrivateRoute';
import ChangePasswordPage from './pages/ChangePasswordPage';
import { UserProvider } from './context/userContext';
import RecoverPasswordPage from './pages/RecoverPasswordPage';

initMercadoPago("APP_USR-7c9f1c8c-9210-4518-994e-34f89c401b06", { locale: "es-AR" });

const App = () => {
  return (
    <ProductProvider>
          <Router>
            <SpinnerProvider>
              <Header />
                <OrderProvider>
                <UserProvider> 
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/orders" element={<OrderPage />} />
                    <Route path="/my-account" element={<AccountPage />} />
                    <Route path="/change-password" element={<ChangePasswordPage />} />
                    <Route path="/recover-password" element={<RecoverPasswordPage />} />

                    <Route path="/admin/orders" element={<PrivateRoute element={<AdminOrderPage />} />} />
                    <Route path="/admin/products" element={<PrivateRoute element={<ProductPage />} />} />
                    <Route path="/admin/products/edit/:id" element={<PrivateRoute element={<EditProductPage />} />} />
                    <Route path="/admin/products/new" element={<PrivateRoute element={<NewProductPage />} />} />
                  </Routes>
                </UserProvider>
                </OrderProvider>
              <Footer />
              <GlobalSpinner />
            </SpinnerProvider>

          </Router>
          </ProductProvider>
  );
};

export default App;
