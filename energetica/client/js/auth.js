// Auth state management
let currentUser = null;
let lastAuthCheck = 0;
const AUTH_CHECK_INTERVAL = 5000; // 5 seconds minimum between checks
let isCheckingAuth = false;
let authCheckInitialized = false;
let authCheckPromise = null;

// Initialize auth system
function initializeAuth() {
    // Only initialize once
    if (window.authInitialized) {
        return;
    }
    window.authInitialized = true;

    // Check if we have a valid user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            currentUser = user;
            updateUIForLoggedInUser();
            updateButtonsVisibility(true);
            dispatchAuthStatusChanged();
        } catch (e) {
            console.error('Error parsing stored user:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', performInitialAuthCheck);
    } else {
        performInitialAuthCheck();
    }
}

// Perform the initial auth check
function performInitialAuthCheck() {
    if (!authCheckInitialized) {
        console.log('Performing initial auth check');
        authCheckInitialized = true;
        checkAuthStatus();
    }
}

// Check if user is logged in
async function checkAuthStatus() {
    console.log('Auth check requested');
    
    // If there's already a check in progress, return its promise
    if (authCheckPromise) {
        console.log('Returning existing auth check promise');
        return authCheckPromise;
    }

    // Prevent multiple simultaneous checks
    if (isCheckingAuth) {
        console.log('Auth check already in progress, skipping');
        return;
    }

    // Check if we've checked recently
    const now = Date.now();
    if (now - lastAuthCheck < AUTH_CHECK_INTERVAL) {
        console.log('Auth check skipped - too recent');
        return;
    }

    isCheckingAuth = true;
    lastAuthCheck = now;

    // Create a new promise for this auth check
    authCheckPromise = (async () => {
        try {
            console.log('Starting auth check');
            // First try to get user from localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                console.log('Found stored user');
                currentUser = JSON.parse(storedUser);
                updateUIForLoggedInUser();
                updateButtonsVisibility(true);
                dispatchAuthStatusChanged();
            }

            // Then verify with server
            console.log('Verifying with server');
            const response = await fetch('http://localhost:5001/api/auth/check', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.isAuthenticated) {
                console.log('Server confirmed authentication');
                currentUser = data.user;
                localStorage.setItem('user', JSON.stringify(data.user));
                updateUIForLoggedInUser();
                updateButtonsVisibility(true);
                dispatchAuthStatusChanged();
            } else {
                console.log('Server reported not authenticated');
                currentUser = null;
                localStorage.removeItem('user');
                updateUIForLoggedOutUser();
                updateButtonsVisibility(false);
                dispatchAuthStatusChanged();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            if (!currentUser) {
                updateUIForLoggedOutUser();
                updateButtonsVisibility(false);
                dispatchAuthStatusChanged();
            }
        } finally {
            isCheckingAuth = false;
            authCheckPromise = null;
        }
    })();

    return authCheckPromise;
}

// Dispatch auth status changed event
function dispatchAuthStatusChanged() {
    const event = new CustomEvent('authStatusChanged', {
        detail: { user: currentUser }
    });
    document.dispatchEvent(event);
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

// Initialize auth system
initializeAuth(); 