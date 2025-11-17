
import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../store/themeStore';
import { useStudyTracks } from '../../hooks/useStudyTracks';

export default function BibliotecaScreen() {
  const theme = useThemeColors();
  const router = useRouter();
  const { resources, loading, error } = useStudyTracks();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((item) => {
      if (!q) return true;
      return (
        (item.title ?? '').toLowerCase().includes(q) ||
        (item.trackTitle ?? '').toLowerCase().includes(q) ||
        (item.description ?? '').toLowerCase().includes(q)
      );
    });
  }, [resources, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((item) => {
      const key = item.trackTitle ?? 'Outros';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const hero = filtered[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 20 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Biblioteca oficial</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Obras, PDFs e sites públicos que você pode acessar de qualquer lugar.
          </Text>
        </View>

        <View style={[styles.searchBox, { borderColor: theme.textMuted + '33' }]}>
          <Ionicons name="search-outline" size={18} color={theme.textMuted} />
          <TextInput
            placeholder="Buscar por título ou prova..."
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text }]}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#4F46E5" />
            <Text style={{ color: theme.text }}>Carregando acervo...</Text>
          </View>
        ) : error ? (
          <Text style={[styles.errorText, { color: '#FECACA' }]}>{error}</Text>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Nada encontrado</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
              Adicione novos recursos na tabela study_track_items ou ajuste o termo de busca.
            </Text>
          </View>
        ) : (
          <>
            {hero ? (
              <TouchableOpacity
                style={[styles.featuredCard, { borderColor: hero.trackColor + '55' }]}
                onPress={() => router.push({ pathname: '/(tabs)/trilhas/recurso/[id]', params: { id: hero.id } })}
              >
                <View style={styles.featuredBadge}>
                  <Ionicons name="bookmark" size={14} color="#FFFFFF" />
                  <Text style={styles.featuredBadgeText}>Em destaque</Text>
                </View>
                <Text style={styles.featuredTrack}>{hero.trackTitle}</Text>
                <Text style={styles.featuredTitle}>{hero.title}</Text>
                {hero.description ? (
                  <Text style={styles.featuredDescription} numberOfLines={3}>
                    {hero.description}
                  </Text>
                ) : null}
                <View style={styles.featuredButton}>
                  <Ionicons name="open-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.featuredButtonText}>Ler agora</Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {grouped.map(([trackTitle, items]) => (
              <View key={trackTitle} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{trackTitle}</Text>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.resourceCard}
                    onPress={() => router.push({ pathname: '/(tabs)/trilhas/recurso/[id]', params: { id: item.id } })}
                  >
                    <View style={styles.resourceIcon}>
                      <Ionicons name="document-text-outline" size={18} color="#4F46E5" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.resourceTitle, { color: theme.text }]} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={[styles.resourceMeta, { color: theme.textMuted }]}>
                        {item.description || 'Recurso público oficial'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { gap: 6 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 14, lineHeight: 20 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 14 },
  loadingBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  errorText: { fontSize: 14 },
  emptyBox: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySubtitle: { fontSize: 13, lineHeight: 18 },
  featuredCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    gap: 10,
    backgroundColor: 'rgba(79,70,229,0.08)',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#4F46E5',
  },
  featuredBadgeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  featuredTrack: { color: '#4F46E5', fontWeight: '700', fontSize: 13 },
  featuredTitle: { color: '#111827', fontSize: 18, fontWeight: '800' },
  featuredDescription: { color: '#1F2937', fontSize: 13, lineHeight: 18 },
  featuredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111827',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  featuredButtonText: { color: '#FFFFFF', fontWeight: '700' },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  resourceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(79,70,229,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceTitle: { fontSize: 14, fontWeight: '700' },
  resourceMeta: { fontSize: 12 },
});
