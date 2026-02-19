import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import ExternalNavigationButton from '../ExternalNavigationButton';

// Mock de react-native para incluir Linking
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    RN.Linking = {
        openURL: jest.fn().mockResolvedValue(true),
        canOpenURL: jest.fn().mockResolvedValue(true),
    };
    return RN;
});

describe('ExternalNavigationButton', () => {
    const mockLat = -34.6037;
    const mockLon = -58.3816;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debe llamar a Linking.openURL con formato de Google Maps al presionar', async () => {
        const { getByText } = render(
            <ExternalNavigationButton
                provider="google"
                latitude={mockLat}
                longitude={mockLon}
            />
        );

        fireEvent.press(getByText('Google Maps'));

        // Esperar a que la promesa de Linking se resuelva
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(Linking.openURL).toHaveBeenCalledWith(
            expect.stringContaining(`https://www.google.com/maps/search/?api=1&query=${mockLat},${mockLon}`)
        );
    });

    it('debe llamar a Linking.openURL con formato de Waze al presionar', async () => {
        const { getByText } = render(
            <ExternalNavigationButton
                provider="waze"
                latitude={mockLat}
                longitude={mockLon}
            />
        );

        fireEvent.press(getByText('Waze'));

        // Esperar a que la promesa de Linking se resuelva
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(Linking.openURL).toHaveBeenCalledWith(
            expect.stringContaining(`https://waze.com/ul?ll=${mockLat},${mockLon}&navigate=yes`)
        );
    });
});
