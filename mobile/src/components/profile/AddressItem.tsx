import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, Briefcase, MapPin, ChevronRight, Check } from 'lucide-react-native';
import { Colors } from '../../../constants/Colors';
import { Address } from '../../lib/supabaseRest';

/**
 * Propiedades del componente AddressItem
 */
interface AddressItemProps {
    /** Objeto de dirección */
    address: Address;
    /** Callback al presionar el item */
    onPress?: () => void;
}

/**
 * AddressItem Component
 * 
 * Muestra una dirección con su alias e icono correspondiente.
 */
const AddressItem: React.FC<AddressItemProps> = ({ address, onPress }) => {

    /**
     * Determina el icono basado en el tipo de dirección
     */
    const getIcon = () => {
        switch (address.type) {
            case 'home': return Home;
            case 'work': return Briefcase;
            default: return MapPin;
        }
    };

    const Icon = getIcon();

    return (
        <TouchableOpacity
            style={[styles.container, address.is_default && styles.defaultContainer]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconBox, { backgroundColor: address.is_default ? Colors.light.primary + '20' : '#F1F3F5' }]}>
                <Icon size={20} color={address.is_default ? Colors.light.primary : '#666'} />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.alias}>{address.alias || 'Dirección'}</Text>
                    {address.is_default && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Principal</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.street} numberOfLines={1}>
                    {address.street}
                </Text>
                <Text style={styles.location}>
                    {address.commune}, {address.city}
                </Text>
            </View>

            <ChevronRight size={20} color="#CCC" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    defaultContainer: {
        borderColor: Colors.light.primary + '40',
        backgroundColor: '#FCFDFF',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    alias: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    badge: {
        backgroundColor: '#E6F4EA',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1E8E3E',
    },
    street: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },
    location: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
    }
});

export default AddressItem;
