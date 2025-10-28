import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

const { width, height } = Dimensions.get('window');

export default function PartidaScreen() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90); // 1:30 em segundos

  const question = {
    category: 'FRONT END',
    question: 'COMO O CSS É UTILIZADO PARA ESTILIZAR UMA PÁGINA WEB E QUAIS SÃO SUAS PRINCIPAIS PROPRIEDADES',
    options: [
      'ELE É USADO PARA CRIAR SCRIPTS E FUNÇÕES.',
      'ELE DEFINE A ESTRUTURA DA PÁGINA E SUAS INTERAÇÕES.',
      'ELE ALTERA A APARÊNCIA VISUAL DE UMA PÁGINA, COMO CORES, FONTES E LAYOUTS.',
      'ELE É RESPONSÁVEL PELA CRIAÇÃO DE BANCOS DE DADOS E SERVIDORES.'
    ],
    correctAnswer: 2 // Índice da resposta correta
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader showMenu={true} menuPosition="right" />
      
      {/* Header Controls */}
      <View style={styles.headerControls}>
        <TouchableOpacity style={styles.timerButton}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.categoryTitle}>{question.category}</Text>
          
          <Text style={styles.questionText}>{question.question}</Text>
          
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.optionButtonSelected
                ]}
                onPress={() => handleAnswerSelect(index)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY_BLUE = '#1CB0FC';
const DARK_BLUE = '#01324B';
const RED = '#FF0000';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#3B3939';
const OPTION_BLUE = '#00B7FF';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_BLUE,
  },
  headerControls: {
    position: 'absolute',
    top: height * 0.12,
    right: 20,
    zIndex: 10,
    alignItems: 'flex-end',
  },
  timerButton: {
    backgroundColor: DARK_BLUE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  exitButton: {
    backgroundColor: RED,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  exitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: TEXT_DARK,
    lineHeight: 24,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: OPTION_BLUE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionButtonSelected: {
    backgroundColor: '#1D4ED8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
});
