import React from 'react';
import AppRoutes from './routes';
import Navbar from './components/Shared/Navbar';

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto pt-10">
        <AppRoutes />
      </main>
    </div>
  );
}
