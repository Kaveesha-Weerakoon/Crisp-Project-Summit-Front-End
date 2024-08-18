import React, { useState, useEffect } from 'react';
import './Navbar.scss';
import logo from './images/Logo.png'; // Adjust path as per your project structure
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        // Handle decoding errors
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.replace('/');
    // Additional logout logic
  };

  return (
    <div className='Navbar'>
      <img src={logo} alt="Logo" />
      <h1>Crisp</h1>
      <div className="cont">
        <Link to="/"><p>Categories</p></Link>
        <Link to="/products"><p>Products</p></Link>
      </div>
      <div className='logcomp'>
        {user ? (
          <div className="user-details">
          
            <p>{user.name}</p>
            <div className="div">
                <Link to="/carts"><button className='cart'>My Carts</button></Link>
                <button className='logoutButton' onClick={handleLogout}>Logout</button>
            </div>
       
          </div>
        ) : (
          <>
            <Link to="/login"><button className='signInButton'>Sign In</button></Link>
            <Link to="/register"><button className='signUpButton'>Sign Up</button></Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
