import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { Colors } from '../../../constants/Colors';
import { api, Product } from '../../lib/supabaseRest';

/**
 * Propiedades para el componente SmartCartModal
 */
interface SmartCartModalProps {
    /** Controla si el modal es visible */
    isVisible: boolean;
    /** Función para cerrar el modal */
    onClose: () => void;
}

/**
 * SmartCartModal Component
 * 
 * Un modal estilo Bottom Sheet diseñado para gestionar el carrito de compras.
 * Permite ver ítems, ajustar cantidades, acceder al checkout y ver sugerencias de upselling.
 */
const SmartCartModal: React.FC<SmartCartModalProps> = ({ isVisible, onClose }) => {
    const { items, total, changeQty, remove, add } = useCart();
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    /**
     * Carga sugerencias de productos basadas en el contenido del carrito (Upselling)
     */
    useEffect(() => {
        async function loadSuggestions() {
            if (items.length > 0 && isVisible) {
                setLoadingSuggestions(true);
                try {
                    // Algoritmo simple: sugerir otros productos del mismo merchant
                    const merchantId = items[0].merchant_id;
                    const allProducts = await api.listProducts(merchantId);

                    // Filtrar productos que YA están en el carrito
                    const itemIds = new Set(items.map(i => i.id));
                    const filtered = (allProducts || [])
                        .filter((p: Product) => !itemIds.has(p.id))
                        .slice(0, 5); // Mostrar máximo 5

                    setSuggestions(filtered);
                } catch (error) {
                    console.error("Error loading upselling suggestions:", error);
                } finally {
                    setLoadingSuggestions(false);
                }
            } else {
                setSuggestions([]);
            }
        }
        loadSuggestions();
    }, [items.length, isVisible]);

    /**
     * Formatea un número como moneda local
     */
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.dismissArea}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={styles.modalContent}>
                    {/* Indicador de arrastre visual */}
                    <View style={styles.dragIndicator} />

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Tu Pedido</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {items.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <ShoppingBag size={40} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
                            <Text style={styles.emptySubtitle}>Agrega algunos productos de tus comercios favoritos para comenzar.</Text>
                            <TouchableOpacity style={styles.continueButton} onPress={onClose}>
                                <Text style={styles.continueButtonText}>Explorar comercios</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
                                <View style={styles.itemsList}>
                                    {items.map((item) => (
                                        <View key={item.id} style={styles.cartItem}>
                                            <View style={styles.itemInfo}>
                                                <Text style={styles.itemName}>{item.name}</Text>
                                                <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
                                            </View>

                                            <View style={styles.actionsContainer}>
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => remove(item.id)}
                                                    testID="delete-button"
                                                >
                                                    <Trash2 size={20} color="#FF6B6B" />
                                                </TouchableOpacity>

                                                <View style={styles.quantityControls}>
                                                    <TouchableOpacity
                                                        style={styles.qtyBtn}
                                                        onPress={() => changeQty(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus size={16} color="#333" />
                                                    </TouchableOpacity>

                                                    <Text style={styles.quantityText}>{item.quantity}</Text>

                                                    <TouchableOpacity
                                                        style={styles.qtyBtn}
                                                        onPress={() => changeQty(item.id, item.quantity + 1)}
                                                        testID="plus-button"
                                                    >
                                                        <Plus size={16} color="#333" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>

                                {/* Sección de Upselling */}
                                {suggestions.length > 0 && (
                                    <View style={styles.upsellingContainer}>
                                        <View style={styles.upsellingHeader}>
                                            <Sparkles size={18} color={Colors.light.primary} fill={Colors.light.primary} />
                                            <Text style={styles.upsellingTitle}>Otros usuarios también compraron</Text>
                                        </View>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsContent}>
                                            {suggestions.map((suggestion) => (
                                                <TouchableOpacity
                                                    key={suggestion.id}
                                                    style={styles.suggestionCard}
                                                    onPress={() => add({
                                                        id: suggestion.id,
                                                        name: suggestion.name,
                                                        price: suggestion.price,
                                                        merchant_id: suggestion.merchant_id,
                                                        image_url: suggestion.image_url
                                                    })}
                                                >
                                                    <Image
                                                        source={{ uri: suggestion.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' }}
                                                        style={styles.suggestionImage}
                                                    />
                                                    <Text style={styles.suggestionName} numberOfLines={1}>{suggestion.name}</Text>
                                                    <Text style={styles.suggestionPrice}>{formatCurrency(suggestion.price)}</Text>
                                                    <View style={styles.addSmallBtn}>
                                                        <Plus size={12} color="#000" />
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                                {loadingSuggestions && (
                                    <ActivityIndicator style={{ marginTop: 20 }} color={Colors.light.primary} />
                                )}
                            </ScrollView>

                            <View style={styles.footer}>
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                                </View>

                                <TouchableOpacity style={styles.checkoutButton}>
                                    <Text style={styles.checkoutText}>Continuar al pago</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                    <SafeAreaView />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        minHeight: '60%',
        maxHeight: '90%',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    dragIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#DDD',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1A1A1A',
    },
    closeButton: {
        padding: 5,
    },
    scrollArea: {
        flex: 1,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF9E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    continueButton: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 15,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    itemsList: {
        paddingHorizontal: 25,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: '800',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 4,
    },
    qtyBtn: {
        padding: 8,
    },
    quantityText: {
        fontSize: 15,
        fontWeight: '800',
        paddingHorizontal: 10,
        minWidth: 30,
        textAlign: 'center',
    },
    deleteButton: {
        padding: 8,
    },
    upsellingContainer: {
        marginTop: 30,
        marginBottom: 20,
    },
    upsellingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 25,
        marginBottom: 15,
    },
    upsellingTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    suggestionsContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    suggestionCard: {
        width: 140,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F1F3F5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    suggestionImage: {
        width: '100%',
        height: 90,
        borderRadius: 15,
        marginBottom: 10,
        backgroundColor: '#F8F9FA',
    },
    suggestionName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    suggestionPrice: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.light.primary,
    },
    addSmallBtn: {
        position: 'absolute',
        right: 8,
        bottom: 8,
        backgroundColor: Colors.light.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 25,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F3F5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1A1A',
    },
    checkoutButton: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    checkoutText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000',
    },
});

export default SmartCartModal;
