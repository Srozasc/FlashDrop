import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, Star, Zap, Check } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

/**
 * Tipos de niveles disponibles para el repartidor.
 */
export type DriverLevel = 'Bronze' | 'Silver' | 'Gold';

/**
 * Propiedades del componente DriverLevelCard.
 */
interface DriverLevelCardProps {
    level: DriverLevel;
    points: number;
    nextLevelPoints: number;
}

/**
 * Componente DriverLevelCard para el sistema de fidelización de repartidores.
 * 
 * Visualiza el estatus actual del repartidor mediante un sistema de niveles,
 * mostrando el progreso hacia el siguiente escalón y los beneficios asociados.
 * Utiliza una estética premium con colores metalizados y barra de progreso animada visualmente.
 * 
 * @param {DriverLevelCardProps} props - Propiedades del componente.
 * @returns {JSX.Element} La tarjeta de nivel.
 */
export default function DriverLevelCard({ level, points, nextLevelPoints }: DriverLevelCardProps) {
    const { isDark } = useTheme();

    /**
     * Define los colores y beneficios según el nivel.
     */
    const getLevelConfig = () => {
        switch (level) {
            case 'Gold':
                return {
                    color: '#FFD700',
                    bg: '#FFF9E6',
                    description: 'Estatus Élite',
                    benefits: ['+15% tarifa base', 'Soporte prioritario', 'Acceso anticipado a zonas']
                };
            case 'Silver':
                return {
                    color: '#C0C0C0',
                    bg: '#F5F5F5',
                    description: 'Repartidor Experimentado',
                    benefits: ['+5% tarifa base', 'Canje de puntos por bonos']
                };
            default:
                return {
                    color: '#CD7F32',
                    bg: '#FAF3ED',
                    description: 'Comienzo de carrera',
                    benefits: ['Tarifa base estándar']
                };
        }
    };

    const config = getLevelConfig();
    const progress = Math.min((points / nextLevelPoints) * 100, 100);

    return (
        <View style={[
            styles.container,
            { backgroundColor: isDark ? '#1A1A1A' : config.bg, borderColor: isDark ? '#333' : '#E0E0E0' }
        ]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
                    <Award size={32} color={config.color} />
                </View>
                <View>
                    <Text style={[styles.levelTitle, { color: isDark ? '#FFF' : '#000' }]}>Nivel {level}</Text>
                    <Text style={styles.levelDesc}>{config.description}</Text>
                </View>
            </View>

            {/* Barra de Progreso */}
            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={[styles.progressText, { color: isDark ? '#AAA' : '#666' }]}>Progreso de nivel</Text>
                    <Text style={[styles.pointsText, { color: isDark ? '#FFF' : '#000' }]}>{points} / {nextLevelPoints} pts</Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: isDark ? '#333' : '#EEE' }]}>
                    <View
                        testID="progress-bar-fill"
                        style={[
                            styles.progressFill,
                            { width: `${progress}%`, backgroundColor: config.color }
                        ]}
                    />
                </View>
            </View>

            {/* Beneficios */}
            <View style={styles.benefitsSection}>
                <Text style={[styles.benefitsTitle, { color: isDark ? '#FFF' : '#000' }]}>Tus beneficios:</Text>
                {config.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                        <Check size={14} color={config.color} />
                        <Text style={[styles.benefitText, { color: isDark ? '#CCC' : '#444' }]}>{benefit}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelTitle: {
        fontSize: 22,
        fontWeight: '900',
    },
    levelDesc: {
        fontSize: 14,
        color: '#757575',
        fontWeight: '600',
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '700',
    },
    pointsText: {
        fontSize: 12,
        fontWeight: '800',
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 5,
    },
    benefitsSection: {
        gap: 8,
    },
    benefitsTitle: {
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 4,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    benefitText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
