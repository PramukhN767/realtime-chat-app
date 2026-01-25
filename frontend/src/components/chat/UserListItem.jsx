function UserListItem({ user, isSelected, onClick, messageCount }) {
  const formatLastSeen = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 transition ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user.username.charAt(0).toUpperCase()}
        </div>
        {user.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-800 truncate">{user.username}</p>
          {messageCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              {messageCount}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {user.isOnline ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`}
        </p>
      </div>
    </div>
  );
}

export default UserListItem;