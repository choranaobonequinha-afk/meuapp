import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Image, Platform, TextStyle } from 'react-native';
import { useThemeStore } from '../store/themeStore';

const isWeb = Platform.OS === 'web';

export default function RootLayout() {
  const { user, loading, initialize } = useAuthStore();
  const theme = useThemeStore((s) => s.theme);
  const unauthScreens = ['index', 'onboarding', 'auth'];

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <LinearGradient colors={['#59B3FF', '#4AA8FF']} style={styles.gradient}>
        <Image
          source={require('../assets/images/splash-logo.png')}
          resizeMode='contain'
          style={{ width: 150, height: 150 }}
        />
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        {(user ? ['(tabs)'] : unauthScreens).map((name) => (
          <Stack.Screen name={name} key={name} />
        ))}
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
    ...(isWeb
      ? ({ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' } as TextStyle)
      : {
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
        }),
  },
});
