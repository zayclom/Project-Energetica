import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import Register from './pages/Register';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/test');
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Error connecting to server');
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;