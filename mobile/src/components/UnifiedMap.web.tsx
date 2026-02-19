import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UnifiedMap() {
  return (
    <View style={styles.map}>
      <Text style={{ color: '#bbb', alignSelf: 'center', marginTop: 200 }}>
        Vista previa del mapa (web)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#212121',
  },
});

