import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getPin, clearPin } from '../store/pinStore';
import CustomHeader from '../components/CustomHeader';
import { PerfilIcon } from '../components/icons/icon';

const { width, height } = Dimensions.get('window');

// Mock de usuários para exibição na tela
const MOCK_PLAYERS = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: 'Usuário',
}));

export default function Sala() {
  const router = useRouter();
  const code = getPin();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1CB0FC" />
      <CustomHeader showMenu={true} menuPosition="right" closeButtonSide="left" />
      <View style={styles.content}>
        {/* Código da sala */}
        <View style={styles.codeContainer}>
          <Text style={styles.code}>
            <Text style={{ fontFamily: 'Blinker-Bold', color: '#FFF', fontSize: 36, letterSpacing: 2 }}>CODE:</Text>
            {' '}
            <Text style={styles.codeValue}>{code}</Text>
          </Text>
        </View>
        {/* Card de Ações */}
        <View style={styles.actionCard}>
          <TouchableOpacity
            style={styles.desmancharBtn}
            onPress={() => {
              clearPin();
              router.replace('/game-pin');
            }}
          >
            <Text style={styles.desmancharText}>DESMANCHAR</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <TouchableOpacity style={styles.iniciarBtn}>
              <Text style={styles.iniciarText}>INICIAR</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Lista de Usuários */}
        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={styles.playersGrid} showsVerticalScrollIndicator={false}>
          {MOCK_PLAYERS.map((player) => (
            <View style={styles.playerCard} key={player.id}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <PerfilIcon style={styles.avatar} width={40} height={48} />
                </View>
              </View>
              <Text style={styles.playerName}>{player.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1CB0FC',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeContainer: {
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 0,
  },
  code: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'Blinker-Bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  codeLabel: {
    color: '#FFF',
    fontFamily: 'Blinker-Bold',
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 1,
  },
  codeValue: {
    color: '#FFF',
    fontFamily: 'Blinker-Bold',
    fontSize: 36,
    letterSpacing: 2,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginTop: 24,
    padding: 20,
    justifyContent: 'space-between',
    width: 330,
    alignSelf: 'center',
    // Sombra destacada
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  desmancharBtn: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    width: 130,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    elevation: 5,
  },
  desmancharText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: 'Blinker-Bold',
  },
  iniciarBtn: {
    backgroundColor: '#FF9D00',
    borderRadius: 10,
    width: 130,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 5,
  },
  iniciarText: {
    color: '#FFF',
    fontWeight: 'Blinker-Bold',
    fontSize: 25,
    letterSpacing: 1,
    fontFamily: 'Blinker-Bold',
    textShadowColor: '#FF9D00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 90,
    gap: 7,
  },
  playerCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    width: 149,
    height: 78,
    marginBottom: 40,
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 12,
    shadowColor: '#000',
    paddingTop: 34,
  },
  avatarWrapper: {
    position: 'absolute',
    top: -22,
    zIndex: 2,
  },

  playerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#3B3939',
    marginTop: 10,
    marginBottom: 0,
  },
});
