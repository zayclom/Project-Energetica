// Get order ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('id');

// Load order details when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (orderId) {
        loadOrderDetails(orderId);
    } else {
        showError('No order ID provided');
    }
});

// Function to load order details from the server
async function loadOrderDetails(orderId) {
    try {
        const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch order details');
        }

        displayOrderDetails(data.order);
    } catch (error) {
        console.error('Error loading order details:', error);
        showError('Failed to load order details. Please try again later.');
    }
}

// Function to display order details
function displayOrderDetails(order) {
    // Update order header information
    document.getElementById('order-id').textContent = `Order #${order._id}`;
    document.getElementById('order-date').textContent = `Date: ${new Date(order.createdAt).toLocaleDateString()}`;
    document.getElementById('order-status').textContent = `Status: ${order.status}`;
    document.getElementById('total-items').textContent = order.items.length;
    document.getElementById('total-amount').textContent = `$${order.total.toFixed(2)}`;

    // Display order items
    const itemsList = document.getElementById('order-items-list');
    itemsList.innerHTML = order.items.map(item => `
        <div class="order-item">
            <div class="order-item-info">
                <h5>${item.name}</h5>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price.toFixed(2)} each</p>
            </div>
            <div class="order-item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
}

// Function to show error message
function showError(message) {
    const container = document.querySelector('.order-details-container');
    container.innerHTML = `
        <div class="error-message">
            <h2 class="cyber-title">Error</h2>
            <p>${message}</p>
            <button class="cyber-button" onclick="window.location.href='profile.html'">Back to Profile</button>
        </div>
    `;
}

// Function to print order
function printOrder() {
    window.print();
} 