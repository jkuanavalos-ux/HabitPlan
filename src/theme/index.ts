export const colors = {
  background: '#0B1026', surface: '#131A3A', surfaceAlt: '#1C2552', border: '#2A3470',
  primary: '#4F7CFF', primarySoft: '#7AA2FF', text: '#E8ECFF', textMuted: '#8A94C8',
  states: ['#E5484D', '#F76B15', '#F5A524', '#E5D04F', '#46C281', '#3AB5E5', '#8B7BFF'],
} as const;
export const navigationTheme = {
  dark: true,
  colors: { primary: colors.primary, background: colors.background, card: colors.surface, text: colors.text, border: colors.border, notification: colors.primarySoft },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '800' as const },
  },
};
