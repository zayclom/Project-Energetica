import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

function Admin() {
    const { login, isAdmin } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (!success) {
            setError('Invalid credentials. Please try again.');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchProducts();
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <div className="admin-login-container">
                <h2>Admin Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin} className="admin-login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="admin123"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h2>Product Management</h2>
            <div className="products-list">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Admin; 