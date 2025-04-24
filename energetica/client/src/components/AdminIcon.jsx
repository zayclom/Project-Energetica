import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin-icon.css';

function AdminIcon() {
    console.log('AdminIcon component rendered');
    return (
        <Link to="/admin" className="admin-icon-container">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="admin-icon"
            >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="admin-tooltip">Admin Dashboard</span>
        </Link>
    );
}

export default AdminIcon; 