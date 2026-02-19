import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { useTheme } from '../useTheme';
import { Colors } from '../../../constants/Colors';


jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    default: jest.fn(),
}));

describe('useTheme Hook (TDD)', () => {
    it('debe retornar los colores del modo claro cuando el sistema está en light', () => {
        (useColorScheme as jest.Mock).mockReturnValue('light');

        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe('light');
        expect(result.current.colors).toEqual(Colors.light);
        expect(result.current.isDark).toBe(false);
    });

    it('debe retornar los colores del modo oscuro OLED cuando el sistema está en dark', () => {
        (useColorScheme as jest.Mock).mockReturnValue('dark');

        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe('dark');
        expect(result.current.colors).toEqual(Colors.dark);
        expect(result.current.isDark).toBe(true);
        // Verificar que el fondo es negro puro (OLED)
        expect(result.current.colors.background).toBe('#000000');
    });

    it('debe usar modo claro por defecto si el sistema no reporta preferencia', () => {
        (useColorScheme as jest.Mock).mockReturnValue(null);

        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe('light');
        expect(result.current.isDark).toBe(false);
    });
});
