import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      set({ user: session?.user ?? null, loading: false });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null });
      });
    } catch (e: any) {
      set({ error: e.message ?? 'Init error', loading: false });
    }
  },

  signIn: async (email, password) => {
    console.log('🔐 AuthStore: Iniciando signIn...');
    set({ error: null, loading: true });
    try {
      // Debug temporário
      console.log('🔍 Tentando fazer login com:', { email, password });
      console.log('🔍 Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
      console.log('🔍 Supabase Key existe:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
      
      console.log('🔄 Chamando supabase.auth.signInWithPassword...');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('❌ Erro do Supabase:', error);
        throw error;
      }
      
      console.log('✅ Login bem-sucedido, obtendo usuário...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Usuário obtido:', user?.email);
      set({ user: user ?? null, loading: false });
    } catch (e: any) {
      console.error('❌ Erro no login:', e);
      set({ error: e.message ?? 'Login error', loading: false });
      throw e;
    }
  },

  signUp: async (email, password, name) => {
    set({ error: null, loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) throw error;
      set({ user: data.user ?? null, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Sign up error', loading: false });
      throw e;
    }
  },

  signOut: async () => {
    set({ error: null, loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Sign out error', loading: false });
      throw e;
    }
  },

  resendConfirmationEmail: async (email) => {
    set({ error: null, loading: true });
    try {
      const { error } = await supabase.auth.resendConfirmation({ email });
      if (error) throw error;
      set({ user: null, loading: false }); // Assuming resending confirmation means signing out for now
    } catch (e: any) {
      set({ error: e.message ?? 'Resend confirmation error', loading: false });
      throw e;
    }
  }
}));
