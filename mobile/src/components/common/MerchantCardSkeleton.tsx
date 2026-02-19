import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

/**
 * MerchantCardSkeleton Component
 * 
 * Versión placeholder de MerchantCard para estados de carga.
 * Mantiene la misma estructura visual que la tarjeta real para evitar saltos de layout.
 */
const MerchantCardSkeleton: React.FC = () => {
    return (
        <View style={styles.card}>
            {/* Marcador para la imagen principal */}
            <Skeleton width="100%" height={160} style={styles.image} />

            <View style={styles.info}>
                <View style={styles.titleRow}>
                    {/* Marcador para el nombre del comercio */}
                    <Skeleton width="60%" height={24} />
                    {/* Marcador para el badge de rating */}
                    <Skeleton width={50} height={24} style={styles.badge} />
                </View>

                {/* Marcador para los tags */}
                <Skeleton width="40%" height={16} style={styles.tags} />

                <View style={styles.meta}>
                    {/* Marcador para tiempo y costo de envío */}
                    <Skeleton width={80} height={16} />
                    <View style={styles.divider} />
                    <Skeleton width={100} height={16} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    image: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    info: {
        padding: 15,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badge: {
        borderRadius: 8,
    },
    tags: {
        marginBottom: 15,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    divider: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E1E9EE',
    },
});

export default MerchantCardSkeleton;
