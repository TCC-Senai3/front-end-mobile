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
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getPin, clearPin } from '../store/pinStore';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Mock de usuários para exibição na tela
const MOCK_PLAYERS = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: 'Usuário',
}));

export default function Sala() {
  const router = useRouter();
  const code = getPin();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const navigateAndClose = (path) => { setMenuVisible(false); router.push(path); };
  const handleLogoutPress = () => { setMenuVisible(false); setLogoutModalVisible(true); };
  const handleConfirmLogout = () => { setLogoutModalVisible(false); router.replace('/'); };

  const menuItems = [
    { name: 'Início', path: '/' }, { name: 'Termos', path: '/termos' }, { name: 'Contato', path: '/contato' },
    { name: 'Minha Conta', path: '/minha-conta' }, { name: 'Usuario', path: '/usuario' }, { name: 'Sair' },
  ];
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1CB0FC" />
      {/* Header original restaurado */}
      <View style={styles.header}>
        <Text style={styles.code}>CODE: {code}</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal do Menu Lateral */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay]}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menuCard}>
            <SafeAreaView style={{ flex: 1 }}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setMenuVisible(false)}>
                <Feather name="x" size={30} color="black" />
              </TouchableOpacity>
              <View style={styles.menuPerfil}>
                <View style={styles.menuframe}>
                  <Image source={require('../assets/images/perfil.svg')} style={styles.profileImage} />
                  <Text style={styles.menuUserName}>Usuário</Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Image source={require('../assets/images/medalha.svg')} style={styles.medalImage} />
                  <Text style={styles.pontuacao}>0</Text>
                </View>
              </View>
              <View style={styles.menuItemsContainer}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => item.name === 'Sair' ? handleLogoutPress() : navigateAndClose(item.path)}
                  >
                    <Text style={styles.menuItemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </SafeAreaView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Confirmação de Saída */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.logoutModalOverlay}>
          <View style={styles.logoutModalCard}>
            <TouchableOpacity 
              style={styles.logoutCloseButton}
              onPress={() => setLogoutModalVisible(false)}
            >
              <Feather name="x" size={24} color="#888" />
            </TouchableOpacity>
            <Text style={styles.logoutModalText}>Deseja mesmo sair da conta?</Text>
            <View style={styles.logoutModalButtons}>
              <TouchableOpacity 
                style={[styles.confirmButton]}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.confirmButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1CB0FC',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 30,
    height: 30,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 4,
    backgroundColor: '#FFF',
    borderRadius: 2,
    marginVertical: 2,
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  menuCard: {
    backgroundColor: '#00ABFF',
    width: width * 0.6,
    height: '100%',
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: height * 0.02,
    right: width * 0.05,
    zIndex: 1,
  },
  menuPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    marginTop: height * 0.06,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuframe: {
    flex: 1,
    height: height * 0.07,
    borderRadius: 100,
    backgroundColor: '#0090FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
    marginRight: width * 0.04,
  },
  profileImage: {
    width: height * 0.055,
    height: height * 0.055,
    borderRadius: (height * 0.055) / 2,
    marginRight: width * 0.02,
  },
  menuUserName: {
    fontSize: width * 0.04,
    color: '#fff',
    flex: 1,
    fontFamily: 'Blinker-Bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medalImage: {
    width: width * 0.07,
    height: width * 0.07,
    marginRight: width * 0.03,
  },
  pontuacao: {
    fontSize: width * 0.045,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
  menuItemsContainer: {
    paddingHorizontal: width * 0.05,
  },
  menuItem: {
    paddingVertical: height * 0.025, 
  },
  menuItemText: {
    fontSize: width * 0.045,
    color: '#FFFFFF',
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
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModalCard: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  logoutCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4e4747',
    borderRadius: 15,
  },
  logoutModalText: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  logoutModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%',
  },
  confirmButton: {
    backgroundColor: '#D32F2F',
    position: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.04,
  },
});
