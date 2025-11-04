import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../store/themeStore';

const { height } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();
  const theme = useThemeColors();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={theme.gradient} style={styles.gradient}>
        <View style={styles.content}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg' }}
            style={styles.hero}
          />
          <Text style={styles.title}>Guia de Vestibular</Text>
          <Text style={styles.subtitle}>ENEM • UFPR • UTFPR</Text>
          <Button title="Começar" onPress={() => router.push('/auth/login')} />
          <Link href="/auth/signup" style={styles.signup}>Criar conta</Link>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { width: '86%', maxWidth: 480, alignItems: 'center', gap: 12 },
  hero: { width: '100%', height: height * 0.28, borderRadius: 18, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 16, color: '#E5E7EB', marginBottom: 6 },
  signup: { color: '#fff', marginTop: 8, textDecorationLine: 'underline' }
});
