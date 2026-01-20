import { useState, useEffect } from 'react';
import api from './services/api';

function App() {
  const [status, setStatus] = useState('Checking connection...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/health');
        setStatus('Connected to backend! Time: ' + new Date(response.data.timestamp).toLocaleTimeString());
      } catch (error) {
        setStatus('Cannot connect to backend - Make sure it is running');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 text-center">
          Chat App
        </h1>
        <div className="bg-gray-100 p-4 rounded-lg">
          {loading ? (
            <p className="text-gray-600 text-center">Testing connection...</p>
          ) : (
            <p className="text-gray-800 text-center font-medium">{status}</p>
          )}
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          Setup Complete
        </div>
      </div>
    </div>
  );
}

export default App;