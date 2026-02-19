import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import ThemedView from '../ThemedView';
import { Colors } from '../../../../constants/Colors';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    default: jest.fn(),
}));

describe('ThemedView Component (TDD)', () => {
    it('debe tener fondo blanco en modo claro', () => {
        (useColorScheme as jest.Mock).mockReturnValue('light');

        render(<ThemedView testID="themed-view"><></></ThemedView>);
        const view = screen.getByTestId('themed-view');

        expect(view.props.style).toContainEqual({ backgroundColor: Colors.light.background });
    });

    it('debe tener fondo negro OLED en modo oscuro', () => {
        (useColorScheme as jest.Mock).mockReturnValue('dark');

        render(<ThemedView testID="themed-view"><></></ThemedView>);
        const view = screen.getByTestId('themed-view');

        // El modo oscuro debe usar negro puro para OLED
        expect(view.props.style).toContainEqual({ backgroundColor: Colors.dark.background });
    });

    it('debe aceptar colores personalizados por tema', () => {
        (useColorScheme as jest.Mock).mockReturnValue('dark');

        render(
            <ThemedView testID="themed-view" darkColor="#1E1E1E"><></></ThemedView>
        );
        const view = screen.getByTestId('themed-view');

        expect(view.props.style).toContainEqual({ backgroundColor: '#1E1E1E' });
    });
});
