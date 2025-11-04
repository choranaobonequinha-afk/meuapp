import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'meuapp',
  slug: 'meuapp',
  scheme: 'meuapp',
  icon: './assets/images/icon.png',
  splash: {
    image: './assets/images/splash-logo.png',
    resizeMode: 'cover',
    backgroundColor: '#59B3FF',
  },
  ios: {
    bundleIdentifier: 'com.meuapp.app',
  },
  android: {
    package: 'com.meuapp.app',
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
    bundler: 'metro',
  },
  assetBundlePatterns: ['**/*'],
  plugins: ['expo-router'],
  extra: {
    router: {
      origin: false,
    },
    // Back-compat with existing code reading EXPO_PUBLIC_* keys
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    // Explicit keys used by src/lib/supabase.ts
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnon: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    redirectUri: 'meuapp://auth/callback',
  },
};

export default config;
