import React from 'react';
import { render } from '@testing-library/react-native';
import DriverWallet from '../DriverWallet';

describe('DriverWallet', () => {
    const mockBalance = {
        total: 1550.50,
        base: 1200.00,
        tips: 250.50,
        bonuses: 100.00
    };

    const mockTransactions = [
        { id: '1', type: 'order', amount: 450.00, date: 'Hoy, 14:30', description: 'Pedido #7890' },
        { id: '2', type: 'bonus', amount: 50.00, date: 'Ayer, 18:00', description: 'Bono lluvia' },
    ];

    it('debe mostrar el balance total formateado correctamente', () => {
        const { getByText } = render(
            <DriverWallet
                balance={mockBalance}
                transactions={[]}
                onCashOut={() => { }}
            />
        );

        expect(getByText('$1,550.50')).toBeTruthy();
    });

    it('debe mostrar el desglose de ingresos (Base, Propinas, Bonos)', () => {
        const { getByText } = render(
            <DriverWallet
                balance={mockBalance}
                transactions={[]}
                onCashOut={() => { }}
            />
        );

        expect(getByText('$1,200.00')).toBeTruthy(); // Base
        expect(getByText('$250.50')).toBeTruthy();  // Propinas
        expect(getByText('$100.00')).toBeTruthy();  // Bonos
    });

    it('debe renderizar la lista de transacciones', () => {
        const { getByText } = render(
            <DriverWallet
                balance={mockBalance}
                transactions={mockTransactions}
                onCashOut={() => { }}
            />
        );

        expect(getByText('Pedido #7890')).toBeTruthy();
        expect(getByText('Bono lluvia')).toBeTruthy();
        expect(getByText('+$450.00')).toBeTruthy();
    });
});
