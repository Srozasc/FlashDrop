import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMerchants } from '../../hooks/useMerchants';

// Mock de lucide-react-native
jest.mock('lucide-react-native', () => ({
    Search: 'Search',
    MapPin: 'MapPin',
    ChevronRight: 'ChevronRight',
    Star: 'Star',
    Clock: 'Clock',
    ShoppingBag: 'ShoppingBag',
}));

// Mock de react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }: any) => children,
}));

// Mock de useCart
jest.mock('../../context/CartContext', () => ({
    useCart: () => ({ items: [] }),
}));

// Mock de useMerchants para evitar llamadas reales a la API y problemas de QueryClient
jest.mock('../../hooks/useMerchants', () => ({
    useMerchants: jest.fn(),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('HomeScreen', () => {
    beforeEach(() => {
        (useMerchants as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
        });
    });

    it('debe renderizar el buscador', () => {
        render(<HomeScreen />, { wrapper });
        expect(screen.getByPlaceholderText(/¿Qué se te antoja hoy?/i)).toBeTruthy();
    });

    it('debe mostrar las categorías principales', () => {
        render(<HomeScreen />, { wrapper });
        expect(screen.getByText(/Restaurantes/i)).toBeTruthy();
        expect(screen.getByText(/Mercados/i)).toBeTruthy();
    });

    it('debe mostrar la sección de comercios cercanos', () => {
        render(<HomeScreen />, { wrapper });
        expect(screen.getByText(/Cerca de ti/i)).toBeTruthy();
    });

    it('debe mostrar los filtros rápidos', () => {
        render(<HomeScreen />, { wrapper });
        expect(screen.getByText(/Envío Gratis/i)).toBeTruthy();
        expect(screen.getByText(/Menos de 30m/i)).toBeTruthy();
    });
});
