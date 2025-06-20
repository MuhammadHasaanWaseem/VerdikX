import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'react-native';
import { AuthProvider } from './context/AuthProvider';
import { SignupProvider } from './context/SignupContext';

export default function RootLayout() {
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
      <StatusBar hidden={true}/>
      <Stack initialRouteName="index">
        <Stack.Screen name="(auth)" options={{ headerShown: false,animation:'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false,animation:'slide_from_left' }} />
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name="+not-found" />
        {/* <StatusBar hidden={true} /> */}
      </Stack></SignupProvider>
      </AuthProvider>
       
    //  </ThemeProvider>
  );
}
