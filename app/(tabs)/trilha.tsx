import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../store/themeStore';
import { trilhas } from '../../data/mock';
import type { Trilha } from '../../types/models';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const examData = {
  enem: {
    name: 'ENEM',
    color: '#4F46E5',
    icon: '🎯',
    subjects: [
      {
        id: 'linguagens',
        name: 'Linguagens, Códigos e suas Tecnologias',
        icon: '📚',
        color: '#8B5CF6',
        topics: ['Gramática', 'Literatura', 'Arte', 'Educação Física', 'Tecnologias da Informação'],
        progress: 65,
        estimatedTime: '120h'
      },
      {
        id: 'humanas',
        name: 'Ciências Humanas e suas Tecnologias',
        icon: '🌍',
        color: '#8B5CF6',
        topics: ['História', 'Geografia', 'Filosofia', 'Sociologia'],
        progress: 45,
        estimatedTime: '100h'
      },
      {
        id: 'naturais',
        name: 'Ciências da Natureza e suas Tecnologias',
        icon: '🔬',
        color: '#10B981',
        topics: ['Física', 'Química', 'Biologia'],
        progress: 30,
        estimatedTime: '150h'
      },
      {
        id: 'matematica',
        name: 'Matemática e suas Tecnologias',
        icon: '📐',
        color: '#3B82F6',
        topics: ['Álgebra', 'Geometria', 'Trigonometria', 'Estatística'],
        progress: 55,
        estimatedTime: '140h'
      }
    ]
  },
  ufpr: {
    name: 'UFPR',
    color: '#10B981',
    icon: '🏛️',
    subjects: [
      {
        id: 'portugues',
        name: 'Língua Portuguesa',
        icon: '📖',
        color: '#8B5CF6',
        topics: ['Gramática', 'Interpretação', 'Literatura', 'Redação'],
        progress: 70,
        estimatedTime: '80h'
      },
      {
        id: 'matematica',
        name: 'Matemática',
        icon: '📐',
        color: '#3B82F6',
        topics: ['Álgebra', 'Geometria', 'Trigonometria', 'Cálculo'],
        progress: 40,
        estimatedTime: '120h'
      },
      {
        id: 'historia',
        name: 'História',
        icon: '🏛️',
        color: '#3B82F6',
        topics: ['História Geral', 'História do Brasil', 'História Contemporânea'],
        progress: 60,
        estimatedTime: '90h'
      },
      {
        id: 'geografia',
        name: 'Geografia',
        icon: '🌍',
        color: '#10B981',
        topics: ['Geografia Física', 'Geografia Humana', 'Geografia do Brasil'],
        progress: 35,
        estimatedTime: '85h'
      }
    ]
  },
  utfpr: {
    name: 'UTFPR',
    color: '#F59E0B',
    icon: '⚡',
    subjects: [
      {
        id: 'portugues',
        name: 'Língua Portuguesa',
        icon: '📖',
        color: '#8B5CF6',
        topics: ['Gramática', 'Interpretação', 'Literatura'],
        progress: 75,
        estimatedTime: '60h'
      },
      {
        id: 'matematica',
        name: 'Matemática',
        icon: '📐',
        color: '#3B82F6',
        topics: ['Álgebra', 'Geometria', 'Trigonometria', 'Cálculo Diferencial'],
        progress: 50,
        estimatedTime: '100h'
      },
      {
        id: 'fisica',
        name: 'Física',
        icon: '⚡',
        color: '#3B82F6',
        topics: ['Mecânica', 'Termodinâmica', 'Eletromagnetismo', 'Óptica'],
        progress: 25,
        estimatedTime: '120h'
      },
      {
        id: 'quimica',
        name: 'Química',
        icon: '🧪',
        color: '#10B981',
        topics: ['Química Geral', 'Química Orgânica', 'Físico-Química'],
        progress: 30,
        estimatedTime: '110h'
      }
    ]
  }
};

export default function TrilhaScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColors();
  const [selectedExam, setSelectedExam] = useState('enem');
  const exam = examData[selectedExam as keyof typeof examData];
  const { subject: subjectParam, subjectName } = useLocalSearchParams<{ subject?: string; subjectName?: string }>();
  const router = useRouter();
  const isMath = useMemo(() => {
    const q = (subjectParam || '').toString().toLowerCase();
    return q.startsWith('matem');
  }, [subjectParam]);

  const filteredSubjects = useMemo(() => {
    if (!subjectParam) return exam.subjects;
    const q = subjectParam.toString().toLowerCase();
    const keywords: Record<string, string[]> = {
      artes: ['arte'],
      matematica: ['matem'],
      ciencia: ['ciên', 'natureza', 'naturais', 'biolog', 'quím', 'fís'],
      letras: ['lingu', 'portugu', 'literat'],
    };
    const ks = keywords[q] || [q];
    const includes = (s: string) => ks.some(k => s.toLowerCase().includes(k));
    return exam.subjects.filter((s) => includes(s.name) || s.topics?.some(t => includes(t)));
  }, [exam, subjectParam]);

  const list = filteredSubjects && filteredSubjects.length ? filteredSubjects : exam.subjects;

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return '#10B981';
    if (progress >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getProgressText = (progress: number) => {
    if (progress >= 70) return 'Excelente!';
    if (progress >= 40) return 'Bom progresso!';
    return 'Precisa focar mais';
  };

  // Utilitário: filtra trilhas por uma "área" (id da matéria)
  const getTrilhasByArea = (areaKey?: string) => {
    if (!areaKey) return trilhas;
    const q = areaKey.toString().toLowerCase();
    const kw: Record<string, string[]> = {
      artes: ['arte'],
      matematica: ['matem'],
      ciencia: ['ciên', 'natureza', 'naturais', 'biolog', 'quím', 'fís'],
      letras: ['lingu', 'portugu', 'literat'],
    };
    const ks = kw[q] || [q];
    const hasMatch = (text: string) => ks.some(k => text.toLowerCase().includes(k));
    return trilhas.filter((t: Trilha) => {
      if (t.areas && t.areas.length) return t.areas.some(a => hasMatch(a));
      return hasMatch(t.nome) || hasMatch(t.id);
    });
  };

  // Removido bloco de "conteúdo oficial" desta tela; simulados/provas ficam na tela própria

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
              <Text style={styles.title} numberOfLines={2}>Sua Trilha de Estudos</Text>
              <Text style={styles.subtitle} numberOfLines={2}>Personalizada para {exam.name}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.examSelector}>
            <Text style={styles.examSelectorText}>{exam.icon} {exam.name}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Exam Selection */}
          <View style={styles.examSelection}>
            <Text style={styles.sectionTitle}>Escolha sua prova</Text>
            <View style={styles.examButtons}>
              {Object.entries(examData).map(([key, data]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.examButton,
                    selectedExam === key && { backgroundColor: data.color }
                  ]}
                  onPress={() => setSelectedExam(key)}
                >
                  <Text style={styles.examButtonIcon}>{data.icon}</Text>
                  <Text style={[
                    styles.examButtonText,
                    selectedExam === key && styles.examButtonTextSelected
                  ]}>
                    {data.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Destaque: Trilha de Matemática */}
          {isMath ? (
            <View style={styles.mathSection}>
              <View style={styles.mathHero}>
                <View style={styles.mathHeroLeft}>
                  <View style={styles.mathIconWrap}>
                    <Text style={styles.mathIcon}>📐</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mathTitle}>Matemática e suas Tecnologias</Text>
                    <Text style={styles.mathSub}>Trilha sugerida: Funções → Geometria → Trigonometria → Estatística</Text>
                  </View>
                </View>
                <View style={styles.mathHeroActions}>
                  <TouchableOpacity
                    style={[styles.mathBtn, { backgroundColor: '#3B82F6' }]}
                    onPress={() => router.push({ pathname: '/(tabs)/trilhas/[id]', params: { id: 'matematica-funcoes' } })}
                    accessibilityRole="button"
                    accessibilityLabel="Abrir trilha: Matemática – Funções"
                  >
                    <Ionicons name="play" size={16} color="#FFFFFF" />
                    <Text style={styles.mathBtnText}>Começar Funções</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.mathBtn, { backgroundColor: 'rgba(255,255,255,0.14)' }]}
                    onPress={() => router.push('/(tabs)/quiz')}
                  >
                    <Ionicons name="help-circle-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.mathBtnText}>Quiz de Matemática</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Roadmap de módulos */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roadmapScroll}>
                {[
                  { id: 'funcoes', label: 'Funções', color: '#3B82F6', progress: 40, icon: 'calculator-outline' as const },
                  { id: 'geometria', label: 'Geometria', color: '#F59E0B', progress: 25, icon: 'cube-outline' as const },
                  { id: 'trigonometria', label: 'Trigonometria', color: '#8B5CF6', progress: 10, icon: 'analytics-outline' as const },
                  { id: 'estatistica', label: 'Estatística', color: '#3B82F6', progress: 0, icon: 'stats-chart-outline' as const },
                ].map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={styles.roadmapCard}
                    onPress={() => {
                      if (m.id === 'funcoes') {
                        router.push({ pathname: '/(tabs)/trilhas/[id]', params: { id: 'matematica-funcoes' } });
                      }
                    }}
                  >
                    <View style={[styles.roadmapIcon, { backgroundColor: m.color }]}>
                      <Ionicons name={m.icon} size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.roadmapLabel}>{m.label}</Text>
                    <View style={styles.roadmapBarBg}>
                      <View style={[styles.roadmapBarFill, { width: `${m.progress}%`, backgroundColor: m.color }]} />
                    </View>
                    <Text style={styles.roadmapPct}>{m.progress}%</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {/* Progress Overview */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Progresso Geral</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Você está no caminho certo!</Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(exam.subjects.reduce((acc, sub) => acc + sub.progress, 0) / exam.subjects.length)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.round(exam.subjects.reduce((acc, sub) => acc + sub.progress, 0) / exam.subjects.length)}%` 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                Continue assim! Sua dedicação está rendendo frutos.
              </Text>
            </View>
          </View>

          {/* Conteúdo oficial por exame (ex.: ENEM Base, Vestibular UFPR) */}
          {null}

          {/* Subjects */}
          <View style={styles.subjectsSection}>
            <Text style={styles.sectionTitle}>Matérias e Progresso</Text>
            {exam.subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={styles.subjectCard}
                onPress={() => {
                  const matches = getTrilhasByArea(subject.id);
                  if (matches.length) {
                    router.push({ pathname: '/(tabs)/trilhas/[id]', params: { id: matches[0].id } });
                  } else {
                    router.push('/(tabs)/trilhas');
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={`Abrir conteúdos de ${subject.name}`}
              >
                <View style={styles.subjectHeader}>
                  <View style={styles.subjectInfo}>
                    <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                      <Text style={styles.subjectIconText}>{subject.icon}</Text>
                    </View>
                    <View style={styles.subjectDetails}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={styles.subjectProgressText}>
                        {subject.progress}% concluído
                      </Text>
                    </View>
                  </View>
                  <View style={styles.subjectStats}>
                    <Text style={styles.subjectTime}>{subject.estimatedTime}</Text>
                    <Text style={styles.subjectTimeLabel}>estimado</Text>
                  </View>
                </View>
                
                <View style={styles.subjectProgress}>
                  <View style={styles.subjectProgressBar}>
                    <View 
                      style={[
                        styles.subjectProgressFill, 
                        { 
                          width: `${subject.progress}%`, 
                          backgroundColor: getProgressColor(subject.progress)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.subjectProgressPercentage, { color: getProgressColor(subject.progress) }]}>
                    {subject.progress}%
                  </Text>
                </View>

                <Text style={styles.subjectStatus}>
                  {getProgressText(subject.progress)}
                </Text>

                <View style={styles.topicsContainer}>
                  <Text style={styles.topicsTitle}>Tópicos principais:</Text>
                  <View style={styles.topicsList}>
                    {subject.topics.map((topic, index) => (
                      <View
                        key={index}
                        style={[styles.topicItem, { borderColor: subject.color }]}
                      >
                        <View style={[styles.topicDot, { backgroundColor: subject.color }]} />
                        <Text style={styles.topicText}>{topic}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.continueButton, { backgroundColor: subject.color }]}
                  onPress={() => {
                    const matches = getTrilhasByArea(subject.id);
                    if (matches.length) {
                      router.push({ pathname: '/(tabs)/trilhas/[id]', params: { id: matches[0].id } });
                    } else {
                      router.push('/(tabs)/trilhas');
                    }
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Continuar estudos em ${subject.name}`}
                >
                  <Text style={styles.continueButtonText}>Continuar Estudos</Text>
                  <Ionicons name="play" size={16} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Study Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Dicas para {exam.name}</Text>
            <View style={styles.tipsCard}>
              <View style={styles.tipItem}>
                <Ionicons name="time-outline" size={24} color="#10B981" />
                <Text style={styles.tipText}>
                  Estude por blocos de 25 minutos com pausas de 5 minutos
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="book-outline" size={24} color="#3B82F6" />
                <Text style={styles.tipText}>
                  Faça resumos das matérias que você tem mais dificuldade
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#F59E0B" />
                <Text style={styles.tipText}>
                  Resolva provas antigas para treinar o formato da prova
                </Text>
              </View>
            </View>
            {/* Link para provas ficará no Quiz; simulados serão adicionados depois */}
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
    flexWrap: 'wrap',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: 0,
    flexBasis: '100%',
  },
  logoContainer: {
    alignItems: 'center',
  },
  heroLogo: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
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
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  examSelector: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexShrink: 0,
    alignSelf: 'flex-start',
    marginTop: 28,
  },
  examSelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
  },
  examSelection: {
    marginBottom: 32,
  },
  mathSection: {
    marginBottom: 24,
  },
  mathHero: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)'
  },
  mathHeroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  mathIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59,130,246,0.25)'
  },
  mathIcon: { fontSize: 20 },
  mathTitle: { color: 'white', fontSize: 16, fontWeight: '800' },
  mathSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },
  mathHeroActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  mathBtn: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  mathBtnText: { color: 'white', fontSize: 12, fontWeight: '700' },
  roadmapScroll: {
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
    paddingHorizontal: 2,
  },
  roadmapCard: {
    width: 140,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    marginRight: 10,
  },
  roadmapIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roadmapLabel: { color: 'white', fontSize: 13, fontWeight: '700' },
  roadmapBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginTop: 8,
  },
  roadmapBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  roadmapPct: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 6 },
  examButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  examButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  examButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  examButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  examButtonTextSelected: {
    color: 'white',
  },
  progressSection: {
    marginBottom: 32,
  },
  trilhasSection: {
    marginBottom: 32,
  },
  trilhasList: {
    gap: 12,
  },
  trilhaCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trilhaIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trilhaTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  trilhaDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  subjectsSection: {
    marginBottom: 32,
  },
  subjectCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  subjectDetails: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  subjectProgressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  subjectStats: {
    alignItems: 'center',
  },
  subjectTime: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  subjectTimeLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  subjectProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  subjectProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  subjectProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  subjectProgressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
  },
  subjectStatus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  topicsContainer: {
    marginBottom: 20,
  },
  topicsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  topicsList: {
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
  },
  topicDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  topicText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  tipsSection: {
    marginBottom: 40,
  },
  tipsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    lineHeight: 20,
  },
});
