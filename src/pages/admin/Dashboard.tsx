import React, { useEffect, useState } from 'react';
import { ShoppingBag, Users, DollarSign, TrendingUp, Map as MapIcon, Shield, ChevronRight, Store, Truck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeDrivers: 0
  });

  useEffect(() => {
    async function fetchGlobalStats() {
      try {
        // Consultas paralelas para rapidez
        const [ordersRes, usersRes, driversRes] = await Promise.all([
          supabase.from('orders').select('total_amount', { count: 'exact' }),
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'repartidor')
        ]);

        const revenue = ordersRes.data?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

        setStats({
          totalOrders: ordersRes.count || 0,
          totalUsers: usersRes.count || 0,
          totalRevenue: revenue,
          activeDrivers: driversRes.count || 0
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGlobalStats();
  }, []);

  const statCards = [
    {
      label: 'Órdenes Globales',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      label: 'Usuarios Totales',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100'
    },
    {
      label: 'Ingresos Totales',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100'
    },
    {
      label: 'Repartidores',
      value: stats.activeDrivers.toLocaleString(),
      icon: Truck,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-100'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel Administrativo</h1>
          <p className="text-gray-500 font-medium">Control global de la red FlashDrop.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">Sistema Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`bg-white rounded-3xl p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-all group`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-7 h-7" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Map Placeholder with stylized UI */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between relative z-10 bg-white/80 backdrop-blur-md">
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <MapIcon className="text-primary" /> Monitoreo de Red
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">Sigue a tus repartidores y pedidos activos en tiempo real.</p>
            </div>
            <button className="px-4 py-2 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-black transition-colors">
              Expandir Mapa
            </button>
          </div>

          <div className="h-[450px] bg-[#F8F9FA] relative flex items-center justify-center overflow-hidden">
            {/* Stylized Map Grid Effect */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Simulated Map Markers */}
            <div className="relative w-full h-full">
              <div className="absolute top-1/4 left-1/3 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 animate-bounce">
                <Truck className="text-primary" size={24} />
              </div>
              <div className="absolute bottom-1/3 right-1/4 p-2 bg-gray-900 rounded-full shadow-2xl border-4 border-white">
                <Users className="text-white" size={16} />
              </div>
              <div className="absolute top-1/2 right-1/2 w-32 h-32 bg-primary/10 rounded-full animate-pulse border border-primary/20" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-2xl flex items-center justify-between">
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 text-center">Activos</p>
                  <p className="text-xl font-black text-gray-900 text-center">{stats.activeDrivers}</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 text-center">En Ruta</p>
                  <p className="text-xl font-black text-gray-900 text-center">5</p>
                </div>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center font-black text-xs">
                    D{i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="text-emerald-500" /> Seguridad
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-900">Verificar Conductores</p>
                    <p className="text-xs text-gray-500 font-medium">3 perfiles pendientes de revisión</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-900">Reportes de Incidencias</p>
                    <p className="text-xs text-gray-500 font-medium">Ninguna incidencia hoy</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FFC107] to-[#FFA000] rounded-3xl p-8 shadow-xl shadow-amber-200 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            <Store className="text-black mb-4" size={32} />
            <h3 className="text-xl font-black text-black mb-2">Nuevo Comercio</h3>
            <p className="text-sm text-black/70 font-bold leading-relaxed mb-6">
              "Restaurante El Faro" se ha unido a la red. ¿Deseas revisar su perfil y activar sus servicios?
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-colors">
              Revisar Comercio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
