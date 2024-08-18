import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.scss';

const Cart = () => {
  const { cartId } = useParams(); // Get cartId from URL
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await axios.get(`http://localhost:4000/api/cart/getcart/${cartId}`);
        setCart(response.data.cart); // Assume response contains cart details
        console.log(response.data.cart);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [cartId]);

  const handleDeleteCart = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/delete-cart/${cartId}`);
      navigate('/carts'); // Redirect to the list of carts after deletion
    } catch (error) {
      console.error('Error deleting cart:', error);
      setError('Failed to delete cart');
    }
  };

  const deleteProductByID = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/delete-cartproduct/${productId}`);
      setCart(cart.filter((product) => product.id !== productId)); // Update the cart state after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="Cart">
      <div className="cart">
        <h2>Cart Details</h2>
        {cart ? (
          <div>
            <h3>Cart ID: {cart.id}</h3>
            <button className="delete-button" onClick={handleDeleteCart}>Delete Cart</button>
            <h4>Products:</h4>
            {cart && cart.length > 0 ? (
              <ul>
                {cart.map((product) => (
                  <li key={product.id} className="cart-product">
                    <img src={product.photoUrl} alt={product.name} className="product-image" />
                    <div className="product-details">
                      <p><strong>Name:</strong> {product.name}</p>
                      <p><strong>Price:</strong> ${product.price}</p>
                      <p><strong>Quantity:</strong> {product.qunatity}</p>
                    </div>
                    <button onClick={() => deleteProductByID(product.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No products in this cart.</p>
            )}
          </div>
        ) : (
          <p>Cart not found.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
