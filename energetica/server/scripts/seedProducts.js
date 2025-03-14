require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const sampleProducts = require('../data/sampleProducts');

if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the environment variables');
    process.exit(1);
}

async function seedProducts() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB');

        // Clear existing products
        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Successfully cleared existing products');

        // Insert sample products
        console.log('Inserting sample products...');
        const result = await Product.insertMany(sampleProducts);
        console.log(`Successfully seeded ${result.length} products`);

        // Log the seeded products
        console.log('Seeded products:');
        result.forEach(product => {
            console.log(`- ${product.name} (${product.category})`);
        });

    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeding
seedProducts(); 