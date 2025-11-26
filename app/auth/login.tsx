import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useThemeColors } from '../../store/themeStore';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useT } from '../../lib/i18n';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isWeb = Platform.OS === 'web';
const heroSurfaceShadow: ViewStyle = isWeb
  ? ({ boxShadow: '0 30px 60px rgba(15,23,42,0.25)' } as ViewStyle)
  : {
      shadowColor: '#0F172A',
      shadowOpacity: 0.18,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 14 },
      elevation: 10,
    };
const formCardShadow: ViewStyle = isWeb
  ? ({ boxShadow: '0 20px 48px rgba(15,23,42,0.25)' } as ViewStyle)
  : {
      shadowColor: '#0F172A',
      shadowOpacity: 0.25,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 14,
    };

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useThemeColors();
  const t = useT();
  const { signIn, resendConfirmationEmail } = useAuthStore.getState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [feedback, setFeedback] = useState<{
    type: 'info' | 'success' | 'error';
    message: string;
  } | null>(null);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Informe seu email';
    if (!EMAIL_REGEX.test(value.trim())) return 'Email invalido';
    return undefined;
  };

  const handlePasswordSignIn = async () => {
    const emailError = validateEmail(email);
    const passwordError = password ? undefined : 'Informe sua senha';

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      Alert.alert('Complete os campos', 'Corrija as informacoes antes de continuar.');
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error?.message?.includes('Email not confirmed')) {
        setShowResendButton(true);
        setFeedback({
          type: 'info',
          message: 'Enviamos um email de confirmacao quando voce criou a conta. Verifique sua caixa de entrada (e spam).',
        });
        Alert.alert('Email nao confirmado', 'Confirme o endereco de email antes de fazer login.');
      } else {
        Alert.alert('Nao foi possivel entrar', error?.message ?? 'Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleResendConfirmation = async () => {
    try {
      setLoading(true);
      await resendConfirmationEmail(email.trim());
      Alert.alert('Email reenviado', 'Confira sua caixa de entrada.');
      setFeedback({
        type: 'success',
        message: `Reenviamos a confirmacao para ${email.trim()}.`,
      });
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Nao foi possivel reenviar o email.');
      setFeedback({
        type: 'error',
        message: 'Nao conseguimos reenviar agora. Tente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={theme.gradient} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 48 }]}
          >
            <View style={styles.langRow}>
              <LanguageSwitcher />
            </View>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerTextBlock}>
                <Text style={styles.appName}>MeuApp</Text>
                <Text style={styles.headerSubtitle}>{t('auth_login_subtitle') ?? 'Bem-vindo de volta!'}</Text>
              </View>
            </View>

            <View style={styles.heroWrapper}>
              <View style={styles.heroCircle}>
                <Image
                  source={require('../../assets/images/hero-logo.png')}
                  resizeMode='contain'
                  style={styles.heroImage}
                />
              </View>
              <Text style={styles.heroTitle}>{t('auth_login_title') ?? 'Fazer login'}</Text>
              <Text style={styles.heroDescription}>
                {t('auth_login_subtitle') ?? 'Entre com seus dados.'}
              </Text>
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{t('auth_login_title') ?? 'Fazer login'}</Text>
                <Text style={styles.cardSubtitle}>{t('auth_login_subtitle') ?? 'Entre com seus dados.'}</Text>
              </View>

              <Input
                label={t('auth_login_email') ?? 'Email'}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="voce@email.com"
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                error={errors.email}
                style={styles.inputSpacing}
              />

              <Input
                label={t('auth_login_password') ?? 'Senha'}
                value={password}
                placeholder="********"
                secureTextEntry
                onChangeText={(value) => {
                  setPassword(value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                error={errors.password}
                style={styles.inputSpacing}
              />

              <Button
                title={t('auth_login_button') ?? 'Entrar com senha'}
                onPress={handlePasswordSignIn}
                loading={loading}
              />


              {showResendButton ? (
                <Button
                  title="Reenviar email de confirmacao"
                  onPress={handleResendConfirmation}
                  variant="ghost"
                  style={styles.secondaryButton}
                />
              ) : null}

              {feedback ? (
                <View
                  style={[
                    styles.feedbackCard,
                    feedback.type === 'success' && styles.feedbackSuccess,
                    feedback.type === 'error' && styles.feedbackError,
                    feedback.type === 'info' && styles.feedbackInfo,
                  ]}
                >
                  <Ionicons
                    name={
                      feedback.type === 'success'
                        ? 'mail-open-outline'
                        : feedback.type === 'error'
                        ? 'alert-circle-outline'
                        : 'information-circle-outline'
                    }
                    size={18}
                    color={
                      feedback.type === 'error'
                        ? '#B91C1C'
                        : feedback.type === 'success'
                        ? '#065F46'
                        : '#1E3A8A'
                    }
                  />
                  <Text
                    style={[
                      styles.feedbackText,
                      feedback.type === 'error' && { color: '#991B1B' },
                      feedback.type === 'success' && { color: '#065F46' },
                    ]}
                  >
                    {feedback.message}
                  </Text>
                </View>
              ) : null}

              <Text style={styles.notice}>
                Depois de criar uma conta, confirme o cadastro pelo link enviado ao seu email antes de tentar entrar.
              </Text>

              <View style={styles.linksRow}>
                <Link href="/auth/forgot-password" style={styles.linkText}>
                  {t('auth_login_forgot') ?? 'Esqueci minha senha'}
                </Link>
                <Text style={styles.dot}>|</Text>
                <Link href="/auth/signup" style={styles.linkText}>
                  {t('auth_login_create') ?? 'Criar conta'}
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#1E40AF',
  },
  gradient: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langRow: {
    alignItems: 'flex-end',
  },
  headerTextBlock: {
    flex: 1,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  heroWrapper: {
    alignItems: 'center',
    gap: 16,
  },
  heroCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...heroSurfaceShadow,
  },
  heroImage: {
    width: 82,
    height: 82,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    borderRadius: 30,
    padding: 24,
    gap: 20,
    backgroundColor: 'rgba(255,255,255,0.97)',
    ...formCardShadow,
  },
  cardHeader: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  inputSpacing: {
    marginBottom: 12,
  },
  secondaryButton: {
    marginTop: -4,
  },
  linksRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  dot: {
    color: '#D1D5DB',
  },
  notice: {
    marginTop: 8,
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 4,
    backgroundColor: 'rgba(59,130,246,0.14)',
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(16,185,129,0.15)',
  },
  feedbackError: {
    backgroundColor: 'rgba(248,113,113,0.2)',
  },
  feedbackInfo: {
    backgroundColor: 'rgba(59,130,246,0.14)',
  },
  feedbackText: {
    flex: 1,
    fontSize: 13,
    color: '#1E3A8A',
  },
});
