import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import WebWebView from 'react-native-web-webview';
import WebView from 'react-native-webview';
import { useThemeColors, useThemeStore } from '../../../../store/themeStore';
import { LEGAL_NOTICE } from '../../../../lib/legal';
import { supabase } from '../../../../lib/supabase';
import { OFFICIAL_RESOURCES } from '../../../../data/officialResources';

type ResourceRow = {
  id: string;
  title: string | null;
  description: string | null;
  resource_url: string | null;
  kind: string;
  track?: {
    title: string;
  } | null;
};

export default function RecursoViewer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useThemeColors();
  const themeName = useThemeStore((s) => s.theme);
  const [resource, setResource] = useState<ResourceRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerError, setViewerError] = useState<string | null>(null);

  const isWeb = Platform.OS === 'web';
  const WebViewComponent: any = isWeb ? WebWebView : WebView;

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('study_track_items')
        .select('id, title, description, resource_url, kind, track:study_tracks(title)')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        const fallback = OFFICIAL_RESOURCES.find((item) => item.id === id);
        if (fallback) {
          setResource({
            id: fallback.id,
            title: fallback.title,
            description: fallback.description,
            resource_url: fallback.url,
            kind: 'resource',
            track: { title: fallback.trackTitle },
          });
          setError(null);
        } else {
          setError(error.message);
          setResource(null);
        }
      } else if (data) {
        setResource(data as ResourceRow | null);
        setError(null);
        setViewerError(null);
      } else {
        const fallback = OFFICIAL_RESOURCES.find((item) => item.id === id);
        if (fallback) {
          setResource({
            id: fallback.id,
            title: fallback.title,
            description: fallback.description,
            resource_url: fallback.url,
            kind: 'resource',
            track: { title: fallback.trackTitle },
          });
          setError(null);
        } else {
          setResource(null);
        }
      }
      setLoading(false);
    };

    fetchResource();
  }, [id]);

  const useGoogleViewer = Platform.OS === 'android' || isWeb;
  const pdfUri = useMemo(() => {
    if (!resource?.resource_url) return null;
    if (useGoogleViewer) {
      const base = 'https://drive.google.com/viewerng/viewer?embedded=true&url=';
      return `${base}${encodeURIComponent(resource.resource_url)}`;
    }
    return resource.resource_url;
  }, [resource?.resource_url, useGoogleViewer]);

  const injectedScript = useMemo(() => {
    if (!useGoogleViewer) return undefined;
    return `
      (function () {
        const sendIfUnavailable = () => {
          const bodyText = document.body ? document.body.innerText || '' : '';
          if (bodyText.includes('Nenhuma visualização disponível') || bodyText.includes('No preview available')) {
            window.ReactNativeWebView.postMessage('preview_unavailable');
          }
        };
        setTimeout(sendIfUnavailable, 1200);
        document.addEventListener('DOMContentLoaded', () => setTimeout(sendIfUnavailable, 500));
      })();
      true;
    `;
  }, [useGoogleViewer]);

  const openInBrowser = async () => {
    if (resource?.resource_url) {
      await WebBrowser.openBrowserAsync(resource.resource_url);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}>
          <ActivityIndicator color="#4F46E5" />
          <Text style={{ color: theme.text }}>Carregando recurso...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!resource) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            {error || 'Recurso nao encontrado.'}
          </Text>
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {resource.title || 'Recurso oficial'}
        </Text>
        <Text style={[styles.headerSub, { color: theme.textMuted }]}>
          {resource.track?.title || 'Trilha oficial'}
        </Text>
      </View>

      {resource.resource_url ? (
        viewerError ? (
          <View style={[styles.viewer, styles.viewerFallback]}>
            <Ionicons name="alert-circle-outline" size={24} color={theme.text} />
            <Text style={[styles.errorText, { color: theme.text }]}>{viewerError}</Text>
            <TouchableOpacity style={styles.linkBtn} onPress={openInBrowser}>
              <Ionicons name="open-outline" size={16} color={theme.text} />
              <Text style={[styles.linkBtnText, { color: theme.text }]}>Abrir no navegador</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.viewer}>
            <WebViewComponent
              source={{ uri: pdfUri ?? resource.resource_url }}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator color="#4F46E5" />
                </View>
              )}
              onLoadStart={() => setViewerError(null)}
              onError={() =>
                setViewerError(
                  'Esta fonte não permite visualização embutida. Use o botão abaixo para abrir no navegador.'
                )
              }
              injectedJavaScript={injectedScript}
              onMessage={(event) => {
                if (event.nativeEvent.data === 'preview_unavailable') {
                  setViewerError(
                    'Esta fonte não permite visualização embutida. Use o botão abaixo para abrir no navegador.'
                  );
                }
              }}
            />
          </View>
        )
      ) : (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            Sem URL cadastrada para este item.
          </Text>
        </View>
      )}

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
  viewerFallback: { justifyContent: 'center', alignItems: 'center', gap: 12, padding: 16 },
  loadingOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  linkBtnText: { fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { fontSize: 13 },
});
