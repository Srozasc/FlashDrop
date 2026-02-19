import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import ThemedText from '../ThemedText';
import { Colors } from '../../../../constants/Colors';

// Mock de useColorScheme para controlar el modo
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    default: jest.fn(),
}));

describe('ThemedText Component (TDD)', () => {
    it('debe renderizar texto con color oscuro en modo claro', () => {
        (useColorScheme as jest.Mock).mockReturnValue('light');

        render(<ThemedText>Hola Mundo</ThemedText>);
        const textElement = screen.getByText('Hola Mundo');

        // Verificamos que el color coincida con el definido en Colors.light.text
        expect(textElement.props.style).toContainEqual({ color: Colors.light.text });
    });

    it('debe renderizar texto con color claro en modo oscuro (OLED)', () => {
        (useColorScheme as jest.Mock).mockReturnValue('dark');

        render(<ThemedText>Hola Dark</ThemedText>);
        const textElement = screen.getByText('Hola Dark');

        // Verificamos que el color coincida con el definido en Colors.dark.text
        expect(textElement.props.style).toContainEqual({ color: Colors.dark.text });
    });
});
