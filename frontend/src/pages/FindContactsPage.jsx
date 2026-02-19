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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Find Contacts</h1>
            <Link to="/chat" className="text-blue-600 hover:underline text-sm font-medium">
              ← Back to Chat
            </Link>
          </div>
          <p className="text-gray-600 text-sm">Search for users and send contact requests</p>
        </div>

        {/* Requests Link Card */}
        <Link
          to="/requests"
          className="block mb-8 bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">View Pending Requests</h3>
              <p className="text-sm text-gray-600">See who wants to connect with you</p>
            </div>
            <span className="text-2xl text-gray-400">→</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username..."
              className="flex-1 px-5 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-medium text-sm transition-all ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 hover:shadow-lg'
              }`}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center text-gray-600 mb-6 text-sm">{message}</p>
        )}

        {/* Search Results Grid */}
        <div className="grid grid-cols-1 gap-3">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{user.username}</h3>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                
                {/* Send Button */}
                <button
                  onClick={() => handleSendRequest(user.id)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 font-medium text-sm transition-all flex-shrink-0"
                >
                  Send Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FindContactsPage;