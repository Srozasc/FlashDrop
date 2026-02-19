import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';
import { Colors } from '../../../constants/Colors';

interface ThemedViewProps extends ViewProps {
    lightColor?: string;
    darkColor?: string;
}

/**
 * Componente contenedor que adapta su color de fondo al tema del sistema.
 * En modo oscuro usa negro puro (#000000) para optimizar pantallas OLED.
 *
 * @param lightColor - Color de fondo personalizado para modo claro.
 * @param darkColor  - Color de fondo personalizado para modo oscuro.
 * @param style      - Estilos adicionales de React Native View.
 */
export default function ThemedView({
    style,
    lightColor,
    darkColor,
    ...rest
}: ThemedViewProps) {
    const theme = useColorScheme() ?? 'light';
    const backgroundColor =
        theme === 'light'
            ? (lightColor || Colors.light.background)
            : (darkColor || Colors.dark.background);

    return <View style={[{ backgroundColor }, style]} {...rest} />;
}
