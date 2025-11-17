import { useCallback, useMemo, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';

import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

type ExtraConfig = {
  authRedirectUri?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  googleAndroidClientId?: string;
  googleIosClientId?: string;
};

const manifestExtra =
  (Constants.expoConfig?.extra ??
    // @ts-expect-error legacy manifest support
    Constants.manifestExtra ??
    {}) as ExtraConfig;

const fallbackRedirect = makeRedirectUri({ scheme: 'meuapp', path: 'auth/callback' });

export function useGoogleSignIn() {
  const isExpoGo = Constants.appOwnership === 'expo';
  const redirectUri =
    manifestExtra.authRedirectUri ??
    makeRedirectUri({
      scheme: 'meuapp',
      path: 'auth/callback',
      useProxy: isExpoGo,
    }) ??
    fallbackRedirect;
  const webClientId = manifestExtra.googleClientId ?? process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
  const androidClientId = manifestExtra.googleAndroidClientId ?? webClientId;
  const iosClientId = manifestExtra.googleIosClientId ?? webClientId;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId ?? '',
    androidClientId: androidClientId ?? undefined,
    iosClientId: iosClientId ?? undefined,
    redirectUri,
    responseType: 'id_token',
    scopes: ['openid', 'email', 'profile'],
  });

  const isReady = useMemo(() => Boolean(request && webClientId), [request, webClientId]);

  const signInWithGoogle = useCallback(async () => {
    if (!request || !isReady) {
      setError('Configuracao do Google OAuth indisponivel.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await promptAsync({ useProxy: isExpoGo });
      if (result.type !== 'success') {
        if (result.type !== 'dismiss') {
          setError('Login com Google cancelado.');
        }
        return;
      }

      const idToken = result.params?.id_token ?? result.authentication?.idToken;
      if (!idToken) {
        setError('Nao recebemos o token do Google. Tente novamente.');
        return;
      }

      const { error: supabaseError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (supabaseError) {
        setError(supabaseError.message);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Falha inesperada ao entrar com Google.');
    } finally {
      setLoading(false);
    }
  }, [isExpoGo, isReady, promptAsync, request]);

  return {
    isReady,
    loading,
    error,
    signInWithGoogle,
  };
}
