import { renderHook, waitFor } from '@testing-library/react-native';
import { useMerchants } from '../useMerchants';
import { api } from '../../lib/supabaseRest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mocks
jest.mock('../../lib/supabaseRest', () => ({
    api: {
        listMerchants: jest.fn(),
    },
}));

// Mock de useCart para evitar errores si HomeScreen o similares lo usan indirectamente
jest.mock('../../context/CartContext', () => ({
    useCart: () => ({ items: [] }),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useMerchants hook (REFACTOR - React Query)', () => {
    it('debe obtener la lista de comercios y almacenarlos en caché', async () => {
        const mockMerchants = [{ id: '1', business_name: 'Fast Pizza' }];
        (api.listMerchants as jest.Mock).mockResolvedValue(mockMerchants);

        const { result } = renderHook(() => useMerchants(), { wrapper });

        // En React Query 5/Testing Library, isLoading puede ser true inicialmente
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockMerchants);
        expect(api.listMerchants).toHaveBeenCalledTimes(1);
    });
});
