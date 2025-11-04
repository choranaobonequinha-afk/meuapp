
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../store/themeStore';

export default function BibliotecaScreen() {
  const theme = useThemeColors();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.center}> 
        <Text style={[styles.title, { color: theme.text }]}>Biblioteca</Text>
        <Text style={{ color: theme.textMuted }}>Em breve: seus livros e resumos.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
});
