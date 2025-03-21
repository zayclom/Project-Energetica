// Cart functionality
let cart = [];

// Load cart on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  loadCart();
  updateCartDisplay();
});

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('energeticaCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('energeticaCart', JSON.stringify(cart));
}

// Update cart display
function updateCartDisplay() {
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const cartSummary = document.querySelector('.cart-summary');
  const cartTotalAmount = document.getElementById('cart-total-amount');
  
  // Clear current display
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    // Show empty cart message
    emptyCartMessage.style.display = 'block';
    cartItemsContainer.style.display = 'none';
    cartSummary.style.display = 'none';
    return;
  }
  
  // Hide empty cart message and show items
  emptyCartMessage.style.display = 'none';
  cartItemsContainer.style.display = 'block';
  cartSummary.style.display = 'flex';
  
  // Calculate total price
  let totalPrice = 0;
  
  // Display each cart item
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image" 
           onerror="this.onerror=null; this.src='images/placeholder.png';">
      
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>${item.caffeine}mg caffeine • ${item.servingSize}</p>
      </div>
      
      <div class="quantity-control">
        <button class="quantity-btn decrement" data-index="${index}">-</button>
        <input type="number" min="1" value="${item.quantity}" class="quantity-value" data-index="${index}">
        <button class="quantity-btn increment" data-index="${index}">+</button>
      </div>
      
      <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
      
      <button class="remove-btn" data-index="${index}">×</button>
    `;
    
    cartItemsContainer.appendChild(cartItemElement);
  });
  
  // Update total price display
  cartTotalAmount.textContent = `$${totalPrice.toFixed(2)}`;
  
  // Add event listeners for quantity controls and remove buttons
  addCartEventListeners();
}

// Add event listeners for cart controls
function addCartEventListeners() {
  // Increment quantity
  document.querySelectorAll('.quantity-btn.increment').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      cart[index].quantity++;
      saveCart();
      updateCartDisplay();
    });
  });
  
  // Decrement quantity
  document.querySelectorAll('.quantity-btn.decrement').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart();
        updateCartDisplay();
      }
    });
  });
  
  // Quantity input
  document.querySelectorAll('.quantity-value').forEach(input => {
    input.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      const newQuantity = parseInt(e.target.value);
      
      if (newQuantity >= 1) {
        cart[index].quantity = newQuantity;
      } else {
        e.target.value = 1;
        cart[index].quantity = 1;
      }
      
      saveCart();
      updateCartDisplay();
    });
  });
  
  // Remove item
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      cart.splice(index, 1);
      saveCart();
      updateCartDisplay();
    });
  });
  
  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
      // Save cart before navigating
      saveCart();
      window.location.href = 'checkout.html';
    } else {
      alert('Your cart is empty!');
    }
  });
}

// Add to cart function (to be called from products page)
function addToCart(product) {
  // Check if product already exists in cart
  const existingProduct = cart.find(item => item.id === product.id);
  
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  saveCart();
  
  // Optional: Show a confirmation message
  alert(`${product.name} added to your cart!`);
} 