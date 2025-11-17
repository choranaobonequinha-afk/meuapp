import React from 'react';
import { View, StyleSheet, ViewStyle, Image } from 'react-native';

type LogoProps = {
  size?: number;
  style?: ViewStyle;
  showOutline?: boolean;
  variant?: 'light' | 'dark';
};

// Simplified brand logo component that uses the official image
export function Logo({ size = 80, style }: LogoProps) {
  return (
    <View style={[styles.root, style]}>
      <Image
        source={require('../../assets/images/hero-logo.png')}
        resizeMode='contain'
        style={{ width: size, height: size }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
