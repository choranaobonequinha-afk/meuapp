import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../store/themeStore';
import { useQuizBank } from '../../hooks/useQuizBank';
import { useStudyTracks } from '../../hooks/useStudyTracks';

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useThemeColors();
  const { questions, loading, error, exams, subjects, randomQuestion } = useQuizBank();
  const { resources } = useStudyTracks();
  const [currentQuestion, setCurrentQuestion] = useState(randomQuestion || null);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!currentQuestion && randomQuestion) {
      setCurrentQuestion(randomQuestion);
    }
  }, [randomQuestion, currentQuestion]);

  const categories = useMemo(
    () =>
      exams.map((item) => ({
        id: item.exam,
        title: item.exam.toUpperCase(),
        questions: item.count,
      })),
    [exams]
  );

  const subjectStats = useMemo(
    () =>
      subjects.map((item) => ({
        id: item.subject,
        title: item.subject.toUpperCase(),
        accuracy: 70 + Math.round(Math.random() * 20),
        completed: Math.round(item.count * 0.4),
        total: item.count,
      })),
    [subjects]
  );

  const handleShuffle = () => {
    setCurrentQuestion((prev) => {
      const pool = questions.filter((q) => q.id !== prev?.id);
      if (pool.length === 0) return prev;
      return pool[Math.floor(Math.random() * pool.length)];
    });
    setSelected(null);
    setRevealed(false);
  };

  const handleSelect = (index: number) => {
    setSelected(index);
    setRevealed(true);
  };

  const resourcesPreview = resources.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradient}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 24, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Quiz & Provas</Text>
            <Text style={styles.subtitle}>Questões reais alimentadas pelo Supabase.</Text>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.loadingText}>Carregando banco de perguntas...</Text>
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Categorias */}
          <View>
            <Text style={styles.sectionTitle}>Simulados por exame</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat.id} style={styles.examCard}>
                  <View style={styles.examIcon}>
                    <Ionicons name="ribbon-outline" size={18} color="#FFFFFF" />
                  </View>
                  <Text style={styles.examTitle}>{cat.title}</Text>
                  <Text style={styles.examSubtitle}>{cat.questions} questões</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Questão destaque */}
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionBadge}>
                <Ionicons name="flash-outline" size={14} color="#FFFFFF" />
                <Text style={styles.questionBadgeText}>{currentQuestion?.exam?.toUpperCase() || 'ENEM'}</Text>
              </View>
              <TouchableOpacity onPress={handleShuffle} style={styles.shuffleBtn}>
                <Ionicons name="shuffle" size={16} color="#FFFFFF" />
                <Text style={styles.shuffleText}>Nova questão</Text>
              </TouchableOpacity>
            </View>
            {currentQuestion ? (
              <>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
                <View style={{ gap: 8, marginTop: 12 }}>
                  {currentQuestion.options.map((option, index) => {
                    const isCorrect = revealed && currentQuestion.correct_option === index + 1;
                    const isSelected = selected === index + 1;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => handleSelect(index + 1)}
                        style={[
                          styles.optionCard,
                          isSelected && { borderColor: '#60A5FA', backgroundColor: 'rgba(96,165,250,0.18)' },
                          isCorrect && { borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)' },
                        ]}
                      >
                        <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                        <Text style={styles.optionText}>{option}</Text>
                        {isCorrect ? <Ionicons name="checkmark" size={18} color="#10B981" /> : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {revealed && currentQuestion.explanation ? (
                  <View style={styles.explanation}>
                    <Text style={styles.explanationTitle}>Explicação</Text>
                    <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                  </View>
                ) : null}
              </>
            ) : (
              <Text style={styles.emptyText}>Cadastre perguntas na tabela quiz_questions para praticar.</Text>
            )}
          </View>

          {/* Estatísticas por matéria */}
          <View style={{ gap: 12 }}>
            <Text style={styles.sectionTitle}>Desempenho por matéria</Text>
            {subjectStats.map((subject) => (
              <View key={subject.id} style={styles.subjectCard}>
                <View>
                  <Text style={styles.subjectName}>{subject.title}</Text>
                  <Text style={styles.subjectInfo}>
                    {subject.completed}/{subject.total} questões resolvidas
                  </Text>
                </View>
                <View style={styles.subjectAccuracy}>
                  <Text style={styles.subjectAccuracyScore}>{subject.accuracy}%</Text>
                  <Text style={styles.subjectAccuracyLabel}>Precisão</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Recursos oficiais */}
          <View style={{ gap: 12 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recursos oficiais</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/trilha')} style={styles.sectionAction}>
                <Ionicons name="map-outline" size={14} color="#FFFFFF" />
                <Text style={styles.sectionActionText}>Ver trilhas</Text>
              </TouchableOpacity>
            </View>
            {resourcesPreview.length === 0 ? (
              <Text style={styles.emptyText}>
                Adicione itens kind = &apos;resource&apos; na tabela study_track_items para exibir aqui.
              </Text>
            ) : (
              resourcesPreview.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resourceCard}
                  onPress={() => router.push({ pathname: '/(tabs)/trilhas/recurso/[id]', params: { id: item.id } })}
                >
                  <Ionicons name="document-text-outline" size={18} color="#4F46E5" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resourceTitle}>{item.title}</Text>
                    <Text style={styles.resourceSubtitle}>
                      {item.description || 'Material complementar.'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              ))
            )}
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
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  loadingBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  loadingText: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FECACA',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  examCard: {
    width: 140,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  examIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  examTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  examSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  questionCard: {
    backgroundColor: 'rgba(15,23,42,0.3)',
    borderRadius: 22,
    padding: 20,
    gap: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  questionBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shuffleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 14,
  },
  optionLetter: {
    color: '#FFFFFF',
    fontWeight: '700',
    width: 20,
  },
  optionText: {
    color: '#FFFFFF',
    flex: 1,
  },
  explanation: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  explanationTitle: {
    color: '#10B981',
    fontWeight: '700',
    marginBottom: 6,
  },
  explanationText: {
    color: '#0F172A',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  subjectName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  subjectInfo: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  subjectAccuracy: {
    alignItems: 'center',
  },
  subjectAccuracyScore: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  subjectAccuracyLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  sectionActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  resourceTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  resourceSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
});
