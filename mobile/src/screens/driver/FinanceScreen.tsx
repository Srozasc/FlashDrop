import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, View, Alert, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import DriverWallet, { Transaction, WalletBalance } from '../../components/driver/DriverWallet';
import DriverLevelCard from '../../components/driver/DriverLevelCard';

/**
 * Pantalla de Finanzas para el repartidor.
 * 
 * Centraliza la gestión de ganancias, permitiendo ver el desglose detallado
 * del balance y realizar retiros instantáneos (Cash Out). Utiliza el componente
 * DriverWallet para la visualización de datos financieros y maneja la lógica
 * de interacción con la cuenta bancaria.
 * 
 * @returns {JSX.Element} La pantalla de finanzas completa.
 */
export default function FinanceScreen() {
    const { isDark, colors } = useTheme();
    const insets = useSafeAreaInsets();

    // Datos de ejemplo para la visualización premium
    const [balance] = useState<WalletBalance>({
        total: 1550.50,
        base: 1200.00,
        tips: 250.50,
        bonuses: 100.00
    });

    const [transactions] = useState<Transaction[]>([
        { id: '1', type: 'order', amount: 450.00, date: 'Hoy, 14:30', description: 'Pedido #7890' },
        { id: '2', type: 'bonus', amount: 50.00, date: 'Hoy, 09:15', description: 'Bono puntualidad' },
        { id: '3', type: 'order', amount: 320.00, date: 'Ayer, 21:00', description: 'Pedido #7885' },
        { id: '4', type: 'withdrawal', amount: -1000.00, date: 'Ayer, 10:00', description: 'Retiro a Banco Galicia' },
        { id: '5', type: 'bonus', amount: 120.00, date: '16 Feb, 15:40', description: 'Bono fin de semana' },
    ]);

    /**
     * Procesa la solicitud de retiro de fondos.
     */
    const handleCashOut = () => {
        Alert.alert(
            'Retiro Instantáneo',
            '¿Deseas transferir tus ganancias a tu cuenta bancaria vinculada?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: () => Alert.alert('Éxito', 'Tu transferencia de $1,550.50 está en camino.')
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFF' }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Mis Finanzas</Text>
                <Text style={styles.subtitle}>Gestiona tus ganancias de FlashDrop</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: 110 + insets.bottom }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <DriverWallet
                    balance={balance}
                    transactions={transactions}
                    onCashOut={handleCashOut}
                />

                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>Estatus de Repartidor</Text>
                <DriverLevelCard level="Silver" points={450} nextLevelPoints={1000} />
            </ScrollView>
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
        paddingBottom: 10,
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
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 32,
        marginBottom: 16,
    }
});
