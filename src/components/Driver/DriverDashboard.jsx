import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRides } from '../../contexts/RideContext';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { rides, assignDriver, updateRideStatus, refresh } = useRides();
  const [online, setOnline] = useState(true);
  const [poll, setPoll] = useState(0);

  const pendingRides = rides.filter(r => !r.driver && r.status === 'pending');
  const myRides = rides.filter(r => r.driver && r.driver.username === user.username);

  React.useEffect(() => {
    const interval = setInterval(() => {
      refresh();
      setPoll(p => p + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = id => {
    assignDriver(id, user);
  };

  const handleStatus = (id, status) => {
    updateRideStatus(id, status);
  };

  return (
    <div>
      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto mt-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl font-bold">Driver Dashboard</span>
          <label className="flex items-center gap-2 ml-auto">
            <input type="checkbox" checked={online} onChange={() => setOnline(o => !o)} />
            <span className="text-sm">{online ? 'Online' : 'Offline'}</span>
          </label>
        </div>
        {online && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Available Rides</h3>
            <table className="w-full mb-4">
              <thead>
                <tr>
                  <th className="p-2">From</th>
                  <th className="p-2">To</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRides.map(ride => (
                  <tr key={ride.id}>
                    <td className="p-2">{ride.from}</td>
                    <td className="p-2">{ride.to}</td>
                    <td className="p-2">
                      <button onClick={() => handleAccept(ride.id)} className="bg-green-700 text-white px-3 py-1 rounded">
                        Accept
                      </button>
                    </td>
                  </tr>
                ))}
                {!pendingRides.length && (
                  <tr><td colSpan={3} className="text-center p-3">No available rides.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-semibold mb-2">My Rides</h3>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myRides.map(ride => (
              <tr key={ride.id}>
                <td className="p-2">{ride.from}</td>
                <td className="p-2">{ride.to}</td>
                <td className="p-2 capitalize">{ride.status}</td>
                <td className="p-2 flex gap-2">
                  {ride.status === 'accepted' && (
                    <button onClick={() => handleStatus(ride.id, 'arrived')} className="bg-blue-700 text-white px-2 py-1 rounded">Arrived</button>
                  )}
                  {ride.status === 'arrived' && (
                    <button onClick={() => handleStatus(ride.id, 'ongoing')} className="bg-yellow-700 text-white px-2 py-1 rounded">Start</button>
                  )}
                  {ride.status === 'ongoing' && (
                    <button onClick={() => handleStatus(ride.id, 'completed')} className="bg-green-700 text-white px-2 py-1 rounded">Complete</button>
                  )}
                </td>
              </tr>
            ))}
            {!myRides.length && (
              <tr><td colSpan={4} className="text-center p-4">No rides yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
