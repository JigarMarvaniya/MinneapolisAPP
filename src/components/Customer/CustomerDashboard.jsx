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
      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto mt-6">
        <h2 className="text-xl font-bold mb-3">Book a Ride</h2>
        <form className="flex flex-col gap-3" onSubmit={handleBook}>
          <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Pickup location" className="border rounded p-2" />
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="Drop location" className="border rounded p-2" />
          <label>
            <input type="checkbox" checked={hasAlcohol} onChange={e => setHasAlcohol(e.target.checked)} /> Carrying alcohol
          </label>
          <label>
            <input type="checkbox" checked={hasDog} onChange={e => setHasDog(e.target.checked)} /> Carrying pet dog
          </label>
          <button className="bg-blue-700 text-white py-2 rounded">Book</button>
        </form>
        {message && <div className="mt-2 text-green-600">{message}</div>}
      </div>
      <div className="max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-semibold mb-2">My Rides</h3>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Status</th>
              <th className="p-2">Driver</th>
              <th className="p-2">Alcohol</th>
              <th className="p-2">Dog</th>
            </tr>
          </thead>
          <tbody>
            {myRides.map(ride => (
              <tr key={ride.id}>
                <td className="p-2">{ride.from}</td>
                <td className="p-2">{ride.to}</td>
                <td className="p-2 capitalize">{ride.status}</td>
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
