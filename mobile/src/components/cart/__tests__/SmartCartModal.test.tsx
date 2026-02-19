import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import SmartCartModal from '../SmartCartModal';
import { useCart } from '../../../context/CartContext';

// Mock de useCart
jest.mock('../../../context/CartContext', () => ({
    useCart: jest.fn(),
}));

// Mock de lucide-react-native
jest.mock('lucide-react-native', () => ({
    X: 'X',
    Plus: 'Plus',
    Minus: 'Minus',
    Trash2: 'Trash2',
    ShoppingBag: 'ShoppingBag',
}));

describe('SmartCartModal Component', () => {
    const mockItems = [
        { id: '1', name: 'Pizza Margherita', price: 1200, quantity: 2, merchant_id: 'm1' },
        { id: '2', name: 'Refresco 500ml', price: 350, quantity: 1, merchant_id: 'm1' },
    ];

    const mockCart = {
        items: mockItems,
        total: 2750,
        changeQty: jest.fn(),
        remove: jest.fn(),
        clear: jest.fn(),
    };

    beforeEach(() => {
        (useCart as jest.Mock).mockReturnValue(mockCart);
    });

    it('debe mostrar la lista de productos y el total', () => {
        render(<SmartCartModal isVisible={true} onClose={() => { }} />);

        expect(screen.getByText('Pizza Margherita')).toBeTruthy();
        expect(screen.getByText('Refresco 500ml')).toBeTruthy();
        expect(screen.getByText(/2.750/)).toBeTruthy(); // Total formateado si aplica
    });

    it('debe llamar a changeQty al presionar botones de cantidad', () => {
        render(<SmartCartModal isVisible={true} onClose={() => { }} />);

        const plusButtons = screen.getAllByTestId('plus-button');
        fireEvent.press(plusButtons[0]);

        expect(mockCart.changeQty).toHaveBeenCalledWith('1', 3);
    });

    it('debe llamar a remove al presionar el icono de basura', () => {
        render(<SmartCartModal isVisible={true} onClose={() => { }} />);

        const deleteButtons = screen.getAllByTestId('delete-button');
        fireEvent.press(deleteButtons[1]);

        expect(mockCart.remove).toHaveBeenCalledWith('2');
    });

    it('debe mostrar mensaje de carrito vacio', () => {
        (useCart as jest.Mock).mockReturnValue({
            ...mockCart,
            items: [],
            total: 0,
        });

        render(<SmartCartModal isVisible={true} onClose={() => { }} />);
        expect(screen.getByText(/Tu carrito está vacío/i)).toBeTruthy();
    });
});
