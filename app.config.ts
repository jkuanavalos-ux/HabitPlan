import type { ExpoConfig } from 'expo/config';
import { APP_NAME } from './src/data/app.json';

const config: ExpoConfig = {
  name: APP_NAME,
  slug: 'habitplan',
  version: '0.1.0',
  scheme: 'habitplan',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  backgroundColor: '#0B1026',
  android: { package: 'com.habitplan.app', allowBackup: true },
  ios: { bundleIdentifier: 'com.habitplan.app', supportsTablet: true },
  plugins: ['expo-router', 'expo-sqlite', 'expo-dev-client'],
};
export default config;
