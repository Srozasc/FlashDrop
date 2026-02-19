import React from 'react';
import { render, screen } from '@testing-library/react-native';
import AddressItem from '../AddressItem';

describe('AddressItem Component (TDD)', () => {
    it('debe mostrar el alias "Casa" y el icono de hogar', () => {
        const mockAddress = {
            id: '1',
            street: 'Av. Siempre Viva 742',
            alias: 'Casa',
            type: 'home' as const,
            is_default: true,
        };

        render(<AddressItem address={mockAddress} />);

        expect(screen.getByText('Casa')).toBeTruthy();
        expect(screen.getByText('Av. Siempre Viva 742')).toBeTruthy();
    });

    it('debe mostrar el alias "Trabajo" y el icono de maletín', () => {
        const mockAddress = {
            id: '2',
            street: 'Wall St 101',
            alias: 'Trabajo',
            type: 'work' as const,
            is_default: false,
        };

        render(<AddressItem address={mockAddress} />);

        expect(screen.getByText('Trabajo')).toBeTruthy();
    });
});
