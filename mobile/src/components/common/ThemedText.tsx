import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import { Colors } from '../../../constants/Colors';

interface ThemedTextProps extends TextProps {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'subtitle' | 'link';
}

/**
 * Componente de texto que se adapta automáticamente al tema actual.
 * Prioriza colores OLED (negro puro) para el modo oscuro.
 * 
 * @param props - Propiedades estándar de Text más opciones de color por tema.
 */
export default function ThemedText({
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...rest
}: ThemedTextProps) {
    const theme = useColorScheme() ?? 'light';
    const color = theme === 'light' ? (lightColor || Colors.light.text) : (darkColor || Colors.dark.text);

    return (
        <Text
            style={[
                { color },
                type === 'title' && { fontSize: 24, fontWeight: '900' },
                type === 'subtitle' && { fontSize: 18, fontWeight: '700' },
                type === 'link' && { color: '#2e78b7' },
                style,
            ]}
            {...rest}
        />
    );
}
