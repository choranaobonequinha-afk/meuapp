import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColors } from '../../../store/themeStore';

type SubjectKey = 'artes' | 'ciencia' | 'matematica' | 'letras';

const SUBJECTS: Record<SubjectKey, { name: string; color: string; icon: keyof typeof Ionicons.glyphMap }>
  = {
    artes:      { name: 'Artes',      color: '#F59E0B', icon: 'color-palette-outline' },
    ciencia:    { name: 'Ciência',    color: '#3B82F6', icon: 'flask-outline' },
    matematica: { name: 'Matemática', color: '#3B82F6', icon: 'calculator-outline' },
    letras:     { name: 'Letras',     color: '#8B5CF6', icon: 'book-outline' },
  };

export default function SubjectScreen() {
  const router = useRouter();
  const theme = useThemeColors();
  const params = useLocalSearchParams<{ id?: string; name?: string; color?: string }>();
  const isMath = ((params.id || '').toString().toLowerCase()).startsWith('matem');

  const meta = useMemo(() => {
    const rawId = (params.id || '').toString().toLowerCase() as SubjectKey | '';
    if (rawId && SUBJECTS[rawId as SubjectKey]) return SUBJECTS[rawId as SubjectKey];
    // Fallback if opened without known id
    return {
      name: decodeURIComponent((params.name || 'Matéria') as string),
      color: (params.color as string) || '#4F46E5',
      icon: 'book-outline' as const,
    };
  }, [params.id, params.name, params.color]);

  const subjectId = (params.id || '').toString().toLowerCase();
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[meta.color, '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <View style={[styles.headerIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name={meta.icon} size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>{meta.name}</Text>
          </View>
          <Text style={styles.headerSubtitle}>Explore conteúdos, trilhas e quizzes de {meta.name}.</Text>
        </LinearGradient>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(tabs)/trilha', params: { subject: subjectId, subjectName: meta.name } })}
            style={[styles.actionCard, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}
          >
            <Ionicons name="map-outline" size={22} color="#10B981" />
            <Text style={[styles.actionLabel, { color: '#065F46' }]}>Trilhas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(tabs)/videos', params: { subject: subjectId, subjectName: meta.name } })}
            style={[styles.actionCard, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}
          >
            <Ionicons name="play-circle-outline" size={22} color="#3B82F6" />
            <Text style={[styles.actionLabel, { color: '#1E3A8A' }]}>Vídeos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(tabs)/quiz', params: { subject: subjectId, subjectName: meta.name } })}
            style={[styles.actionCard, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}
          >
            <Ionicons name="help-circle-outline" size={22} color="#8B5CF6" />
            <Text style={[styles.actionLabel, { color: '#4C1D95' }]}>Quiz</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo por matéria */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Conteúdos de {meta.name}</Text>
          {isMath ? (
            <>
              <View style={[styles.card, { borderColor: 'rgba(16,185,129,0.35)', backgroundColor: 'rgba(16,185,129,0.08)' }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Trilha sugerida</Text>
                <Text style={[styles.cardText, { color: theme.textMuted }]}>Funções → Geometria → Trigonometria → Estatística</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {[
                    { id: 'funcoes', label: 'Funções', color: '#10B981', trilhaId: 'matematica-funcoes' },
                    { id: 'geometria', label: 'Geometria', color: '#F59E0B' },
                    { id: 'trigonometria', label: 'Trigonometria', color: '#8B5CF6' },
                    { id: 'estatistica', label: 'Estatística', color: '#3B82F6' },
                  ].map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => m.trilhaId ? router.push({ pathname: '/(tabs)/trilhas/[id]', params: { id: m.trilhaId } }) : null}
                      style={{
                        flexDirection: 'row', alignItems: 'center', gap: 8,
                        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
                        backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: m.color,
                      }}
                    >
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: m.color }} />
                      <Text style={{ color: theme.text }}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/(tabs)/trilhas/[id]', params: { id: 'matematica-funcoes' } })}
                    style={{ backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', gap: 8, alignItems: 'center' }}
                  >
                    <Ionicons name="play" size={16} color="#FFFFFF" />
                    <Text style={{ color: 'white', fontWeight: '700' }}>Começar Funções</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/quiz')}
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', gap: 8, alignItems: 'center' }}
                  >
                    <Ionicons name="help-circle-outline" size={16} color={theme.text} />
                    <Text style={{ color: theme.text, fontWeight: '700' }}>Quiz de Matemática</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ gap: 12 }}>
                {[
                  { id: 'resumos', title: 'Resumos Essenciais', desc: 'Revisões rápidas para fixar os conceitos-chave.' },
                  { id: 'exercicios', title: 'Exercícios Comentados', desc: 'Pratique com resolução passo a passo.' },
                ].map((c) => (
                  <View key={c.id} style={[styles.card, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>{c.title}</Text>
                    <Text style={[styles.cardText, { color: theme.textMuted }]}>{c.desc}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.card}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Em breve</Text>
              <Text style={[styles.cardText, { color: theme.textMuted }]}>Aqui você verá aulas, resumos e exercícios desta matéria.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 64 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  actionCard: {
    flex: 1,
    height: 72,
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 14,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
  },
});
