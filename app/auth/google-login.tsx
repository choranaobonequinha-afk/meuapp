import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Platform, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../../components/ui/Button';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import { useThemeColors } from '../../store/themeStore';

const isWeb = Platform.OS === 'web';
const cardShadow: ViewStyle = isWeb
  ? ({ boxShadow: '0 18px 40px rgba(15,23,42,0.15)' } as ViewStyle)
  : {
      shadowColor: '#0F172A',
      shadowOpacity: 0.15,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    };

export default function GoogleLoginScreen() {
  const theme = useThemeColors();
  const { signInWithGoogle, loading, error, isReady } = useGoogleSignIn();

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={theme.gradient} style={styles.gradient}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Ionicons name="logo-google" size={28} color="#EA4335" />
            <Text style={styles.title}>Entrar com Google</Text>
          </View>
          <Text style={styles.subtitle}>
            Use sua conta Google para acessar o MeuApp rapidamente e sincronizar seus dados no Supabase.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title={loading ? 'Conectando...' : 'Entrar com Google'}
            onPress={signInWithGoogle}
            loading={loading}
            disabled={!isReady}
          />
          <Text style={styles.helperText}>Redirecionaremos para meuapp://auth/callback após a confirmação.</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 28,
    padding: 24,
    gap: 16,
    ...cardShadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 21,
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  helperText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6B7280',
  },
});
