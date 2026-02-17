import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/merchant/Sidebar';
import { Header } from '@/components/merchant/Header';

export default function MerchantLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 mt-16 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
