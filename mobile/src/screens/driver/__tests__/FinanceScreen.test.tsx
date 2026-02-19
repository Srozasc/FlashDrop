import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FinanceScreen from '../FinanceScreen';
import { Alert } from 'react-native';

// Mock de useSafeAreaInsets
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaView: ({ children }: any) => children,
}));

// Mock de useTheme
jest.mock('../../../hooks/useTheme', () => ({
    useTheme: () => ({
        isDark: false,
        colors: { background: '#FFF' },
    }),
}));

// Mock de Alert.alert
jest.spyOn(Alert, 'alert');

describe('FinanceScreen', () => {
    it('debe renderizar el título de la sección y el componente DriverWallet', () => {
        const { getByText } = render(<FinanceScreen />);
        expect(getByText('Mis Finanzas')).toBeTruthy();
        expect(getByText('Balance Disponible')).toBeTruthy();
    });

    it('debe mostrar un mensaje de confirmación al presionar "Retirar Ahora"', async () => {
        const { getByText } = render(<FinanceScreen />);

        fireEvent.press(getByText('Retirar Ahora'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Retiro Instantáneo',
            '¿Deseas transferir tus ganancias a tu cuenta bancaria vinculada?',
            expect.any(Array)
        );
    });
});
