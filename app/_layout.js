import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Blinker-Bold': require('../assets/fonts/Blinker-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Início',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="contato"
        options={{
          title: 'Contato',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="suporte"
        options={{
          title: 'Suporte',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="termos"
        options={{
          title: 'Termos',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="game-pin"
        options={{
          title: 'Game PIN',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verified"
        options={{
          title: 'Verificado',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="error"
        options={{
          title: 'Erro',
          headerShown: false,
        }}
      />
      {/* Adicione outras telas do SkillUpMobile aqui, se necessário */}
    </Stack>
  );
}