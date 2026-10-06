import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../src/theme';
import { APP_NAME } from '../../src/constants';
export default function TabsLayout() {
  return <Tabs screenOptions={{ tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border }, tabBarActiveTintColor: colors.primarySoft, tabBarInactiveTintColor: colors.textMuted, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
    <Tabs.Screen name="index" options={{ title: APP_NAME, tabBarLabel: 'Inicio', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>⌂</Text> }} />
    <Tabs.Screen name="menu" options={{ title: 'Menú', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>☰</Text> }} />
  </Tabs>;
}
