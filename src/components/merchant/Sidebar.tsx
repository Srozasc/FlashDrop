import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/comercio/dashboard' },
  { icon: Package, label: 'Productos', href: '/comercio/products' },
  { icon: ShoppingBag, label: 'Pedidos', href: '/comercio/orders' },
  { icon: BarChart3, label: 'Reportes', href: '/comercio/reports' },
  { icon: Settings, label: 'Configuración', href: '/comercio/settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#121212] text-white flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-[#FFC107]">Flash Drop</h1>
        <span className="ml-2 text-xs text-gray-400 border border-gray-700 rounded px-1.5 py-0.5">Comercio</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-3 rounded-lg transition-colors group",
                isActive 
                  ? "bg-[#FFC107] text-black font-medium" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center w-full px-3 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
