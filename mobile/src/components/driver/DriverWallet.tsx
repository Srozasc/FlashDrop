import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Wallet, ArrowUpRight, TrendingUp, HandCoins, History } from 'lucide-react-native';
import { Colors } from '../../../constants/Colors';
import { useTheme } from '../../hooks/useTheme';

/**
 * Interfaz para el balance del repartidor.
 */
export interface WalletBalance {
    total: number;
    base: number;
    tips: number;
    bonuses: number;
}

/**
 * Interfaz para una transacción individual.
 */
export interface Transaction {
    id: string;
    type: 'order' | 'bonus' | 'withdrawal';
    amount: number;
    date: string;
    description: string;
}

/**
 * Propiedades del componente DriverWallet.
 */
interface DriverWalletProps {
    balance: WalletBalance;
    transactions: Transaction[];
    onCashOut: () => void;
}

/**
 * Componente DriverWallet para la gestión financiera del repartidor.
 * 
 * Muestra un resumen visual de las ganancias desglosadas (Base, Propinas, Bonos)
 * y una lista detallada de transacciones recientes. Incluye soporte para Dark Mode
 * y una estética premium basada en tarjetas redondeadas y sombras suaves.
 * 
 * @param {DriverWalletProps} props - Propiedades del componente.
 * @returns {JSX.Element} El componente de billetera.
 */
export default function DriverWallet({ balance, transactions, onCashOut }: DriverWalletProps) {
    const { isDark, colors } = useTheme();

    /**
     * Formatea un número como moneda local (USD para este ejemplo).
     * @param value Valor a formatear.
     */
    const formatCurrency = (value: number) => {
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    /**
     * Renderiza una tarjeta de desglose de ingresos.
     */
    const renderStatNode = (label: string, value: number, icon: JSX.Element, color: string) => (
        <View style={[styles.statNode, { backgroundColor: isDark ? '#1A1A1A' : '#F9F9FB' }]}>
            <View style={[styles.statIconFrame, { backgroundColor: color + '20' }]}>
                {icon}
            </View>
            <View>
                <Text style={[styles.statNodeLabel, { color: isDark ? '#AAA' : '#666' }]}>{label}</Text>
                <Text style={[styles.statNodeValue, { color: isDark ? '#FFF' : '#000' }]}>{formatCurrency(value)}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Tarjeta Principal de Balance */}
            <View style={[styles.mainCard, { backgroundColor: Colors.light.primary }]}>
                <View style={styles.mainCardHeader}>
                    <View style={styles.walletIconContainer}>
                        <Wallet color="#000" size={24} />
                    </View>
                    <Text style={styles.mainCardLabel}>Balance Disponible</Text>
                </View>
                <Text style={styles.mainCardValue}>{formatCurrency(balance.total)}</Text>

                <TouchableOpacity
                    style={styles.cashOutButton}
                    onPress={onCashOut}
                    activeOpacity={0.8}
                >
                    <Text style={styles.cashOutText}>Retirar Ahora</Text>
                    <ArrowUpRight color="#FFF" size={18} />
                </TouchableOpacity>
            </View>

            {/* Desglose de Ingresos */}
            <View style={styles.statsRow}>
                {renderStatNode('Base', balance.base, <TrendingUp size={20} color="#4CAF50" />, '#4CAF50')}
                {renderStatNode('Propinas', balance.tips, <HandCoins size={20} color="#2196F3" />, '#2196F3')}
            </View>
            <View style={styles.statsRow}>
                {renderStatNode('Bonos', balance.bonuses, <TrendingUp size={20} color="#FF9800" />, '#FF9800')}
                <View style={[styles.statNode, { backgroundColor: 'transparent' }]} />
            </View>

            {/* Historial de Transacciones */}
            <View style={styles.historyHeader}>
                <History size={20} color={isDark ? '#FFF' : '#000'} />
                <Text style={[styles.historyTitle, { color: isDark ? '#FFF' : '#000' }]}>Actividad reciente</Text>
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <View style={[styles.transactionItem, { borderBottomColor: isDark ? '#333' : '#F0F0F2' }]}>
                        <View style={styles.transactionLeft}>
                            <View style={[styles.transactionIcon, { backgroundColor: item.type === 'bonus' ? '#FFF3E0' : '#E8F5E9' }]}>
                                {item.type === 'bonus' ? <TrendingUp size={16} color="#FF9800" /> : <TrendingUp size={16} color="#4CAF50" />}
                            </View>
                            <View>
                                <Text style={[styles.transactionDesc, { color: isDark ? '#FFF' : '#000' }]}>{item.description}</Text>
                                <Text style={styles.transactionDate}>{item.date}</Text>
                            </View>
                        </View>
                        <Text style={[styles.transactionAmount, { color: item.amount > 0 ? '#4CAF50' : '#FF5252' }]}>
                            {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay transacciones todavía.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainCard: {
        padding: 24,
        borderRadius: 28,
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    mainCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    walletIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        padding: 8,
        borderRadius: 12,
    },
    mainCardLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        opacity: 0.7,
    },
    mainCardValue: {
        fontSize: 36,
        fontWeight: '900',
        color: '#000',
        marginBottom: 20,
    },
    cashOutButton: {
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignSelf: 'flex-start',
        gap: 8,
    },
    cashOutText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '800',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statNode: {
        flex: 1,
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statIconFrame: {
        padding: 8,
        borderRadius: 12,
    },
    statNodeLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    statNodeValue: {
        fontSize: 15,
        fontWeight: '800',
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 24,
        marginBottom: 16,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionDesc: {
        fontSize: 15,
        fontWeight: '700',
    },
    transactionDate: {
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 2,
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: '800',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9E9E9E',
        marginTop: 20,
        fontSize: 14,
    }
});
