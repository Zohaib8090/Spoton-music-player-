
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import CustomSplashScreen from '@/components/SplashScreen';
import { StreamingServiceProvider } from '@/context/StreamingServiceContext';
import { PlaybackSettingsProvider } from '@/context/PlaybackSettingsContext';
import PlaybackLogic from '@/components/PlaybackLogic';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { useNetInfo } from '@react-native-community/netinfo';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, initializing } = useAuth();
  const { isInternetReachable } = useNetInfo();

  useEffect(() => {
    if (!initializing && isInternetReachable !== null) {
      SplashScreen.hideAsync();
    }
  }, [initializing, isInternetReachable]);

  if (initializing || isInternetReachable === null) {
    return <CustomSplashScreen />;
  }

  if (isInternetReachable === false) {
    return (
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
    );
  }

  if (!user) {
    return <Redirect href="/features/auth/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <StreamingServiceProvider>
        <PlaybackSettingsProvider>
          <NotificationsProvider>
            <PlaybackLogic />
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <RootLayoutNav />
              <StatusBar style="auto" />
            </ThemeProvider>
          </NotificationsProvider>
        </PlaybackSettingsProvider>
      </StreamingServiceProvider>
    </AuthProvider>
  );
}
