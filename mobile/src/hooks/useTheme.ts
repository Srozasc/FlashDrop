import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

/**
 * Hook centralizado para acceder al tema actual de la aplicación.
 * Detecta automáticamente la preferencia del sistema (light/dark).
 *
 * @returns {object} Objeto con:
 *   - `theme`: 'light' | 'dark'
 *   - `colors`: Paleta de colores del tema actual (Colors.light o Colors.dark)
 *   - `isDark`: Booleano que indica si el modo oscuro está activo
 *
 * @example
 * const { colors, isDark } = useTheme();
 * <View style={{ backgroundColor: colors.background }} />
 */
export function useTheme() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const isDark = theme === 'dark';
    const colors = isDark ? Colors.dark : Colors.light;

    return { theme, colors, isDark };
}
