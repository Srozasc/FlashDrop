import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Bike,
  ShoppingBag,
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Usuarios', href: '/admin/users' },
  { icon: Store, label: 'Comercios', href: '/admin/merchants' },
  { icon: Bike, label: 'Repartidores', href: '/admin/drivers' },
  { icon: ShoppingBag, label: 'Pedidos', href: '/admin/orders' },
  { icon: Settings, label: 'Configuración', href: '/admin/settings' },
];

export function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#121212] text-white flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-[#FFC107]">Flash Drop Admin</h1>
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
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
