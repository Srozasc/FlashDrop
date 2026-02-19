import React from 'react';
import { render, screen } from '@testing-library/react-native';
import BlurImage from '../BlurImage';

describe('BlurImage Component (TDD)', () => {
    it('debe renderizar un placeholder antes de cargar la imagen', () => {
        render(
            <BlurImage
                uri="https://example.com/image.jpg"
                blurhash="L6PZf600.Q8w00-j.3_J00?bc_9F"
                testID="blur-image"
            />
        );

        expect(screen.getByTestId('blur-image-placeholder')).toBeTruthy();
    });

    it('debe renderizar la imagen con la URI correcta', () => {
        render(
            <BlurImage
                uri="https://example.com/image.jpg"
                testID="blur-image"
            />
        );

        // Verificamos que el componente de imagen base exista
        expect(screen.getByTestId('blur-image-source')).toBeTruthy();
    });
});
