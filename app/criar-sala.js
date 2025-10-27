import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

const { width, height } = Dimensions.get('window');

export default function CriarSalaScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');

  const handleCriar = () => {
    if (titulo.trim()) {
      // Aqui você pode adicionar a lógica para criar a sala
      console.log('Criando sala com título:', titulo);
      // Navegar para próxima tela ou voltar
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader showMenu={true} menuPosition="right" />
      <View style={styles.container}>
        {/* Título */}
        <Text style={styles.title}>CRIAR SALA</Text>

        {/* Card Central */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Titulo do questionario"
              placeholderTextColor="#6B6B6B"
              value={titulo}
              onChangeText={setTitulo}
              maxLength={50}
            />
            
            <TouchableOpacity 
              style={[styles.button, !titulo.trim() && styles.buttonDisabled]} 
              onPress={handleCriar}
              disabled={!titulo.trim()}
            >
              <Text style={styles.buttonText}>CRIAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY_BLUE = '#00A9FF';
const SUCCESS_GREEN = '#00ED4B';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#2F2E2E';
const TEXT_MUTED = '#6B6B6B';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_BLUE,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 40,
    marginBottom: 12,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: TEXT_DARK,
    backgroundColor: '#FFFFFF',
    marginBottom: 28,
    minHeight: 60,
    textAlign: 'left',
  },
  button: {
    backgroundColor: SUCCESS_GREEN,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
