import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRides } from '../../contexts/RideContext';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { rides, assignDriver, updateRideStatus, refresh } = useRides();
  const [online, setOnline] = useState(true);
  const [acceptsAlcohol, setAcceptsAlcohol] = useState(true);
  const [acceptsDog, setAcceptsDog] = useState(true);
  const [poll, setPoll] = useState(0);

  const pendingRides = rides.filter(r =>
    !r.driver &&
    r.status === 'pending' &&
    (acceptsAlcohol || !r.hasAlcohol) &&
    (acceptsDog || !r.hasDog)
  );

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
      <div className="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-yellow-400 max-w-xl mx-auto mt-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"><span className="text-yellow-400 text-3xl">🚖</span>Driver Dashboard</span>
          <label className="flex items-center gap-2 ml-auto">
            <input type="checkbox" checked={online} onChange={() => setOnline(o => !o)} />
            <span className="text-sm">{online ? 'Online' : 'Offline'}</span>
          </label>
        </div>
        <div className="flex gap-4 mt-2 mb-2">
          <label>
            <input type="checkbox" checked={acceptsAlcohol} onChange={() => setAcceptsAlcohol(a => !a)} />
            <span className="ml-1 text-sm">Accept alcohol</span>
          </label>
          <label>
            <input type="checkbox" checked={acceptsDog} onChange={() => setAcceptsDog(d => !d)} />
            <span className="ml-1 text-sm">Accept pet dog</span>
          </label>
        </div>
        {online && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Available Rides</h3>
            <table className="w-full bg-white rounded-2xl shadow overflow-hidden text-sm">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="p-3">From</th>
                  <th className="p-3">To</th>
                  <th className="p-3">Alcohol</th>
                  <th className="p-3">Dog</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRides.map(ride => (
                  <tr key={ride.id} className="odd:bg-gray-50 even:bg-white">
                    <td className="p-2">{ride.from}</td>
                    <td className="p-2">{ride.to}</td>
                    <td className="p-2">{ride.hasAlcohol ? "Yes" : "No"}</td>
                    <td className="p-2">{ride.hasDog ? "Yes" : "No"}</td>
                    <td className="p-2">
                      <button onClick={() => handleAccept(ride.id)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-3 py-1 rounded shadow transition-colors">
                        Accept
                      </button>
                    </td>
                  </tr>
                ))}
                {!pendingRides.length && (
                  <tr><td colSpan={5} className="text-center p-3">No available rides.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">My Rides <span className="text-yellow-400 text-xl">🚖</span></h3>
        <table className="w-full bg-white rounded-2xl shadow overflow-hidden text-sm">
          <thead className="bg-yellow-100">
            <tr>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myRides.map(ride => (
              <tr key={ride.id} className="odd:bg-gray-50 even:bg-white">
                <td className="p-2">{ride.from}</td>
                <td className="p-2">{ride.to}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    ride.status === 'pending' ? 'bg-gray-200 text-gray-700' :
                    ride.status === 'accepted' ? 'bg-yellow-300 text-yellow-900' :
                    ride.status === 'arrived' ? 'bg-blue-200 text-blue-800' :
                    ride.status === 'ongoing' ? 'bg-blue-500 text-white' :
                    ride.status === 'completed' ? 'bg-green-400 text-green-900' :
                    'bg-red-200 text-red-700'
                  }`}>
                    {ride.status}
                  </span>
                </td>
                <td className="p-2 flex gap-2">
                  {ride.status === 'accepted' && (
                    <button onClick={() => handleStatus(ride.id, 'arrived')} className="bg-blue-600 text-white px-2 py-1 rounded font-bold shadow hover:bg-blue-700 transition-colors">Arrived</button>
                  )}
                  {ride.status === 'arrived' && (
                    <button onClick={() => handleStatus(ride.id, 'ongoing')} className="bg-yellow-400 text-black px-2 py-1 rounded font-bold shadow hover:bg-yellow-500 transition-colors">Start</button>
                  )}
                  {ride.status === 'ongoing' && (
                    <button onClick={() => handleStatus(ride.id, 'completed')} className="bg-green-500 text-white px-2 py-1 rounded font-bold shadow hover:bg-green-700 transition-colors">Complete</button>
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
