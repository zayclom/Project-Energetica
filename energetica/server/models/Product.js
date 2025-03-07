const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stats: {
        caffeine: {
            type: Number,
            required: true
        },
        power: {
            type: Number,
            required: true
        }
    },
    category: {
        type: String,
        required: true,
        enum: ['drink', 'powder']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema); 