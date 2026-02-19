import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions
} from 'react-native';
import { Search, MapPin, Star, Clock, ChevronRight, ShoppingBag } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MerchantCardSkeleton from '../components/common/MerchantCardSkeleton';
import { useCart } from '../context/CartContext';
import SmartCartModal from '../components/cart/SmartCartModal';
import { useMerchants } from '../hooks/useMerchants';
import BlurImage from '../components/common/BlurImage';

const { width } = Dimensions.get('window');

/**
 * HomeScreen Component
 * 
 * Pantalla principal de descubrimiento para el usuario final.
 * Implementa el "Bloque 1" del rediseño 2025: buscador inteligente, 
 * carrusel de historias, categorías y comercios cercanos.
 */
export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { items } = useCart();
    const { data: merchants, isLoading } = useMerchants();
    const [search, setSearch] = useState('');
    const [cartVisible, setCartVisible] = useState(false);

    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);


    const CATEGORIES = [
        { id: '1', name: 'Restaurantes', icon: '🍔' },
        { id: '2', name: 'Mercados', icon: '🛒' },
        { id: '3', name: 'Farmacia', icon: '💊' },
        { id: '4', name: 'Licores', icon: '🥂' },
        { id: '5', name: 'Mascotas', icon: '🐾' },
    ];

    const STORIES = [
        { id: '1', name: 'Pizza Hut', image: 'https://img.freepik.com/foto-gratis/pizza-pizza-rellena-con-ingredientes-pina-jamon_140725-3351.jpg' },
        { id: '2', name: 'McDonalds', image: 'https://img.freepik.com/foto-gratis/hamburguesa-carne-papas-fritas-bebida-fria_144627-22701.jpg' },
        { id: '3', name: 'Starbucks', image: 'https://img.freepik.com/foto-gratis/cafes-frios-crema-vasos-plastico_23-2148202356.jpg' },
        { id: '4', name: 'Sushi Zen', image: 'https://img.freepik.com/foto-gratis/conjunto-sushi-rollos-makis-bandeja-negra_140725-5441.jpg' },
    ];

    const NEARBY_MERCHANTS = [
        {
            id: '1',
            name: 'La Parrilla Urbana',
            rating: 4.8,
            time: '20-30 min',
            fee: 'Gratis',
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500',
            tags: ['Carnes', 'Gourmet']
        },
        {
            id: '2',
            name: 'Sushi Go!',
            rating: 4.5,
            time: '35-45 min',
            fee: '$500',
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500',
            tags: ['Sushi', 'Asiática']
        }
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
            >
                {/* Header - Location & Search */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.locationSelector}>
                        <MapPin size={20} color={Colors.light.primary} />
                        <Text style={styles.locationText}>Mi Casa • Calle Principal 123</Text>
                        <ChevronRight size={16} color="#666" />
                    </TouchableOpacity>

                    <View style={styles.searchContainer}>
                        <Search size={20} color="#999" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="¿Qué se te antoja hoy?"
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                {/* Stories Section */}
                <View style={styles.section}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContent}>
                        {STORIES.map((story) => (
                            <TouchableOpacity key={story.id} style={styles.storyItem}>
                                <View style={styles.storyRing}>
                                    <Image source={{ uri: story.image }} style={styles.storyImage} />
                                </View>
                                <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Categories Grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categorías</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                <Text style={styles.categoryText}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Filters */}
                <View style={styles.filtersContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
                        {['Envío Gratis', 'Menos de 30m', '⭐ 4.5+', 'Ofertas'].map((filter) => (
                            <TouchableOpacity key={filter} style={styles.filterBadge}>
                                <Text style={styles.filterText}>{filter}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Nearby Merchants */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Cerca de ti</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>
                    {isLoading ? (
                        <>
                            <MerchantCardSkeleton />
                            <MerchantCardSkeleton />
                            <MerchantCardSkeleton />
                        </>
                    ) : (
                        (merchants || []).map((merchant) => (
                            <TouchableOpacity key={merchant.id} style={styles.merchantCard}>
                                <BlurImage
                                    uri={merchant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80'}
                                    style={styles.merchantImage}
                                    testID={`merchant-image-${merchant.id}`}
                                />
                                <View style={styles.merchantInfo}>
                                    <View style={styles.merchantTitleRow}>
                                        <Text style={styles.merchantName}>{merchant.business_name}</Text>
                                        <View style={styles.ratingBadge}>
                                            <Star size={12} color="#FFB800" fill="#FFB800" />
                                            <Text style={styles.ratingText}>4.8</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.merchantTags}>Comida Rápida • Gourmet</Text>
                                    <View style={styles.merchantMeta}>
                                        <Clock size={14} color="#666" />
                                        <Text style={styles.metaText}>20-30 min</Text>
                                        <Text style={styles.metaDivider}>•</Text>
                                        <Text style={styles.metaText}>Envío: Gratis</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* Espacio para la TabBar */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Cart Button */}
            {cartCount > 0 && (
                <TouchableOpacity
                    style={[styles.floatingCart, { bottom: 100 + insets.bottom }]}
                    onPress={() => setCartVisible(true)}
                >
                    <View style={styles.cartContent}>
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartCount}</Text>
                        </View>
                        <ShoppingBag size={24} color="#000" />
                        <Text style={styles.viewCartText}>Ver carrito</Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Smart Cart Modal */}
            <SmartCartModal
                isVisible={cartVisible}
                onClose={() => setCartVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    floatingCart: {
        position: 'absolute',
        left: 20,
        right: 20,
        backgroundColor: Colors.light.primary,
        borderRadius: 20,
        height: 60,
        justifyContent: 'center',
        paddingHorizontal: 20,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    cartContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    cartBadge: {
        backgroundColor: '#000',
        borderRadius: 10,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    viewCartText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#000',
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 8
    },
    locationText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F3F5',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 15,
        gap: 10
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    section: {
        marginTop: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1A1A1A',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    storiesContent: {
        paddingHorizontal: 15,
        gap: 15
    },
    storyItem: {
        alignItems: 'center',
        width: 80,
    },
    storyRing: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 3,
        borderColor: Colors.light.primary,
        padding: 3,
        marginBottom: 5
    },
    storyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
        backgroundColor: '#EEE'
    },
    storyName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#444',
    },
    categoriesContent: {
        paddingHorizontal: 15,
        gap: 12
    },
    categoryCard: {
        width: 100,
        height: 110,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: 8
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333'
    },
    filtersContainer: {
        marginTop: 20,
    },
    filtersContent: {
        paddingHorizontal: 20,
        gap: 10
    },
    filterBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E9ECEF'
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#495057'
    },
    merchantCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 3,
    },
    merchantImage: {
        width: '100%',
        height: 160,
        backgroundColor: '#EEE'
    },
    merchantInfo: {
        padding: 15,
    },
    merchantTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    merchantName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A1A'
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#5C4A00'
    },
    merchantTags: {
        fontSize: 13,
        color: '#666',
        marginBottom: 10
    },
    merchantMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    metaText: {
        fontSize: 13,
        color: '#444',
        fontWeight: '600'
    },
    metaDivider: {
        color: '#DDD'
    }
});
