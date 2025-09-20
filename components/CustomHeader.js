import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const CustomHeader = ({
  title = "SKILL UP",
  showMenu = false,
  showBackButton = false,
  showSearch = false,
  menuPosition = 'left',
  backgroundColor = '#00A9FF',
  edgePadding = 15,
  rightOffset = 0,

}) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  // ===== NOVO ESTADO PARA CONTROLAR O MODAL DE SAÍDA =====
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const router = useRouter();
  const userName = "Usuário";

  const navigateAndClose = (path) => {
    setMenuVisible(false);
    router.push(path);
  };

  // ===== NOVA FUNÇÃO PARA LIDAR COM O CLIQUE EM "SAIR" =====
  const handleLogoutPress = () => {
    setMenuVisible(false); // Fecha o menu lateral
    setLogoutModalVisible(true); // Abre o modal de confirmação
  };

  // ===== NOVA FUNÇÃO PARA CONFIRMAR A SAÍDA =====
  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    // Aqui viria a sua lógica de logout (limpar tokens, etc.)
    // Por enquanto, vamos navegar para a tela inicial.
    router.replace('/'); // Usa 'replace' para não poder voltar para a tela anterior
  };

  const menuItems = [
    { name: 'Início', path: '/' },
    { name: 'Termos', path: '/termos' },
    { name: 'Contato', path: '/contato' },
    { name: 'Minha Conta', path: '/' },
    { name: 'Usuários', path: '/' }, 
    // O item "Sair" agora não tem uma ação de navegação direta
    { name: 'Sair' }, 
  ];

  const LeftSlot = () => (
    <View style={styles.headerSide}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      ) : (showMenu && menuPosition === 'left') ? (
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Feather name="menu" size={28} color="white" />
        </TouchableOpacity>
      ) : <View />}
    </View>
  );

  const RightSlot = () => (
    <View style={[styles.headerSide, { alignItems: 'flex-end', marginRight: -Math.max(0, rightOffset) }]}>
      {(showMenu && menuPosition === 'right') ? (
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Feather name="menu" size={28} color="white" />
        </TouchableOpacity>
      ) : showSearch ? (
        <TouchableOpacity onPress={() => {}}>
          <Feather name="search" size={22} color="white" />
        </TouchableOpacity>
      ) : <View />}
    </View>
  );

  return (
    <>
      <SafeAreaView style={{ backgroundColor }}>
        <View style={[
          styles.header,
          { backgroundColor, paddingHorizontal: Math.max(0, edgePadding) }
        ]}>
          <LeftSlot />

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>

          <RightSlot />
        </View>
      </SafeAreaView>

      {/* Modal do Menu Lateral (código existente) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setMenuVisible(false)}>
          <View style={styles.menuCard}>
            <SafeAreaView style={{ flex: 1 }}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setMenuVisible(false)}>
                <Feather name="x" size={30} color="black" />
              </TouchableOpacity>
              <View style={styles.menuPerfil}>
                <View style={styles.menuframe}>
                  <Image source={require('../assets/images/user-profile 1.png')} style={styles.profileImage} />
                  <Text style={styles.menuUserName}>{userName}</Text>
                </View>
                <View style={styles.scoreContainer}>
                   <Image source={require('../assets/images/image 33.png')} style={styles.medalImage} />
                   <Text style={styles.pontuacao}>0</Text>
                </View>
              </View>
              <View style={styles.menuItemsContainer}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.menuItem} 
                    // Lógica condicional para o clique
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

      {/* ===== NOVO MODAL DE CONFIRMAÇÃO DE SAÍDA ===== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.logoutModalOverlay}>
          <View style={styles.logoutModalCard}>
            {/* BOTÃO 'X' ADICIONADO AQUI */}
            <TouchableOpacity 
              style={styles.logoutCloseButton}
              onPress={() => setLogoutModalVisible(false)}
            >
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.logoutModalText}>Deseja mesmo sair da conta?</Text>
            <View style={styles.logoutModalButtons}>
              <TouchableOpacity 
                onPress={handleConfirmLogout}
              >
                <Text style={styles.logoutModalButtonTextSair}>Sair</Text>
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
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  menuButton: {},
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  menuCard: {
    backgroundColor: '#00ABFF',
    width: width * 0.8, // 80% da largura do ecrã
    height: '100%',
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: height * 0.02, // 2% da altura do ecrã
    right: width * 0.05, // 5% da largura do ecrã
    zIndex: 1,
  },
  // ===== ESTILOS RESPONSIVOS APLICADOS ABAIXO =====
  menuPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, // 5% de padding horizontal
    paddingVertical: height * 0.02, // 2% de padding vertical
    marginTop: height * 0.06, // 6% de margem do topo
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuframe: {
    flex: 1, // Ocupa o espaço flexível disponível
    height: height * 0.07, // 7% da altura do ecrã
    borderRadius: 100,
    backgroundColor: '#0090FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.02, // 2% de padding horizontal
    marginRight: width * 0.25, // 4% de margem à direita
  },
  profileImage: {
    width: height * 0.055, // A largura é 5.5% da altura do ecrã (para manter proporção)
    height: height * 0.055, // A altura é 5.5% da altura do ecrã
    borderRadius: (height * 0.055) / 2, // Metade da altura/largura para ser um círculo
    marginRight: width * 0.02, // 2% de margem
  },
  menuUserName: {
    fontSize: width * 0.04, // A fonte é 4% da largura do ecrã
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medalImage: {
    width: width * 0.07, // 7% da largura do ecrã
    height: width * 0.07,
    marginRight: width * 0.03,
  },
  pontuacao: {
    fontSize: width * 0.045, // 4.5% da largura do ecrã
    color: '#fff',
    fontWeight: 'bold',
  },
  menuItemsContainer: {
    paddingHorizontal: width * 0.05, // 5% de padding horizontal
  },
  menuItem: {
    paddingVertical: height * 0.03, 
  },
  menuItemText: {
    fontSize: width * 0.05, // 4.5% da largura do ecrã
    color: '#FFFFFF',
  },
  // ===== ESTILOS DO MODAL DE SAÍDA (JÁ RESPONSIVOS) =====
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModalCard: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10,
  },
  logoutCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logoutModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  logoutModalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  logoutModalButtonTextSair: {
    backgroundColor: '#FF0000',
    width: 100,
    height: 40,
    borderRadius: 8,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold', 
    lineHeight: 40, 
    fontSize: 18,
    overflow: 'hidden', 
  },
});

export default CustomHeader;