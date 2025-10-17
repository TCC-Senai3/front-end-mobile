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
import { OndasIcon } from '../components/icons/icon';
import BackgroundIcon from '../components/icons/BackgroundIcon';

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
    setPin(pin.trim()); // Atualiza o estado local
    // Salva o PIN globalmente
    require('../store/pinStore').setPin(pin.trim());
    router.push('/aguardando');
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
          <BackgroundIcon width={Dimensions.get('window').width} height={416} />
          <View style={styles.headerContent}>
            <Text style={styles.logoTextSenai}>SENAI</Text>
            <Text style={styles.logoTextSkillUp}>SKILL UP</Text>
          </View>
        </View>

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
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  scrollView: {
    flex: 1,
    borderWidth: 0,
    borderBottomWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  scrollContentContainer: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 100,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  headerBackground: {
    width: '100%',
    height: 416,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50,
    paddingTop: 42,
    borderWidth: 0,
    borderBottomWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    position: 'relative',
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
    fontFamily: 'Blinker-Black',
    fontWeight: '900',
    fontSize: 50,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  logoTextSkillUp: {
    fontFamily: 'Poppins-Medium',
    fontSize: 50,
    color: '#FFFFFF',
    marginTop: -15,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
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
});