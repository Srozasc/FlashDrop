import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import CheckoutScreen from '../CheckoutScreen';
import { useCart } from '../../context/CartContext';
import { api } from '../../lib/supabaseRest';

// Mock de useCart
jest.mock('../../context/CartContext', () => ({
    useCart: jest.fn(),
}));

// Mock de api
jest.mock('../../lib/supabaseRest', () => ({
    api: {
        listAddresses: jest.fn(),
        listMerchants: jest.fn(),
        createOrder: jest.fn(),
        createOrderItems: jest.fn(),
        listPaymentMethods: jest.fn(), // Nuevo método esperado
    },
}));

// Mock de navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        goBack: jest.fn(),
        navigate: jest.fn(),
    }),
}));

// Mock de safe area
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock de lucide-react-native
jest.mock('lucide-react-native', () => ({
    CreditCard: 'CreditCard',
    MapPin: 'MapPin',
    ShoppingBag: 'ShoppingBag',
    ArrowLeft: 'ArrowLeft',
    CheckCircle2: 'CheckCircle2',
}));

describe('CheckoutScreen Component (TDD - One-Tap Checkout)', () => {
    const mockItems = [
        { id: '1', name: 'Pizza Margherita', price: 1200, quantity: 2, merchant_id: 'm1' },
    ];

    const mockCart = {
        items: mockItems,
        total: 2400,
        merchantId: 'm1',
        changeQty: jest.fn(),
        remove: jest.fn(),
        clear: jest.fn(),
    };

    const mockAddresses = [
        { id: 'addr1', street: 'Calle Falsa 123', is_default: true },
    ];

    const mockPaymentMethods = [
        { id: 'pm1', type: 'visa', last4: '4242', brand: 'Visa' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useCart as jest.Mock).mockReturnValue(mockCart);
        (api.listAddresses as jest.Mock).mockResolvedValue(mockAddresses);
        (api.listMerchants as jest.Mock).mockResolvedValue([{ id: 'm1', delivery_fee: 500 }]);
        (api.listPaymentMethods as jest.Mock).mockResolvedValue(mockPaymentMethods);
    });

    it('debe mostrar la sección de dirección y métodos de pago', async () => {
        render(<CheckoutScreen />);

        await waitFor(() => {
            expect(screen.getByText('Dirección de Entrega')).toBeTruthy();
            expect(screen.getByText('Método de Pago')).toBeTruthy();
            expect(screen.getByText(/Visa \*\*\*\* 4242/)).toBeTruthy();
        });
    });

    it('debe permitir completar el pedido con un solo toque al tener todo seleccionado', async () => {
        (api.createOrder as jest.Mock).mockResolvedValue({ id: 123 });
        (api.createOrderItems as jest.Mock).mockResolvedValue(true);

        render(<CheckoutScreen />);

        // Esperar a que se carguen los datos (aparezca la dirección)
        await waitFor(() => {
            expect(screen.getByText('Calle Falsa 123')).toBeTruthy();
        });

        const confirmBtn = screen.getByText(/Confirmar y Pagar/i);
        fireEvent.press(confirmBtn);

        await waitFor(() => {
            expect(api.createOrder).toHaveBeenCalled();
        });
        expect(api.createOrderItems).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByText(/¡Pedido Exitoso!/i)).toBeTruthy();
        });
    });
});
