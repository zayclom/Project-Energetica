import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin';
import Products from './pages/Products';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import AdminIcon from './components/AdminIcon';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { isAdmin, loading } = useAuth();
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('AppContent - isAdmin:', isAdmin);
    console.log('AppContent - loading:', loading);
  }, [isAdmin, loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/test');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {isAdmin && <AdminIcon />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;