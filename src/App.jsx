import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Clothes from "./pages/Clothes";
import Accessories from "./pages/Accessories";
import AuthPage from "./pages/AuthPage"; 
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import EditProduct from "./pages/EditProduct";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import FashionPreference from "./pages/FashionPreference";
import Bodymeasurement from "./pages/Bodymeasurement";
import AvatarSelection from "./pages/AvatarSelection";
import Recommendations from "./pages/Recommendations";
import ProductDetails from "./pages/ProductDetails";
//import SellerRoute from "./components/SellerRoute";
import AdminLogin from "./pages/AdminLogin";
import ARTryOn from "./pages/ARTryOn";
import { Search } from "lucide-react";

export default function App() {
  return (
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

         <Route path="/ar-tryon/:id" element={<ARTryOn />} />

        <Route path="/admin/login" element={<AdminLogin />} />
   <Route path="/orders" element={<Orders />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<SellerProducts />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/edit/:id" element={<EditProduct />} /> 
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/fashionpreference" element={<FashionPreference />} />
        <Route path="/avatarselection" element={<AvatarSelection />} />
        <Route path="/measurements" element={<Bodymeasurement/>} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/clothes" element={<Clothes />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/ar-tryon/:id" element={<ARTryOn />} />
        <Route path="/cart" element={<Cart />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />


      </Routes>
    </Router>
    </CartProvider>
  );
}
