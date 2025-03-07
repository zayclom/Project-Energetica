const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed initial products
router.post('/seed', async (req, res) => {
    try {
        // First, clear existing products
        await Product.deleteMany({});

        const initialProducts = [
            {
                name: 'VOLTAGE SURGE',
                description: 'Electric blue energy drink with electrifying citrus flavor and enhanced focus formula.',
                price: 3.99,
                image: 'https://images.unsplash.com/photo-1621502863666-e2b78bb61646?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                stats: {
                    caffeine: 200,
                    power: 95
                },
                category: 'drink'
            },
            {
                name: 'PLASMA PUNCH',
                description: 'Explosive fruit punch blend with added electrolytes and B-vitamins.',
                price: 3.99,
                image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                stats: {
                    caffeine: 180,
                    power: 90
                },
                category: 'drink'
            },
            {
                name: 'QUANTUM QUENCH',
                description: 'Zero-sugar energy drink with quantum-infused berry blast flavor.',
                price: 4.29,
                image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                stats: {
                    caffeine: 160,
                    power: 88
                },
                category: 'drink'
            },
            {
                name: 'POWER CRYSTALS',
                description: 'Premium energy powder with crystalline caffeine and taurine blend.',
                price: 29.99,
                image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                stats: {
                    caffeine: 250,
                    power: 98
                },
                category: 'powder'
            }
        ];

        const products = await Product.insertMany(initialProducts);
        res.status(201).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 