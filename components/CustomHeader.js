import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Dimensions, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

const CustomHeader = ({
  showMenu = false,
  showBackButton = false,
  userName = "Usuário",
  menuPosition = 'left', // Padrão: menu abre da esquerda
  closeButtonSide = 'right', // Padrão: 'x' fica na direita
}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const router = useRouter();

  const navigateAndClose = (path) => { setMenuVisible(false); router.push(path); };
  const handleLogoutPress = () => { setMenuVisible(false); setLogoutModalVisible(true); };
  const handleConfirmLogout = () => { setLogoutModalVisible(false); router.replace('/'); };

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Blinker-Regular': require('../assets/fonts/Blinker/Blinker-Regular.ttf'),
  });

  const menuItems = [
    { name: 'Início', path: '/home' }, { name: 'Termos', path: '/termos' },{ name: 'Contato', path: '/contato' },
    { name: 'Minha Conta', path: '/minha-conta' },{ name: 'Usuario', path: '/usuario' },
    { name: 'Sair' },
  ];

  return (
    <>
      <SafeAreaView style={{ backgroundColor: '#00A9FF' }}>
        <View style={styles.header}>
            <View style={styles.headerSide}>
              {showBackButton && (
                <TouchableOpacity onPress={() => router.back()}>
                  <Feather name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
              )}
              {!showBackButton && showMenu && menuPosition === 'left' && (
                <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
                  <Feather name="menu" size={28} color="white" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.headerCenter}></View>
            <View style={styles.headerSide}>
              {showMenu && menuPosition === 'right' && (
                <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
                  <Feather name="menu" size={28} color="white" />
                </TouchableOpacity>
              )}
            </View>
        </View>
      </SafeAreaView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={[
            styles.modalOverlay,
            menuPosition === 'right' && styles.modalOverlayRight
          ]}
          activeOpacity={1} 
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menuCard}>
            <SafeAreaView style={{ flex: 1 }}>
                <TouchableOpacity 
                  style={[
                    styles.closeButtonBase,
                    closeButtonSide === 'left' ? styles.closeButtonLeft : styles.closeButtonRight
                  ]} 
                  onPress={() => setMenuVisible(false)}
                >
                  <Feather name="x" size={30} color="black" />
                </TouchableOpacity>
                
                <View style={[styles.menuPerfil, menuPosition === 'right' && styles.menuPerfilRight]}>
                  <View style={[styles.menuframe, menuPosition === 'right' && styles.menuframeRight]}>
                    <Image source={require('../assets/images/perfil.svg')} style={styles.profileImage} />
                    <Text style={styles.menuUserName}>{userName}</Text>
                  </View>
                  <View style={styles.scoreContainer}>
                      <Image source={require('../assets/images/medalha.svg')} style={styles.medalImage} />
                      <Text style={styles.pontuacao}>0</Text>
                  </View>
                </View>

                <View style={styles.menuItemsContainer}>
                  {menuItems.map((item, index) => (
                    <Pressable 
                      key={index} 
                      style={({ hovered }) => [styles.menuItem, hovered && styles.menuItemHover]} 
                      onPress={() => item.name === 'Sair' ? handleLogoutPress() : navigateAndClose(item.path)}
                    >
                      <Text style={[styles.menuItemText, menuPosition === 'right' && styles.menuItemTextRight]}>{item.name}</Text>
                    </Pressable>
                  ))}
                </View>
            </SafeAreaView>
          </View>
        </TouchableOpacity>
      </Modal>
      
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
                  style={[styles.logoutButton, styles.cancelButton]} 
                  onPress={() => setLogoutModalVisible(false)}
                >
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.logoutButton, styles.confirmButton]}
                  onPress={handleConfirmLogout}
                >
                  <Text style={styles.confirmButtonText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#00A9FF',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerSide: { width: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  menuButton: {},
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  modalOverlayRight: {
    justifyContent: 'flex-end',
  },
  menuCard: {
    backgroundColor: '#00ABFF',
    width: width * 0.6,
    height: '100%',
    elevation: 10,
  },
  closeButtonBase: {
    position: 'absolute',
    top: height * 0.02,
    zIndex: 1,
  },
  closeButtonLeft: { left: width * 0.05, },
  closeButtonRight: { right: width * 0.05, },

  menuPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    marginTop: height * 0.06,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuPerfilRight: {
    flexDirection: 'row-reverse',
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
  menuframeRight: {
    flexDirection: 'row-reverse',
    marginRight: 0,
    marginLeft: width * 0.04,
  },
  profileImage: {
    width: height * 0.055,
    height: height * 0.055,
    borderRadius: (height * 0.055) / 2,
  },
  menuUserName: {
    fontSize: width * 0.04,
    fontFamily : 'Blinker-Regular',
    color: '#fff',
    flex: 1,
    marginHorizontal: width * 0.02,
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
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  menuItemHover: {
    backgroundColor: 'rgba(0, 144, 255, 0.8)',
  },
  menuItemText: {
    fontSize: width * 0.045,
    color: '#FFFFFF',
    textAlign: 'left',
  },
  menuItemTextRight: {
    textAlign: 'right',
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

export default CustomHeader;