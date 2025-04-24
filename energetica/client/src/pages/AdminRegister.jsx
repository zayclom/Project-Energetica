import React, { useState } from 'react';
import axios from 'axios';
import '../styles/admin-register.css';

function AdminRegister() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        adminKey: '' // Special key required for admin registration
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/admin/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                adminKey: formData.adminKey
            });

            if (response.data.success) {
                alert('Admin account created successfully!');
                // Redirect to admin login page
                window.location.href = '/admin';
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Failed to create admin account. Please check your admin key and try again.');
        }
    };

    return (
        <div className="admin-register-container">
            <h2>Create Admin Account</h2>
            <form onSubmit={handleSubmit} className="admin-register-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="adminKey">Admin Key:</label>
                    <input
                        type="password"
                        id="adminKey"
                        name="adminKey"
                        value={formData.adminKey}
                        onChange={handleChange}
                        required
                        placeholder="Enter admin registration key"
                    />
                </div>
                <button type="submit" className="register-button">Create Admin Account</button>
            </form>
        </div>
    );
}

export default AdminRegister; 