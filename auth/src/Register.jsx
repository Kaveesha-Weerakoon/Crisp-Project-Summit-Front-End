import React, { useState } from 'react';
import axios from 'axios';
import './Register.scss';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/auth/register', {
                email,
                password,
                name,
            });
            console.log('Registration successful:', response.data);
            setRegistrationSuccess(true); // Set registration success state
            setError('');
            // Clear input fields
            setEmail('');
            setPassword('');
            setName('');
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed');
        }
    };

    return (
        <div className='Register'>
            <h2>Sign Up</h2>
            {!registrationSuccess ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <button type="submit">Register</button>
                </form>
            ) : (
                <div className="success-message">
                    Registration successful!
                    {/* Optionally add a link or button for redirection */}
                </div>
            )}
        </div>
    );
};

export default Register;
