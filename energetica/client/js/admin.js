// Admin icon functionality
function createAdminIcon() {
    console.log('Creating admin icon');
    const existingIcon = document.querySelector('.admin-icon-container');
    if (existingIcon) {
        console.log('Admin icon already exists');
        return;
    }

    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) {
        console.error('Auth buttons container not found');
        return;
    }

    const iconContainer = document.createElement('div');
    iconContainer.className = 'admin-icon-container';
    iconContainer.innerHTML = `
        <a href="/admin" class="admin-icon-link">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                class="admin-icon"
            >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span class="admin-tooltip">Admin Dashboard</span>
        </a>
    `;
    authButtons.appendChild(iconContainer);
    console.log('Admin icon created successfully');
}

// Check if user is admin and show icon
async function checkAdminAndShowIcon() {
    try {
        console.log('Checking admin status...');
        const response = await fetch('http://localhost:5001/api/auth/check', {
            credentials: 'include'
        });
        const data = await response.json();
        console.log('Auth check response:', data);
        
        if (data.isAuthenticated && data.user?.isAdmin) {
            console.log('User is admin, showing icon');
            createAdminIcon();
        } else {
            console.log('User is not admin or not authenticated');
            const existingIcon = document.querySelector('.admin-icon-container');
            if (existingIcon) {
                existingIcon.remove();
            }
        }
    } catch (error) {
        console.error('Admin check failed:', error);
    }
}

// Add admin icon styles
const style = document.createElement('style');
style.textContent = `
    .admin-icon-container {
        display: inline-block;
        margin-left: 10px;
        vertical-align: middle;
    }

    .admin-icon-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: #007bff;
        border-radius: 50%;
        color: white;
        text-decoration: none;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        position: relative;
    }

    .admin-icon-link:hover {
        background-color: #0056b3;
        transform: scale(1.1);
    }

    .admin-icon {
        width: 20px;
        height: 20px;
    }

    .admin-tooltip {
        position: absolute;
        right: 50px;
        top: 50%;
        transform: translateY(-50%);
        background-color: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 14px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        white-space: nowrap;
        z-index: 1000;
    }

    .admin-icon-link:hover .admin-tooltip {
        opacity: 1;
        visibility: visible;
    }
`;
document.head.appendChild(style);

// Check admin status when page loads
document.addEventListener('DOMContentLoaded', checkAdminAndShowIcon);

// Also check admin status when auth status changes
document.addEventListener('authStatusChanged', checkAdminAndShowIcon); 