import React from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Store, User, Bike } from 'lucide-react-native';

type Coord = { lat: number; lng: number };

/**
 * Mapa 2.0 - UnifiedMap
 * 
 * Componente de mapa premium con soporte para modo oscuro, 
 * marcadores personalizados y polilíneas suavizadas.
 */
export default function UnifiedMap({
  origin,
  destination,
}: {
  origin?: Coord;
  destination?: Coord;
}) {
  const o = origin || { lat: -34.6037, lng: -58.3816 };
  const d = destination || { lat: -34.62, lng: -58.44 };

  // Estilo oscuro para el mapa (JSON standard Google Maps)
  const mapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
    { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
    { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
  ];

  /**
   * Marcador Personalizado
   */
  const CustomMarker = ({ icon: Icon, color, label }: any) => (
    <View style={[styles.markerContainer, { backgroundColor: color }]}>
      <Icon size={14} color="#000" />
      <View style={[styles.markerArrow, { borderTopColor: color }]} />
    </View>
  );

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      customMapStyle={mapStyle}
      initialRegion={{
        latitude: (o.lat + d.lat) / 2,
        longitude: (o.lng + d.lng) / 2,
        latitudeDelta: Math.abs(o.lat - d.lat) + 0.05,
        longitudeDelta: Math.abs(o.lng - d.lng) + 0.05,
      }}
    >
      {/* Marcador Comercio */}
      <Marker coordinate={{ latitude: o.lat, longitude: o.lng }}>
        <CustomMarker icon={Store} color={Colors.light.primary} />
      </Marker>

      {/* Marcador Cliente */}
      <Marker coordinate={{ latitude: d.lat, longitude: d.lng }}>
        <CustomMarker icon={User} color="#FFFFFF" />
      </Marker>

      {/* Ruta (Simulando curva leve para Mapa 2.0) */}
      <Polyline
        coordinates={[
          { latitude: o.lat, longitude: o.lng },
          { latitude: (o.lat + d.lat) / 2 + 0.005, longitude: (o.lng + d.lng) / 2 },
          { latitude: d.lat, longitude: d.lng },
        ]}
        strokeColor={Colors.light.primary}
        strokeWidth={5}
        lineDashPattern={[0]}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  markerArrow: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
  }
});
