import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import contactApi from '../services/contactApi';

function FindContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setMessage('');
    
    try {
      const response = await api.get('/users');
      const filtered = response.data.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      
      if (filtered.length === 0) {
        setMessage('No users found');
      }
    } catch (error) {
      setMessage('Error searching users');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await contactApi.sendRequest(userId);
      alert('Request sent successfully!');
      setSearchResults(searchResults.filter(u => u.id !== userId));
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-800">Find Contacts</h1>
            <Link to="/chat" className="text-blue-600 hover:underline">
              ← Back to Chat
            </Link>
          </div>
          <p className="text-gray-600">Search for users to connect with</p>
        </div>

        <Link
          to="/requests"
          className="block mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">View Pending Requests</h3>
              <p className="text-sm text-gray-600">See who wants to connect with you</p>
            </div>
            <span className="text-2xl">→</span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {message && (
          <p className="text-center text-gray-600 mb-4">{message}</p>
        )}

        <div className="space-y-3">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleSendRequest(user.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Send Request
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FindContactsPage;