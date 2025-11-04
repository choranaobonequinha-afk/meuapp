import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useThemeStore, themes } from '../store/themeStore';

export default function RootLayout() {
  const { user, loading, initialize } = useAuthStore();
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <LinearGradient colors={['#59B3FF', '#4AA8FF']} style={styles.gradient}>
        <Image
          source={require('../assets/images/splash-logo.png')}
          style={{ width: 150, height: 150, resizeMode: 'contain' }}
        />
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        {!user ? (
      <>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
      </>
    ) : (
      <>
        <Stack.Screen name="home" />
        <Stack.Screen name="(tabs)" />
      </>
    )}
  </Stack>
</>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
