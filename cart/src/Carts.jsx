import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Carts.scss'; // Ensure you have the appropriate CSS file
import {jwtDecode}  from 'jwt-decode'; // Correctly import jwt-decode

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state
  const [user, setUser] = useState(null); // State for decoded user
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log(decoded.email);

        const fetchCarts = async (email) => {
          setLoading(true);
          setError(null); // Reset error state
          try {
            const response = await axios.get('http://localhost:4000/api/cart/getcarts', {
              params: { userId: decoded.email } // Use email as userId
            });
            const fetchedCarts = response.data.carts.map((cart, index) => ({ ...cart, index: index + 1 }));
            setCarts(fetchedCarts);
          } catch (error) {
            console.error('Error fetching carts:', error);
            setError('Failed to fetch carts'); // Set error state
          } finally {
            setLoading(false);
          }
        };

        fetchCarts(decoded.email); // Fetch carts using decoded email
      } catch (error) {
        console.error('Error decoding token:', error);
        // Handle decoding errors
      }
    }
  }, []);

  const handleDeleteCart = async (cartId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/delete-cart/${cartId}`);
      setCarts(carts.filter(cart => cart.id !== cartId));
      // Navigate to cart/id URL
    } catch (error) {
      console.error('Error deleting cart:', error);
      setError('Failed to delete cart');
    }
  };

  if (error) {
    return <div className="error">{error}</div>; // Display error message
  }

  return (
    <div className="Carts">
      <div className="carts">
        <h2>Your Carts</h2>
        {loading && <div>Loading...</div>}
        {!loading && carts.length > 0 ? (
          carts.map(cart => (
            <Cart key={cart.id} cart={cart} onDelete={() => handleDeleteCart(cart.id)} />
          ))
        ) : (
          !loading && <div>No carts available.</div>
        )}
      </div>
    </div>
  );
};

const Cart = ({ cart, onDelete }) => {
  return (
    <div className="cart">
      <Link to={`/cart/${cart.id}`} className="cart-link">
        <h3>Cart Id</h3>
        <p>{cart.id}</p>
        {/* Add other cart details here as needed */}
      </Link>
      <button className="delete-button" onClick={onDelete}>Delete</button>
    </div>
  );
};

export default Carts;
