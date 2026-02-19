import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Clock, MapPin, User, Grid, List, User as UserIcon } from 'lucide-react-native';
import { api, Order } from '../lib/supabaseRest';
import FetchState from '../components/FetchState';

const STATUS_TABS = ['TODO', 'DESPACHADO', 'EN CAMINO', 'ENTREGADO'];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('EN CAMINO');
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const statusFilter = activeTab === 'TODO' ? undefined : activeTab;
      const data = await api.listOrders(statusFilter);
      setOrders(data || []);
    } catch (e: any) {
      setError(e?.message || 'Error cargando pedidos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [activeTab]);

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order #{item.id}</Text>
      </View>
      <View style={styles.orderContent}>
        <Text style={styles.orderText}>Pedido: {new Date(item.created_at).toLocaleString()}</Text>
        <Text style={styles.orderText}>Repartidor: {item.courier_name || '-'}</Text>
        <Text style={styles.orderText}>Entregar en: {item.address || '-'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.light.headerBackground} barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.tabContainer}>
          {STATUS_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {error || loading ? (
          <FetchState loading={loading} error={error} onRetry={load} />
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={[styles.listContent, { paddingBottom: 110 + insets.bottom }]}
            refreshing={loading}
            onRefresh={load}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.headerBackground,
    paddingVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    opacity: 0.6,
  },
  activeTabText: {
    opacity: 1,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
  },
  errorBox: {
    padding: 16,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  orderHeader: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  orderTitle: {
    color: Colors.light.primary, // Yellow text on black header matching image "Order #20" card header
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderContent: {
    padding: 16,
  },
  orderText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
});
