import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

type Status = 'processing' | 'error';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState<Status>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const completeSignIn = async () => {
      let description: string | undefined;
      try {
        const getParam = (value: string | string[] | undefined) =>
          Array.isArray(value) ? value[0] : value;

        const code = getParam(params.code as string | string[] | undefined);
        const accessToken = getParam(params.access_token as string | string[] | undefined);
        const refreshToken = getParam(params.refresh_token as string | string[] | undefined);
        const type = getParam(params.type as string | string[] | undefined);
        description = getParam(params.error_description as string | string[] | undefined);
        const normalizedType = type ? type.toLowerCase() : undefined;

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else {
          throw new Error(description ?? 'Parametros de autenticacao ausentes.');
        }

        await useAuthStore.getState().initialize();

        if (normalizedType === 'recovery') {
          Alert.alert('Redefinicao de senha', 'Link validado. Atualize sua senha.');
          router.replace('/auth/reset-password');
        } else {
          router.replace('/home');
        }
      } catch (error: any) {
        console.error('Supabase auth callback error', error);
        setErrorMessage(error?.message ?? description ?? 'Falha ao concluir a autenticacao.');
        setStatus('error');
      }
    };

    completeSignIn();
  }, [params, router]);

  return (
    <View style={styles.container}>
      {status === 'processing' ? (
        <>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.message}>Concluindo autenticacao...</Text>
        </>
      ) : (
        <>
          <Text style={[styles.message, styles.error]}>Nao foi possivel autenticar</Text>
          {errorMessage ? <Text style={styles.details}>{errorMessage}</Text> : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    color: '#111827',
  },
  error: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  details: {
    marginTop: 8,
    textAlign: 'center',
    color: '#6B7280',
  },
});
