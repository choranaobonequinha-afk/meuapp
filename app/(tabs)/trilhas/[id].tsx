import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getRecursosByTrilha, trilhas } from '../../../data/mock';
import { Recurso } from '../../../types/models';
import { useThemeColors, useThemeStore } from '../../../store/themeStore';
import { LEGAL_NOTICE } from '../../../lib/legal';
import { logResourceClick } from '../../../lib/telemetry';

function iconByTipo(tipo: Recurso['tipo']): keyof typeof Ionicons.glyphMap {
  switch (tipo) {
    case 'PDF_OFICIAL':
      return 'document-text-outline';
    case 'YOUTUBE':
      return 'logo-youtube';
    case 'SITE':
    default:
      return 'globe-outline';
  }
}

export default function TrilhaDetalhe() {
  const theme = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trilha = trilhas.find((t) => t.id === id);
  const lista = getRecursosByTrilha(id as string);
  const themeName = useThemeStore((s) => s.theme);

  const accent = useMemo(() => {
    if (trilha?.id?.startsWith('matematica')) return '#3B82F6';
    return '#4F46E5';
  }, [trilha?.id]);

  const chips = useMemo(() => {
    if (!trilha) return [] as string[];
    if (trilha.id === 'matematica-funcoes') return ['1º grau', '2º grau', 'Álgebra', 'Funções'];
    return [] as string[];
  }, [trilha]);

  const primaryVideo = useMemo(() => lista.find((r) => r.tipo === 'YOUTUBE'), [lista]);

  const renderItem = ({ item }: { item: Recurso }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor:
            trilha?.id?.startsWith('matematica')
              ? (themeName === 'dark' ? 'rgba(59,130,246,0.14)' : 'rgba(59,130,246,0.10)')
              : (themeName === 'dark' ? 'rgba(255,255,255,0.06)' : '#F9FAFB'),
          borderColor:
            trilha?.id?.startsWith('matematica')
              ? (themeName === 'dark' ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.25)')
              : (themeName === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'),
        },
      ]}
      onPress={() => {
        logResourceClick({ tipoRecurso: item.tipo, trilhaId: item.trilhaId, recursoId: item.id });
        router.push({ pathname: '/(tabs)/trilhas/recurso/[id]', params: { id: item.id } });
      }}
      accessibilityRole="button"
      accessibilityLabel={`Abrir recurso ${item.titulo}`}
    >
      <View style={[styles.iconWrap, { backgroundColor: item.tipo === 'YOUTUBE' ? 'rgba(239,68,68,0.16)' : item.tipo === 'PDF_OFICIAL' ? 'rgba(16,185,129,0.16)' : 'rgba(59,130,246,0.16)' }]}>
        <Ionicons name={iconByTipo(item.tipo)} size={20} color={item.tipo === 'YOUTUBE' ? '#EF4444' : item.tipo === 'PDF_OFICIAL' ? '#10B981' : '#3B82F6'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{item.titulo}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, item.tipo === 'YOUTUBE' ? styles.badgeRed : item.tipo === 'PDF_OFICIAL' ? styles.badgeGreen : styles.badgeBlue]}>
            <Ionicons name={iconByTipo(item.tipo)} size={12} color={item.tipo === 'YOUTUBE' ? '#EF4444' : item.tipo === 'PDF_OFICIAL' ? '#10B981' : '#3B82F6'} />
            <Text style={[styles.badgeText, { color: item.tipo === 'YOUTUBE' ? '#EF4444' : item.tipo === 'PDF_OFICIAL' ? '#10B981' : '#3B82F6' }]}>
              {item.tipo === 'YOUTUBE' ? 'Vídeo' : item.tipo === 'PDF_OFICIAL' ? 'PDF oficial' : 'Site oficial'}
            </Text>
          </View>
          {item.origem ? (
            <View style={[styles.badge, styles.badgeNeutral]}>
              <Text style={[styles.badgeText, { color: theme.text }]}>{item.origem}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Hero */}
      <LinearGradient
        colors={[accent, '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          <View style={[styles.heroIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="map-outline" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle} numberOfLines={2}>{trilha?.nome || 'Trilha'}</Text>
        </View>
        {trilha?.descricao ? (
          <Text style={styles.heroSub} numberOfLines={3}>{trilha.descricao}</Text>
        ) : null}
        {chips.length ? (
          <View style={styles.chipsRow}>
            {chips.map((c) => (
              <View key={c} style={styles.chip}><Text style={styles.chipText}>{c}</Text></View>
            ))}
          </View>
        ) : null}
        <View style={styles.heroActions}>
          {primaryVideo ? (
            <TouchableOpacity
              style={[styles.heroBtn, { backgroundColor: 'rgba(255,255,255,0.18)' }]}
              onPress={() => {
                logResourceClick({ tipoRecurso: primaryVideo.tipo, trilhaId: primaryVideo.trilhaId, recursoId: primaryVideo.id });
                router.push({ pathname: '/(tabs)/trilhas/recurso/[id]', params: { id: primaryVideo.id } });
              }}
            >
              <Ionicons name="play" size={16} color="#FFFFFF" />
              <Text style={styles.heroBtnText}>Assistir vídeo</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[styles.heroBtn, { backgroundColor: 'rgba(255,255,255,0.12)' }]}
            onPress={() => router.push('/(tabs)/quiz')}
          >
            <Ionicons name="help-circle-outline" size={16} color="#FFFFFF" />
            <Text style={styles.heroBtnText}>Quiz relacionado</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Aviso legal */}
      <View
        style={[
          styles.notice,
          {
            backgroundColor:
              trilha?.id?.startsWith('matematica')
                ? (themeName === 'dark' ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)')
                : (themeName === 'dark' ? 'rgba(255,255,255,0.06)' : '#F9FAFB'),
            borderColor:
              trilha?.id?.startsWith('matematica')
                ? (themeName === 'dark' ? 'rgba(59,130,246,0.30)' : 'rgba(59,130,246,0.20)')
                : (themeName === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'),
          },
        ]}
      >
        <Ionicons name="information-circle-outline" size={16} color={theme.textMuted} />
        <Text style={[styles.noticeText, { color: theme.textMuted }]}>{LEGAL_NOTICE}</Text>
      </View>

      {/* Lista de recursos */}
      <FlatList
        data={lista}
        keyExtractor={(r) => r.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  heroIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', flex: 1 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.95)' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)' },
  chipText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  heroActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  heroBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
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
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSub: { fontSize: 13 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700' },
  meta: { fontSize: 12 },
  badges: { flexDirection: 'row', gap: 6, marginTop: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeGreen: { backgroundColor: 'rgba(16,185,129,0.18)' },
  badgeBlue: { backgroundColor: 'rgba(59,130,246,0.18)' },
  badgeRed: { backgroundColor: 'rgba(239,68,68,0.18)' },
  badgeNeutral: { backgroundColor: 'rgba(255,255,255,0.14)' },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
