import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../store/themeStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const exams = [
  { id: 'enem', name: 'ENEM', description: 'Exame Nacional do Ensino Médio', color: '#4F46E5', icon: '🎯' },
  { id: 'ufpr', name: 'UFPR', description: 'Universidade Federal do Paraná', color: '#10B981', icon: '🏛️' },
  { id: 'utfpr', name: 'UTFPR', description: 'Universidade Tecnológica Federal do Paraná', color: '#F59E0B', icon: '⚡' },
];

const subjects = [
  { id: 'linguagens', name: 'Linguagens', icon: '📚', color: '#8B5CF6' },
  { id: 'humanas', name: 'Humanas', icon: '🌍', color: '#3B82F6' },
  { id: 'naturais', name: 'Naturais', icon: '🔬', color: '#10B981' },
  { id: 'matematica', name: 'Matemática', icon: '📐', color: '#F59E0B' },
];

const levels = [
  { id: 'iniciante', name: 'Iniciante', description: 'Começando do básico', color: '#10B981' },
  { id: 'intermediario', name: 'Intermediário', description: 'Já tenho uma base', color: '#F59E0B' },
  { id: 'avancado', name: 'Avançado', description: 'Quero revisar e aprofundar', color: '#EF4444' },
];

export default function OnboardingFlow() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColors();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    exam: '',
    level: '',
    subjects: [] as string[]
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 7) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSubject = (subjectId: string) => {
    const newSubjects = formData.subjects.includes(subjectId)
      ? formData.subjects.filter(id => id !== subjectId)
      : [...formData.subjects, subjectId];
    updateFormData('subjects', newSubjects);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>Qual o seu nome?</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.button, !formData.name.trim() && styles.buttonDisabled]}
              onPress={nextStep}
              disabled={!formData.name.trim()}
            >
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>Quantos anos você tem?</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua idade"
              value={formData.age}
              onChangeText={(text) => updateFormData('age', text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              autoFocus
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, !formData.age && styles.buttonDisabled]}
                onPress={nextStep}
                disabled={!formData.age}
              >
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>Qual vestibular você vai prestar?</Text>
            <Text style={styles.subtitle}>Escolha a prova principal para personalizarmos seus estudos</Text>
            <View style={styles.examsGrid}>
              {exams.map((exam) => (
                <TouchableOpacity
                  key={exam.id}
                  style={[
                    styles.examButton,
                    formData.exam === exam.id && { backgroundColor: exam.color }
                  ]}
                  onPress={() => updateFormData('exam', exam.id)}
                >
                  <Text style={styles.examIcon}>{exam.icon}</Text>
                  <Text style={[
                    styles.examName,
                    formData.exam === exam.id && styles.examNameSelected
                  ]}>
                    {exam.name}
                  </Text>
                  <Text style={[
                    styles.examDescription,
                    formData.exam === exam.id && styles.examDescriptionSelected
                  ]}>
                    {exam.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, !formData.exam && styles.buttonDisabled]}
                onPress={nextStep}
                disabled={!formData.exam}
              >
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>Como você se considera?</Text>
            <Text style={styles.subtitle}>Isso nos ajuda a criar uma trilha personalizada</Text>
            <View style={styles.levelsGrid}>
              {levels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.levelButton,
                    formData.level === level.id && { backgroundColor: level.color }
                  ]}
                  onPress={() => updateFormData('level', level.id)}
                >
                  <Text style={[
                    styles.levelName,
                    formData.level === level.id && styles.levelNameSelected
                  ]}>
                    {level.name}
                  </Text>
                  <Text style={[
                    styles.levelDescription,
                    formData.level === level.id && styles.levelDescriptionSelected
                  ]}>
                    {level.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, !formData.level && styles.buttonDisabled]}
                onPress={nextStep}
                disabled={!formData.level}
              >
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>Quais áreas mais te interessam?</Text>
            <Text style={styles.subtitle}>Selecione as matérias que você quer focar</Text>
            <View style={styles.subjectsGrid}>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectButton,
                    formData.subjects.includes(subject.id) && { backgroundColor: subject.color }
                  ]}
                  onPress={() => toggleSubject(subject.id)}
                >
                  <Text style={styles.subjectIcon}>{subject.icon}</Text>
                  <Text style={[
                    styles.subjectText,
                    formData.subjects.includes(subject.id) && styles.subjectTextSelected
                  ]}>
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, formData.subjects.length === 0 && styles.buttonDisabled]}
                onPress={nextStep}
                disabled={formData.subjects.length === 0}
              >
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>Qual é o seu email?</Text>
            <Text style={styles.subtitle}>Para salvar seu progresso e enviar lembretes</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, !formData.email.trim() && styles.buttonDisabled]}
                onPress={nextStep}
                disabled={!formData.email.trim()}
              >
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.question}>Defina sua senha</Text>
            <Text style={styles.subtitle}>Para proteger sua conta e dados</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              secureTextEntry
              autoFocus
            />
            <Text style={styles.passwordStrength}>
              Força da senha: {formData.password.length < 6 ? 'Fraca' : formData.password.length < 10 ? 'Média' : 'Super Forte'}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, formData.password.length < 6 && styles.buttonDisabled]}
                onPress={() => router.push('/auth/signup')}
                disabled={formData.password.length < 6}
              >
                <Text style={styles.buttonText}>COMEÇAR A ESTUDAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
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
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.progressBar}>
            {[1, 2, 3, 4, 5, 6, 7].map((stepNumber) => (
              <View
                key={stepNumber}
                style={[
                  styles.progressDot,
                  { backgroundColor: stepNumber <= step ? 'white' : 'rgba(255,255,255,0.3)' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={[styles.content as any, { paddingBottom: insets.bottom + 64 }]}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stepContainer: {
    alignItems: 'center',
    minHeight: 400,
  },
  question: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  passwordStrength: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    minWidth: 160,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  examsGrid: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  examButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  examIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  examName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  examNameSelected: {
    color: 'white',
  },
  examDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  examDescriptionSelected: {
    color: 'white',
  },
  levelsGrid: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  levelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  levelName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  levelNameSelected: {
    color: 'white',
  },
  levelDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  levelDescriptionSelected: {
    color: 'white',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  subjectButton: {
    width: (width - 80) / 2,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  subjectIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  subjectTextSelected: {
    color: 'white',
  },
});
