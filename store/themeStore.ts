import { create } from 'zustand';
import { createJSONStorage, persist } from '../lib/zustand-middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeName = 'light' | 'dark';

type ThemeState = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (t: ThemeName) => set({ theme: t }),
      toggle: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: 'app-theme-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const themes = {
  light: {
    background: '#FFFFFF',
    text: '#111827',
    textMuted: '#374151',
    gradient: ['#42A5F5', '#2196F3'] as [string, string],
  },
  dark: {
    background: '#0F172A',
    text: '#F9FAFB',
    textMuted: '#D1D5DB',
    // Slightly brighter dark blues to evitar "tela preta"
    gradient: ['#1E3A8A', '#0F3068'] as [string, string],
  },
};

export function useThemeColors() {
  const theme = useThemeStore((s) => s.theme);
  return themes[theme];
}
