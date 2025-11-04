import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useThemeColors } from '../../store/themeStore';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColors();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!password || password.length < 6) {
      Alert.alert('Senha invalida', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'Confirme a nova senha corretamente.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      Alert.alert('Senha atualizada', 'Voce ja pode usar a nova senha para entrar.');
      router.replace('/auth/login');
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Nao foi possivel atualizar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={theme.gradient} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 48 }]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.box}>
              <Text style={styles.title}>Definir nova senha</Text>
              <Text style={styles.description}>
                Escolha uma nova senha segura para continuar utilizando o aplicativo.
              </Text>

              <Input
                label="Nova senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Digite a nova senha"
                style={styles.input}
              />

              <Input
                label="Confirmar senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Repita a nova senha"
                style={styles.input}
              />

              <Button title="Atualizar senha" onPress={handleUpdate} loading={loading} />

              <Button
                title="Voltar ao login"
                onPress={() => router.replace('/auth/login')}
                variant="ghost"
                style={styles.backButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111827',
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
});
