import { create } from 'zustand';
import { createJSONStorage, persist } from '../lib/zustand-middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppLanguage = 'pt' | 'en';

type LocaleState = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggle: () => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      language: 'pt',
      setLanguage: (language: AppLanguage) => set({ language }),
      toggle: () => set({ language: get().language === 'pt' ? 'en' : 'pt' }),
    }),
    {
      name: 'app-locale',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
