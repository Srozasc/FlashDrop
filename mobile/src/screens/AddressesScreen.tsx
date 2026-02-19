import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, Address } from '../lib/supabaseRest';
import { Colors } from '../../constants/Colors';
import FetchState from '../components/FetchState';

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listAddresses();
      setAddresses(data || []);
    } catch (e: any) {
      setError(e?.message || 'Error cargando direcciones');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Text style={styles.title}>Mis direcciones</Text>
      </View>
      <FlatList
        data={addresses}
        keyExtractor={(a) => a.id}
        refreshing={loading}
        onRefresh={load}
        contentContainerStyle={[styles.listContent, { paddingBottom: 110 + insets.bottom }]}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.street}>{item.street || '-'}</Text>
              <Text style={styles.sub}>{item.commune || ''}{item.city ? `, ${item.city}` : ''}</Text>
            </View>
            {item.is_default && <Text style={styles.badge}>Default</Text>}
          </View>
        )}
        ListEmptyComponent={<FetchState loading={loading} error={error} onRetry={load} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: Colors.light.headerBackground, padding: 16 },
  title: { color: Colors.light.headerText, fontWeight: '700', fontSize: 18 },
  listContent: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  street: { fontSize: 16, fontWeight: '700', color: '#000' },
  sub: { fontSize: 12, color: '#757575', marginTop: 2 },
  badge: {
    backgroundColor: Colors.light.primary,
    color: Colors.light.primaryForeground,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 12,
  },
  emptyBox: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#757575' },
});

