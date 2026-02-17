import React, { useEffect, useState } from 'react';
import { Filter, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { merchantService, Order } from '@/services/merchant';
import { formatCurrency } from '@/lib/utils';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadOrders() {
        if (!user) return;
        try {
            const merchant = await merchantService.getMerchantByUserId(user.id);
            if (merchant) {
                const data = await merchantService.getOrders(merchant.id);
                setOrders(data || []);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    }
    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter(order => 
      statusFilter === 'all' ? true : order.status === statusFilter
  );

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
      try {
          await merchantService.updateOrderStatus(orderId, newStatus);
          setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } catch (error) {
          console.error('Error updating order status:', error);
          alert('Error al actualizar el estado del pedido');
      }
  };

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'pending': return 'bg-yellow-100 text-yellow-800';
          case 'preparando': return 'bg-blue-100 text-blue-800';
          case 'listo': return 'bg-green-100 text-green-800';
          case 'en_camino': return 'bg-purple-100 text-purple-800';
          case 'entregado': return 'bg-gray-100 text-gray-800';
          case 'cancelado': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-600';
      }
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparando').length;
  const readyCount = orders.filter(o => o.status === 'listo').length;
  const completedTodayCount = orders.filter(o => o.status === 'entregado' && new Date(o.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h2>
        <div className="flex gap-2">
            <select 
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="preparando">En Preparación</option>
                <option value="listo">Listos para Retiro</option>
                <option value="en_camino">En Camino</option>
                <option value="entregado">Entregados</option>
                <option value="cancelado">Cancelados</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col cursor-pointer hover:border-yellow-400" onClick={() => setStatusFilter('pending')}>
              <span className="text-sm text-gray-500">Pendientes</span>
              <span className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col cursor-pointer hover:border-blue-400" onClick={() => setStatusFilter('preparando')}>
              <span className="text-sm text-gray-500">En Preparación</span>
              <span className="text-2xl font-bold text-blue-600 mt-1">{preparingCount}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col cursor-pointer hover:border-green-400" onClick={() => setStatusFilter('listo')}>
              <span className="text-sm text-gray-500">Listos para Retiro</span>
              <span className="text-2xl font-bold text-green-600 mt-1">{readyCount}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <span className="text-sm text-gray-500">Completados Hoy</span>
              <span className="text-2xl font-bold text-gray-800 mt-1">{completedTodayCount}</span>
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                   <tr><td colSpan={7} className="py-8 text-center text-gray-500">Cargando pedidos...</td></tr>
              ) : filteredOrders.length === 0 ? (
                   <tr><td colSpan={7} className="py-8 text-center text-gray-500">No se encontraron pedidos</td></tr>
              ) : (
                filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.user?.name || 'Cliente'}
                    <div className="text-xs text-gray-400">{order.user?.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items?.length || 0} items
                    {/* TODO: Show items summary */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                        {order.status === 'pending' && (
                             <button 
                                className="p-1 text-green-600 hover:text-green-800" 
                                title="Aceptar Pedido"
                                onClick={() => handleUpdateStatus(order.id, 'preparando')}
                             >
                                <CheckCircle className="w-5 h-5" />
                            </button>
                        )}
                        {order.status === 'preparando' && (
                             <button 
                                className="p-1 text-blue-600 hover:text-blue-800" 
                                title="Marcar Listo"
                                onClick={() => handleUpdateStatus(order.id, 'listo')}
                             >
                                <CheckCircle className="w-5 h-5" />
                            </button>
                        )}
                         {(order.status === 'pending' || order.status === 'preparando') && (
                            <button 
                                className="p-1 text-red-600 hover:text-red-800" 
                                title="Rechazar/Cancelar"
                                onClick={() => {
                                    if(window.confirm('¿Seguro que deseas cancelar este pedido?')) {
                                        handleUpdateStatus(order.id, 'cancelado');
                                    }
                                }}
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                         <button className="p-1 text-gray-500 hover:text-[#FFC107]" title="Ver detalles">
                            <Eye className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
