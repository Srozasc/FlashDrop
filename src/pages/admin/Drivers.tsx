import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Bike,
  Phone,
  Mail,
  MapPin,
  Star,
  X
} from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  is_available: boolean;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  user?: {
    email: string;
  };
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (driverId: string) => {
    try {
      const details = await adminService.getDriverById(driverId);
      setSelectedDriver(details);
    } catch (error) {
      console.error('Error loading driver details:', error);
    }
  };

  const handleApproveDriver = async (driverId: string) => {
    try {
      await adminService.approveDriver(driverId);
      await loadDrivers();
      setSelectedDriver(null);
      alert('Repartidor aprobado exitosamente');
    } catch (error) {
      console.error('Error approving driver:', error);
      alert('Error al aprobar el repartidor');
    }
  };

  const handleToggleStatus = async (driverId: string, isActive: boolean) => {
    try {
      await adminService.toggleDriverStatus(driverId, !isActive);
      await loadDrivers();
      setSelectedDriver(null);
      alert(`Repartidor ${!isActive ? 'activado' : 'suspendido'} exitosamente`);
    } catch (error) {
      console.error('Error toggling driver status:', error);
      alert('Error al cambiar el estado del repartidor');
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      driver.name.toLowerCase().includes(searchLower) ||
      driver.phone.toLowerCase().includes(searchLower) ||
      driver.user?.email?.toLowerCase().includes(searchLower);

    if (statusFilter === 'approved') return matchesSearch && driver.is_approved;
    if (statusFilter === 'pending') return matchesSearch && !driver.is_approved;
    if (statusFilter === 'available') return matchesSearch && driver.is_available;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Repartidores</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los repartidores de la plataforma
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Repartidores</p>
              <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
            </div>
            <Bike className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Aprobados</p>
              <p className="text-2xl font-bold text-green-600">
                {drivers.filter(d => d.is_approved).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Disponibles</p>
              <p className="text-2xl font-bold text-indigo-600">
                {drivers.filter(d => d.is_available).length}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {drivers.filter(d => !d.is_approved).length}
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
              placeholder="Buscar por nombre, teléfono o email..."
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
              <option value="available">Disponibles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponibilidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
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
                    Cargando repartidores...
                  </td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron repartidores
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bike className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {driver.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.user?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {driver.is_available ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Disponible
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          No Disponible
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {driver.is_approved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Aprobado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(driver.id)}
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

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedDriver.name}
                </h2>
                <div className="flex gap-2 mt-2">
                  {selectedDriver.is_approved ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Aprobado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      Pendiente
                    </span>
                  )}
                  {selectedDriver.is_available && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Disponible
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Driver Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Información Personal
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <p className="font-medium text-gray-900">{selectedDriver.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium text-gray-900">{selectedDriver.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha de Registro:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedDriver.created_at).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {!selectedDriver.is_approved && (
                  <button
                    onClick={() => handleApproveDriver(selectedDriver.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Aprobar Repartidor
                  </button>
                )}
                {selectedDriver.is_approved && (
                  <button
                    onClick={() => handleToggleStatus(selectedDriver.id, selectedDriver.is_active)}
                    className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${selectedDriver.is_active
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                  >
                    {selectedDriver.is_active ? (
                      <>
                        <XCircle className="w-5 h-5 mr-2" />
                        Suspender
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Activar
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
