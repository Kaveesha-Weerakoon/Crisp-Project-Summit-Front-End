import React, { useEffect, useState } from 'react';
import './ProductsCategory.scss'; // Ensure you have the appropriate CSS file
import axios from 'axios'; // Import axios
import { useParams } from 'react-router-dom';
import CartModal from './CartModal'; // Import CartModal
import { useNavigate } from 'react-router-dom';

const ProductsCategory = () => {
  const { id ,name} = useParams(); // Get the categoryId from the URL
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // Track the total number of pages
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate=useNavigate();
  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/products/category/${categoryId}`);
      console.log(response.data)
      setCategoryName(response.data.name);
    } catch (error) {
      console.error('Error fetching category name:', error);
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

  const fetchProductsByCategory = async (categoryId, page = 0, size =8) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/products/category/${categoryId}?page=${page}&size=${size}`);
      setProducts(response.data.content); // Assuming response.data has a 'content' field
      setTotalPages(response.data.totalPages); // Assuming response.data has a 'totalPages' field
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCategoryName(id); // Fetch the category name
      fetchProductsByCategory(id, currentPage); // Fetch the products for the current page
    }
  }, [id, currentPage]); // Fetch products when the category ID or currentPage changes

  return (
    <div className='ProductsCategory'>
      <div className="top">
        <h2>{name}</h2>
      </div>
      <div className="bottom">
        {products.length === 0 && <div>No Products</div>}
        {products.length > 0 && products.map(product => (
          <ProductCard
            key={product.id}
            name={product.name}
            photoUrl={product.photoUrl}
            price={product.price}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => {
            const newPage = currentPage - 1;
            if (newPage >= 0) {
              setCurrentPage(newPage);
            }
          }}
          disabled={currentPage === 0}
        >
          &laquo;
        </button>
        {[...Array(totalPages).keys()].map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? 'active' : ''}
            disabled={currentPage === page}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() => {
            const newPage = currentPage + 1;
            if (newPage < totalPages) {
              setCurrentPage(newPage);
            }
          }}
          disabled={currentPage === totalPages - 1}
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
export default ProductsCategory;
