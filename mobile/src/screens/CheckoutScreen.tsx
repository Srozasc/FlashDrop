import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useCart } from '../context/CartContext';
import { api, Address, Merchant, PaymentMethod } from '../lib/supabaseRest';
import { Colors } from '../../constants/Colors';
import FetchState from '../components/FetchState';
import { MapPin, CreditCard, ShoppingBag, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

/**
 * CheckoutScreen
 * 
 * Pantalla de finalización de compra con experiencia "One-Tap".
 * Permite gestionar direcciones, métodos de pago y confirmar el pedido de forma ágil.
 */
export default function CheckoutScreen() {
  const { items, total, merchantId, changeQty, remove, clear } = useCart();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Estados de carga y datos
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<number | null>(null);

  /**
   * Carga inicial de datos del servidor
   */
  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Carga paralela para mejor performance
      const [addrs, pms] = await Promise.all([
        api.listAddresses(),
        api.listPaymentMethods()
      ]);

      setAddresses(addrs || []);
      const defAddr = (addrs || []).find((a: Address) => a.is_default);
      setAddressId(defAddr?.id || (addrs?.[0]?.id ?? null));

      setPaymentMethods(pms || []);
      const defPm = (pms || []).find((p: PaymentMethod) => p.is_default);
      setPaymentMethodId(defPm?.id || (pms?.[0]?.id ?? null));

      if (merchantId) {
        const ms = await api.listMerchants();
        const m = (ms || []).find((x: Merchant) => x.id === merchantId) || null;
        setMerchant(m);
      }
    } catch (e: any) {
      setError(e?.message || 'Error cargando datos de facturación');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [merchantId]);

  const deliveryFee = merchant?.delivery_fee ?? 0;
  const grandTotal = useMemo(() => total + deliveryFee, [total, deliveryFee]);

  /**
   * Procesa la creación del pedido (One-Tap Action)
   */
  async function placeOrder() {
    if (placing) return;
    setPlacing(true);
    setError(null);

    try {
      if (!addressId) throw new Error('Por favor selecciona una dirección de entrega');
      if (!paymentMethodId) throw new Error('Por favor selecciona un método de pago');

      const addressObj = addresses.find(a => a.id === addressId);

      // 1. Crear la cabecera del pedido
      const order = await api.createOrder({
        status: 'TODO',
        address: addressObj?.street || '',
        total: grandTotal,
        courier_name: null,
        merchant_id: merchantId,
      });

      // 2. Crear los items del pedido
      await api.createOrderItems(
        items.map(i => ({
          order_id: order.id,
          name: i.name,
          quantity: i.quantity,
          image_url: i.image_url || null,
        })),
      );

      setOrderSuccess(order.id);
      clear();
    } catch (e: any) {
      setError(e?.message || 'Error al procesar tu pedido');
    } finally {
      setPlacing(false);
    }
  }

  if (orderSuccess) {
    return (
      <View style={styles.successContainer}>
        <CheckCircle2 size={80} color={Colors.light.primary} />
        <Text style={styles.successTitle}>¡Pedido Exitoso!</Text>
        <Text style={styles.successSubtitle}>Tu orden #{orderSuccess} ha sido recibida y está siendo procesada.</Text>
        <TouchableOpacity
          style={styles.successButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.successButtonText}>Seguir explorando</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Sección de Dirección */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
          </View>
          <View style={styles.cardsContainer}>
            {addresses.length > 0 ? (
              addresses.map(addr => (
                <TouchableOpacity
                  key={addr.id}
                  style={[styles.optionCard, addressId === addr.id && styles.optionCardActive]}
                  onPress={() => setAddressId(addr.id)}
                >
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{addr.street}</Text>
                    <Text style={styles.cardSubtitle}>{addr.city || 'Ciudad'}, {addr.commune || 'Comuna'}</Text>
                  </View>
                  {addressId === addr.id && (
                    <View style={styles.selectedCheck}>
                      <CheckCircle2 size={16} color={Colors.light.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No tienes direcciones guardadas.</Text>
            )}
          </View>
        </View>

        {/* Sección de Pago */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Método de Pago</Text>
          </View>
          <View style={styles.cardsContainer}>
            {paymentMethods.length > 0 ? (
              paymentMethods.map(pm => (
                <TouchableOpacity
                  key={pm.id}
                  style={[styles.optionCard, paymentMethodId === pm.id && styles.optionCardActive]}
                  onPress={() => setPaymentMethodId(pm.id)}
                >
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>
                      {pm.brand || pm.type.toUpperCase()} **** {pm.last4}
                    </Text>
                    <Text style={styles.cardSubtitle}>Pago rápido habilitado</Text>
                  </View>
                  {paymentMethodId === pm.id && (
                    <View style={styles.selectedCheck}>
                      <CheckCircle2 size={16} color={Colors.light.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No tienes métodos de pago guardados.</Text>
            )}
          </View>
        </View>

        {/* Resumen de Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShoppingBag size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Tu Pedido</Text>
          </View>
          <View style={styles.itemsCard}>
            {items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
                <Text style={styles.itemPrice}>${item.price * item.quantity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Resumen de Totales */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Costo de envío</Text>
            <Text style={styles.summaryValue}>${deliveryFee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${grandTotal}</Text>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 100 }]}>
        <TouchableOpacity
          style={[styles.confirmButton, (loading || placing || items.length === 0) && styles.disabledButton]}
          onPress={placeOrder}
          disabled={loading || placing || items.length === 0}
        >
          {placing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.confirmText}>Confirmar y Pagar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  backButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  cardsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
  },
  optionCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: '#FFFBE6',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  selectedCheck: {
    marginLeft: 10,
  },
  itemsCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  summarySection: {
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.light.primary,
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  disabledButton: {
    backgroundColor: '#E9ECEF',
    shadowOpacity: 0,
    elevation: 0,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    marginTop: 20,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
  successButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 40,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 10,
  }
});
