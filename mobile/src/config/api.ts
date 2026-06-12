import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getDevServerHost(): string | undefined {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    (Constants as { manifest?: { debuggerHost?: string } }).manifest?.debuggerHost;

  if (!hostUri) return undefined;

  return hostUri.split(':')[0];
}

function getBaseUrl(): string {
  // No Expo Go, usa o mesmo IP do Metro (evita .env desatualizado)
  if (__DEV__) {
    const devHost = getDevServerHost();
    if (devHost) return `http://${devHost}:3000`;
  }

  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
}

export const API_BASE_URL = getBaseUrl();
