const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'http://localhost:5173',  // Vite dev server
            'http://127.0.0.1:5173'   // Vite dev server alternative URL
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Origin blocked:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['set-cookie']
}));

app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: false, // Set to false for development
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Enhanced debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length) {
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) sanitizedBody.password = '[HIDDEN]';
        console.log('Body:', sanitizedBody);
    }
    next();
});

// More detailed error logging middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        message: 'An error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to MongoDB.');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Add connection error handler
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

// Add disconnection handler
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orders');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Session check endpoint
app.get('/api/auth/check', (req, res) => {
    console.log('Session check:', req.session);
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

const PORT = 5001;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});

module.exports = app; 