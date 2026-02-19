import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CheckCircle, ShieldCheck } from 'lucide-react-native';
import { Colors } from '../../../constants/Colors';

/**
 * Interfaz para las propiedades del componente DeliveryConfirmation.
 */
interface DeliveryConfirmationProps {
    orderId: string;
    method: 'pin' | 'photo';
    onConfirm: (data: { orderId: string, method: 'pin' | 'photo', data: string }) => void;
}

/**
 * Componente para gestionar la confirmación de entrega de un pedido.
 * 
 * Permite al repartidor validar la entrega mediante un PIN proporcionado por el cliente.
 * Este sistema reduce el fraude y asegura que el pedido fue entregado en mano.
 * 
 * @param {DeliveryConfirmationProps} props - Propiedades del componente.
 * @returns {JSX.Element} Un formulario especializado para confirmación.
 */
export default function DeliveryConfirmation({ orderId, method, onConfirm }: DeliveryConfirmationProps) {
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Procesa la confirmación del PIN.
     */
    const handleConfirm = () => {
        if (method === 'pin') {
            if (pin.length !== 4) {
                setError('El PIN debe tener 4 dígitos');
                return;
            }

            onConfirm({
                orderId,
                method: 'pin',
                data: pin
            });
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ShieldCheck color={Colors.light.primary} size={24} />
                <Text style={styles.title}>Confirmar Entrega</Text>
            </View>

            <Text style={styles.subtitle}>
                {method === 'pin'
                    ? 'Para finalizar, solicita el código de 4 dígitos al cliente.'
                    : 'Toma una fotografía del pedido en el lugar de entrega.'}
            </Text>

            {method === 'pin' && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, error ? styles.inputError : null]}
                        placeholder="Ingresa el PIN del cliente"
                        value={pin}
                        onChangeText={(text) => {
                            setPin(text.replace(/[^0-9]/g, '').slice(0, 4));
                            setError(null);
                        }}
                        keyboardType="number-pad"
                        maxLength={4}
                        secureTextEntry
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            )}

            <TouchableOpacity
                testID="confirm-delivery-button"
                style={[
                    styles.button,
                    (method === 'pin' && pin.length !== 4) || loading ? styles.buttonDisabled : null
                ]}
                onPress={handleConfirm}
                disabled={(method === 'pin' && pin.length !== 4) || loading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <>
                        <CheckCircle size={20} color="#000" />
                        <Text style={styles.buttonText}>Confirmar Entrega</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
        lineHeight: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '700',
        letterSpacing: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    inputError: {
        borderColor: '#FF5252',
        backgroundColor: '#FFF1F1',
    },
    errorText: {
        color: '#FF5252',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '600',
    },
    button: {
        backgroundColor: Colors.light.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 10,
    },
    buttonDisabled: {
        backgroundColor: '#E0E0E0',
        opacity: 0.7,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
});
