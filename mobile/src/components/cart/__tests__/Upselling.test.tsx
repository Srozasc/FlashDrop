import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import SmartCartModal from '../SmartCartModal';
import { useCart } from '../../../context/CartContext';
import { api } from '../../../lib/supabaseRest';

// Mock de useCart
jest.mock('../../../context/CartContext', () => ({
    useCart: jest.fn(),
}));

// Mock de api
jest.mock('../../../lib/supabaseRest', () => ({
    api: {
        listProducts: jest.fn(),
    },
}));

// Mock de lucide-react-native
jest.mock('lucide-react-native', () => ({
    X: 'X',
    Plus: 'Plus',
    Minus: 'Minus',
    Trash2: 'Trash2',
    ShoppingBag: 'ShoppingBag',
    Sparkles: 'Sparkles', // Icono para sugerencias
}));

describe('SmartCartModal - Upselling Sugerido (TDD)', () => {
    const mockItems = [
        { id: '1', name: 'Hamburguesa Clásica', price: 1500, quantity: 1, merchant_id: 'm1' },
    ];

    const mockCart = {
        items: mockItems,
        total: 1500,
        changeQty: jest.fn(),
        remove: jest.fn(),
    };

    const mockSuggestions = [
        { id: 's1', name: 'Papas Fritas', price: 500, merchant_id: 'm1', image_url: null },
        { id: 's2', name: 'Gaseosa 500ml', price: 300, merchant_id: 'm1', image_url: null },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useCart as jest.Mock).mockReturnValue(mockCart);
        (api.listProducts as jest.Mock).mockResolvedValue(mockSuggestions);
    });

    it('debe mostrar la sección "Otros usuarios también compraron" con recomendaciones', async () => {
        render(<SmartCartModal isVisible={true} onClose={() => { }} />);

        await waitFor(() => {
            expect(screen.getByText(/Otros usuarios también compraron/i)).toBeTruthy();
            expect(screen.getByText('Papas Fritas')).toBeTruthy();
            expect(screen.getByText('Gaseosa 500ml')).toBeTruthy();
        });
    });
});
