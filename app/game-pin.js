import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import CustomHeader from '../components/CustomHeader';
import { setPin } from '../store/pinStore';

const { height } = Dimensions.get('window');

export default function GamePinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');

  const handleEnter = () => {
    const length = pin.trim().length;
    if (length !== 6) {
      Alert.alert('PIN inválido', 'Você precisa informar exatamente 6 dígitos.');
      return;
    }
    setPin(pin.trim());
    router.push('/aguardando');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A84FF" />

        <CustomHeader title="" showMenu={true} menuPosition="right" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={require('../assets/images/ondas.svg')}
          style={styles.headerBackground}
          resizeMode="stretch">
          <View style={styles.headerContent}>
            <Text style={styles.logoTextSenai}>SENAI</Text>
            <Text style={styles.logoTextSkillUp}>SKILL UP</Text>
          </View>
        </ImageBackground>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <TextInput
              style={styles.pinInput}
              placeholder="PIN do jogo"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric"
              maxLength={6}
              value={pin}
              onChangeText={(t) => setPin(t.replace(/\D/g, ''))}
            />
            <TouchableOpacity style={styles.enterButton} onPress={handleEnter}>
              <Text style={styles.enterButtonText}>ENTRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Remover componentes e estilos de barra inferior e botões cinzas */}
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
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    paddingTop: 0,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  logoTextSenai: {
    fontFamily: 'Blinker-Bold',
    fontSize: 50,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  logoTextSkillUp: {
    fontFamily: 'Poppins-Medium',
    fontSize: 50,
    color: '#FFFFFF',
    marginTop: -15,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  backButton: {
    display: 'none',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40, // aumentar para descer o card
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
    fontSize: 16,
    marginBottom: 12,
  },
  enterButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#009DFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  // Remover estilos:
  // bottomNav, navButtonPlaceholder
});