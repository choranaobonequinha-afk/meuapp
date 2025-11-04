import React, { useEffect } from 'react';
import { View } from 'react-native';

// Placeholder para a aba "Mais" (o botão abre um modal no _layout)
export default function MaisScreen() {
  // Intencionalmente vazio; mantemos a rota para evitar warnings de rota ausente.
  useEffect(() => {}, []);
  return <View style={{ flex: 1 }} />;
}

