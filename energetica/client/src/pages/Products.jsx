import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/header.css';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsSidebarOpen(false);
    };

    if (loading) return (
        <div className="splash-container">
            <div className="loading">Loading Arsenal...</div>
        </div>
    );
    
    if (error) return (
        <div className="splash-container">
            <div className="error">{error}</div>
        </div>
    );

    return (
        <div className="splash-container">
            {/* Header */}
            <header className="header">
                <button className="menu-button" onClick={toggleSidebar}>
                    ☰
                </button>
                <h1 className="header-title">ENERGETICA ARSENAL</h1>
            </header>

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <ul className="menu-items">
                    <li className="menu-item" onClick={() => handleNavigation('/')}>Home</li>
                    <li className="menu-item" onClick={() => handleNavigation('/products')}>Products</li>
                    <li className="menu-item">About Us</li>
                    <li className="menu-item">Contact</li>
                    <li className="menu-item">Login</li>
                    <li className="menu-item" onClick={() => handleNavigation('/register')}>Register</li>
                </ul>
            </div>

            {/* Sidebar Overlay */}
            <div 
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            <div className="lightning">
                <div className="bolt" style={{left: "20%", animationDelay: "0.2s"}}></div>
                <div className="bolt" style={{left: "40%", animationDelay: "0.5s"}}></div>
                <div className="bolt" style={{left: "60%", animationDelay: "0.8s"}}></div>
                <div className="bolt" style={{left: "80%", animationDelay: "1.1s"}}></div>
            </div>
            
            <div className="products-content">
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product._id} className="product-card">
                            <div className="product-glow"></div>
                            <h2 className="product-title">{product.name}</h2>
                            <div className="product-image-container">
                                <img src={product.image} alt={product.name} className="product-image" />
                            </div>
                            <p className="product-description">{product.description}</p>
                            <div className="product-stats">
                                <span className="stat">CAFFEINE: {product.stats.caffeine}mg</span>
                                <span className="stat">POWER: {product.stats.power}/100</span>
                            </div>
                            <p className="product-price">₡{product.price.toFixed(2)}</p>
                            <button className="cyber-button">ADD TO ARSENAL</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Products; 