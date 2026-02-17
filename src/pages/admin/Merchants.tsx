import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Store,
  MapPin,
  Phone,
  Mail,
  Package,
  DollarSign,
  X
} from 'lucide-react';

interface Merchant {
  id: string;
  business_name: string;
  rut: string;
  address: string;
  phone: string;
  email: string;
  is_approved: boolean;
  created_at: string;
}

export default function Merchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [merchantStats, setMerchantStats] = useState<any>(null);

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMerchants();
      setMerchants(data);
    } catch (error) {
      console.error('Error loading merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (merchantId: string) => {
    try {
      const [details, stats] = await Promise.all([
        adminService.getMerchantById(merchantId),
        adminService.getMerchantStats(merchantId)
      ]);
      setSelectedMerchant(details);
      setMerchantStats(stats);
    } catch (error) {
      console.error('Error loading merchant details:', error);
    }
  };

  const handleApproveMerchant = async (merchantId: string) => {
    try {
      await adminService.approveMerchant(merchantId);
      await loadMerchants();
      setSelectedMerchant(null);
      alert('Comercio aprobado exitosamente');
    } catch (error) {
      console.error('Error approving merchant:', error);
      alert('Error al aprobar el comercio');
    }
  };

  const filteredMerchants = merchants.filter(merchant => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      merchant.business_name.toLowerCase().includes(searchLower) ||
      merchant.rut.toLowerCase().includes(searchLower) ||
      merchant.email.toLowerCase().includes(searchLower);

    if (statusFilter === 'approved') return matchesSearch && merchant.is_approved;
    if (statusFilter === 'pending') return matchesSearch && !merchant.is_approved;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Comercios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los comercios de la plataforma
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Comercios</p>
              <p className="text-2xl font-bold text-gray-900">{merchants.length}</p>
            </div>
            <Store className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Aprobados</p>
              <p className="text-2xl font-bold text-green-600">
                {merchants.filter(m => m.is_approved).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {merchants.filter(m => !m.is_approved).length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, RUT o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent appearance-none bg-white"
            >
              <option value="">Todos</option>
              <option value="approved">Aprobados</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Merchants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre del Negocio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RUT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Cargando comercios...
                  </td>
                </tr>
              ) : filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron comercios
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Store className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {merchant.business_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {merchant.rut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {merchant.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {merchant.is_approved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Aprobado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(merchant.created_at).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(merchant.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Merchant Detail Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedMerchant.business_name}
                </h2>
                {selectedMerchant.is_approved ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 mt-2">
                    Aprobado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 mt-2">
                    Pendiente de Aprobación
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedMerchant(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Business Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Información del Negocio
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">RUT:</span>
                    <p className="font-medium text-gray-900">{selectedMerchant.rut}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <p className="font-medium text-gray-900">{selectedMerchant.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium text-gray-900">{selectedMerchant.email}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Dirección:</span>
                    <p className="font-medium text-gray-900">{selectedMerchant.address}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {merchantStats && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Estadísticas
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <Package className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-gray-900">{merchantStats.totalOrders}</p>
                      <p className="text-xs text-gray-500">Pedidos Totales</p>
                    </div>
                    <div className="text-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-gray-900">{merchantStats.deliveredOrders}</p>
                      <p className="text-xs text-gray-500">Entregados</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(merchantStats.totalRevenue)}
                      </p>
                      <p className="text-xs text-gray-500">Ingresos</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!selectedMerchant.is_approved && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproveMerchant(selectedMerchant.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Aprobar Comercio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
