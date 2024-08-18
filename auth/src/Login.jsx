import React, { useState } from 'react';
import axios from 'axios';
import './Login.scss'; // Assuming you have SCSS styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        username,
        password,
      });
      console.log('Login successful:', response.data);

      // Save token to local storage
      localStorage.setItem('token', response.data.token);

      // Handle successful login (e.g., redirect to dashboard)
      // Replace '/dashboard' with your actual redirect path
      window.location.replace('/');
      
      setError('');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className='Login'>
      <form onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
