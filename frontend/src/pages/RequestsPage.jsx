import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import contactApi from '../services/contactApi';

function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await contactApi.getPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await contactApi.acceptRequest(requestId);
      alert('Request accepted!');
      fetchRequests();
    } catch (error) {
      alert('Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await contactApi.rejectRequest(requestId);
      alert('Request rejected!');
      fetchRequests();
    } catch (error) {
      alert('Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Contact Requests</h1>
            <Link to="/find-contacts" className="text-blue-600 hover:underline text-sm font-medium">
              ← Back
            </Link>
          </div>
          <p className="text-gray-600 text-sm">
            {requests.length} {requests.length === 1 ? 'pending request' : 'pending requests'}
          </p>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📭</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">No pending requests</p>
              <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {request.sender.username.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                      {request.sender.username}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{request.sender.email}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:opacity-90 font-medium text-sm transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:border-red-400 hover:text-red-600 font-medium text-sm transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestsPage;