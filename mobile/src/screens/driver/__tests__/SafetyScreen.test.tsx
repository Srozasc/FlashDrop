import React from 'react';
import { render } from '@testing-library/react-native';
import SafetyScreen from '../SafetyScreen';

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

describe('SafetyScreen', () => {
    it('debe renderizar el título del Centro de Seguridad y el componente SafetyCenter', () => {
        const { getByText } = render(<SafetyScreen />);
        expect(getByText('Centro de Seguridad')).toBeTruthy();
        expect(getByText('BOTÓN SOS')).toBeTruthy();
    });
});
