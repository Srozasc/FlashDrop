import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DeliveryConfirmation from '../DeliveryConfirmation';

describe('DeliveryConfirmation', () => {
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe mostrar el campo de PIN cuando el método es "pin"', () => {
        const { getByPlaceholderText } = render(
            <DeliveryConfirmation
                orderId="123"
                method="pin"
                onConfirm={mockOnConfirm}
            />
        );

        expect(getByPlaceholderText('Ingresa el PIN del cliente')).toBeTruthy();
    });

    it('debe llamar a onConfirm con el PIN ingresado', () => {
        const { getByPlaceholderText, getByTestId } = render(
            <DeliveryConfirmation
                orderId="123"
                method="pin"
                onConfirm={mockOnConfirm}
            />
        );

        fireEvent.changeText(getByPlaceholderText('Ingresa el PIN del cliente'), '4321');
        fireEvent.press(getByTestId('confirm-delivery-button'));

        expect(mockOnConfirm).toHaveBeenCalledWith({
            orderId: '123',
            method: 'pin',
            data: '4321'
        });
    });

    it('debe deshabilitar el botón si el PIN está incompleto', () => {
        const { getByPlaceholderText, getByTestId } = render(
            <DeliveryConfirmation
                orderId="123"
                method="pin"
                onConfirm={mockOnConfirm}
            />
        );

        fireEvent.changeText(getByPlaceholderText('Ingresa el PIN del cliente'), '12');

        // Dependiendo de la implementación, el botón podría estar deshabilitado o mostrar error.
        // Aquí verificamos que NO se haya llamado al presionar si es inválido.
        fireEvent.press(getByTestId('confirm-delivery-button'));
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });
});
