// app/jogo.js

import React, { useState, useRef } from 'react';
import { ScrollView, SafeAreaView, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import styles from '../styles/JogoStyles';
import CustomHeader from '../components/CustomHeader';
import JogoSection from '../components/JogoSection';
import RankingSection from '../components/RankingSection';
import QuestionarioSection from '../components/QuestionarioSection'; // Importa o novo componente
import { useFonts } from 'expo-font';


const { width } = Dimensions.get('window');

export default function JogoScreen() {
  const [activeTab, setActiveTab] = useState('ranking'); // 'ranking' ou 'questionario'
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
    setActiveTab(tabName);
    horizontalScrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
<CustomHeader 
        showMenu={true} 
        menuPosition="right" 
        closeButtonSide="left" 
      />
      <ScrollView>
        <JogoSection />

        {/* Abas de Navegação */}
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
          onScroll={(event) => {
            const slide = Math.round(event.nativeEvent.contentOffset.x / width);
            if (slide === 0 && activeTab !== 'ranking') {
              setActiveTab('ranking');
            } else if (slide === 1 && activeTab !== 'questionario') {
              setActiveTab('questionario');
            }
          }}
          style={styles.horizontalScrollContainer}
        >
          <View style={styles.frameContainer}>
            <RankingSection />
          </View>
          <View style={styles.frameContainer}>
            <QuestionarioSection />
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}