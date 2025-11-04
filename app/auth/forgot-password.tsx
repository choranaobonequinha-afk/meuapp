import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../store/themeStore';
import { useRouter } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export default function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColors();
  const router = useRouter();
  const redirectTo = useMemo(() => makeRedirectUri({ scheme: 'meuapp', path: 'auth/callback' }), []);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    try {
      setLoading(true);
      const trimmedEmail = email.trim();
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo,
      });
      if (error) throw error;
      Alert.alert('Enviado', 'Confira seu email para redefinir a senha.');
      router.replace('/auth/login');
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Tente novamente');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={theme.gradient} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 48 }]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.box}>
              <Text style={styles.title}>Redefinir senha</Text>
              <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="voce@email.com" />
              <Button title="Enviar link" onPress={handleReset} loading={loading} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  box: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 }
});
