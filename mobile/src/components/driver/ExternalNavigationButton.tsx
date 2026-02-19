import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Alert } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { Colors } from '../../../constants/Colors';

/**
 * Interfaz para las propiedades del componente ExternalNavigationButton.
 * 
 * @property {'google' | 'waze'} provider - El proveedor de mapas elegido.
 * @property {number} latitude - Latitud del destino.
 * @property {number} longitude - Longitud del destino.
 */
interface ExternalNavigationButtonProps {
    provider: 'google' | 'waze';
    latitude: number;
    longitude: number;
}

/**
 * Componente que renderiza un botón estilizado para abrir una dirección en una app de navegación externa.
 * 
 * Este componente facilita la vida al repartidor permitiéndole saltar a su app favorita 
 * (Google Maps o Waze) con un solo toque, pasando las coordenadas exactas del pedido.
 * 
 * @param {ExternalNavigationButtonProps} props - Propiedades del componente.
 * @returns {JSX.Element} Un botón táctil con icono y etiqueta.
 */
export default function ExternalNavigationButton({ provider, latitude, longitude }: ExternalNavigationButtonProps) {
    /**
     * Gestiona la apertura de la URL externa.
     */
    const handlePress = async () => {
        let url = '';

        if (provider === 'google') {
            // URL para Google Maps (Universal Link)
            url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        } else if (provider === 'waze') {
            // URL para Waze
            url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
        }

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', `No se pudo abrir ${provider === 'google' ? 'Google Maps' : 'Waze'}. ¿Está instalada la aplicación?`);
            }
        } catch (error) {
            console.error('Error al abrir navegación externa:', error);
            Alert.alert('Error', 'Hubo un fallo al intentar abrir la aplicación de navegación.');
        }
    };

    const isGoogle = provider === 'google';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: isGoogle ? '#4285F4' : '#33CCFF' }
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            {isGoogle ? (
                <MapPin size={18} color="#fff" />
            ) : (
                <Navigation size={18} color="#000" />
            )}
            <Text style={[styles.text, { color: isGoogle ? '#fff' : '#000' }]}>
                {isGoogle ? 'Google Maps' : 'Waze'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        fontSize: 14,
        fontWeight: '700',
    },
});
