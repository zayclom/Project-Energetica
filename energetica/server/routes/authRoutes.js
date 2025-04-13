const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Enable CORS preflight for all routes
router.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

// Register route
router.post('/register', async (req, res) => {
    console.log('Registration request received:', {
        body: req.body,
        headers: req.headers
    });

    if (!req.body) {
        console.error('No request body received');
        return res.status(400).json({ message: 'No data received' });
    }

    try {
        const { username, email, password } = req.body;

        // Log received data (excluding password)
        console.log('Processing registration for:', { username, email });

        // Validate input
        if (!username || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                message: 'All fields are required',
                missing: {
                    username: !username,
                    email: !email,
                    password: !password
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format');
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already registered:', email);
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        // Save user
        await user.save();
        console.log('User saved successfully:', { username, email });

        // Set session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        
        console.log('Session set:', req.session);

        res.status(201).json({
            message: 'Registration successful',
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password (plain text comparison)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Set session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        res.json({
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Check auth status
router.get('/check', (req, res) => {
    if (req.session.user) {
        res.json({
            isAuthenticated: true,
            user: {
                username: req.session.user.username,
                email: req.session.user.email
            }
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

module.exports = router; 