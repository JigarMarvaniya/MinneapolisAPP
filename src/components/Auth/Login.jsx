import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState('customer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (login(type, username, password)) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded">
          <option value="customer">Customer</option>
          <option value="driver">Driver</option>
        </select>
        <input type="text" placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" />
        <button className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-900">Login</button>
      </form>
    </div>
  );
}
