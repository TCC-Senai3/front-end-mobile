import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getPin } from '../store/pinStore';
import GameboyIcon from '../components/icons/GameboyIcon';

const { width, height } = Dimensions.get('window');

export default function Aguardando() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const code = getPin();

  const navigateAndClose = (path) => { setMenuVisible(false); router.push(path); };
  const handleLogoutPress = () => { setMenuVisible(false); setLogoutModalVisible(true); };
  const handleConfirmLogout = () => { setLogoutModalVisible(false); router.replace('/'); };
  const menuItems = [
    { name: 'Início', path: '/' }, { name: 'Termos', path: '/termos' }, { name: 'Contato', path: '/contato' },
    { name: 'Minha Conta', path: '/perfil' }, { name: 'Sair' },
  ];
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/sala');
    }, 4000);
    return () => clearTimeout(t);
  }, [router]);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        {/* Header igual ao da tela sala */}
        <View style={styles.header}>
          <View style={{ flex: 1 }} />
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

        <GameboyIcon style={styles.illustration} />

        <Text style={styles.title}>Aguardando o host da Sala</Text>

        <View style={styles.card}>
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#1CB0FC" />
            <Text style={styles.inputText}>Carregando...</Text>
          </View>

          <View style={styles.exitButtonWrapper}>
            <View style={styles.exitButtonShadow} />
            <TouchableOpacity style={styles.exitButton} onPress={() => router.replace('/game-pin')}>
              <Text style={styles.exitText}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.homeIndicator} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1CB0FC',
    alignItems: 'center',
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
  menuButton: { padding: 8 },
  menuIcon: { width: 30, height: 30, justifyContent: 'space-between' },
  menuLine: { height: 4, backgroundColor: '#FFF', borderRadius: 2, marginVertical: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', flexDirection: 'row', justifyContent: 'flex-start' },
  menuCard: { backgroundColor: '#00ABFF', width: width * 0.6, height: '100%', elevation: 10 },
  closeButton: { position: 'absolute', top: height * 0.02, right: width * 0.05, zIndex: 1 },
  menuPerfil: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: width * 0.05, paddingVertical: height * 0.02, marginTop: height * 0.06, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.2)' },
  menuframe: { flex: 1, height: height * 0.07, borderRadius: 100, backgroundColor: '#0090FF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: width * 0.02, marginRight: width * 0.04 },
  profileImage: { width: height * 0.055, height: height * 0.055, borderRadius: (height * 0.055) / 2, marginRight: width * 0.02 },
  menuUserName: { fontSize: width * 0.04, color: '#fff', flex: 1, fontFamily: 'Blinker-Bold' },
  scoreContainer: { flexDirection: 'row', alignItems: 'center' },
  medalImage: { width: width * 0.07, height: width * 0.07, marginRight: width * 0.03 },
  pontuacao: { fontSize: width * 0.045, color: '#000000', fontFamily: 'Poppins-Regular' },
  menuItemsContainer: { paddingHorizontal: width * 0.05 },
  menuItem: { paddingVertical: height * 0.025 },
  menuItemText: { fontSize: width * 0.045, color: '#FFFFFF' },
  illustration: {
    width: 320,
    height: 320,
    marginTop: 20,
  },
  title: {
    marginTop: 8,
    color: '#FFFFFF',
    fontFamily: 'Blinker-Bold',
    fontSize: 28,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  card: {
    width: '80%',
    maxWidth: 350,
    backgroundColor: '#DDDDDD',
    borderRadius: 16,
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputPlaceholder: {
    width: 270,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B0B0AF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  inputText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.31)',
  },
  exitButtonWrapper: {
    position: 'relative',
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  exitButtonShadow: {
    position: 'absolute',
    width: 270,
    height: 42,
    left: 0,
    top: 0,
    backgroundColor: '#FF0000',
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  exitButton: {
    width: 270,
    height: 42,
    backgroundColor: '#FF0000',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: {
    fontFamily: 'Blinker',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    letterSpacing: 0.02,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 10,
    width: 150,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 100,
  },
  logoutModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  logoutModalCard: { width: '80%', maxWidth: 320, backgroundColor: '#FFF', borderRadius: 10, padding: 20, alignItems: 'center', elevation: 10 },
  logoutCloseButton: { position: 'absolute', top: 10, right: 10, backgroundColor: '#4e4747', borderRadius: 15 },
  logoutModalText: { fontSize: width * 0.045, fontFamily: 'Poppins-Bold', textAlign: 'center', marginVertical: 20, color: '#333' },
  logoutModalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '65%' },
  confirmButton: { backgroundColor: '#D32F2F', position: 'center', flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  confirmButtonText: { color: '#FFF', fontFamily: 'Poppins-Regular', fontSize: width * 0.04 },
});
