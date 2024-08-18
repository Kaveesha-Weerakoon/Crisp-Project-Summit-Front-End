import React, { useEffect, useState } from 'react';

import './Products.scss'; // Ensure you have a similar CSS file
import axios from 'axios'; // Import axios
import CartModal from './CartModal'; // Import CartModal
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate=useNavigate();

  const userId = "121"; // Assuming you have the user ID from context or props

  const fetchProducts = async (page = 0, size = 8) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/products?page=${page}&size=${size}`);
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByName = async (page = 0, size = 8, searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await axios.get(`http://localhost:4000/api/products/search?page=${page}&size=${size}&name=${encodedQuery}`);
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products by name:', error);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchProductsByName(currentPage, 10, searchQuery);
    } else {
      fetchProducts(currentPage);
    }
  }, [currentPage, searchQuery]);

  const handleSearch = () => {
    fetchProductsByName(0, 10, searchQuery);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token');
    if (token) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
   
    else {
      // User is not logged in
      navigate("/login");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className='Products2'>
      <div className="top">
        <h2>All Products</h2>
        <div className="cont">
          <input
            type="text"
            placeholder='Search for products'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="bottom">
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {products.length === 0 && !loading && !error && <div>No Products</div>}
        {products.length > 0 && products.map(product => (
          <ProductCard
            key={product.id}
            name={product.name}
            photoUrl={product.photoUrl}
            price={product.price}
            onAddToCart={() => handleAddToCart(product)} // Pass entire product object
          />
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0 || loading}
        >
          &laquo;
        </button>
        {[...Array(totalPages).keys()].map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
            disabled={loading}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || loading}
        >
          &raquo;
        </button>
      </div>
      {isModalOpen && selectedProduct && (
        <CartModal
          isOpen={isModalOpen}
          onClose={closeModal}
          userId={"userId"} // Pass the user ID
          product={selectedProduct} // Pass the selected product object
        />
      )}
    </div>
  );
};

const ProductCard = ({ name, photoUrl, price, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={photoUrl} alt={name} />
      <h1>{name}</h1>
      <h2>Rs <span>{price}</span></h2>
      <button onClick={onAddToCart}>Add to Cart</button>
    </div>
  );
};

export default Products;
