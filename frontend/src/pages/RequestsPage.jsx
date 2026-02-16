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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-800">Pending Requests</h1>
            <Link to="/find-contacts" className="text-blue-600 hover:underline">
              ← Back
            </Link>
          </div>
          <p className="text-gray-600">
            {requests.length} {requests.length === 1 ? 'request' : 'requests'} waiting
          </p>
        </div>

        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No pending requests</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {request.sender.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {request.sender.username}
                      </h3>
                      <p className="text-sm text-gray-500">{request.sender.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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