// app/perfil.js

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions, 
  ScrollView, 
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

// --- ÍCONES GERAIS ---
import { MedalhaIcon } from '../components/icons/icon';
import Userprofile2Icon from '../components/icons/Userprofile2Icon';

// --- ÍCONES DE AVATAR ---
import BodeIcon from '../components/icons/BodeIcon';
import CanetabicIcon from '../components/icons/CanetabicIcon';
import PatoIcon from '../components/icons/PatoIcon';

import usuarioService from '../services/usuarioService';

const { width } = Dimensions.get('window');

export default function PerfilScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Estado do Perfil
  const [profile, setProfile] = useState({
    id: null, 
    name: 'Carregando...',
    email: '',
    points: 0,
    bio: '',
    avatar: null
  });

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  // Lista de Avatares disponíveis para escolha
  const availableAvatars = [
    { key: 'bode', Component: BodeIcon, label: 'Bode' },
    { key: 'pato', Component: PatoIcon, label: 'Pato' },
    { key: 'canetabic', Component: CanetabicIcon, label: 'Caneta' },
  ];

  const avatarMap = {
    'bode': BodeIcon,
    'bode.svg': BodeIcon,
    'canetabic': CanetabicIcon,
    'canetabic.svg': CanetabicIcon,
    'pato': PatoIcon,
    'pato.svg': PatoIcon,
  };

  // --- CARREGAR DADOS ---
  const fetchProfileData = async () => {
    try {
      const userData = await usuarioService.getMeuPerfil();
      if (userData) {
        setProfile({
          id: userData.id,
          name: userData.nome || 'Usuário',
          email: userData.email || '', 
          points: userData.pontuacao || 0,
          bio: userData.biografia || 'Sem biografia...',
          avatar: userData.avatar
        });
        setBioDraft(userData.biografia || '');
      }
    } catch (error) {
      console.error("Erro perfil:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const getAvatarComponent = () => {
    if (profile.avatar) {
      const avatarKey = profile.avatar.toLowerCase();
      return avatarMap[avatarKey] || Userprofile2Icon;
    }
    return Userprofile2Icon;
  };
  const CurrentAvatar = getAvatarComponent();

  // --- ATUALIZAR BIOGRAFIA ---
  const handleSaveBio = async () => {
    if (updating) return;
    
    if (!profile.id) {
        Alert.alert("Erro", "ID do usuário não encontrado.");
        return;
    }

    setUpdating(true);
    try {
      await usuarioService.atualizarBiografia(profile.id, bioDraft);
      
      setProfile({ ...profile, bio: bioDraft });
      setEditingBio(false);
      Alert.alert("Sucesso", "Biografia atualizada!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao atualizar biografia.");
    } finally {
      setUpdating(false);
    }
  };

  // --- ATUALIZAR AVATAR ---
  const handleSelectAvatar = async (avatarKey) => {
    setAvatarModalVisible(false);
    
    if (!profile.id) {
        Alert.alert("Erro", "ID do usuário não encontrado.");
        return;
    }

    setUpdating(true);

    try {
      await usuarioService.atualizarAvatar(profile.id, avatarKey);

      setProfile(prev => ({ ...prev, avatar: avatarKey }));
      Alert.alert("Sucesso", "Avatar alterado com sucesso!");

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível alterar o avatar.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={{ width: 28 }} />
          <Text style={styles.badgeText}>MEU PERFIL</Text>
          <View style={styles.headerSpacerRight}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD PRINCIPAL */}
        <View style={styles.card}>
          
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <CurrentAvatar width={100} height={100} style={{ borderRadius: 50 }} />
                <View style={styles.statusDot} />
              </View>

              <TouchableOpacity 
                style={styles.changeAvatarButton} 
                onPress={() => setAvatarModalVisible(true)}
              >
                <Feather name="camera" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>

          {/* SÓ PONTOS */}
          <View style={styles.gridRow}>
            <View style={styles.gridCard}>
              <View style={styles.gridHeader}>
                <MedalhaIcon style={styles.gridIcon} width={25} height={27} />
                <Text style={styles.gridTitle}>PONTOS</Text>
              </View>
              <Text style={styles.gridValue}>
                {`${profile.points}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}
              </Text>
            </View>
          </View>

          {/* SÓ BIOGRAFIA */}
          <View style={styles.gridRow}>
            <View style={styles.gridCardWide}>
              <Text style={styles.sectionLabel}>BIOGRAFIA</Text>
              {editingBio ? (
                <>
                  <TextInput
                    value={bioDraft}
                    style={styles.bioInput}
                    onChangeText={setBioDraft}
                    maxLength={120}
                    multiline
                    autoFocus
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                    <TouchableOpacity onPress={handleSaveBio} style={styles.saveButton} disabled={updating}>
                      {updating ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.buttonTextWhite}>Salvar</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setBioDraft(profile.bio); setEditingBio(false); }} style={styles.cancelButton}>
                      <Text style={styles.buttonTextDark}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.bioText}>{profile.bio}</Text>
              )}
            </View>
          </View>

          <View style={styles.footerRow}>
            {!editingBio && (
              <TouchableOpacity style={styles.editButton} onPress={() => setEditingBio(true)}>
                <Feather name="edit-2" size={16} color="#2F2E2E" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* --- MODAL DE SELEÇÃO DE AVATAR --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={avatarModalVisible}
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha seu Avatar</Text>
              <TouchableOpacity onPress={() => setAvatarModalVisible(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.avatarsGrid}>
              {availableAvatars.map((item) => (
                <TouchableOpacity 
                  key={item.key} 
                  style={[
                    styles.avatarOption, 
                    profile.avatar === item.key && styles.avatarOptionSelected
                  ]}
                  onPress={() => handleSelectAvatar(item.key)}
                >
                  <item.Component width={50} height={50} />
                  <Text style={styles.avatarLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const CARD_BG = '#FFFFFF';
const PAGE_BG = '#2B2B2B';
const TEXT_DARK = '#2F2E2E';
const TEXT_MUTED = '#626361';
const TILE_BG = '#D9D9D9';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PAGE_BG },
  container: { padding: 25 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 25,
  },
  badgeText: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  closeIcon: { color: '#FFF', fontSize: 32, padding: 4 },
  headerSpacerRight: { width: 28, alignItems: 'flex-end' },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 16,
    minHeight: 450, // Ajustado pois removemos itens
  },
  avatarWrapper: { alignItems: 'center', marginTop: 8 },
  avatarContainer: { marginTop: -10, marginBottom: -40, marginLeft: 50 },
 
  
  changeAvatarButton: {
    bottom: 0,
    right: 0,
    backgroundColor: '#00A9FF',
    width: 25,
    height: 25,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 3,
    marginTop: -40, 
    marginLeft: 12,
  },

  name: { marginTop: 50, fontFamily: 'Poppins-SemiBold', fontSize: 16, color: TEXT_DARK },
  email: { marginTop: 2, fontFamily: 'Poppins-Regular', fontSize: 12, color: TEXT_MUTED },

  gridRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  gridCard: {
    flex: 1,
    backgroundColor: TILE_BG,
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-between',
    elevation: 1,
  },
  gridHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gridIcon: { width: 20, height: 20 },
  gridTitle: { fontFamily: 'Poppins-Medium', fontSize: 10, color: TEXT_MUTED },
  gridValue: { fontFamily: 'Blinker-Bold', fontSize: 32, color: TEXT_DARK, alignSelf: 'flex-start' },

  gridCardWide: {
    flex: 1,
    backgroundColor: TILE_BG,
    borderRadius: 12,
    padding: 14,
    elevation: 1,
  },
  sectionLabel: { fontFamily: 'Poppins-Medium', fontSize: 12, color: TEXT_MUTED, marginBottom: 8 },
  
  bioText: { fontFamily: 'Poppins-Regular', color: TEXT_DARK, textAlign: 'left', lineHeight: 20 },
  bioInput: { 
    backgroundColor: '#FFF', 
    color: TEXT_DARK, 
    padding: 10, 
    borderRadius: 8, 
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'top',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#CCC'
  },

  footerRow: { alignItems: 'flex-end', marginTop: 12 },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9E9E9',
  },
  
  saveButton: { marginRight: 10, backgroundColor: '#00A9FF', borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  cancelButton: { backgroundColor: '#FFF', borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#CCC' },
  buttonTextWhite: { color: 'white', fontFamily: 'Poppins-Medium', fontSize: 12 },
  buttonTextDark: { color: '#2F2E2E', fontFamily: 'Poppins-Medium', fontSize: 12 },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 15,
    
    
  },
  avatarOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: '#00A9FF',
    backgroundColor: '#F0F8FF',
  },
  avatarLabel: {
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    
  }
});