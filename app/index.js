import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import HomeScreen from './home'; // seu arquivo HomeScreen

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await SplashScreen.preventAutoHideAsync();

        await Font.loadAsync({
          'Blinker-Bold': require('../assets/fonts/Blinker/Blinker-Bold.ttf'),
          'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
          'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
          'Poppins-SemiBold': require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
        });

        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar translucent={false} backgroundColor="#00A9FF" barStyle="light-content" />
        <ActivityIndicator size="large" color="#f50606" />
      </View>
    );
  }

  // Renderiza a HomeScreen diretamente como primeira tela
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#00A9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
