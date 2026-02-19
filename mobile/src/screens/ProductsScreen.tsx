import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, Product, Merchant } from '../lib/supabaseRest';
import { Colors } from '../../constants/Colors';
import FetchState from '../components/FetchState';
import { useCart } from '../context/CartContext';

export default function ProductsScreen() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [activeMerchant, setActiveMerchant] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const cart = useCart();

  async function loadMerchants() {
    const data = await api.listMerchants();
    setMerchants(data || []);
    if (data?.length) setActiveMerchant(data[0].id);
  }

  async function loadProducts(merchantId?: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listProducts(merchantId);
      setProducts(data || []);
    } catch (e: any) {
      setError(e?.message || 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMerchants();
  }, []);

  useEffect(() => {
    loadProducts(activeMerchant);
  }, [activeMerchant]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <FlatList
          data={merchants}
          horizontal
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.merchantList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.merchantChip,
                activeMerchant === item.id && styles.merchantChipActive,
              ]}
              onPress={() => setActiveMerchant(item.id)}
            >
              <Text
                style={[
                  styles.merchantChipText,
                  activeMerchant === item.id && styles.merchantChipTextActive,
                ]}
              >
                {item.business_name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={() => loadProducts(activeMerchant)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description || ''}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() =>
                  cart.add({
                    id: item.id,
                    merchant_id: item.merchant_id,
                    name: item.name,
                    price: item.price,
                    image_url: item.image_url,
                  })
                }
              >
                <Text style={styles.addText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<FetchState loading={loading} error={error} onRetry={() => loadProducts(activeMerchant)} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: Colors.light.headerBackground, paddingVertical: 8 },
  merchantList: { paddingHorizontal: 12, gap: 8 },
  merchantChip: {
    backgroundColor: '#FFD54F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  merchantChipActive: {
    backgroundColor: '#FFFFFF',
  },
  merchantChipText: { color: '#000000', opacity: 0.7, fontWeight: '600' },
  merchantChipTextActive: { opacity: 1, fontWeight: 'bold' },
  listContent: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#EEE', margin: 12 },
  info: { flex: 1, paddingVertical: 12, paddingRight: 12 },
  name: { fontSize: 16, fontWeight: '700', color: '#000' },
  desc: { fontSize: 12, color: '#757575', marginTop: 2 },
  price: { fontSize: 14, fontWeight: '700', marginTop: 8 },
  addBtn: {
    marginTop: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addText: { color: '#000', fontWeight: '700' },
  emptyBox: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#757575' },
});

