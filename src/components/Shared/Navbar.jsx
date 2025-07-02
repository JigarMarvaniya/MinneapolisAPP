import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-yellow-400 border-b-4 border-black text-black p-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
        <span className="text-3xl">🚕</span> Harmony Ride
      </Link>
      <div>
        {user ? (
          <>
            <span className="mr-4 capitalize font-semibold">{user.type}: {user.username}</span>
            <button onClick={logout} className="bg-black text-yellow-400 px-3 py-1 rounded shadow hover:bg-gray-800 hover:text-white">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-3 font-semibold hover:text-blue-800">Login</Link>
            <Link to="/signup" className="font-semibold hover:text-blue-800">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
