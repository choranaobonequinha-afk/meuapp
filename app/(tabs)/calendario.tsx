
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeColors } from '../../store/themeStore';

const weekDays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const sampleEvents = [
  { id: 1, title: 'Revisão de Matemática', date: 'Amanhã • 18:00', color: '#10B981' },
  { id: 2, title: 'Simulado ENEM', date: 'Sábado • 08:00', color: '#F59E0B' },
];

export default function CalendarioScreen() {
  const theme = useThemeColors();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Calendário</Text>

        {/* Semana atual (mini grade) */}
        <View style={styles.weekRow}>
          {weekDays.map((d, i) => (
            <View key={i} style={styles.dayCell}>
              <Text style={[styles.dayLabel, { color: theme.textMuted }]}>{d}</Text>
              <View style={[styles.dayDot, i === 1 ? { backgroundColor: '#4F46E5' } : { opacity: 0.15 }]} />
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Próximos eventos</Text>
        {sampleEvents.map((e) => (
          <View key={e.id} style={styles.eventCard}>
            <View style={[styles.eventDot, { backgroundColor: e.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.eventTitle, { color: theme.text }]}>{e.title}</Text>
              <Text style={[styles.eventDate, { color: theme.textMuted }]}>{e.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  sectionTitle: { marginTop: 20, marginBottom: 8, fontSize: 16, fontWeight: '700' },
  weekRow: { flexDirection: 'row', gap: 10 },
  dayCell: { flex: 1, alignItems: 'center' },
  dayLabel: { fontSize: 12, fontWeight: '700' },
  dayDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, backgroundColor: '#E5E7EB' },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginBottom: 10,
  },
  eventDot: { width: 10, height: 10, borderRadius: 5 },
  eventTitle: { fontSize: 15, fontWeight: '700' },
  eventDate: { fontSize: 13 },
});
