import React from 'react';
import { render } from '@testing-library/react-native';
import OrderHeatmap from '../OrderHeatmap';

// Mock de react-native-maps ya que no se puede renderizar en tests unitarios normales
jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View } = require('react-native');

    class MockMapView extends React.Component {
        render() {
            return <View testID="map-view">{this.props.children}</View>;
        }
    }

    class MockCircle extends React.Component<any> {
        render() {
            return <View testID={this.props.testID} />;
        }
    }

    return {
        __esModule: true,
        default: MockMapView,
        Circle: MockCircle,
    };
});

describe('OrderHeatmap', () => {
    const mockHotspots = [
        { id: '1', latitude: -34.6037, longitude: -58.3816, weight: 5 }, // Obelisco
        { id: '2', latitude: -34.6137, longitude: -58.3716, weight: 3 },
    ];

    it('debe renderizar el mapa correctamente', () => {
        const { getByTestId } = render(<OrderHeatmap hotspots={[]} />);
        expect(getByTestId('map-view')).toBeTruthy();
    });

    it('debe renderizar la cantidad correcta de círculos de calor (hotspots)', () => {
        const { getAllByTestId } = render(<OrderHeatmap hotspots={mockHotspots} />);
        const circles = getAllByTestId('heatmap-circle');
        expect(circles.length).toBe(mockHotspots.length);
    });
});
