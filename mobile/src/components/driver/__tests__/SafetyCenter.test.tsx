import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SafetyCenter from '../SafetyCenter';
import { Alert } from 'react-native';

// Mock de Alert.alert
jest.spyOn(Alert, 'alert');

describe('SafetyCenter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe renderizar el botón de emergencia SOS', () => {
        const { getByText } = render(<SafetyCenter onReportSubmit={() => { }} />);
        expect(getByText('BOTÓN SOS')).toBeTruthy();
    });

    it('debe pedir confirmación al presionar el botón SOS', () => {
        const { getByText } = render(<SafetyCenter onReportSubmit={() => { }} />);

        fireEvent.press(getByText('BOTÓN SOS'));

        expect(Alert.alert).toHaveBeenCalledWith(
            '¡EMERGENCIA!',
            '¿Deseas alertar a las autoridades y soporte de FlashDrop sobre una emergencia activa?',
            expect.any(Array)
        );
    });

    it('debe mostrar las opciones de reporte de incidentes', () => {
        const { getByText } = render(<SafetyCenter onReportSubmit={() => { }} />);

        expect(getByText('Reportar Problema')).toBeTruthy();
        expect(getByText('Vehículo averiado')).toBeTruthy();
        expect(getByText('Accidente')).toBeTruthy();
    });

    it('debe llamar a onReportSubmit al seleccionar un incidente', () => {
        const mockOnSubmit = jest.fn();
        const { getByText } = render(<SafetyCenter onReportSubmit={mockOnSubmit} />);

        fireEvent.press(getByText('Vehículo averiado'));

        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
            type: 'breakdown'
        }));
    });
});
