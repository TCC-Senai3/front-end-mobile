// app/jogo.js (VERSÃO FINAL DE DEPURAÇÃO)

import React, { useState, useRef } from 'react';
import { ScrollView, SafeAreaView, View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import styles from '../styles/JogoStyles';
import CustomHeader from '../components/CustomHeader';
import JogoSection from '../components/JogoSection';
import RankingSection from '../components/RankingSection';
import QuestionarioSection from '../components/QuestionarioSection';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function JogoScreen() {
  const [activeTab, setActiveTab] = useState('ranking');
  const horizontalScrollRef = useRef(null);

  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Blinker-Regular': require('../assets/fonts/Blinker/Blinker-Regular.ttf'),
    'Blinker-ExtraBold': require('../assets/fonts/Blinker/Blinker-ExtraBold.ttf'),
    'Blinker-Bold': require('../assets/fonts/Blinker/Blinker-Bold.ttf'),
  });

  const handleTabPress = (tabName, index) => {
    console.log(`Clicou na aba: ${tabName}`);
    setActiveTab(tabName);
    horizontalScrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  return (
    <SafeAreaView style={localStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader 
        showMenu={true} 
        menuPosition="right" 
        closeButtonSide="left" 
      />

      {/* --- CORREÇÃO 1: TRAZENDO O SCROLL VERTICAL DE VOLTA --- */}
      <ScrollView>
        <JogoSection />

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ranking' && styles.activeTabButton]}
            onPress={() => handleTabPress('ranking', 0)}
          >
            <Text style={[styles.tabText, activeTab === 'ranking' && styles.activeTabText]}>
              Ranking
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'questionario' && styles.activeTabButton]}
            onPress={() => handleTabPress('questionario', 1)}
          >
            <Text style={[styles.tabText, activeTab === 'questionario' && styles.activeTabText]}>
              Questionário
            </Text>
          </TouchableOpacity>
        </View>

        {/* ScrollView Horizontal para os Frames */}
        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const slide = Math.round(event.nativeEvent.contentOffset.x / width);
            const newTab = slide === 0 ? 'ranking' : 'questionario';
            console.log(`Scroll terminou na página: ${slide}, mudando aba para: ${newTab}`);
            if (newTab !== activeTab) {
              setActiveTab(newTab);
            }
          }}
          // --- CORREÇÃO 2: APLICANDO ALTURA FIXA ---
          style={localStyles.horizontalScrollView}
        >
          <View style={localStyles.frameContainer}>
            <RankingSection />
          </View>
          <View style={localStyles.frameContainer}>
            <QuestionarioSection />
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // --- ESTILO CORRIGIDO PARA O SCROLL HORIZONTAL ---
 
 frameContainer: {
  width: width,
}
});