import React from 'react';
import { render, screen } from '@testing-library/react-native';
import GamificationCard from '../GamificationCard';

describe('GamificationCard Component (TDD)', () => {
    it('debe mostrar el nivel Bronce y los puntos correctamente', () => {
        render(<GamificationCard points={500} level="Bronce" />);

        expect(screen.getByText('Nivel Bronce')).toBeTruthy();
        expect(screen.getByText('500 puntos')).toBeTruthy();
    });

    it('debe mostrar el nivel Plata cuando los puntos superan 1000', () => {
        render(<GamificationCard points={1500} level="Plata" />);

        expect(screen.getByText('Nivel Plata')).toBeTruthy();
        expect(screen.getByText('1.500 puntos')).toBeTruthy();
    });

    it('debe mostrar una barra de progreso', () => {
        render(<GamificationCard points={500} level="Bronce" />);
        expect(screen.getByTestId('progress-bar')).toBeTruthy();
    });
});
