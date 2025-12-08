// components/CustomHeader.js

import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView, 
  Dimensions, 
  Pressable 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

// --- Ícones Gerais ---
import PerfilIcon from '../components/icons/PerfilIcon'; // Ícone padrão

// --- Ícones de Avatar (Novos) ---
import BodeIcon from '../components/icons/BodeIcon';
import CanetabicIcon from '../components/icons/CanetabicIcon';
import PatoIcon from '../components/icons/PatoIcon';

import usuarioService from '../services/usuarioService'; 

const { width, height } = Dimensions.get('window');

const CustomHeader = ({
  showMenu = false,
  showBackButton = false,
  userName = "Usuário",
  menuPosition = 'left',
  closeButtonSide = 'right',
  headerStyle = 'solid',
}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Blinker-Regular': require('../assets/fonts/Blinker/Blinker-Regular.ttf'),
  });

  // --- MAPEAMENTO DE AVATARES (IGUAL AO RANKING) ---
  const avatarMap = {
    'bode': BodeIcon,
    'bode.svg': BodeIcon,
    'canetabic': CanetabicIcon,
    'canetabic.svg': CanetabicIcon,
    'pato': PatoIcon,
    'pato.svg': PatoIcon,
  };

  // --- BUSCA DADOS ---
  useFocusEffect(
    useCallback(() => {
      const fetchPerfil = async () => {
        try {
          if (showMenu) {
            const token = await usuarioService.getToken();
            if (token) {
              const userData = await usuarioService.getMeuPerfil();
              // console.log("Dados Header:", userData); // Debug se precisar
              setUser(userData);
            }
          }
        } catch (error) {
          console.log("Erro Header:", error);
        }
      };
      fetchPerfil();
    }, [showMenu])
  );

  const navigateAndClose = (path) => { setMenuVisible(false); router.push(path); };
  const handleLogoutPress = () => { setMenuVisible(false); setLogoutModalVisible(true); };
  
  const handleConfirmLogout = async () => { 
    try {
      await usuarioService.logoutUsuario();
      setLogoutModalVisible(false); 
      router.replace('/login'); 
    } catch (error) {
      router.replace('/login');
    }
  };

  const menuItems = [
    { name: 'Início', path: '/jogo' }, 
    { name: 'Termos', path: '/termos' },
    { name: 'Contato', path: '/contato' },
    { name: 'Minha Conta', path: '/perfil' },
    { name: 'Sair' },
  ];

  const MenuIcon = () => (
    <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
      <Feather name="menu" size={width * 0.08} color={headerStyle === 'floating' ? '#000000' : '#FFFFFF'} />
    </TouchableOpacity>
  );

  // --- LÓGICA PARA ESCOLHER O ÍCONE DO AVATAR ---
  const getAvatarComponent = () => {
    if (user && user.avatar) {
      const avatarKey = user.avatar.toLowerCase();
      // Retorna o ícone mapeado OU o PerfilIcon se não encontrar
      return avatarMap[avatarKey] || PerfilIcon;
    }
    // Retorna ícone padrão se não tiver user ou avatar
    return PerfilIcon;
  };

  const AvatarComponent = getAvatarComponent();

  if (!fontsLoaded) return null;

  return (
    <>
      {/* Header Sólido */}
      {headerStyle === 'solid' && (
        <SafeAreaView style={{ backgroundColor: '#00A9FF' }}>
          <View style={styles.header}>
            <View style={styles.headerSide}>
              {showBackButton && (
                <TouchableOpacity onPress={() => router.back()}>
                  <Feather name="arrow-left" size={width * 0.07} color="white" />
                </TouchableOpacity>
              )}
              {!showBackButton && showMenu && menuPosition === 'left' && <MenuIcon />}
            </View>
            <View style={styles.headerCenter}></View>
            <View style={styles.headerSide}>
              {showMenu && menuPosition === 'right' && <MenuIcon />}
            </View>
          </View>
        </SafeAreaView>
      )}

      {/* Header Flutuante */}
      {headerStyle === 'floating' && showMenu && (
        <View style={[
          styles.floatingContainer,
          menuPosition === 'left' ? styles.floatingPositionLeft : styles.floatingPositionRight
        ]}>
          <MenuIcon />
        </View>
      )}

    {/* --- MENU LATERAL (MODAL) --- */}
      <Modal
        animationType="fade"
        transpar  ent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, menuPosition === 'right' && styles.modalOverlayRight]}
          activeOpacity={1} 
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menuCard}>
            <SafeAreaView style={{ flex: 1 }}>
                <TouchableOpacity 
                  style={[styles.closeButtonBase, closeButtonSide === 'left' ? styles.closeButtonLeft : styles.closeButtonRight]} 
                  onPress={() => setMenuVisible(false)}
                >
                  <Feather name="x" size={width * 0.08} color="black" />
                </TouchableOpacity>
                
                {/* --- ÁREA DO PERFIL --- */}
                <View style={[styles.menuPerfil, menuPosition === 'right' && styles.menuPerfilRight]}>
                  <View style={[styles.menuframe, menuPosition === 'right' && styles.menuframeRight]}>
                    
                    {/* Renderiza o componente SVG escolhido */}
                    <AvatarComponent style={styles.profileImage} />

                    <Text style={styles.menuUserName} numberOfLines={1}>
                        {user?.nome || userName}
                    </Text>
                  </View>
                  
                  {/* <View style={styles.scoreContainer}>
                    <MedalhamenuIcon style={styles.medalImage} />
                    <Text style={styles.pontuacao}>
                        {user?.pontuacao !== undefined ? user.pontuacao : 0}
                    </Text>
                  </View> */}
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
      
      {/* --- MODAL SAIR --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.logoutModalOverlay}>
            <View style={styles.logoutModalCard}>
              <TouchableOpacity style={styles.logoutCloseButton} onPress={() => setLogoutModalVisible(false)}>
                <Feather name="x" size={width * 0.06} color="#888" />
              </TouchableOpacity>
              <Text style={styles.logoutModalText}>Deseja mesmo sair da conta?</Text>
              <View style={styles.logoutModalButtons}>
                <TouchableOpacity style={[styles.logoutButton, styles.cancelButton]} onPress={() => setLogoutModalVisible(false)}>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.logoutButton, styles.confirmButton]} onPress={handleConfirmLogout}>
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
    height: height * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
  },
  headerSide: { 
    width: width * 0.1,
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerCenter: { 
    flex: 1, 
    alignItems: 'center' 
  },
  floatingContainer: {
    position: 'absolute',
    top: height * 0.06,
    zIndex: 10,
  },
  floatingPositionLeft: {
    left: width * 0.04,
  },
  floatingPositionRight: {
    right: width * 0.04,
  },
  menuButton: {
    padding: 5,
  },
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
    width: width * 0.7,
    height: '100%',
    elevation: 10,
  },
  closeButtonBase: {
    position: 'absolute',
    top: height * 0.02,
    zIndex: 1,
  },
  closeButtonLeft: { 
    left: width * 0.05, 
  },
  closeButtonRight: { 
    right: width * 0.05, 
  },
  menuPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
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
    marginRight: width * 0.09
  },
  menuframeRight: {
    flexDirection: 'row-reverse',
    marginRight: 0,
    marginLeft: width * 0.04,
  },
  // Estilo ajustado para suportar SVG
  profileImage: {
    width: height * 0.050,
    height: height * 0.050,
    // borderRadius não afeta SVG diretamente, mas mantém caso use View container
  },
  menuUserName: {
    fontSize: width * 0.05,
    fontFamily : 'Blinker-Regular',
    color: '#fff',
    flex: 1,
    marginHorizontal: width * 0.04,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  
  menuItemsContainer: {
    paddingHorizontal: width * 0.05,
  },
  menuItem: {
    paddingVertical: height * 0.025, 
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.025,
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
    width: '90%',
    maxWidth: 320,
    backgroundColor: '#FFF',
    borderRadius: width * 0.03,
    padding: width * 0.08,
    alignItems: 'center',
    elevation: 10,
  },
  logoutCloseButton: {
    position: 'absolute',
    top: height * 0.01,
    right: width * 0.03,
    backgroundColor: '#4e4747',
    borderRadius: width * 0.04,
    padding: width * 0.01,
  },
  logoutModalText: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginVertical: height * 0.02,
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
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.04,
  },
  cancelButton: {},
  logoutButton: {}
});

export default CustomHeader;