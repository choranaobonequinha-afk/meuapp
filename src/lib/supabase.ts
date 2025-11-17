import 'expo-standard-web-crypto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

type ExtraConfig = {
  supabaseUrl?: string;
  supabaseAnon?: string;
};

const extra = (Constants.expoConfig?.extra ??
  // @ts-expect-error manifestExtra exists at runtime for legacy compat
  Constants.manifestExtra ??
  {}) as ExtraConfig;

const normalizeEnvValue = (value?: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return undefined;
};

const envSupabaseUrl = normalizeEnvValue(
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) ??
    (typeof globalThis !== 'undefined' ? (globalThis as any).EXPO_PUBLIC_SUPABASE_URL : undefined)
);
const envSupabaseAnon = normalizeEnvValue(
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY) ??
    (typeof globalThis !== 'undefined' ? (globalThis as any).EXPO_PUBLIC_SUPABASE_ANON_KEY : undefined)
);

const supabaseUrl = extra.supabaseUrl ?? envSupabaseUrl;
const supabaseAnon = extra.supabaseAnon ?? envSupabaseAnon;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error('Supabase credentials are missing. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
