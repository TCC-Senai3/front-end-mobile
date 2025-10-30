import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, ScrollView, ImageBackground, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { UserIcon, MedalhaIcon, RankingIcon, Trofeu1Icon } from '../components/icons/icon';
import Userprofile2Icon from '../components/icons/Userprofile2Icon';

const { width } = Dimensions.get('window');

export default function PerfilScreen() {
  const router = useRouter();

  // Dados mockados (substituir quando houver backend)
  // Passar para estado para editar depois
  const [profile, setProfile] = useState({
    name: 'Usuario200',
    email: 'usuario200@gmail.com',
    rankPosition: 1,
    points: 200,
    bio: 'texto limitado a uma quantidade de caracteres',
  });
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(profile.bio);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={{ width: 28 }} />
          {/* PlacaIcon não existe, comentário placeholder:
          <PlacaIcon style={styles.badgeImage} width={350} height={50} /> */}
          
            <Text style={styles.badgeText}></Text>
          
          <View style={styles.headerSpacerRight}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              {/* Avatar do perfil (ícone) */}
              <Userprofile2Icon width={100} height={100} style={{ borderRadius: 50 }} />
              
              <View style={styles.statusDot} />
            </View>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCard}>
              <View style={styles.gridHeader}>
                {/* Ícones da grid: */}
                <Trofeu1Icon style={styles.gridIcon} width={28} height={27} />
                <Text style={styles.gridTitle}>POSIÇÃO NO RANKING</Text>
              </View>
              <Text style={styles.gridValue}>{profile.rankPosition}</Text>
            </View>
            <View style={styles.gridCard}>
              <View style={styles.gridHeader}>
                {/* Ícones da grid: */}
                <MedalhaIcon style={styles.gridIcon} width={25} height={27} />
                <Text style={styles.gridTitle}>PONTOS</Text>
              </View>
              <Text style={styles.gridValue}>{`${profile.points}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCardWide}>
              <Text style={styles.sectionLabel}>TAG#</Text>
              <View style={styles.tagRow}>
                {/* Ícones da grid: */}
                <Trofeu1Icon width={30} height={30} style={{ marginRight: 8, resizeMode: 'contain' }} />
                <Text style={styles.tagText}>{profile.tag}</Text>
              </View>
            </View>
            <View style={styles.gridCardWide}>
              <Text style={styles.sectionLabel}>BIOGRAFIA</Text>
              {editingBio ? (
                <>
                  <TextInput
                    value={bioDraft}
                    style={[styles.bioText, {backgroundColor: '#fff', color: '#333', padding: 8, borderRadius: 8}]}
                    onChangeText={setBioDraft}
                    maxLength={120}
                    multiline
                    autoFocus
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
                    <TouchableOpacity onPress={() => {
                      setProfile({ ...profile, bio: bioDraft });
                      setEditingBio(false);
                    }} style={{ marginRight: 16, backgroundColor: '#00A9FF', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 }}>
                      <Text style={{ color: 'white', fontFamily: 'Poppins-Medium' }}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      setBioDraft(profile.bio);
                      setEditingBio(false);
                    }} style={{ backgroundColor: '#E9E9E9', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 }}>
                      <Text style={{ color: '#2F2E2E', fontFamily: 'Poppins-Medium' }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.bioText}>{profile.bio}</Text>
              )}
            </View>
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.editButton} onPress={() => setEditingBio(true)}>
              <Feather name="edit-2" size={16} color="#2F2E2E" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_BG = '#FFFFFF';
const PAGE_BG = '#2B2B2B';
const PRIMARY = '#00A9FF';
const TEXT_DARK = '#2F2E2E';
const TEXT_MUTED = '#626361';
const TILE_BG = '#D9D9D9';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PAGE_BG },
  container: { padding: 16 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgeImage: {
    height: 50,
    width: 350,
    alignItems: '',
    justifyContent: '',
    marginLeft: -22,
  },
  badgeText: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  closeIcon: { color: '#FFF', fontSize: 22, padding: 4 },
  headerSpacerRight: { width: 28, alignItems: 'flex-end' },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 16,
    minHeight: 520,
  },
  avatarWrapper: { alignItems: 'center', marginTop: 8 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  statusDot: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2CC84D',
  },
  name: { marginTop: 10, fontFamily: 'Poppins-SemiBold', fontSize: 16, color: TEXT_DARK },
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
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallIcon: { width: 18, height: 18 },
  tagText: { fontFamily: 'Poppins-SemiBold', color: TEXT_DARK },
  bioText: { fontFamily: 'Poppins-Regular', color: '#FFFFFF', textAlign: 'center' },

  footerRow: { alignItems: 'flex-end', marginTop: 12 },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9E9E9',
  },
});


