import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correctly import jwt-decode
import './CartModal.scss'; // Ensure you have the appropriate CSS file

const CartModal = ({ isOpen, onClose, product }) => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // State for userId
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchUserIdFromToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.email); // Assuming email is used as userId
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    const fetchCarts = async () => {
      if (!userId) return; // Do not fetch carts if userId is not set

      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/cart/getcarts', {
          params: { userId }
        });
        setCarts(response.data.carts);
      } catch (error) {
        console.error('Error fetching carts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserIdFromToken();
    }

    // Fetch carts only when userId is set and modal is open
    if (userId) {
      fetchCarts();
    }
  }, [isOpen, userId]); // Re-run the effect when isOpen or userId changes

  const handleCreateCart = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/cart/create-cart', {  userId });
      const newCart = {
        cartId: response.data.cartId,
        id: response.data.cartId ,
        productId: null,
        quantity: 0
      };

      console.log(carts);
      setCarts([...carts,newCart]);
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  };

  const handleAddToCart = async (cartId) => {
    try {
      await axios.post('http://localhost:4000/api/cart/add-product', {
        userId, // Use the fetched userId
        productId: product.id,
        name: product.name,
        price: product.price,
        photoUrl: product.photoUrl,
        quantity:quantity,
        cartId: cartId
      });
      // Notify user or update state as needed
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal">
      <div className="cart-modal-content">
        <button className="close" onClick={onClose}>&times;</button>
        <h2>Select or Create a Cart</h2>
        {loading && <div>Loading...</div>}
        {!loading && (
          <>
          <div className="quantity-section">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min="1"
                step="1"
              />
            </div>
            <div className="carts-list">
              {carts.length > 0 ? (
                carts.map((cart, index) => (
                  <button
                    key={cart.id}
                    className="cart-option"
                    onClick={() => handleAddToCart(cart.id)}
                  >
                    <b>Cart ID:</b> {cart.id}
                  </button>
                ))
              ) : (
                <div>No carts available.</div>
              )}
            </div>
            <div className="create-cart">
              <button onClick={handleCreateCart}>Create New Cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
