import { useQuery } from '@tanstack/react-query';
import { api, Merchant } from '../lib/supabaseRest';

/**
 * useMerchants Hook
 * 
 * Gestiona la obtención y el cacheo de la lista de comercios 
 * utilizando React Query para deduplicación y navegación instantánea.
 * 
 * @returns Un objeto de consulta de React Query con los comercios.
 */
export function useMerchants() {
    return useQuery<Merchant[]>({
        queryKey: ['merchants'],
        queryFn: async () => {
            const data = await api.listMerchants();
            if (!data) return [];
            return data;
        },
        // Mantenemos los datos frescos por 5 minutos para navegación instantánea
        staleTime: 1000 * 60 * 5,
        // Cacheamos los datos por 30 minutos
        gcTime: 1000 * 60 * 30,
    });
}
