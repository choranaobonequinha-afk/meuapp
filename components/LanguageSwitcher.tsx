import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLocaleStore } from '../store/localeStore';

type Props = {
  variant?: 'pill' | 'inline';
};

export function LanguageSwitcher({ variant = 'pill' }: Props) {
  const { language, setLanguage } = useLocaleStore();

  const options: { id: 'pt' | 'en'; label: string }[] = [
    { id: 'pt', label: 'PT' },
    { id: 'en', label: 'EN' },
  ];

  return (
    <View style={[styles.container, variant === 'inline' && styles.inline]}>
      {options.map((opt) => {
        const active = language === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            style={[styles.btn, active && styles.btnActive, variant === 'inline' && styles.btnInline]}
            onPress={() => setLanguage(opt.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.text, active && styles.textActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  inline: {
    alignSelf: 'flex-start',
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  btnInline: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  text: {
    fontWeight: '700',
    color: '#0F172A',
  },
  textActive: {
    color: '#FFFFFF',
  },
});
