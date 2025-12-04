import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator, // <--- Importado
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import CustomHeader from '../components/CustomHeader';
import BackgroundIcon from '../components/icons/BackgroundIcon';

// --- SERVIÇOS ---
import salaService from '../services/salaService';
import usuarioService from '../services/usuarioService';

const { width, height } = Dimensions.get('window');

export default function GamePinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleEnter = async () => {
    const cleanPin = pin.trim();

    if (cleanPin.length < 1) {
      Alert.alert('Atenção', 'Por favor, digite o código da sala.');
      return;
    }

    setLoading(true);

    try {
      // 1. Pega ID do usuário logado
      const perfil = await usuarioService.getMeuPerfil();
      
      if (!perfil || !perfil.id) {
        Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
        return;
      }

      console.log(`Tentando entrar na sala ${cleanPin} com user ${perfil.id}...`);
      
      // 2. Chama a API para entrar na sala
      await salaService.entrarNaSala(cleanPin, perfil.id);

      // 3. Sucesso! Navega para a sala passando o código
      router.push({
        pathname: '/sala',
        params: { 
          codigoSala: cleanPin,
          nomeSala: 'Sala de Jogo' // O componente sala.js vai atualizar o nome correto via API
        }
      });

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Sala não encontrada ou código inválido.";
      Alert.alert('Erro ao entrar', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <CustomHeader title="" showMenu={true} menuPosition="right" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerBackground}>
            <BackgroundIcon width={Dimensions.get('window').width} height={417} />
            <View style={styles.headerContent}>
              <Text style={styles.logoTextSenai}>SENAI</Text>
              <Text style={styles.logoTextSkillUp}>SKILL UP</Text>
            </View>
            <View style={styles.lineCover} />
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <TextInput
                style={styles.pinInput}
                placeholder="PIN do jogo"
                placeholderTextColor="#A0A0A0"
                keyboardType="default" // Mudado para default caso o PIN tenha letras
                autoCapitalize="characters"
                maxLength={8} // Ajuste conforme o tamanho real do seu PIN
                value={pin}
                onChangeText={setPin}
              />
              
              <TouchableOpacity 
                style={[styles.enterButton, (!pin.trim() || loading) && styles.buttonDisabled]} 
                onPress={handleEnter}
                disabled={!pin.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.enterButtonText}>ENTRAR</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 100,
  },
  headerBackground: {
    width: '100%',
    height: 416,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50,
    paddingTop: 42,
    position: 'relative',
    marginBottom: 40,
  },
  headerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  logoTextSenai: {
    fontFamily: 'Blinker-Black', // Certifique-se que a fonte está carregada
    fontWeight: '900',
    fontSize: 50,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  logoTextSkillUp: {
    fontFamily: 'Poppins-Medium', // Certifique-se que a fonte está carregada
    fontSize: 50,
    color: '#FFFFFF',
    marginTop: -15,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  card: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  pinInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  enterButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#009DFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0CFFF', // Cor mais clara quando desabilitado
  },
  enterButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  lineCover: {
    position: 'absolute',
    bottom: -22,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
});