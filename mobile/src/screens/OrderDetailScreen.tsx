import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import {
  ArrowLeft,
  Clock,
  User,
  MapPin,
  Truck,
  CheckCircle2,
  Package,
  Store,
  PhoneCall
} from 'lucide-react-native';
import { api, Order, OrderItem, Driver, Delivery } from '../lib/supabaseRest';
import FetchState from '../components/FetchState';

/**
 * OrderDetailScreen
 * 
 * Pantalla de seguimiento detallado del pedido.
 * Implementa un Timeline Interactivo premium para el Bloque 3.
 */
export default function OrderDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const orderId = route.params?.orderId || '0';
  const insets = useSafeAreaInsets();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [updating, setUpdating] = useState(false);

  /**
   * Mapeo de estados del servidor a índices del timeline
   */
  const statusMap: Record<string, number> = {
    'TODO': 1,
    'DESPACHADO': 2,
    'EN CAMINO': 3,
    'ENTREGADO': 4
  };

  const currentStep = statusMap[order?.status || 'TODO'] || 0;

  /**
   * Carga de datos del pedido y entrega
   */
  async function load() {
    if (!orderId || orderId === '0') return;
    try {
      setLoading(true);
      setError(null);
      const [o, it, dv] = await Promise.all([
        api.getOrderById(Number(orderId)),
        api.listOrderItems(Number(orderId)),
        api.getDeliveryByOrder(Number(orderId))
      ]);
      setOrder(o || null);
      setItems(it || []);
      setDelivery(dv || null);
    } catch (e: any) {
      setError(e?.message || 'Error cargando detalle del pedido');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    // Simulación de polling para seguimiento en vivo (Cada 30 seg)
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  /**
   * Componente visual del Timeline
   */
  const RenderTimeline = () => {
    const steps = [
      { id: 1, label: 'Pedido Recibido', icon: Store, color: '#4CAF50' },
      { id: 2, label: 'En Preparación', icon: Package, color: '#FF9800' },
      { id: 3, label: 'En camino', icon: Truck, color: Colors.light.primary },
      { id: 4, label: 'Entregado', icon: CheckCircle2, color: '#2196F3' }
    ];

    return (
      <View style={styles.timelineContainer}>
        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isLast = index === steps.length - 1;
          const Icon = step.icon;

          return (
            <View key={step.id} style={styles.timelineStepWrapper}>
              <View style={styles.stepIndicatorContainer}>
                <View style={[
                  styles.stepCircle,
                  isActive ? { backgroundColor: step.color } : styles.stepCircleInactive
                ]}>
                  <Icon size={16} color={isActive ? "#FFF" : "#999"} />
                </View>
                {!isLast && (
                  <View style={[
                    styles.stepLine,
                    currentStep > step.id ? { backgroundColor: step.color } : styles.stepLineInactive
                  ]} />
                )}
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={[
                  styles.stepLabel,
                  isActive ? styles.stepLabelActive : styles.stepLabelInactive
                ]}>
                  {step.label}
                </Text>
                {isActive && currentStep === step.id && (
                  <Text style={styles.stepStatusBadge}>Actual</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading && !order) return <FetchState loading={true} error={null} onRetry={load} />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seguimiento de Pedido</Text>
        <TouchableOpacity style={styles.contactButton}>
          <PhoneCall size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Card Principal */}
        <View style={styles.statusCard}>
          <Text style={styles.orderNumber}>Orden #{orderId}</Text>
          <Text style={styles.statusTime}>Entrega estimada: 30-40 min</Text>

          <RenderTimeline />
        </View>

        {/* Mapa / Botón de Mapa */}
        <TouchableOpacity
          style={styles.mapPreview}
          onPress={() => navigation.navigate('Map', { orderId })}
        >
          <MapPin size={24} color={Colors.light.primary} />
          <View style={styles.mapInfo}>
            <Text style={styles.mapTitle}>Ver seguimiento en vivo</Text>
            <Text style={styles.mapSubtitle}>{order?.address || 'Cargando dirección...'}</Text>
          </View>
          <CheckCircle2 size={20} color="#DDD" />
        </TouchableOpacity>

        {/* Datos del Courier */}
        {order?.courier_name && (
          <View style={styles.courierCard}>
            <View style={styles.courierAvatar}>
              <User size={30} color="#666" />
            </View>
            <View style={styles.courierInfo}>
              <Text style={styles.courierLabel}>Tu repartidor</Text>
              <Text style={styles.courierName}>{order.courier_name}</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <PhoneCall size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Resumen de Productos */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Detalle del Pedido</Text>
          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemQtyCircle}>
                <Text style={styles.itemQtyText}>{item.quantity}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price || 0}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Pagado</Text>
            <Text style={styles.totalValue}>${order?.total || 0}</Text>
          </View>
        </View>
      </ScrollView>
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
  backButton: { padding: 5 },
  contactButton: {
    padding: 8,
    backgroundColor: '#FFFBE6',
    borderRadius: 12
  },
  scrollContent: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 5,
  },
  statusTime: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 30,
  },
  timelineContainer: {
    paddingLeft: 10,
  },
  timelineStepWrapper: {
    flexDirection: 'row',
    height: 70,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    width: 30,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepCircleInactive: {
    backgroundColor: '#F1F3F5',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  stepLine: {
    width: 3,
    flex: 1,
    marginTop: -5,
    marginBottom: -5,
    zIndex: 1,
  },
  stepLineInactive: {
    backgroundColor: '#F1F3F5',
  },
  stepTextContainer: {
    flex: 1,
    marginLeft: 15,
    paddingTop: 5,
  },
  stepLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  stepLabelActive: { color: '#1A1A1A' },
  stepLabelInactive: { color: '#ADB5BD' },
  stepStatusBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.light.primary,
    backgroundColor: '#FFFBE6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  mapPreview: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  mapInfo: {
    flex: 1,
    marginLeft: 15,
  },
  mapTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  mapSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  courierCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  courierAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courierInfo: {
    flex: 1,
    marginLeft: 15,
  },
  courierLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  courierName: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '800',
  },
  callButton: {
    backgroundColor: Colors.light.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsSection: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemQtyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemQtyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#495057',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#666',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.light.primary,
  }
});
