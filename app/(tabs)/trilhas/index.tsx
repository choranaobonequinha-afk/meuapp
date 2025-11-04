import React from 'react';
import { Redirect } from 'expo-router';

// Esta rota foi descontinuada. Redireciona para Quiz & Simulados.
export default function TrilhasHome() {
  return <Redirect href="/(tabs)/quiz" />;
}
