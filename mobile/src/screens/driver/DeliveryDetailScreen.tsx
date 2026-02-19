import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';

export default function DeliveryDetailScreen({ route, navigation }: any) {
  const { orderId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pedido #{orderId}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Mapa de Navegación</Text>
          <Text style={styles.mapSubtext}>Aquí se mostrará la ruta GPS</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.mainButton}>
            <Text style={styles.buttonText}>Iniciar Navegación</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#4CAF50', marginTop: 12 }]}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>Confirmar Entrega</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { fontSize: 16, color: '#007AFF', marginRight: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapText: { fontSize: 18, fontWeight: 'bold', color: '#757575' },
  mapSubtext: { fontSize: 14, color: '#9e9e9e' },
  actions: { paddingBottom: 20 },
  mainButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold', fontSize: 16, color: '#000' },
});
