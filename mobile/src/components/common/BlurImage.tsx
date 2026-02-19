import React, { useState } from 'react';
import { View, Image, StyleSheet, Animated, StyleProp, ImageStyle } from 'react-native';

/**
 * Propiedades del componente BlurImage
 */
interface BlurImageProps {
    /** URI de la imagen real */
    uri: string;
    /** Hash de difuminado (BlurHash) o color de placeholder */
    blurhash?: string;
    /** Estilos opcionales para la imagen */
    style?: StyleProp<ImageStyle>;
    /** ID de prueba */
    testID?: string;
}

/**
 * BlurImage Component
 * 
 * Implementa carga progresiva de imágenes para el Bloque 5. 
 * Muestra un placeholder estilizado y realiza una transición suave (fade)
 * cuando la imagen real termina de cargar.
 */
const BlurImage: React.FC<BlurImageProps> = ({ uri, blurhash, style, testID }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageOpacity = useState(new Animated.Value(0))[0];

    /**
     * Se ejecuta cuando la imagen real se carga completamente.
     */
    const onLoad = () => {
        setIsLoaded(true);
        Animated.timing(imageOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={[styles.container, style]} testID={testID}>
            {/* Placeholder: Aparece mientras isLoaded es falso */}
            {!isLoaded && (
                <View
                    testID={`${testID}-placeholder`}
                    style={[
                        styles.placeholder,
                        { backgroundColor: blurhash?.startsWith('#') ? blurhash : '#F1F3F5' }
                    ]}
                />
            )}

            {/* Imagen Real */}
            <Animated.Image
                testID={`${testID}-source`}
                source={{ uri }}
                style={[
                    styles.image,
                    style,
                    { opacity: imageOpacity }
                ]}
                onLoad={onLoad}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: '#F1F3F5',
        borderRadius: 8,
    },
    placeholder: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});

export default BlurImage;
