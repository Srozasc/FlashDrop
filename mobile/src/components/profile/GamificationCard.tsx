import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Trophy, Star, Crown, Zap } from 'lucide-react-native';
import { Colors } from '../../../constants/Colors';

/**
 * Propiedades del componente GamificationCard
 */
interface GamificationCardProps {
    /** Puntos actuales del usuario */
    points: number;
    /** Nivel actual del usuario (Bronce, Plata, Oro) */
    level: 'Bronce' | 'Plata' | 'Oro';
}

/**
 * GamificationCard Component
 * 
 * Muestra el estatus de fidelización del usuario, sus puntos y progreso.
 * Diseñado con una estética premium y minimalista.
 */
const GamificationCard: React.FC<GamificationCardProps> = ({ points, level }) => {

    // Configuración por nivel
    const levelConfig = {
        Bronce: { icon: Trophy, color: '#CD7F32', next: 1000, label: 'Bronce' },
        Plata: { icon: Star, color: '#C0C0C0', next: 5000, label: 'Plata' },
        Oro: { icon: Crown, color: '#FFD700', next: 10000, label: 'Oro' },
    };

    const config = levelConfig[level] || levelConfig.Bronce;
    const Icon = config.icon;

    // Cálculo de progreso
    const prevThreshold = level === 'Plata' ? 1000 : level === 'Oro' ? 5000 : 0;
    const progress = Math.min(Math.max((points - prevThreshold) / (config.next - prevThreshold), 0), 1);

    /**
     * Formatea los puntos con separadores de miles
     */
    const formatPoints = (val: number) => {
        return new Intl.NumberFormat('es-AR').format(val);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.iconCircle, { backgroundColor: config.color + '20' }]}>
                    <Icon size={24} color={config.color} />
                </View>
                <View style={styles.levelInfo}>
                    <Text style={styles.levelLabel}>Nivel {config.label}</Text>
                    <View style={styles.pointsRow}>
                        <Zap size={14} color={Colors.light.primary} fill={Colors.light.primary} />
                        <Text style={styles.pointsText}>{formatPoints(points)} puntos</Text>
                    </View>
                </View>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progreso al siguiente nivel</Text>
                    <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
                </View>

                <View style={styles.progressBarContainer} testID="progress-bar">
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${progress * 100}%`, backgroundColor: config.color }
                        ]}
                    />
                </View>

                <View style={styles.thresholds}>
                    <Text style={styles.thresholdText}>{formatPoints(prevThreshold)}</Text>
                    <Text style={styles.thresholdText}>{formatPoints(config.next)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1A1A',
        borderRadius: 25,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    levelInfo: {
        flex: 1,
    },
    levelLabel: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pointsText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#ADB5BD',
    },
    progressSection: {
        marginTop: 5,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ADB5BD',
    },
    progressPercent: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    thresholds: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    thresholdText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#666',
    }
});

export default GamificationCard;
