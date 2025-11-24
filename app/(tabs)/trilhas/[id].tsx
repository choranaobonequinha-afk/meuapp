import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../../store/themeStore';
import { useStudyTracks } from '../../../hooks/useStudyTracks';

export default function TrilhaDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useThemeColors();
  const router = useRouter();
  const { trackMap, loading, error } = useStudyTracks();
  const trilha = id ? trackMap.get(id) : undefined;

  const lessons = useMemo(
    () => trilha?.items.filter((item) => item.kind === 'lesson') ?? [],
    [trilha?.items]
  );
  const resources = useMemo(
    () => trilha?.items.filter((item) => item.kind === 'resource') ?? [],
    [trilha?.items]
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Carregando trilha...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !trilha) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.text }]}>{error || 'Trilha nao encontrada.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient colors={[trilha.color_hex, '#60A5FA']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.heroHead}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>{trilha.title}</Text>
          </View>
          <Text style={styles.heroDescription}>{trilha.description || 'Sequencia de estudo personalizada.'}</Text>
          <View style={styles.heroStats}>
            <View>
              <Text style={styles.heroStatValue}>{trilha.exam?.toUpperCase() || 'GERAL'}</Text>
              <Text style={styles.heroStatLabel}>Prova alvo</Text>
            </View>
            <View>
              <Text style={styles.heroStatValue}>{trilha.items.length}</Text>
              <Text style={styles.heroStatLabel}>Passos</Text>
            </View>
            <View>
              <Text style={styles.heroStatValue}>{lessons.length}</Text>
              <Text style={styles.heroStatLabel}>Aulas</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: 20, gap: 20 }}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Passos da trilha</Text>
            {lessons.map((item, index) => (
              <LinearGradient
                key={item.id}
                colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.08)']}
                style={styles.stepCard}
              >
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>{item.lesson?.title || item.title || 'Aula'}</Text>
                  <Text style={styles.stepSubtitle}>
                    {item.lesson?.module
                      ? `${item.lesson.module} - ${item.estimated_minutes || 20} min`
                      : `${item.estimated_minutes || 20} min estimados`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.stepAction}
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/videos',
                    })
                  }
                >
                  <Ionicons name="play-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.stepActionText}>Ver aula</Text>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>

          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recursos oficiais</Text>
            {resources.length === 0 ? (
              <Text style={styles.emptyText}>Essa trilha ainda nao possui materiais extras.</Text>
            ) : (
              resources.map((resource) => (
                <TouchableOpacity
                  key={resource.id}
                  style={[
                    styles.resourceCard,
                    {
                      borderColor: 'rgba(255,255,255,0.18)',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      shadowColor: '#1E3A8A',
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 4,
                    },
                  ]}
                  onPress={() =>
                    router.push({ pathname: '/(tabs)/trilhas/recurso/[id]', params: { id: resource.id } })
                  }
                >
                  <View style={styles.resourceBadge}>
                    <Ionicons name="document-text-outline" size={14} color={trilha.color_hex || '#4F46E5'} />
                    <Text style={[styles.resourceBadgeText, { color: trilha.color_hex || '#4F46E5' }]}>Oficial</Text>
                  </View>
                  <Text style={[styles.resourceTitle, { color: theme.text }]}>{resource.title}</Text>
                  {resource.description ? (
                    <Text style={[styles.resourceDescription, { color: theme.textMuted }]}>{resource.description}</Text>
                  ) : null}
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    padding: 24,
    paddingTop: 48,
    gap: 16,
  },
  heroHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 24,
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  stepCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  stepSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  stepAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15,23,42,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  resourceCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 6,
  },
  resourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resourceBadgeText: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  resourceDescription: {
    fontSize: 13,
  },
  emptyText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
  },
});
