import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRides } from '../../contexts/RideContext';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { rides, bookRide, refresh } = useRides();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [hasAlcohol, setHasAlcohol] = useState(false);
  const [hasDog, setHasDog] = useState(false);
  const [poll, setPoll] = useState(0);

  const myRides = rides.filter(r => r.customer.username === user.username).sort((a, b) => b.id - a.id);

  React.useEffect(() => {
    const interval = setInterval(() => {
      refresh();
      setPoll(p => p + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBook = e => {
    e.preventDefault();
    if (!from || !to) {
      setMessage('Enter both pickup and drop locations.');
      return;
    }
    bookRide(user, from, to, hasAlcohol, hasDog);
    setMessage('Ride booked! Wait for a driver to accept.');
    setFrom('');
    setTo('');
    setHasAlcohol(false);
    setHasDog(false);
  };

  return (
    <div>
      <div className="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-yellow-400 max-w-xl mx-auto mt-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-yellow-400 text-3xl">🚕</span> Book a Ride
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleBook}>
          <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Pickup location" className="border rounded p-2" />
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="Drop location" className="border rounded p-2" />
          <label className="flex gap-2 items-center font-semibold">
            <input type="checkbox" checked={hasAlcohol} onChange={e => setHasAlcohol(e.target.checked)} /> Carrying alcohol
          </label>
          <label className="flex gap-2 items-center font-semibold">
            <input type="checkbox" checked={hasDog} onChange={e => setHasDog(e.target.checked)} /> Carrying pet dog
          </label>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded shadow-lg transition-colors">Book Ride</button>
        </form>
        {message && <div className="mt-2 text-green-600">{message}</div>}
      </div>
      <div className="max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">My Rides <span className="text-yellow-400 text-xl">🚕</span></h3>
        <table className="w-full bg-white rounded-2xl shadow overflow-hidden text-sm">
          <thead className="bg-yellow-100">
            <tr>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Status</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Alcohol</th>
              <th className="p-3">Dog</th>
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
                <td className="p-2">{ride.driver ? ride.driver.username : '—'}</td>
                <td className="p-2">{ride.hasAlcohol ? "Yes" : "No"}</td>
                <td className="p-2">{ride.hasDog ? "Yes" : "No"}</td>
              </tr>
            ))}
            {!myRides.length && (
              <tr><td colSpan={6} className="text-center p-4">No rides yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
