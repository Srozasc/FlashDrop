import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

/**
 * Propiedades para el componente Skeleton
 */
interface SkeletonProps {
    /** Ancho del componente (número o porcentaje) */
    width: number | string;
    /** Alto del componente (número) */
    height: number;
    /** Variante de forma: 'rect' para rectángulos (default) o 'circle' para círculos/avatars */
    variant?: 'rect' | 'circle';
    /** Estilos adicionales de contenedor */
    style?: ViewStyle;
    /** ID para pruebas unitarias */
    testID?: string;
}

/**
 * Skeleton Component
 * 
 * Un cargador de marcador de posición animado que utiliza una animación pulsante de opacidad.
 * Diseñado para mejorar el "perceived performance" de la aplicación siguiendo estándares premium.
 */
const Skeleton: React.FC<SkeletonProps> = ({
    width,
    height,
    variant = 'rect',
    style,
    testID,
}) => {
    // Referencia para la animación de opacidad
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        /**
         * Configuración de la animación pulsante infinita.
         * Varía la opacidad entre 0.3 y 0.7 para un efecto sutil.
         */
        const pulse = Animated.sequence([
            Animated.timing(opacity, {
                toValue: 0.7,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0.3,
                duration: 800,
                useNativeDriver: true,
            }),
        ]);

        Animated.loop(pulse).start();
    }, [opacity]);

    // Estilos dinámicos basados en props
    const skeletonStyles = [
        styles.base,
        {
            width,
            height,
            borderRadius: variant === 'circle' ? Number(height) / 2 : 8,
        },
        style,
    ];

    return (
        <Animated.View
            testID={testID}
            style={[...skeletonStyles, { opacity }]}
        />
    );
};

const styles = StyleSheet.create({
    /** Estilo base con un color neutro premium */
    base: {
        backgroundColor: '#E1E9EE',
    },
});

export default Skeleton;
