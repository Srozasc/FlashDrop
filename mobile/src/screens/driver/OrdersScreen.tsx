import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { api } from '../../lib/supabaseRest';
import { MapPin, Navigation, Package } from 'lucide-react-native';

// Tipo temporal para pedidos de repartidor
type DriverOrder = {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerAddress: string;
  distance: string;
  earnings: number;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered';
};

export default function DriverOrdersScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<DriverOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de pedidos
    // En el futuro conectaremos con api.listOrders() filtrando por estado y zona
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          restaurantName: 'Burger King - Centro',
          restaurantAddress: 'Av. Libertador 1234',
          customerName: 'Juan Pérez',
          customerAddress: 'Calle Falsa 123, Depto 402',
          distance: '2.5 km',
          earnings: 3500,
          status: 'pending'
        },
        {
          id: '2',
          restaurantName: 'Sushi House',
          restaurantAddress: 'Mall Plaza Norte',
          customerName: 'Maria González',
          customerAddress: 'Av. Los Leones 55',
          distance: '4.1 km',
          earnings: 5200,
          status: 'pending'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderOrderItem = ({ item }: { item: DriverOrder }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Nueva Solicitud</Text>
        </View>
        <Text style={styles.earnings}>${item.earnings}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          <View style={[styles.dot, { backgroundColor: '#000' }]} />
          <View>
            <Text style={styles.pointLabel}>Retiro</Text>
            <Text style={styles.pointTitle}>{item.restaurantName}</Text>
            <Text style={styles.pointAddress}>{item.restaurantAddress}</Text>
          </View>
        </View>

        <View style={styles.connectorLine} />

        <View style={styles.routePoint}>
          <View style={[styles.dot, { backgroundColor: Colors.light.primary }]} />
          <View>
            <Text style={styles.pointLabel}>Entrega</Text>
            <Text style={styles.pointTitle}>{item.customerName}</Text>
            <Text style={styles.pointAddress}>{item.customerAddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.distance}>{item.distance} total</Text>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => navigation.navigate('DeliveryDetail', { orderId: item.id })}
        >
          <Text style={styles.acceptButtonText}>Aceptar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos Disponibles</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 110 + insets.bottom }]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text>No hay pedidos disponibles en este momento.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  earnings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  pointLabel: {
    fontSize: 10,
    color: '#757575',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  pointTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  pointAddress: {
    fontSize: 13,
    color: '#555',
  },
  connectorLine: {
    position: 'absolute',
    left: 5,
    top: 16,
    bottom: 40,
    width: 2,
    backgroundColor: '#E0E0E0',
    zIndex: -1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  distance: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
});
