import { useState, useEffect } from 'react';
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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Project Energetica</h1>
      <p>Server Response: {message}</p>
    </div>
  );
}

export default App; 