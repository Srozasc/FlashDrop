import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

/**
 * Interfaz para los puntos de calor (Hotspots).
 * 
 * @property {string} id - Identificador único del punto.
 * @property {number} latitude - Latitud de la zona de demanda.
 * @property {number} longitude - Longitud de la zona de demanda.
 * @property {number} weight - Intensidad de la demanda (1-10), determina el radio y opacidad.
 */
export interface Hotspot {
    id: string;
    latitude: number;
    longitude: number;
    weight: number;
}

/**
 * Interfaz para las propiedades del componente OrderHeatmap.
 * 
 * @property {Hotspot[]} hotspots - Lista de coordenadas con peso de demanda.
 * @property {object} [region] - Región inicial del mapa.
 */
interface OrderHeatmapProps {
    hotspots: Hotspot[];
    region?: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
}

/**
 * Componente OrderHeatmap para visualizar zonas de alta demanda de pedidos.
 * 
 * Este componente renderiza un mapa interactivo con círculos de "calor" que ayudan
 * al repartidor a identificar dónde posicionarse para recibir más pedidos.
 * Está optimizado para Dark Mode OLED con un estilo de mapa personalizado.
 * 
 * @param {OrderHeatmapProps} props - Propiedades del componente.
 * @returns {JSX.Element} El componente de mapa de calor.
 */
export default function OrderHeatmap({ hotspots, region }: OrderHeatmapProps) {
    const { isDark } = useTheme();

    // Estilo de mapa oscuro premium para pantallas OLED
    const darkMapStyle = [
        {
            "elementType": "geometry",
            "stylers": [{ "color": "#212121" }]
        },
        {
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#757575" }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#212121" }]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{ "color": "#757575" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#2c2c2c" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#000000" }]
        }
    ];

    const defaultRegion = {
        latitude: -34.6037,
        longitude: -58.3816,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={styles.container}>
            <MapView
                testID="map-view"
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region || defaultRegion}
                customMapStyle={isDark ? darkMapStyle : []}
            >
                {hotspots.map((spot) => (
                    <React.Fragment key={spot.id}>
                        {/* Capa exterior suave */}
                        <Circle
                            testID="heatmap-circle"
                            center={{ latitude: spot.latitude, longitude: spot.longitude }}
                            radius={300 * (spot.weight / 2)}
                            fillColor={isDark ? 'rgba(255, 193, 7, 0.15)' : 'rgba(255, 193, 7, 0.2)'}
                            strokeColor="transparent"
                        />
                        {/* Núcleo de calor */}
                        <Circle
                            center={{ latitude: spot.latitude, longitude: spot.longitude }}
                            radius={100 * (spot.weight / 3)}
                            fillColor={isDark ? 'rgba(255, 122, 0, 0.4)' : 'rgba(255, 122, 0, 0.5)'}
                            strokeColor="transparent"
                        />
                    </React.Fragment>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        borderRadius: 16,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
