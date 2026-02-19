import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import SafetyCenter, { IncidentReport } from '../../components/driver/SafetyCenter';

/**
 * Pantalla del Centro de Seguridad para el repartidor.
 * 
 * Centraliza todas las opciones de protección y asistencia. Permite a los
 * repartidores reaccionar rápidamente ante emergencias o problemas logísticos,
 * manteniendo una comunicación directa con el equipo de soporte y seguridad.
 * 
 * @returns {JSX.Element} La pantalla de seguridad completa.
 */
export default function SafetyScreen() {
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    /**
     * Procesa los incidentes reportados desde el componente hijo.
     * @param report Objeto con los detalles del incidente.
     */
    const handleIncidentReport = (report: IncidentReport) => {
        // Aquí se integraría con el backend/socket para notificar en tiempo real
        console.log('Incidente reportado:', report);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFF' }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Centro de Seguridad</Text>
                <Text style={styles.subtitle}>Tu protección es nuestra prioridad número uno</Text>
            </View>

            <View style={[styles.content, { paddingBottom: 110 + insets.bottom }]}>
                <SafetyCenter onReportSubmit={handleIncidentReport} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 14,
        color: '#757575',
        marginTop: 4,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    }
});
