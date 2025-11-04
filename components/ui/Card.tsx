import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export const Card: React.FC<{style?: ViewStyle; children?: React.ReactNode}> = ({ style, children }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  }
});
