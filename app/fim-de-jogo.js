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

// Troféu
import TrophyIcon from '../components/icons/campeao1Icon';

const { width } = Dimensions.get('window');

export default function FimDeJogo() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Dados vindos da partida
  const acertos = Number(params.acertos || 0);
  const total = Number(params.total || 0);

  // ID da sala pode vir como string, arrumamos aqui
  const idSalaParam = params.idSala ? Number(params.idSala) : null;

  const [idSala, setIdSala] = useState(idSalaParam);
  const [ranking, setRanking] = useState([]);
  const [podiumData, setPodiumData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);

  // Avatares
  const avatarMap = {
    'bode': BodeIcon, 'bode.svg': BodeIcon,
    'pato': PatoIcon, 'pato.svg': PatoIcon,
    'canetabic': CanetabicIcon, 'canetabic.svg': CanetabicIcon,
    'caneta': CanetabicIcon
  };

  const getAvatarComponent = (name) => {
    if (!name) return Userprofile2Icon;
    const clean = String(name).trim().toLowerCase().replace('.svg', '');
    return avatarMap[clean] || Userprofile2Icon;
  };

  // Carregar ranking completo
  useEffect(() => {
    const carregarRanking = async () => {
      try {
        setLoading(true);

        const token = await usuarioService.getToken();
        const user = await usuarioService.getMeuPerfil();
        setCurrentUser(user);

        // Se idSala vier errado, não quebra
        const id = Number(idSala) || Number(idSalaParam);
        setIdSala(id);

        const dadosRanking = await rankingSalaService.getRankingSala(id, token);

        // Normalizar dados
        const organizado = (dadosRanking || [])
          .map((jogador, index) => ({
            id: jogador.id ?? jogador.idUsuario ?? index,
            nome: jogador.nomeUsuario ?? jogador.nome ?? "Anônimo",
            avatar: jogador.avatar ?? null,
            pontos: Number(jogador.pontuacao ?? jogador.pontos ?? 0)
          }))
          .sort((a, b) => b.pontos - a.pontos)
          .map((item, index) => ({
            ...item,
            posicao: index + 1
          }));

        setRanking(organizado);
        setPodiumData(organizado.slice(0, 3));

      } catch (err) {
        console.log("❌ Erro ao buscar ranking:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarRanking();
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
                    return <Avatar width={50} height={50} />;
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
              const isMe = Number(currentUser?.id) === Number(jogador.id);

              return (
                <View 
                  key={jogador.id}
                  style={[styles.rankingRow, isMe && styles.myRow]}
                >
                  <Text style={styles.rankPos}>#{jogador.posicao}</Text>

                  <View style={styles.rankUser}>
                    <View style={styles.rankAvatar}>
                      <Avatar width={50} height={50} />
                    </View>
                    <Text style={styles.rankName}>
                      {isMe ? `${jogador.nome} (Você)` : jogador.nome}
                    </Text>
                  </View>

                  <Text style={styles.rankPoints}>{jogador.pontos} pts</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* BOTÃO VOLTAR */}
        <TouchableOpacity 
          style={styles.btnVoltar} 
          onPress={() => router.replace('/home')}
        >
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

  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center'
  },

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

  highlight: { 
    fontWeight: 'bold', 
    fontSize: 20, 
    color: '#FFF' 
  },

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

  firstPlaceContainer: { 
    alignItems: 'center' 
  },

  winnerCard: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },

  winnerAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
   
  },

  winnerName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333',
    marginRight: 40,
    marginlefth: 50

  },

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

  rankPos: { 
    width: 40, 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

  rankUser: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  rankAvatar: { 
    
    marginRight: 30,
    justifyContent: 'center',
    alignItems: 'center', 
  },

  rankName: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

  rankPoints: { 
    color: '#BDF8BD', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

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
