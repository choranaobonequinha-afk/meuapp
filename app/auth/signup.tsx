import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../store/themeStore';
import { useRouter, Link } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useThemeColors();
  const { signUp } = useAuthStore.getState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  async function handleSignUp() {
    try {
      const nextErrors: { name?: string; email?: string; password?: string } = {};
      if (!name.trim()) nextErrors.name = 'Informe seu nome';
      if (!email.trim()) nextErrors.email = 'Informe seu email';
      if (!password) nextErrors.password = 'Informe uma senha';

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) nextErrors.email = 'Email inválido';

      // Validação de senha
      if (password && password.length < 6) nextErrors.password = 'Mínimo 6 caracteres';

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        Alert.alert('Complete os campos', 'Corrija os campos destacados.');
        return;
      }

      setLoading(true);
      await signUp(email.trim(), password, name.trim());
      Alert.alert(
        'Pronto!', 
        'Verifique seu email para confirmar a conta.',
        [
          { text: 'OK', onPress: () => router.push('/auth/login') }
        ]
      );
    } catch (e: any) {
      let errorMessage = 'Tente novamente';
      
      if (e.message?.includes('Email address')) {
        errorMessage = 'Email inválido ou não permitido. Tente com outro email.';
      } else if (e.message?.includes('password')) {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
      }
      
      Alert.alert('Erro ao criar conta', errorMessage);
    } finally {
      setLoading(false);
    }
  }

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
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar conta</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 64 }]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/images/hero-logo.png')}
                  style={styles.heroLogo}
                />
                <Text style={styles.appTitle}>APRENDER +</Text>
              </View>

              <Text style={styles.subtitle}>Crie seu perfil Agora!</Text>
              <Text style={styles.description}>
                Crie um perfil para salvar seu progresso nos estudos e continue aprendendo de graça!
              </Text>

              <View style={styles.inputContainer}>
                <Input 
                  label="Nome" 
                  value={name} 
                  onChangeText={(t) => { setName(t); if (errors.name) setErrors({ ...errors, name: undefined }); }} 
                  placeholder="Seu nome" 
                  style={styles.input}
                  error={errors.name}
                />
                <Input 
                  label="Email" 
                  value={email} 
                  onChangeText={(t) => { setEmail(t); if (errors.email) setErrors({ ...errors, email: undefined }); }} 
                  autoCapitalize="none" 
                  keyboardType="email-address" 
                  placeholder="voce@email.com" 
                  style={styles.input}
                  error={errors.email}
                />
                <Input 
                  label="Senha" 
                  value={password} 
                  onChangeText={(t) => { setPassword(t); if (errors.password) setErrors({ ...errors, password: undefined }); }} 
                  secureTextEntry 
                  placeholder="••••••••" 
                  style={styles.input}
                  error={errors.password}
                />
              </View>

              <Button 
                title="Criar conta" 
                onPress={handleSignUp} 
                loading={loading}
                style={styles.signupButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.googleButton}>
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text style={styles.googleButtonText}>Entrar Com Google</Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Já tenho conta</Text>
                <Link href="/auth/login" style={styles.footerLink}>Entrar</Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heroLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  hexagon: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '30deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1976D2',
    transform: [{ rotate: '-30deg' }],
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
  },
  signupButton: {
    width: '100%',
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.7)',
    marginHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    marginBottom: 32,
    gap: 8,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  footerLink: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
