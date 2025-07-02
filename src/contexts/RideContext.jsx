import React, { createContext, useContext, useState, useEffect } from 'react';

const RideContext = createContext();

export function useRides() {
  return useContext(RideContext);
}

export function RideProvider({ children }) {
  const [rides, setRides] = useState(() =>
    JSON.parse(localStorage.getItem('rides') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('rides', JSON.stringify(rides));
  }, [rides]);

  const refresh = () => setRides(JSON.parse(localStorage.getItem('rides') || '[]'));

  const bookRide = (customer, from, to) => {
    const newRide = {
      id: Date.now(),
      customer,
      driver: null,
      status: 'pending',
      from,
      to,
      history: [{ ts: Date.now(), status: 'pending' }]
    };
    setRides([...rides, newRide]);
    return newRide.id;
  };

  const assignDriver = (rideId, driver) => {
    setRides(rides =>
      rides.map(r =>
        r.id === rideId
          ? {
              ...r,
              driver,
              status: 'accepted',
              history: [...r.history, { ts: Date.now(), status: 'accepted' }]
            }
          : r
      )
    );
  };

  const updateRideStatus = (rideId, status) => {
    setRides(rides =>
      rides.map(r =>
        r.id === rideId
          ? {
              ...r,
              status,
              history: [...r.history, { ts: Date.now(), status }]
            }
          : r
      )
    );
  };

  return (
    <RideContext.Provider value={{
      rides,
      bookRide,
      assignDriver,
      updateRideStatus,
      refresh
    }}>
      {children}
    </RideContext.Provider>
  );
}
