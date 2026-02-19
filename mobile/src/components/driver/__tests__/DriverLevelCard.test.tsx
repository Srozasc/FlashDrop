import React from 'react';
import { render } from '@testing-library/react-native';
import DriverLevelCard from '../DriverLevelCard';

describe('DriverLevelCard', () => {
    it('debe renderizar el nivel actual y los puntos', () => {
        const { getByText } = render(
            <DriverLevelCard level="Silver" points={450} nextLevelPoints={1000} />
        );

        expect(getByText('Nivel Silver')).toBeTruthy();
        expect(getByText('450 / 1000 pts')).toBeTruthy();
    });

    it('debe calcular el progreso correctamente (porcentaje)', () => {
        const { getByTestId } = render(
            <DriverLevelCard level="Gold" points={800} nextLevelPoints={1000} />
        );

        const progressBar = getByTestId('progress-bar-fill');
        // El estilo debería reflejar el 80%
        expect(progressBar.props.style).toContainEqual(expect.objectContaining({ width: '80%' }));
    });

    it('debe mostrar los beneficios del nivel', () => {
        const { getByText } = render(
            <DriverLevelCard level="Bronze" points={50} nextLevelPoints={200} />
        );

        expect(getByText('Tarifa base estándar')).toBeTruthy();
    });
});
