import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
      <h1 className="text-4xl font-bold text-[#FFC107]">Flash Drop</h1>
      <p className="text-xl text-gray-600">Plataforma de Delivery</p>
      <div className="flex space-x-4 mt-8">
        <Link 
          to="/admin" 
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
        >
          Ir al Panel de Administración
        </Link>
      </div>
    </div>
  );
}
