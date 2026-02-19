import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { api } from '../lib/supabaseRest';
import { updateAuthUserMetadata } from '../lib/auth';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, Save, MapPin, User as UserIcon } from 'lucide-react-native';
import GamificationCard from '../components/profile/GamificationCard';

/**
 * ProfileScreen
 * 
 * Pantalla de perfil de usuario con gestión de datos personales,
 * direcciones y sistema de gamificación/fidelización.
 */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState<'Bronce' | 'Plata' | 'Oro'>('Bronce');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // Address state
  const [addrId, setAddrId] = useState<string | null>(null);
  const [street, setStreet] = useState('');
  const [commune, setCommune] = useState('');
  const [city, setCity] = useState('');
  const [alias, setAlias] = useState('');
  const [addrType, setAddrType] = useState<'home' | 'work' | 'other'>('home');

  /**
   * Carga de datos del perfil
   */
  async function load() {
    if (!user?.id) return;
    try {
      setLoading(true);
      const p = await api.getUserProfileById(user.id);
      setName(p?.name || '');
      setPhone(p?.phone || '');
      setPoints(p?.points || 0);
      setLevel(p?.level || 'Bronce');

      const a = await api.getDefaultAddressByUser(user.id);
      if (a) {
        setAddrId(a.id);
        setStreet(a.street || '');
        setCommune(a.commune || '');
        setCity(a.city || '');
        setAlias(a.alias || '');
        setAddrType(a.type || 'home');
      }
    } catch (e: any) {
      setError('Error cargando perfil');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [user?.id]);

  /**
   * Guarda los cambios en el perfil y dirección
   */
  async function save() {
    if (!user?.id) return;
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      await updateAuthUserMetadata({ name, phone });
      await api.updateUserProfile(user.id, { name, phone });
      if (addrId) {
        await api.updateAddress(addrId, { street, commune, city, alias, type: addrType });
      }
      setOk('¡Perfil actualizado con éxito!');
      setTimeout(() => setOk(null), 3000);
    } catch (e: any) {
      setError(e?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  if (loading && !name) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Mi Cuenta</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
              <LogOut size={20} color="#FF4444" />
            </TouchableOpacity>
          </View>

          {/* Gamificación */}
          <GamificationCard points={points} level={level} />

          {/* Sección: Datos Personales */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <UserIcon size={18} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Datos Personales</Text>
            </View>

            <Text style={styles.label}>Email (No editable)</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={user?.email || ''}
              editable={false}
            />

            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Juan Pérez"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: +54 9 11 1234 5678"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={18} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
            </View>

            <Text style={styles.label}>Alias de ubicación (Ej: Casa, Oficina)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Mi Casa"
              value={alias}
              onChangeText={setAlias}
            />

            <Text style={styles.label}>Tipo de ubicación</Text>
            <View style={styles.typeSelector}>
              {(['home', 'work', 'other'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeButton, addrType === t && styles.typeButtonActive]}
                  onPress={() => setAddrType(t)}
                >
                  <Text style={[styles.typeButtonText, addrType === t && styles.typeButtonTextActive]}>
                    {t === 'home' ? 'Hogar' : t === 'work' ? 'Trabajo' : 'Otro'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Calle y Número</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Av. Corrientes 1234, 4to B"
              value={street}
              onChangeText={setStreet}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Comuna / Barrio</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Palermo"
                  value={commune}
                  onChangeText={setCommune}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Ciudad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: CABA"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
          {ok && <Text style={styles.successText}>{ok}</Text>}

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={save}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Save size={20} color="#000" />
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  typeButtonActive: {
    backgroundColor: Colors.light.primary + '20',
    borderColor: Colors.light.primary,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  typeButtonTextActive: {
    color: Colors.light.primary,
  },
  disabledInput: {
    opacity: 0.6,
    color: '#999',
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    height: 55,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  errorText: {
    color: '#FF4444',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    color: '#28A745',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  }
});
