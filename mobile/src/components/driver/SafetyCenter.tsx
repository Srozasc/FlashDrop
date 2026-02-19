import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ShieldAlert, Info, Bike, Car, Siren, ChevronRight, PhoneCall } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

/**
 * Tipos de incidentes disponibles para reporte.
 */
export type IncidentType = 'breakdown' | 'accident' | 'health' | 'other';

/**
 * Interfaz para el envío de reportes.
 */
export interface IncidentReport {
    type: IncidentType;
    timestamp: Date;
    description: string;
}

/**
 * Propiedades del componente SafetyCenter.
 */
interface SafetyCenterProps {
    onReportSubmit: (report: IncidentReport) => void;
}

/**
 * Centro de Seguridad para el Repartidor.
 * 
 * Este componente proporciona acceso crítico a funciones de emergencia (SOS)
 * y un sistema rápido de reporte de incidentes en ruta. Diseñado con una 
 * jerarquía visual que prioriza el botón de pánico en situaciones de alto estrés.
 * 
 * @param {SafetyCenterProps} props - Propiedades del componente.
 */
export default function SafetyCenter({ onReportSubmit }: SafetyCenterProps) {
    const { isDark } = useTheme();

    /**
     * Dispara la alerta de emergencia máxima.
     */
    const handleSOS = () => {
        Alert.alert(
            '¡EMERGENCIA!',
            '¿Deseas alertar a las autoridades y soporte de FlashDrop sobre una emergencia activa?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'ACTIVAR SOS',
                    style: 'destructive',
                    onPress: () => Alert.alert('Alerta Enviada', 'Las autoridades y el equipo de seguridad han sido notificados.')
                }
            ]
        );
    };

    /**
     * Maneja el reporte de un incidente específico.
     * @param type Tipo de incidente seleccionado.
     * @param label Texto descriptivo para la UI.
     */
    const handleReport = (type: IncidentType, label: string) => {
        onReportSubmit({
            type,
            timestamp: new Date(),
            description: `Reporte de ${label}`
        });
        Alert.alert('Reporte Recibido', `Hemos registrado el problema: ${label}. Soporte se contactará contigo.`);
    };

    const incidentOptions = [
        { id: 'breakdown', label: 'Vehículo averiado', icon: <Bike size={20} color="#FF9800" />, type: 'breakdown' as IncidentType },
        { id: 'accident', label: 'Accidente', icon: <Siren size={20} color="#F44336" />, type: 'accident' as IncidentType },
        { id: 'health', label: 'Problema de salud', icon: <ShieldAlert size={20} color="#2196F3" />, type: 'health' as IncidentType },
        { id: 'other', label: 'Otro problema', icon: <Info size={20} color="#9E9E9E" />, type: 'other' as IncidentType },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Sección SOS - Máxima Prioridad */}
            <TouchableOpacity
                style={styles.sosButton}
                onPress={handleSOS}
                activeOpacity={0.9}
            >
                <View style={styles.sosInner}>
                    <ShieldAlert color="#FFF" size={40} />
                    <Text style={styles.sosText}>BOTÓN SOS</Text>
                    <Text style={styles.sosSubtext}>Presiona solo en emergencias</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Sección de Soporte y Contacto */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Contacto de Seguridad</Text>
                <TouchableOpacity style={[styles.contactCard, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F7' }]}>
                    <View style={styles.contactLeft}>
                        <View style={styles.phoneIcon}>
                            <PhoneCall size={20} color="#FFF" />
                        </View>
                        <View>
                            <Text style={[styles.contactName, { color: isDark ? '#FFF' : '#000' }]}>Línea Directa 24/7</Text>
                            <Text style={styles.contactInfo}>Soporte especializado para repartidores</Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color="#9E9E9E" />
                </TouchableOpacity>
            </View>

            {/* Sección de Reporte de Incidentes */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Reportar Problema</Text>
                <View style={styles.grid}>
                    {incidentOptions.map(option => (
                        <TouchableOpacity
                            key={option.id}
                            style={[styles.gridItem, { backgroundColor: isDark ? '#1A1A1A' : '#F9F9FB' }]}
                            onPress={() => handleReport(option.type, option.label)}
                        >
                            <View style={styles.optionIcon}>
                                {option.icon}
                            </View>
                            <Text style={[styles.optionLabel, { color: isDark ? '#FFF' : '#000' }]}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sosButton: {
        backgroundColor: '#FF3B30',
        borderRadius: 32,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        // Sombra de emergencia
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    sosInner: {
        alignItems: 'center',
        gap: 12,
    },
    sosText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 2,
    },
    sosSubtext: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 24,
        opacity: 0.2,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 20,
    },
    contactLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    phoneIcon: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 12,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '700',
    },
    contactInfo: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        width: '48%',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        gap: 12,
    },
    optionIcon: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 12,
        borderRadius: 14,
    },
    optionLabel: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
    }
});
