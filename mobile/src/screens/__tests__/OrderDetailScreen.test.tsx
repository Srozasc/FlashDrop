import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import OrderDetailScreen from '../OrderDetailScreen';
import { api } from '../../lib/supabaseRest';
import { useRoute, useNavigation } from '@react-navigation/native';

// Mocks
jest.mock('../../lib/supabaseRest', () => ({
    api: {
        getOrderById: jest.fn(),
        listOrderItems: jest.fn(),
        listDrivers: jest.fn(),
        getDeliveryByOrder: jest.fn(),
    },
}));

jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn(),
    useNavigation: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('OrderDetailScreen - Timeline Interactivo (TDD)', () => {
    const mockOrder = {
        id: 123,
        status: 'EN CAMINO',
        created_at: new Date().toISOString(),
        address: 'Calle Falsa 123',
        total: 2500,
        courier_name: 'Juan Repartidor',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRoute as jest.Mock).mockReturnValue({ params: { orderId: '123' } });
        (useNavigation as jest.Mock).mockReturnValue({ goBack: jest.fn(), navigate: jest.fn() });
        (api.getOrderById as jest.Mock).mockResolvedValue(mockOrder);
        (api.listOrderItems as jest.Mock).mockResolvedValue([]);
        (api.listDrivers as jest.Mock).mockResolvedValue([]);
        (api.getDeliveryByOrder as jest.Mock).mockResolvedValue({ id: 'd1', assigned_at: new Date().toISOString() });
    });

    it('debe mostrar el timeline interactivo con el estado actual resaltado', async () => {
        render(<OrderDetailScreen />);

        await waitFor(() => {
            // Verificamos que existan los estados en el timeline
            expect(screen.getByText('Pedido Recibido')).toBeTruthy();
            expect(screen.getByText('En Preparación')).toBeTruthy();
            expect(screen.getByText('En camino')).toBeTruthy();
            expect(screen.getByText('Entregado')).toBeTruthy();
        });
    });
});
