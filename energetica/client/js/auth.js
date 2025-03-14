// Auth state management
let currentUser = null;

// Check if user is logged in
async function checkAuthStatus() {
    try {
        const response = await fetch('http://localhost:5001/api/auth/check', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.isAuthenticated) {
            currentUser = data.user;
            updateUIForLoggedInUser();
            updateButtonsVisibility(true);
        } else {
            currentUser = null;
            updateUIForLoggedOutUser();
            updateButtonsVisibility(false);
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        updateUIForLoggedOutUser();
        updateButtonsVisibility(false);
    }
}

// Update UI for logged-in user
function updateUIForLoggedInUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <span class="user-welcome">Welcome, ${currentUser.username}!</span>
            <button class="cyber-button" onclick="logout()">Logout</button>
        `;
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