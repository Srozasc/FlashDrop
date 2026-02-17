import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
            placeholder="Buscar..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-sm font-medium text-gray-900">Mi Comercio</span>
            <span className="text-xs text-gray-500">Comercio Verificado</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
