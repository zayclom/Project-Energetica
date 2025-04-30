const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(5); // Limit to 5 most recent orders

    res.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders' 
    });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;

    // Validate required fields
    if (!orderData.userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required. Please log in to complete your order.'
      });
    }

    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.'
      });
    }

    if (!orderData.shippingDetails) {
      return res.status(400).json({
        success: false,
        message: 'Shipping details are required.'
      });
    }

    // Validate shipping details
    const requiredShippingFields = ['name', 'email', 'address', 'city', 'state', 'zip'];
    for (const field of requiredShippingFields) {
      if (!orderData.shippingDetails[field]) {
        return res.status(400).json({
          success: false,
          message: `Shipping ${field} is required.`
        });
      }
    }

    const order = new Order(orderData);
    await order.save();
    
    res.status(201).json({ 
      success: true, 
      orderId: order._id,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error creating order. Please try again.' 
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order' 
    });
  }
});

module.exports = router; 