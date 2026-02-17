import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  DollarSign,
  CreditCard,
  Save,
  Settings as SettingsIcon,
  Check
} from 'lucide-react';

interface SystemConfig {
  commission_rate: number;
  delivery_base_fee: number;
  payment_methods: {
    cash: boolean;
    card: boolean;
    webpay: boolean;
  };
}

export default function Settings() {
  const [config, setConfig] = useState<SystemConfig>({
    commission_rate: 15,
    delivery_base_fee: 2500,
    payment_methods: {
      cash: true,
      card: true,
      webpay: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);

      // Intentar cargar configuración desde la base de datos
      const { data: commissionData } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'commission_rate')
        .single();

      const { data: deliveryFeeData } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'delivery_base_fee')
        .single();

      const { data: paymentMethodsData } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'payment_methods')
        .single();

      setConfig({
        commission_rate: commissionData?.value?.percentage || 15,
        delivery_base_fee: deliveryFeeData?.value?.amount || 2500,
        payment_methods: paymentMethodsData?.value || {
          cash: true,
          card: true,
          webpay: true,
        },
      });
    } catch (error) {
      console.error('Error loading config:', error);
      // Mantener valores por defecto si hay error
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);

      // Guardar comisión
      await supabase
        .from('system_config')
        .upsert({
          key: 'commission_rate',
          value: { percentage: config.commission_rate },
        });

      // Guardar tarifa de delivery
      await supabase
        .from('system_config')
        .upsert({
          key: 'delivery_base_fee',
          value: { amount: config.delivery_base_fee },
        });

      // Guardar métodos de pago
      await supabase
        .from('system_config')
        .upsert({
          key: 'payment_methods',
          value: config.payment_methods,
        });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra las configuraciones globales de la plataforma
          </p>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <Check className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-sm font-medium text-green-800">
            Configuración guardada exitosamente
          </span>
        </div>
      )}

      {/* Comisiones y Tarifas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Comisiones y Tarifas</h2>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Commission Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comisión de la Plataforma (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={config.commission_rate}
                onChange={(e) =>
                  setConfig({ ...config, commission_rate: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Porcentaje que la plataforma cobra por cada pedido completado
            </p>
          </div>

          {/* Delivery Base Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarifa Base de Delivery (CLP)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={config.delivery_base_fee}
                onChange={(e) =>
                  setConfig({ ...config, delivery_base_fee: parseInt(e.target.value) })
                }
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tarifa base que se cobra por el servicio de delivery
            </p>
          </div>
        </div>
      </div>

      {/* Métodos de Pago */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Métodos de Pago</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Activa o desactiva los métodos de pago disponibles para los clientes
          </p>

          {/* Cash */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Efectivo</p>
              <p className="text-sm text-gray-500">Pago en efectivo al recibir el pedido</p>
            </div>
            <button
              onClick={() =>
                setConfig({
                  ...config,
                  payment_methods: {
                    ...config.payment_methods,
                    cash: !config.payment_methods.cash,
                  },
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.payment_methods.cash ? 'bg-green-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.payment_methods.cash ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          {/* Card */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Tarjeta de Crédito/Débito</p>
              <p className="text-sm text-gray-500">Pago con tarjeta en la app</p>
            </div>
            <button
              onClick={() =>
                setConfig({
                  ...config,
                  payment_methods: {
                    ...config.payment_methods,
                    card: !config.payment_methods.card,
                  },
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.payment_methods.card ? 'bg-green-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.payment_methods.card ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          {/* WebPay */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">WebPay</p>
              <p className="text-sm text-gray-500">Pago mediante WebPay Plus</p>
            </div>
            <button
              onClick={() =>
                setConfig({
                  ...config,
                  payment_methods: {
                    ...config.payment_methods,
                    webpay: !config.payment_methods.webpay,
                  },
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.payment_methods.webpay ? 'bg-green-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.payment_methods.webpay ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${saving
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-black hover:bg-gray-800 text-white'
            }`}
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}
