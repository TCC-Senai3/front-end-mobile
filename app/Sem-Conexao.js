// app/sem-conexao.js

import React, { useCallback } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import styles from '../styles/SemConexaoStyles';
import CustomHeader from '../components/CustomHeader';
import NoConnectionIcon from '../components/icons/NoConnectionIcon';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function SemConexaoScreen() {

    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            
            <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
                {/* --- ATUALIZAÇÃO AQUI --- */}
                <CustomHeader 
                    showMenu={true} 
                    headerStyle='floating' // Define o modo flutuante
                    menuPosition='right'   // Posição à direita
                />

                <View style={styles.contentContainer}>
                    <View style={styles.iconContainer}>
                        <NoConnectionIcon />
                    </View>
                    <Text style={styles.messageText}>Conexão cortada</Text>
                </View>
            </SafeAreaView>
        </>
    );
}