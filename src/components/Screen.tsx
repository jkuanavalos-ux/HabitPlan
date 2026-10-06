import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
export function Screen({ title, children }: { title: string; children: ReactNode }) {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}><Text accessibilityRole="header" style={styles.title}>{title}</Text>{children}</ScrollView>;
}
export function Card({ children }: { children: ReactNode }) { return <View style={styles.card}>{children}</View>; }
export function Body({ children, muted = false }: { children: ReactNode; muted?: boolean }) { return <Text style={[styles.body, muted && { color: colors.textMuted }]}>{children}</Text>; }
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', marginBottom: 4 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 18, gap: 10 },
  body: { color: colors.text, fontSize: 16, lineHeight: 24 },
  link: { color: colors.primarySoft, fontSize: 17, paddingVertical: 12 },
});
