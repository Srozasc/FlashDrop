import React from 'react';
import { render } from '@testing-library/react-native';
import Skeleton from '../Skeleton';

describe('Skeleton Component', () => {
    it('debe renderizar con las dimensiones proporcionadas', () => {
        const { getByTestId } = render(
            <Skeleton width={100} height={20} testID="skeleton-base" />
        );
        const skeleton = getByTestId('skeleton-base');

        expect(skeleton.props.style).toMatchObject({ width: 100, height: 20 });
    });

    it('debe soportar la variante circular', () => {
        const { getByTestId } = render(
            <Skeleton width={50} height={50} variant="circle" testID="skeleton-circle" />
        );
        const skeleton = getByTestId('skeleton-circle');

        expect(skeleton.props.style).toMatchObject({ borderRadius: 25 });
    });

    it('debe aplicar un color de fondo por defecto', () => {
        const { getByTestId } = render(<Skeleton width={100} height={20} testID="skeleton-bg" />);
        const skeleton = getByTestId('skeleton-bg');

        // Verificamos que tenga algún color grisáceo de fondo
        expect(skeleton.props.style).toMatchObject({
            backgroundColor: expect.any(String)
        });
    });
});
