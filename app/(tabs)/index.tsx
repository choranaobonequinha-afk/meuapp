import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useThemeColors } from '../../store/themeStore';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

const subjects = [
  { id: 'artes', name: 'Artes', icon: '🎨', color: '#F59E0B', progress: 75 },
  { id: 'ciencia', name: 'Ciência', icon: '🔬', color: '#3B82F6', progress: 60 },
  { id: 'matematica', name: 'Matemática', icon: '📐', color: '#3B82F6', progress: 45 },
  { id: 'letras', name: 'Letras', icon: '📚', color: '#8B5CF6', progress: 30 },
];

const recentActivities = [
  { id: 1, subject: 'Matemática', activity: 'Equações do 2º grau', time: '2h atrás' },
  { id: 2, subject: 'Ciência', activity: 'Sistema Solar', time: '1 dia atrás' },
  { id: 3, subject: 'Artes', activity: 'História da Arte', time: '2 dias atrás' },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuthStore();
  const theme = useThemeColors();

  const getActivityIcon = (subject: string) => {
    switch (subject) {
      case 'Matemática':
        return { name: 'calculator-outline' as const, bg: '#3B82F6' };
      case 'Ciência':
        return { name: 'flask-outline' as const, bg: '#3B82F6' };
      case 'Artes':
        return { name: 'color-palette-outline' as const, bg: '#F59E0B' };
      default:
        return { name: 'book-outline' as const, bg: 'rgba(255,255,255,0.2)' };
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
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
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/hero-logo.png')}
                style={styles.heroLogo}
              />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.greeting}>Olá, {user?.user_metadata?.name || 'Estudante'}!</Text>
              <Text style={styles.subtitle}>Continue aprendendo</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Overview */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Seu Progresso</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Progresso Geral</Text>
                <Text style={styles.progressPercentage}>65%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressText}>Continue assim! Você está indo muito bem.</Text>
            </View>
          </View>

          {/* Subjects Grid */}
          <View style={styles.subjectsSection}>
            <Text style={styles.sectionTitle}>Suas Matérias</Text>
            <View style={styles.subjectsGrid}>
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={{
                    pathname: '/(tabs)/materias/[id]',
                    params: { id: subject.id, name: subject.name, color: subject.color },
                  }}
                  asChild
                >
                  <TouchableOpacity style={styles.subjectCard}>
                    <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                      <Text style={styles.subjectIconText}>{subject.icon}</Text>
                    </View>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <View style={styles.subjectProgress}>
                      <View style={styles.subjectProgressBar}>
                        <View
                          style={[
                            styles.subjectProgressFill,
                            { width: `${subject.progress}%`, backgroundColor: subject.color },
                          ]}
                        />
                      </View>
                      <Text style={styles.subjectProgressText}>{subject.progress}%</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>

          {/* Recent Activities */}
          <View style={styles.activitiesSection}>
            <Text style={styles.sectionTitle}>Atividades Recentes</Text>
            <View style={styles.activitiesList}>
              {recentActivities.map((activity) => {
                const ico = getActivityIcon(activity.subject);
                // Map subject label to id for navigation
                const subjectId = activity.subject.toLowerCase().startsWith('arte')
                  ? 'artes'
                  : activity.subject.toLowerCase().startsWith('matem')
                  ? 'matematica'
                  : activity.subject.toLowerCase().startsWith('ci')
                  ? 'ciencia'
                  : 'letras';
                return (
                  <Link
                    key={activity.id}
                    href={{
                      pathname: '/(tabs)/materias/[id]',
                      params: { id: subjectId, name: activity.subject },
                    }}
                    asChild
                  >
                    <TouchableOpacity style={styles.activityCard}>
                      <View style={[styles.activityIcon, { backgroundColor: ico.bg }]}>
                        <Ionicons name={ico.name} size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activitySubject}>{activity.subject}</Text>
                        <Text style={styles.activityText}>{activity.activity}</Text>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
                    </TouchableOpacity>
                  </Link>
                );
              })}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Ações Rápidas</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="play-circle" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Continuar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
                  <Ionicons name="search" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Explorar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
                  <Ionicons name="trophy" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Conquistas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
                  <Ionicons name="settings" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Config</Text>
              </TouchableOpacity>
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
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: 0,
    marginTop: 4,
  },
  logoContainer: {
    alignItems: 'center',
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  heroLogo: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    alignSelf: 'flex-start',
    marginTop: 0,
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
  progressSection: {
    marginBottom: 32,
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
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  subjectCard: {
    width: (width - 72) / 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  subjectIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIconText: {
    fontSize: 28,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subjectProgress: {
    width: '100%',
    alignItems: 'center',
  },
  subjectProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 8,
  },
  subjectProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  subjectProgressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  activitiesSection: {
    marginBottom: 32,
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activitySubject: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  actionsSection: {
    marginBottom: 40,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  actionCard: {
    width: (width - 72) / 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
