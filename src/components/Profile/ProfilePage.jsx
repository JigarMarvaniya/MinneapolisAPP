import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '');
  const [msg, setMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    // Update user in localStorage (MVP style)
    const updated = {
      ...user,
      displayName,
      photoUrl
    };
    localStorage.setItem('user', JSON.stringify(updated));
    // Trick: call login again to refresh context
    login(user.type, user.username, ''); // password ignored
    setMsg('Profile updated!');
  };

  return (
    <div className="max-w-xl mx-auto bg-white mt-12 p-8 rounded-2xl shadow-lg border-t-8 border-yellow-400">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-yellow-400 text-3xl">👤</span> My Profile
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSave}>
        <div>
          <label className="block font-semibold mb-1">Username:</label>
          <input value={user.username} disabled className="border rounded p-2 bg-gray-100 w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Account Type:</label>
          <input value={user.type} disabled className="border rounded p-2 bg-gray-100 w-full capitalize" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Display Name:</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Photo URL:</label>
          <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="border rounded p-2 w-full" />
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded shadow-lg transition-colors mt-2">
          Save Profile
        </button>
        {msg && <div className="text-green-600">{msg}</div>}
      </form>
      {photoUrl && (
        <div className="mt-6 text-center">
          <img src={photoUrl} alt="Profile" className="inline w-24 h-24 rounded-full border-4 border-yellow-400 object-cover" />
          <div className="font-semibold mt-2">{displayName}</div>
        </div>
      )}
    </div>
  );
}
