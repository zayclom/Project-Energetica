// Auth state management
let currentUser = null;

// Check if user is logged in
async function checkAuthStatus() {
    try {
        // First try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            updateUIForLoggedInUser();
            updateButtonsVisibility(true);
        }

        // Then verify with server
        const response = await fetch('http://localhost:5001/api/auth/check', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.isAuthenticated) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
            updateUIForLoggedInUser();
            updateButtonsVisibility(true);
        } else {
            // If server says not authenticated, clear everything
            currentUser = null;
            localStorage.removeItem('user');
            updateUIForLoggedOutUser();
            updateButtonsVisibility(false);
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        // On error, keep using localStorage data if available
        if (!currentUser) {
            updateUIForLoggedOutUser();
            updateButtonsVisibility(false);
        }
    }
}

// Update UI for logged-in user
function updateUIForLoggedInUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    // Get user from currentUser instead of localStorage
    if (currentUser) {
        authButtons.innerHTML = `
            <span>Welcome, <a href="profile.html" class="username-link">${currentUser.username}</a></span>
            <button onclick="logout()" class="cyber-button">Logout</button>
        `;
    } else {
        updateUIForLoggedOutUser();
    }
}

// Update UI for logged-out user
function updateUIForLoggedOutUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="cyber-button" onclick="window.location.href='login.html'">Login</button>
            <button class="cyber-button" onclick="window.location.href='register.html'">Register</button>
        `;
    }
}

// Update visibility of login/register buttons in the main container
function updateButtonsVisibility(isLoggedIn) {
    const buttonsContainer = document.querySelector('.buttons-container');
    if (buttonsContainer) {
        const loginButton = buttonsContainer.querySelector('button[onclick="window.location.href=\'login.html\'"]');
        const registerButton = buttonsContainer.querySelector('button[onclick="window.location.href=\'register.html\'"]');
        
        if (loginButton) loginButton.style.display = isLoggedIn ? 'none' : 'inline-block';
        if (registerButton) registerButton.style.display = isLoggedIn ? 'none' : 'inline-block';
    }
}

// Login function
async function login(email, password) {
    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            updateUIForLoggedInUser();
            updateButtonsVisibility(true);
            window.location.href = 'index.html';
            return { success: true };
        } else {
            return { error: data.message };
        }
    } catch (error) {
        console.error('Login failed:', error);
        return { error: 'Login failed. Please try again.' };
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('http://localhost:5001/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            currentUser = null;
            // Clear user data from localStorage
            localStorage.removeItem('user');
            updateUIForLoggedOutUser();
            updateButtonsVisibility(false);
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// Check auth status when page loads
document.addEventListener('DOMContentLoaded', checkAuthStatus); 