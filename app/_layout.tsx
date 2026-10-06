import { useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDatabase } from '../src/db/client';
import { useAppStore } from '../src/store/useAppStore';
import { colors, navigationTheme } from '../src/theme';
import { Body, Card } from '../src/components/Screen';

export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  const { ready, error, setReady, setError } = useAppStore();
  function initialize() {
    try { getDatabase(); setReady(); }
    catch (cause) { console.error('No se pudo inicializar SQLite', cause); setError('No pudimos abrir tus datos locales. Volvé a intentar.'); }
  }
  useEffect(() => { initialize(); }, []);
  return <SafeAreaProvider><ThemeProvider value={navigationTheme}><StatusBar style="light" />
    {ready ? <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ title: 'Bienvenida' }} />
      <Stack.Screen name="habits" options={{ title: 'Hábitos' }} />
      <Stack.Screen name="goals/index" options={{ title: 'Objetivos' }} />
      <Stack.Screen name="goals/[id]" options={{ title: 'Objetivo' }} />
      <Stack.Screen name="schedule" options={{ title: 'Horario' }} />
      <Stack.Screen name="sales" options={{ title: 'Ventas' }} />
      <Stack.Screen name="stats" options={{ title: 'Estadísticas' }} />
      <Stack.Screen name="journal" options={{ title: 'Diario' }} />
      <Stack.Screen name="quotes" options={{ title: 'Frases motivadoras' }} />
      <Stack.Screen name="settings" options={{ title: 'Configuración' }} />
    </Stack> : <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background }}>
      {error ? <Card><Body>{error}</Body><Pressable accessibilityRole="button" onPress={initialize}><Body>Reintentar</Body></Pressable></Card> : <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Preparando datos locales" />}
    </View>}
  </ThemeProvider></SafeAreaProvider>;
}
