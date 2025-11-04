import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, resendConfirmationEmail } = useAuthStore.getState();
  const redirectTo = useMemo(() => makeRedirectUri({ scheme: 'meuapp', path: 'auth/callback' }), []);
  const googleConfigured = useMemo(() => {
    const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
    return Boolean(
      extra?.googleClientId ||
        extra?.googleOAuthEnabled ||
        process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ||
        process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET
    );
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showResendButton, setShowResendButton] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'Informe seu email';
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      return 'Email invalido';
    }
    return undefined;
  };

  const handleSignInWithPassword = async () => {
    const emailError = validateEmail(email);
    const passwordError = password ? undefined : 'Informe sua senha';

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      Alert.alert('Complete os campos', 'Corrija as informacoes antes de continuar.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace('/home');
    } catch (error: any) {
      if (error?.message?.includes('Email not confirmed')) {
        setShowResendButton(true);
        Alert.alert('Email nao confirmado', 'Confirme o endereco de email antes de fazer login.');
      } else {
        Alert.alert('Nao foi possivel entrar', error?.message ?? 'Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      Alert.alert('Email invalido', 'Informe um email valido para receber o link magico.');
      return;
    }

    try {
      setMagicLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      Alert.alert('Verifique seu email', 'Enviamos um link magico para continuar o acesso.');
    } catch (error: any) {
      Alert.alert('Nao foi possivel enviar o link', error?.message ?? 'Tente novamente em instantes.');
    } finally {
      setMagicLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    try {
      setOauthLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Nao foi possivel iniciar com Google', error?.message ?? 'Verifique as credenciais do provedor.');
    } finally {
      setOauthLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      setLoading(true);
      await resendConfirmationEmail(email.trim());
      Alert.alert('Email reenviado', 'Confira sua caixa de entrada.');
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Nao foi possivel reenviar o email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Acessar conta</Text>
        <Text style={styles.subtitle}>
          Use seu email para receber um link magico ou autentique com senha.
        </Text>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="voce@email.com"
            error={errors.email}
            style={styles.input}
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder="********"
            secureTextEntry
            error={errors.password}
            style={styles.input}
          />

          <Button
            title="Entrar com senha"
            onPress={handleSignInWithPassword}
            loading={loading}
            style={styles.button}
          />

          <Button
            title="Enviar magic link"
            onPress={handleMagicLink}
            loading={magicLoading}
            variant="ghost"
            style={styles.button}
          />

          {showResendButton && (
            <Button
              title="Reenviar email de confirmacao"
              onPress={handleResendConfirmation}
              variant="ghost"
              style={styles.button}
            />
          )}
        </View>

        <View style={styles.linksRow}>
          <Link href="/auth/forgot-password" style={styles.linkText}>
            Esqueci minha senha
          </Link>
          <Text style={styles.separator}>|</Text>
          <Link href="/auth/signup" style={styles.linkText}>
            Criar conta
          </Link>
        </View>

        {googleConfigured ? (
          <View style={styles.oauthSection}>
            <Text style={styles.oauthTitle}>Ou continue com</Text>
            <Button
              title="Google"
              onPress={handleGoogleOAuth}
              loading={oauthLoading}
              variant="ghost"
              style={styles.button}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    width: '100%',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  separator: {
    color: '#D1D5DB',
  },
  oauthSection: {
    gap: 12,
  },
  oauthTitle: {
    color: '#6B7280',
    fontSize: 14,
  },
});
