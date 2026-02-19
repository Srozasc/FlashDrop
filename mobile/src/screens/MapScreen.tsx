import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Phone, MapPin, Navigation } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, Delivery, Order, Merchant } from '../lib/supabaseRest';
import UnifiedMap from '../components/UnifiedMap';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      if (orderId) {
        const o = await api.getOrderById(Number(orderId));
        setOrder(o || null);
        const d = await api.getDeliveryByOrder(Number(orderId));
        setDelivery(d || null);
        if (o?.merchant_id) {
          const ms = await api.listMerchants();
          const m = (ms || []).find((mm: Merchant) => mm.id === o.merchant_id) || null;
          setMerchant(m);
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Error cargando mapa');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [orderId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <UnifiedMap
        origin={{
          lat: merchant?.coordinates?.lat ?? -34.6037,
          lng: merchant?.coordinates?.lng ?? -58.3816,
        }}
        destination={{
          lat: delivery?.delivery_coordinates?.lat ?? -34.62,
          lng: delivery?.delivery_coordinates?.lng ?? -58.44,
        }}
      />

      {/* Top Header Overlay */}
      <View style={[styles.headerOverlay, { top: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Lugar de entrega</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Bottom Card */}
      <View style={[styles.bottomCard, { paddingBottom: 24 + insets.bottom, bottom: insets.bottom }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.googleLabel}>Google</Text>
        </View>
        
        <View style={styles.locationInfo}>
          <View style={styles.locationRow}>
            <Text style={styles.locationTitle}>{merchant?.business_name || 'Origen'}</Text>
            <Navigation size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.locationSubtitle}>Comercio</Text>
          
          <View style={styles.separator} />

          <View style={styles.locationRow}>
            <Text style={styles.locationTitle}>{order?.address || 'Dirección'}</Text>
            <MapPin size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.locationSubtitle}>Dirección</Text>
        </View>

        <View style={styles.userRow}>
          <View style={styles.userInfo}>
            <View style={styles.avatarPlaceholder} />
            <Text style={styles.userName}>Camila Rodriguez</Text>
          </View>
          <TouchableOpacity style={styles.phoneButton}>
            <Phone size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>ENTREGAR PEDIDO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#212121', // Dark map color
  },
  routeLine: {
    position: 'absolute',
    top: 200,
    left: 100,
    width: 200,
    height: 300,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: Colors.dark.primary, // Yellow route
    transform: [{ rotate: '45deg' }],
  },
  headerOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E', // Dark card
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  googleLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.7,
  },
  locationInfo: {
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationSubtitle: {
    color: '#9E9E9E',
    fontSize: 14,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#2C2C2C',
    padding: 10,
    borderRadius: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#555',
    marginRight: 10,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
  },
  actionButton: {
    backgroundColor: '#000000', // Image shows dark button
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonText: {
    color: '#FFFFFF', // Assuming white text
    fontWeight: 'bold',
    fontSize: 16,
  },
});
