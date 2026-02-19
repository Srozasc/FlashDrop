import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { MapPin, DollarSign, Clock, CheckCircle, ChevronRight, Navigation, LayoutDashboard, Flame } from 'lucide-react-native';
import OrderHeatmap from '../../components/driver/OrderHeatmap';

const { width } = Dimensions.get('window');

export default function DriverDashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    completedOrders: 0,
    hoursOnline: 0
  });

  const dummyHotspots = [
    { id: '1', latitude: -34.6037, longitude: -58.3816, weight: 8 }, // Obelisco
    { id: '2', latitude: -34.5885, longitude: -58.3974, weight: 6 }, // Recoleta
    { id: '3', latitude: -34.6177, longitude: -58.3678, weight: 9 }, // Puerto Madero
    { id: '4', latitude: -34.5835, longitude: -58.4233, weight: 7 }, // Palermo
  ];

  const toggleSwitch = () => setIsAvailable(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0] || 'Repartidor'}</Text>
            <Text style={styles.subtext}>¿Estás listo para entregar hoy?</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'D'}</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusInfo}>
            <View style={[styles.statusIndicator, { backgroundColor: isAvailable ? '#4CAF50' : '#757575' }]} />
            <Text style={styles.statusLabel}>
              Estás {isAvailable ? 'En línea' : 'Desconectado'}
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#E0E0E0", true: "#C8E6C9" }}
            thumbColor={isAvailable ? "#4CAF50" : "#fff"}
            ios_backgroundColor="#E0E0E0"
            onValueChange={toggleSwitch}
            value={isAvailable}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen del día con tarjetas individuales para más impacto */}
        <Text style={styles.sectionTitle}>Tu desempeño hoy</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#FFF9E6' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.light.primary }]}>
              <DollarSign color="#000" size={20} />
            </View>
            <Text style={styles.statValue}>${stats.todayEarnings}</Text>
            <Text style={styles.statLabel}>Ganancias</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#4CAF50' }]}>
              <CheckCircle color="#fff" size={20} />
            </View>
            <Text style={styles.statValue}>{stats.completedOrders}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#2196F3' }]}>
              <Clock color="#fff" size={20} />
            </View>
            <Text style={styles.statValue}>{stats.hoursOnline}h</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
        </View>

        {/* Zonas de Alta Demanda (Hotspots) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Zonas de alta demanda</Text>
          <View style={styles.liveBadge}>
            <Flame size={14} color="#FF5722" fill="#FF5722" />
            <Text style={styles.liveText}>EN VIVO</Text>
          </View>
        </View>

        <View style={styles.heatmapWrapper}>
          <OrderHeatmap hotspots={dummyHotspots} />
          <View style={styles.heatmapOverlay}>
            <Text style={styles.heatmapHint}>Posiciónate cerca de las zonas naranjas para recibir más pedidos</Text>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <Text style={styles.sectionTitle}>Gestión de ruta</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('DriverOrders')}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconWrapper}>
            <Navigation color="#000" size={24} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Ver Pedidos Disponibles</Text>
            <Text style={styles.actionSubtitle}>Encuentra entregas cerca de ti</Text>
          </View>
          <ChevronRight color="#BDBDBD" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Earnings')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconWrapper, { backgroundColor: '#F5F5F7' }]}>
            <LayoutDashboard color="#000" size={24} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Historial Mensual</Text>
            <Text style={styles.actionSubtitle}>Revisa tus totales y bonos</Text>
          </View>
          <ChevronRight color="#BDBDBD" size={20} />
        </TouchableOpacity>

        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>Bono de Fin de Semana</Text>
          <Text style={styles.promoDesc}>Completa 10 entregas extra y obtén un bono de $50.</Text>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Ver Detalles</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
  },
  subtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
    fontWeight: '500',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F2',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    color: '#000',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'flex-start',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#616161',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBE6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF5722',
  },
  heatmapWrapper: {
    height: 200,
    borderRadius: 20,
    marginBottom: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
  },
  heatmapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    alignItems: 'center',
  },
  heatmapHint: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5F5F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
    fontWeight: '500',
  },
  promoCard: {
    backgroundColor: '#000',
    padding: 24,
    borderRadius: 24,
    marginTop: 16,
  },
  promoTitle: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  promoDesc: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
});
