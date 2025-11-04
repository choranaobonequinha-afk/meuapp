import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { recursos, trilhas } from '../../data/mock';
// Unify logo usage across screens (use hero image)

const { width } = Dimensions.get('window');

const quizCategories = [
  {
    id: 'enem',
    name: 'ENEM',
    icon: '🎯',
    color: '#4F46E5',
    questions: 180,
    time: '5h 30min',
    difficulty: 'Médio',
    subjects: ['Todas as áreas']
  },
  {
    id: 'ufpr',
    name: 'UFPR',
    icon: '🏛️',
    color: '#10B981',
    questions: 80,
    time: '4h',
    difficulty: 'Difícil',
    subjects: ['Português', 'Matemática', 'História', 'Geografia']
  },
  {
    id: 'utfpr',
    name: 'UTFPR',
    icon: '⚡',
    color: '#F59E0B',
    questions: 60,
    time: '3h',
    difficulty: 'Médio',
    subjects: ['Português', 'Matemática', 'Física', 'Química']
  }
];

const subjectQuizzes = [
  {
    id: 'matematica',
    name: 'Matemática',
    icon: '📐',
    color: '#F59E0B',
    questions: 45,
    completed: 12,
    accuracy: 78
  },
  {
    id: 'portugues',
    name: 'Português',
    icon: '📚',
    color: '#8B5CF6',
    questions: 40,
    completed: 18,
    accuracy: 85
  },
  {
    id: 'historia',
    name: 'História',
    icon: '🏛️',
    color: '#3B82F6',
    questions: 35,
    completed: 8,
    accuracy: 72
  },
  {
    id: 'geografia',
    name: 'Geografia',
    icon: '🌍',
    color: '#10B981',
    questions: 30,
    completed: 15,
    accuracy: 80
  }
];

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState('enem');
  const router = useRouter();

  // Provas oficiais (sem simulados por enquanto)
  const provasOficiais = useMemo(() => {
    return recursos.filter((r) => r.tipo === 'PDF_OFICIAL' || r.tipo === 'SITE');
  }, []);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return '#10B981';
    if (accuracy >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getAccuracyText = (accuracy: number) => {
    if (accuracy >= 80) return 'Excelente!';
    if (accuracy >= 60) return 'Bom!';
    return 'Precisa melhorar';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradient}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/hero-logo.png')}
                style={styles.heroLogo}
              />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>Quiz & Provas</Text>
              <Text style={styles.subtitle}>Teste seus conhecimentos</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.statsButton}>
            <Ionicons name="stats-chart" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Provas Oficiais (prioridade) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Provas Oficiais</Text>
            <View style={styles.provasList}>
              {provasOficiais.map((item) => {
                const trilha = trilhas.find((t) => t.id === item.trilhaId);
                const trilhaName = trilha?.nome;
                const isPdf = item.tipo === 'PDF_OFICIAL';
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.provaCard}
                    onPress={() => router.push({ pathname: '/(tabs)/trilhas/recurso/[id]', params: { id: item.id } })}
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir ${isPdf ? 'PDF oficial' : 'Site oficial'}: ${item.titulo}`}
                  >
                    <View style={[styles.provaIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                      <Ionicons
                        name={isPdf ? 'document-text-outline' : 'globe-outline'}
                        size={18}
                        color={'white'}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      {trilhaName ? (
                        <View style={styles.trilhaChip}>
                          <Ionicons name="map-outline" size={12} color={'rgba(255,255,255,0.9)'} />
                          <Text style={styles.trilhaChipText} numberOfLines={1}>{trilhaName}</Text>
                        </View>
                      ) : null}
                      <Text style={styles.provaTitle} numberOfLines={2}>{item.titulo}</Text>
                      <View style={styles.badgesRow}>
                        <View style={[styles.badge, isPdf ? styles.badgePdf : styles.badgeSite]}>
                          <Ionicons name={isPdf ? 'document-text-outline' : 'globe-outline'} size={12} color={isPdf ? '#10B981' : '#3B82F6'} />
                          <Text style={[styles.badgeText, { color: isPdf ? '#10B981' : '#3B82F6' }]}>
                            {isPdf ? 'PDF oficial' : 'Site oficial'}
                          </Text>
                        </View>
                        {item.origem ? (
                          <View style={[styles.badge, styles.badgeNeutral]}>
                            <Text style={[styles.badgeText, { color: 'rgba(255,255,255,0.95)' }]}>{item.origem}</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={'rgba(255,255,255,0.85)'} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Quiz por Matéria (mantido) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quiz por Matéria</Text>
            <View style={styles.subjectsGrid}>
              {subjectQuizzes.map((subject) => (
                <TouchableOpacity key={subject.id} style={styles.subjectCard}>
                  <View style={styles.subjectHeader}>
                    <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                      <Text style={styles.subjectIconText}>{subject.icon}</Text>
                    </View>
                    <View style={styles.subjectInfo}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={styles.subjectStats}>
                        {subject.completed}/{subject.questions} completados
                      </Text>
                    </View>
                    <View style={styles.accuracyContainer}>
                      <Text style={[styles.accuracyScore, { color: getAccuracyColor(subject.accuracy) }]}>
                        {subject.accuracy}%
                      </Text>
                      <Text style={styles.accuracyLabel}>acerto</Text>
                    </View>
                  </View>
                  
                  <View style={styles.subjectProgress}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${(subject.completed / subject.questions) * 100}%`,
                            backgroundColor: subject.color
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {getAccuracyText(subject.accuracy)}
                    </Text>
                  </View>

                  <TouchableOpacity style={[styles.quizButton, { backgroundColor: subject.color }]}>
                    <Text style={styles.quizButtonText}>Fazer Quiz</Text>
                    <Ionicons name="play" size={16} color="white" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: 0,
  },
  logoContainer: {
    alignItems: 'center',
  },
  heroLogo: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  hexagon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '30deg' }],
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    transform: [{ rotate: '-30deg' }],
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 12,
    textAlign: 'center',
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  categoryNameSelected: {
    color: 'white',
  },
  categoryDetails: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  categoryDetail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  categoryDetailSelected: {
    color: 'white',
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  subjectsGrid: {
    gap: 16,
  },
  provasList: {
    gap: 12,
  },
  provaCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  provaIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trilhaChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginBottom: 6,
  },
  trilhaChipText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  provaTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgePdf: { backgroundColor: 'rgba(16,185,129,0.18)' },
  badgeSite: { backgroundColor: 'rgba(59,130,246,0.18)' },
  badgeNeutral: { backgroundColor: 'rgba(255,255,255,0.14)' },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subjectCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectIconText: {
    fontSize: 24,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  subjectStats: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  accuracyContainer: {
    alignItems: 'center',
  },
  accuracyScore: {
    fontSize: 18,
    fontWeight: '700',
  },
  accuracyLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  subjectProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  quizButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});
