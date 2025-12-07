// app/fim-de-jogo.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions, 
  ScrollView, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

// Services
import rankingSalaService from '../services/rankingSalaService';
import usuarioService from '../services/usuarioService';

// Avatares
import Userprofile2Icon from '../components/icons/Userprofile2Icon';
import BodeIcon from '../components/icons/BodeIcon';
import CanetabicIcon from '../components/icons/CanetabicIcon';
import PatoIcon from '../components/icons/PatoIcon';

// Troféu do campeão
import TrophyIcon from '../components/icons/VerifiedIcon';

const { width } = Dimensions.get('window');

export default function FimDeJogo() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { acertos, total, idSala } = params;

  const [ranking, setRanking] = useState([]);
  const [podiumData, setPodiumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Mapa de avatares
  const avatarMap = {
    'bode.svg': BodeIcon, bode: BodeIcon,
    'canetabic.svg': CanetabicIcon, caneta: CanetabicIcon,
    'pato.svg': PatoIcon, pato: PatoIcon,
  };

  const getAvatarComponent = (name) => {
    if (!name) return Userprofile2Icon;
    const clean = String(name).toLowerCase().replace('.svg', '');
    return avatarMap[clean] || Userprofile2Icon;
  };

  // Busca ranking da sala
  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);

        const token = await usuarioService.getToken();
        const user = await usuarioService.getMeuPerfil();
        setCurrentUser(user);

        const dados = await rankingSalaService.getRankingSala(idSala, token);

        const organizado = dados
          .map((jogador, index) => ({
            id: jogador.id ?? index,
            nome: jogador.nomeUsuario ?? "Anônimo",
            avatar: jogador.avatar,
            pontos: jogador.pontuacao ?? 0,
          }))
          .sort((a, b) => b.pontos - a.pontos)
          .map((j, i) => ({ ...j, posicao: i + 1 }));

        setRanking(organizado);
        setPodiumData(organizado.slice(0, 3));
      } catch (e) {
        console.log("Erro ao carregar ranking:", e);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [idSala]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1CB0FC" barStyle="light-content" />
      <CustomHeader showMenu menuPosition="right" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* TÍTULO */}
        <Text style={styles.title}>FIM DE JOGO</Text>

        {/* RESULTADO */}
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            Você acertou <Text style={styles.highlight}>{acertos}</Text> de{" "}
            <Text style={styles.highlight}>{total}</Text> perguntas.
          </Text>
        </View>

        {/* LOADING */}
        {loading && (
          <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 40 }} />
        )}

        {/* PÓDIO */}
        {!loading && podiumData.length > 0 && (
          <View style={styles.podiumContainer}>
            <Text style={styles.sectionTitle}>Pódio da Partida</Text>

            <View style={styles.firstPlaceContainer}>
              <TrophyIcon width={120} height={120} />

              <View style={styles.winnerCard}>
                <View style={styles.winnerAvatarCircle}>
                  {(() => {
                    const Avatar = getAvatarComponent(podiumData[0].avatar);
                    return <Avatar width={40} height={40} />;
                  })()}
                </View>

                <Text style={styles.winnerName}>{podiumData[0].nome}</Text>
              </View>

              <Text style={styles.winnerPoints}>{podiumData[0].pontos} pts</Text>
            </View>
          </View>
        )}

        {/* LISTA GERAL */}
        {!loading && ranking.length > 0 && (
          <View style={styles.rankingList}>
            <Text style={styles.sectionTitle}>Classificação Geral</Text>

            {ranking.map((jogador) => {
              const Avatar = getAvatarComponent(jogador.avatar);
              const isMe = currentUser?.id == jogador.id;

              return (
                <View
                  key={jogador.id}
                  style={[styles.rankingRow, isMe && styles.myRow]}
                >
                  <Text style={styles.rankPos}>#{jogador.posicao}</Text>

                  <View style={styles.rankUser}>
                    <View style={styles.rankAvatar}>
                      <Avatar width={24} height={24} />
                    </View>
                    <Text style={styles.rankName}>{jogador.nome}</Text>
                  </View>

                  <Text style={styles.rankPoints}>{jogador.pontos} pts</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* BOTÃO VOLTAR */}
        <TouchableOpacity style={styles.btnVoltar} onPress={() => router.replace('/home')}>
          <Text style={styles.btnText}>VOLTAR AO MENU</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------ STYLES ------------------ */

const PRIMARY_BLUE = '#1CB0FC';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY_BLUE },
  scrollContent: { paddingBottom: 40, alignItems: 'center' },

  title: {
    color: '#FFF',
    fontSize: 32,
    fontFamily: 'Blinker-Bold',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  resultBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
  },

  resultText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },

  highlight: { fontWeight: 'bold', fontSize: 20, color: '#FFF' },

  podiumContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  firstPlaceContainer: { alignItems: 'center' },

  winnerCard: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
    elevation: 5,
  },

  winnerAvatarCircle: {
    width: 10,
    height: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
  },

  winnerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },

  winnerPoints: {
    marginTop: 10,
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },

  rankingList: {
    width: '90%',
    maxWidth: 400,
    marginBottom: 30,
  },

  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  myRow: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: '#FFF',
  },

  rankPos: { width: 40, color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  rankUser: { flex: 1, flexDirection: 'row', alignItems: 'center' },

  rankAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  rankName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  rankPoints: { color: '#BDF8BD', fontSize: 16, fontWeight: 'bold' },

  btnVoltar: {
    width: '80%',
    backgroundColor: '#22D1EC',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 6,
    borderBottomColor: '#1FBDD5',
  },

  btnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
