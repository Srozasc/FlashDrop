import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { merchantService } from '@/services/merchant';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    async function loadSettings() {
        if (!user) return;
        try {
            const merchant = await merchantService.getMerchantByUserId(user.id);
            if (merchant) {
                setFormData(merchant);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    loadSettings();
  }, [user]);

  const handleSubmit = async () => {
      setSaving(true);
      try {
          await merchantService.updateMerchant(formData.id, formData);
          alert('Configuración guardada correctamente');
      } catch (error) {
          console.error(error);
          alert('Error al guardar configuración');
      } finally {
          setSaving(false);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  if (loading) {
      return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Configuración del Comercio</h2>
        <button 
            className="bg-[#FFC107] hover:bg-[#ffcd38] text-black font-medium px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={saving}
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Información del Negocio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Comercio</label>
                        <input 
                            type="text" 
                            name="business_name"
                            value={formData.business_name || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RUT Empresa</label>
                        <input 
                            type="text" 
                            name="rut"
                            value={formData.rut || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent" 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input 
                            type="text" 
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent" 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea 
                            name="description" // Assuming description field exists or we can use it if added to DB
                            rows={3} 
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent" 
                            placeholder="Descripción del comercio (opcional)"
                        />
                    </div>
                </div>
            </div>

            {/* Configuración de Envíos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Envíos y Tarifas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tarifa Base</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input 
                                type="number" 
                                name="delivery_fee"
                                value={formData.delivery_fee || ''}
                                onChange={handleChange}
                                className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo Estimado (min)</label>
                        <input 
                            type="number" 
                            placeholder="45"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent" 
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            {/* Horario */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Estado y Horario</h3>
                
                <div className="flex items-center justify-between mb-6">
                    <span className="font-medium text-gray-900">Estado del Local</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="is_approved" // Using is_approved as a proxy for open/close or we need a new field is_open
                            className="sr-only peer" 
                            checked={formData.is_approved || false}
                            readOnly // Approval is admin only usually, but let's assume this is "Open/Close" for now if we had the field
                        />
                         <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-yellow-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${formData.is_approved ? 'peer-checked:bg-green-500' : ''}`}></div>
                        <span className={`ml-3 text-sm font-medium ${formData.is_approved ? 'text-green-600' : 'text-gray-500'}`}>
                            {formData.is_approved ? 'Aprobado' : 'Pendiente'}
                        </span>
                    </label>
                </div>

                <div className="space-y-3">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                        <div key={day} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 w-24">{day}</span>
                            <span className="text-gray-900 font-medium">10:00 - 22:00</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
