import React from 'react';
import { render, screen } from '@testing-library/react-native';
import UnifiedMap from '../UnifiedMap.native';

// Mock de react-native-maps
jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View } = require('react-native');
    class MockMapView extends React.Component {
        render() { return <View testID="map-view">{this.props.children}</View>; }
    }
    class MockMarker extends React.Component {
        render() { return <View testID="marker" />; }
    }
    class MockPolyline extends React.Component {
        render() { return <View testID="polyline" />; }
    }
    return {
        __esModule: true,
        default: MockMapView,
        Marker: MockMarker,
        Polyline: MockPolyline,
        PROVIDER_GOOGLE: 'google',
    };
});

describe('UnifiedMap Component (TDD - Mapa 2.0)', () => {
    it('debe renderizar el mapa con origen, destino y polilínea', () => {
        const origin = { lat: -34.6, lng: -58.4 };
        const destination = { lat: -34.7, lng: -58.5 };

        render(<UnifiedMap origin={origin} destination={destination} />);

        expect(screen.getByTestId('map-view')).toBeTruthy();
        const markers = screen.getAllByTestId('marker');
        expect(markers.length).toBeGreaterThanOrEqual(2);
        expect(screen.getByTestId('polyline')).toBeTruthy();
    });
});
