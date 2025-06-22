import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './context/AuthProvider';
import { SignupProvider } from './context/SignupContext';

export default function RootLayout() {
   useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        //  User is already logged in, go to main app
        router.replace('/(tabs)');
      }
    };

    checkSession();
  }, []);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
    //  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <AuthProvider>
      <SignupProvider>
        <StatusBar hidden={true} />
        <Stack initialRouteName='index' >
          <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_left' }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="(communication)" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="apply" options={{ headerShown: false, animation: 'slide_from_left' }} />
          <Stack.Screen name="SeperateUser" options={{ headerShown: false, animation: 'slide_from_left' }} />
          <Stack.Screen name="Editprofile" options={{ headerShown: false, animation: 'slide_from_left' }} />
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='Avatar' options={{ headerShown: false,animation:'slide_from_right' }} />
          <Stack.Screen name="+not-found" />
          {/* <StatusBar hidden={true} /> */}
        </Stack></SignupProvider>
    </AuthProvider>

    //  </ThemeProvider>
  );
}
