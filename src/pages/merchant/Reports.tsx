import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { merchantService } from '@/services/merchant';
import { formatCurrency } from '@/lib/utils';

export default function Reports() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ ordersToday: 0, totalSales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
        if (!user) return;
        try {
            const merchant = await merchantService.getMerchantByUserId(user.id);
            if (merchant) {
                const data = await merchantService.getStats(merchant.id);
                setStats(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    loadStats();
  }, [user]);

  const commission = stats.totalSales * 0.08;
  const netIncome = stats.totalSales - commission;

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando reportes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h2>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Últimos 30 días
        </button>
      </div>

      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Gráficos de Ventas</h3>
        <p className="text-gray-500">Esta sección mostrará gráficos detallados de ventas diarias, semanales y mensuales.</p>
        <div className="mt-8 h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Área de gráfico (Próximamente)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Top Productos</h3>
            <ul className="space-y-4">
                 <li className="text-gray-500 text-center py-4">Datos no disponibles aún</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen Financiero (Estimado)</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ventas Brutas</span>
                    <span className="font-medium text-gray-900">{formatCurrency(stats.totalSales)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Comisiones Plataforma (8%)</span>
                    <span className="font-medium text-red-600">-{formatCurrency(commission)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Ganancia Neta</span>
                    <span className="font-bold text-green-600 text-lg">{formatCurrency(netIncome)}</span>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}
