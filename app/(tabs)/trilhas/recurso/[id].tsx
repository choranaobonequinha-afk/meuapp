import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
// YouTube player is only required on native; on web we embed via iframe
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { LEGAL_NOTICE } from '../../../../lib/legal';
import { getRecursoById } from '../../../../data/mock';
import { useThemeColors, useThemeStore } from '../../../../store/themeStore';

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const parts = u.pathname.split('/');
    const idx = parts.findIndex((p) => p === 'embed');
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

export default function RecursoViewer() {
  const theme = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recurso = getRecursoById(id as string);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const themeName = useThemeStore((s) => s.theme);
  const isWeb = Platform.OS === 'web';

  // Use platform-appropriate WebView implementation
  const WebViewComponent: any = isWeb
    ? // For web, use react-native-web-webview (default export)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('react-native-web-webview').default
    : // For native, use the official react-native-webview (default export)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('react-native-webview').default;
  const YoutubePlayerCmp = !isWeb
    ? // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('react-native-youtube-iframe').default
    : null;

  const isPDF = recurso?.tipo === 'PDF_OFICIAL';
  const isYouTube = recurso?.tipo === 'YOUTUBE';
  const isSite = recurso?.tipo === 'SITE';

  const pdfUri = useMemo(() => {
    if (!recurso?.urlOficial) return null;
    if (Platform.OS === 'android' || isWeb) {
      const base = 'https://drive.google.com/viewerng/viewer?embedded=true&url=';
      return `${base}${encodeURIComponent(recurso.urlOficial)}`;
    }
    return recurso.urlOficial;
  }, [recurso?.urlOficial]);

  const ytId = useMemo(() => (recurso?.urlOficial ? extractYouTubeId(recurso.urlOficial) : null), [recurso?.urlOficial]);

  const openInBrowser = async () => {
    if (recurso?.urlOficial) {
      await WebBrowser.openBrowserAsync(recurso.urlOficial);
    }
  };

  if (!recurso) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}> 
          <Text style={[styles.errorText, { color: theme.text }]}>Recurso não encontrado.</Text>
          <TouchableOpacity
            style={[
              styles.linkBtn,
              { borderColor: themeName === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)' },
            ]}
            onPress={openInBrowser}
          >
            <Ionicons name="open-outline" size={16} color={theme.text} />
            <Text style={[styles.linkBtnText, { color: theme.text }]}>Abrir no navegador</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.notice,
          {
            backgroundColor: themeName === 'dark' ? 'rgba(255,255,255,0.06)' : '#F9FAFB',
            borderColor: themeName === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)',
          },
        ]}
      > 
        <Ionicons name="information-circle-outline" size={16} color={theme.textMuted} />
        <Text style={[styles.noticeText, { color: theme.textMuted }]}>{LEGAL_NOTICE}</Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{recurso.titulo}</Text>
        <Text style={[styles.headerSub, { color: theme.textMuted }]}>{recurso.origem || 'Fonte oficial'}</Text>
      </View>

      {(isPDF || isSite) && recurso.urlOficial ? (
        <View style={styles.viewer}>
          {loading && !error && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#4F46E5" />
              <Text style={{ marginTop: 8, color: theme.textMuted }}>Carregando…</Text>
            </View>
          )}
          <WebViewComponent
            source={{ uri: isPDF ? (pdfUri as string) : recurso.urlOficial }}
            onLoadStart={() => { setLoading(true); setError(null); }}
            onLoadEnd={() => setLoading(false)}
            onError={() => { setLoading(false); setError('Falha ao carregar (a fonte pode bloquear incorporação)'); }}
            style={{ flex: 1 }}
            allowsFullscreenVideo
          />
        </View>
      ) : null}

      {isYouTube && ytId ? (
        <View style={{ aspectRatio: 16 / 9, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' }}>
          {isWeb ? (
            <WebViewComponent
              source={{ uri: `https://www.youtube.com/embed/${ytId}` }}
              allowsFullscreenVideo
              style={{ flex: 1 }}
            />
          ) : (
            <YoutubePlayerCmp
              height={220}
              width={undefined as unknown as number}
              videoId={ytId}
              play={false}
              webViewStyle={{ opacity: 0.99 }}
            />
          )}
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="warning-outline" size={16} color="#EF4444" />
          <Text style={[styles.errorText, { color: theme.text }]}>Não foi possível carregar o conteúdo.</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableOpacity style={[styles.retryBtn]} onPress={() => setError(null)}>
              <Ionicons name="refresh" size={16} color="#FFFFFF" />
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.linkBtn,
                { borderColor: themeName === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)' },
              ]}
              onPress={openInBrowser}
            >
              <Ionicons name="open-outline" size={16} color={theme.text} />
              <Text style={[styles.linkBtnText, { color: theme.text }]}>Abrir no navegador</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={[
              styles.linkBtn,
              { borderColor: themeName === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)' },
            ]}
            onPress={openInBrowser}
          >
            <Ionicons name="open-outline" size={16} color={theme.text} />
            <Text style={[styles.linkBtnText, { color: theme.text }]}>Abrir no navegador</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    margin: 16,
    borderRadius: 10,
  },
  noticeText: { fontSize: 12, flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  headerSub: { fontSize: 12 },
  viewer: { flex: 1, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  loadingOverlay: { position: 'absolute', top: 12, right: 12, alignItems: 'center' },
  errorBox: { margin: 16, padding: 12, borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.08)' },
  errorText: { fontSize: 13 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#4F46E5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  linkBtnText: { fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
});
