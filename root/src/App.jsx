import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route,Routes, Switch } from 'react-router-dom';
import NavBar from "navbar/Navbar";
import Category from "category/Category"; 
import Products from "products/Products";
import ProductsCategory from "products/ProductsCategory"; // Adjust based on your ModuleFederationPlugin setup
import Register from "auth/Register";
import Login from "auth/Login";
import Carts from "cart/Carts";
import Cart from "cart/Cart";

import './index.css'


const App = () => (
  <div>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Category />} />
        <Route path="/products" element={<Products />} />
        <Route path="/category/:id/:name" element={< ProductsCategory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carts" element={<Carts />} />
        <Route path="/cart/:cartId" element={<Cart />} />


      </Routes>
    </Router>
  </div>
);

const isAuthenticated = () => {
  // Check if user is authenticated (e.g., check localStorage or session)
  const token = localStorage.getItem('token');
  return !!token; // Assuming token presence means authenticated
};


const PrivateRoute = ({ element, ...props }) => {
  return isAuthenticated() ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
};
ReactDOM.render(<App />, document.getElementById('app'));
