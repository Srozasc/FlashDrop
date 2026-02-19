import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function FetchState({
  loading,
  error,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.retry}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  center: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 8, color: '#555' },
  errorText: { color: '#D32F2F', marginBottom: 8, textAlign: 'center' },
  retry: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  retryText: { color: '#000', fontWeight: '700' },
});

