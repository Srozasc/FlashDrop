import React, { useEffect, useState } from 'react';
import { ShoppingBag, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { merchantService, Order } from '@/services/merchant';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ordersToday: 0,
    totalSales: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const loadData = async () => {
    if (!user) return;
    try {
      const merchant = await merchantService.getMerchantByUserId(user.id);
      if (merchant) {
        const statsData = await merchantService.getStats(merchant.id);

        // Contar órdenes pendientes específicamente
        const orders = await merchantService.getOrders(merchant.id);
        const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

        setStats({ ...statsData, pendingOrders: pendingCount });
        setRecentOrders(orders.slice(0, 8));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Configurar Supabase Realtime para actualizaciones automáticas
    const setupRealtime = async () => {
      const merchant = await merchantService.getMerchantByUserId(user?.id || '');
      if (!merchant) return;

      const subscription = supabase
        .channel('order_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `merchant_id=eq.${merchant.id}`
          },
          () => {
            loadData(); // Recargar datos cuando haya cambios
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    if (user) setupRealtime();
  }, [user]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await merchantService.updateOrderStatus(orderId, newStatus);
      // loadData() se llamará automáticamente por Realtime o manualmente si falla
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div className="ml-3 text-gray-500 font-medium">Cargando dashboard premium...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Ventas Totales',
      value: formatCurrency(stats.totalSales),
      label: 'Acumulado',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Pedidos Hoy',
      value: stats.ordersToday.toString(),
      label: 'Nuevos',
      icon: ShoppingBag,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Por Preparar',
      value: stats.pendingOrders.toString(),
      label: 'Urgente',
      icon: Clock,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Ticket Promedio',
      value: formatCurrency(stats.ordersToday > 0 ? stats.totalSales / stats.ordersToday : 0),
      label: 'Eficiencia',
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Comerciante';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bienvenido, {userName.split(' ')[0]}</h2>
          <p className="text-gray-500 mt-1 font-medium">Aquí tienes el resumen de tu negocio hoy.</p>
        </div>
        <button
          onClick={() => loadData()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Actualizar datos"
        >
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-7 h-7" strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase italic">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Pedidos Recientes</h3>
            <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              Ver todos <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID / Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic font-medium">
                      No hay pedidos recientes para mostrar.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 font-medium">{order.user?.name || 'Cliente Invitado'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                          }`}>
                          {order.status === 'pending' ? 'Pendiente' :
                            order.status === 'preparing' ? 'Preparando' :
                              order.status === 'completed' ? 'Entregado' : order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-900">{formatCurrency(order.total_amount)}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'preparing')}
                              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Empezar preparación"
                            >
                              <Clock size={18} />
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'ready')}
                              className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="Listo para entrega"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Ver detalle"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products / Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Próximos Pasos</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="p-2 bg-primary rounded-lg h-fit">
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Gestionar Productos</p>
                  <p className="text-xs text-gray-500 mt-1">Actualiza tu menú y disponibilidad de stock.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-not-allowed grayscale">
                <div className="p-2 bg-gray-200 rounded-lg h-fit text-gray-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Análisis Avanzado</p>
                  <p className="text-xs text-gray-400 mt-1">Reportes detallados de ventas y comportamiento.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl shadow-xl text-white">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Tip de éxito</p>
            <h4 className="text-lg font-bold mb-2">Optimiza tus fotos</h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Los productos con fotos de alta calidad venden hasta un 40% más. ¡Actualiza tus imágenes hoy!
            </p>
            <button className="w-full py-3 bg-primary text-black font-black rounded-xl hover:opacity-90 transition-opacity">
              Subir Imágenes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
