import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import CreateNoteScreen from './create-note';
import ListNotesScreen from '.';
import { Stack } from 'expo-router';

const App = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'Mis Notas',
        }}
      />
      <Stack.Screen
        name='create-note'
        options={{
          headerShown: true,
          title: 'Crear nueva nota'
        }}
      />
    </Stack>
  );
};
export default App;