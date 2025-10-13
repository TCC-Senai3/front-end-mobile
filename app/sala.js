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
} from 'react-native';
import { useRouter } from 'expo-router';
import { getPin, clearPin } from '../store/pinStore';
import CustomHeader from '../components/CustomHeader';

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
          <Text style={styles.code}>CODE: {code}</Text>
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
        <View style={{ width: 330, marginTop: 40 }}>
          {[0, 1, 2].map((rowIdx) => (
            <View key={rowIdx} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
              {MOCK_PLAYERS.slice(rowIdx * 2, rowIdx * 2 + 2).map((player) => (
                <View style={styles.playerCard} key={player.id}>
                  <View style={styles.avatarWrapper}>
                    <Image source={require('../assets/images/perfil.svg')} style={styles.avatar} />
                  </View>
                  <Text style={styles.playerName}>{player.name}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1CB0FC',
    // alignItems: 'center',  // Removido para header não ser centralizado
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  code: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'Blinker-Bold',
    textAlign: 'center',
    flex: 1,
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
    fontWeight: 'bold',
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
    alignItems: 'center',
    width: 330,
    marginTop: 40,
  },
  playerCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: 156,
    height: 70,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    elevation: 8,
    // sombra do card (similar ao SVG)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarWrapper: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 0,
    // sombra do avatar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  playerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#3B3939',
    marginTop: 10,
    marginBottom: 0,
  },
});
