import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold tracking-wide">
        🚖 Harmony Ride
      </Link>
      <div>
        {user ? (
          <>
            <span className="mr-4 capitalize">{user.type}: {user.username}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-3">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
