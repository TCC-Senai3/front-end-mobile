import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';

export default function WaitingOverlay() {
  // Animação de FadeIn (semelhante ao keyframes fadeIn do CSS)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300, // 0.3s como no CSS
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.waitingOverlay, { opacity: fadeAnim }]}>
      <Text style={styles.text}>
        Resposta registrada{'\n'}Aguarde...
      </Text>
      {/* Opcional: Adicionei um indicador visual para reforçar o "Aguarde" */}
      <ActivityIndicator size="large" color="#333" style={{ marginTop: 20 }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  waitingOverlay: {
    // position: absolute, top: 0, left: 0, width: 100%, height: 100%
    ...StyleSheet.absoluteFillObject, 
    
    zIndex: 10,
    
    // background: rgba(255, 255, 255, 0.7)
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Aumentei um pouco a opacidade para mobile
    
    // border-radius: 20px
    borderRadius: 20,
    
    // Centralização (Flexbox é padrão no RN)
    justifyContent: 'center',
    alignItems: 'center',
    
    // Nota: O "backdrop-filter: blur" nativo exige a biblioteca 'expo-blur'.
    // Sem ela, usamos apenas a cor semitransparente acima.
  },
  text: {
    // color: #333
    color: '#333',
    
    // font-size: 2.5rem (aprox 40px, ajustado para 32px para caber melhor em telas menores)
    fontSize: 32,
    
    // font-weight: 700
    fontWeight: 'bold',
    
    // text-align: center
    textAlign: 'center',
    
    // Espaçamento entre linhas para o \n
    lineHeight: 40,
  }
});