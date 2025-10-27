import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import CustomHeader from '../components/CustomHeader';
import { Trofeu1Icon, Trofeu2Icon, Trofeu3Icon, PerfilIcon } from '../components/icons/icon';

const { width } = Dimensions.get('window');

export default function FimDeJogoScreen() {
  const router = useRouter();

  // Dados do ranking baseados na imagem
  const rankingData = [
    { rank: 1, score: 3869, username: 'Usuário' },
    { rank: 2, score: 3868, username: 'Usuário' },
    { rank: 3, score: 3867, username: 'Usuário' },
  ];

  const getTrophyIcon = (rank) => {
    const iconSize = width * 0.18; // reduzido para base, pois terá scale de zoom agora
    const iconStyle = styles.trophyIcon;
    if (rank === 1)
      return (
        <View style={{ transform: [{ scale: 2.00 }] }}>
          <Trofeu1Icon width={50} height={50} style={iconStyle} />
        </View>
      );
    if (rank === 2)
      return (
        <View style={{ transform: [{ scale: 2.00 }] }}>
          <Trofeu2Icon width={50} height={50} style={iconStyle} />
        </View>
      );
    if (rank === 3)
      return (
        <View style={{ transform: [{ scale: 2.00 }] }}>
          <Trofeu3Icon width={50} height={ 50} style={iconStyle} />
        </View>
      );
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader showMenu={true} menuPosition="right" />
      
      <View style={styles.container}>
        <Text style={styles.title}>FIM DE JOGO</Text>

        <View style={styles.rankingContainer}>
          {rankingData.map((item, index) => (
            <View key={index} style={styles.rankItem}>
              <View style={styles.cardContainer}>
                {getTrophyIcon(item.rank)}
                <View style={styles.playerCard}>
                  <View style={styles.avatarContainer}>
                    <PerfilIcon width={width * 0.18} height={width * 0.18} style={styles.avatar} />
                  </View>
                  <Text style={styles.username}>{item.username}</Text>
                </View>
              </View>
              
              <Text style={styles.score}>{item.score} Pontos</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY_BLUE = '#2196F3';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#2F2E2E';
const TEXT_WHITE = '#FFFFFF';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_BLUE,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: TEXT_WHITE,
    textAlign: 'center',
    marginBottom: 50,
    letterSpacing: 2,
  },
  rankingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  rankItem: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    marginBottom: 30,
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  trophyIcon: {
    marginRight: 20,
  },
  playerCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    minHeight: 60,
    position: 'relative',
  },
  avatarContainer: {
    position: 'absolute',
    top: -40,
    borderRadius: (width * 0.16) / 2,
    padding: 2,
    zIndex: 1,
  },
  avatar: {
    borderRadius: (width * 0.16) / 2,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: TEXT_DARK,
    textAlign: 'center',
    marginTop: (width * 0.16 / 2) + 15,
  },
  score: {
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
    color: TEXT_WHITE,
    textAlign: 'center',
    marginTop: 5,
  },
});
