// app/partida.js

// 1. POLYFILL OBRIGATÓRIO
import * as TextEncoding from 'text-encoding';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoding.TextEncoder;
  global.TextDecoder = TextEncoding.TextDecoder;
}

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Componentes
import CustomHeader from '../components/CustomHeader';
import CountdownOverlay from '../components/CountdownOverlay';
import WaitingOverlay from '../components/WaitingOverlay';
import Verified from '../app/verified.js';
import ErrorScreen from '../app/error.js';

// Serviços e WebSocket
import { Client } from '@stomp/stompjs';
import usuarioService from '../services/usuarioService';
import salaService from '../services/salaService';
import { getFormularioById, enviarResposta as enviarRespostaService } from '../services/formulariosService';

const { width, height } = Dimensions.get('window');

export default function PartidaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parâmetros esperados:
  // codigoSala: PIN / código
  // idSala: id numérico da sala (opcional)
  // idFormulario: id do formulário (opcional, recuperável via sala)
  const { codigoSala, idSala: paramIdSala } = params;
  let initialIdFormulario = params.idFormulario;

  // Estado
  const [perguntas, setPerguntas] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const perguntaAtual = perguntas[currentQuestionIndex];

  const [gameState, setGameState] = useState('LOADING'); // LOADING | COUNTDOWN | PLAYING | WAITING_TIME | RESULT
  const [statusText, setStatusText] = useState('Carregando Quiz...');
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // idAlternativa
  const [isCorrect, setIsCorrect] = useState(false);
  const [acertos, setAcertos] = useState(0);

  const stompClientRef = useRef(null);
  const timerRef = useRef(null);
  const resolvedIdSalaRef = useRef(paramIdSala || null); // guarda idSala real após recuperar

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ---------- Inicialização: pegar formulário (fallback para sala) e conectar WS ----------
  useEffect(() => {
    let mounted = true;

    const inicializar = async () => {
      try {
        const token = await usuarioService.getToken();
        if (!token) throw new Error('Usuário não autenticado.');

        let finalIdFormulario = initialIdFormulario;
        // Se não vier id do formulário, tenta recuperar pela sala
        if (!finalIdFormulario || finalIdFormulario === 'undefined') {
          setStatusText('Sincronizando dados da sala...');
          const dadosSala = await salaService.getSalaByPin(codigoSala, token);
          if (!dadosSala) throw new Error('Sala não encontrada.');

          // salva idSala resolvido para uso posterior
          resolvedIdSalaRef.current = dadosSala.idSala ?? dadosSala.id ?? resolvedIdSalaRef.current;

          // pega idFormulario em possíveis formatos
          if (dadosSala.idFormulario) finalIdFormulario = dadosSala.idFormulario;
          else if (dadosSala.formulario && (dadosSala.formulario.idFormulario || dadosSala.formulario.id)) {
            finalIdFormulario = dadosSala.formulario.idFormulario ?? dadosSala.formulario.id;
          }
        }

        if (!finalIdFormulario) {
          throw new Error('ID do formulário inválido.');
        }

        setStatusText('Baixando perguntas...');
        const dados = await getFormularioById(finalIdFormulario, token);

        if (!dados || !Array.isArray(dados.perguntas) || dados.perguntas.length === 0) {
          throw new Error('Este quiz não tem perguntas.');
        }

        if (!mounted) return;
        setPerguntas(dados.perguntas);
        setGameState('COUNTDOWN');

        // Conectar WebSocket para escutar fim de jogo / sala fechada
        try {
          const wsUrl = 'wss://tccdrakes.azurewebsites.net/ws-native';
          const client = new Client({
            brokerURL: wsUrl,
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            onConnect: () => {
              // tópico específico do game (pode variar no backend)
              client.subscribe(`/topic/sala/${codigoSala}/game`, (msg) => {
                try {
                  const pl = JSON.parse(msg.body);
                  if (pl.type === 'FIM_DE_JOGO' || pl.type === 'SALA_FECHADA') {
                    Alert.alert('Aviso', 'O jogo foi encerrado.');
                    router.replace('/jogo');
                  }
                } catch (e) {
                  // ignore parse error
                }
              });
            },
          });
          client.activate();
          stompClientRef.current = client;
        } catch (err) {
          console.warn('WS: falha ao conectar (não bloqueante):', err);
        }
      } catch (error) {
        console.error('Erro fatal:', error);
        Alert.alert('Erro', error.message || 'Falha ao carregar partida.', [
          { text: 'Sair', onPress: () => router.replace('/jogo') },
        ]);
      }
    };

    inicializar();

    return () => {
      mounted = false;
      if (stompClientRef.current) {
        try {
          stompClientRef.current.deactivate();
        } catch (e) {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ---------- Iniciar pergunta (quando COUNTDOWN termina) ----------
  const iniciarPergunta = () => {
    const tempo = perguntaAtual?.tempo || 20;
    setTimeLeft(tempo);
    setGameState('PLAYING');
    setSelectedAnswer(null);
    setIsCorrect(false);
  };

  // ---------- Timer (roda durante PLAYING ou WAITING_TIME) ----------
  useEffect(() => {
    if ((gameState === 'PLAYING' || gameState === 'WAITING_TIME') && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finalizarRodada();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  // ---------- Envio de resposta (NÃO inclui respostaCorreta) ----------
  const handleAnswerSelect = async (alternativa) => {
    if (selectedAnswer !== null || gameState !== 'PLAYING' || timeLeft <= 0) return;

    setSelectedAnswer(alternativa.idAlternativa);
    setGameState('WAITING_TIME'); // mostra overlay local

    try {
      const eu = await usuarioService.getMeuPerfil();
      const token = await usuarioService.getToken();

      // monta o payload EXATAMENTE sem respostaCorreta (você pediu assim)
      const payload = {
        idUsuario: eu.id,
        idPergunta: perguntaAtual.idPergunta ?? perguntaAtual.id,
        idAlternativaSelecionada: alternativa.idAlternativa,
        tempoGasto: (perguntaAtual?.tempo || 20) - timeLeft,
        idSala: resolvedIdSalaRef.current ?? paramIdSala ?? null,
      };

      // faz a chamada ao service — sem aguardar para não travar UI
      if (typeof enviarRespostaService === 'function') {
        enviarRespostaService(payload, token).catch((err) => {
          // apenas log — não bloqueia a UI
          console.warn('Erro ao enviar resposta (não crítico):', err);
        });
      }

      // atualiza acertos localmente usando informação do formulário (se estiver disponível)
      try {
        const altEscolhida = perguntaAtual.alternativas.find(a => a.idAlternativa === alternativa.idAlternativa);
        if (altEscolhida && altEscolhida.correta) {
          setAcertos(prev => prev + 1);
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
        }
      } catch (e) {
        // se algo estranho ocorrer, mantém flow normal (backend calcula de verdade)
      }

      // observa: não mudamos para RESULT aqui — o timer chamará finalizarRodada quando zerar,
      // porém você também pode querer mostrar o resultado imediatamente; deixei a lógica pelo timer
    } catch (e) {
      console.warn('Erro no handleAnswerSelect:', e);
    }
  };

  // ---------- Finalizar rodada ----------
  const finalizarRodada = () => {
    // Se já tínhamos marcado selectedAnswer, já atualizamos acertos localmente no envio.
    // Caso o usuário não tenha respondido, contaremos como errado (acertos não incrementados).
    setGameState('RESULT'); // mostra Verified ou Error conforme isCorrect
    // Vai para próxima após 2s
    setTimeout(prepararProxima, 2000);
  };

  // ---------- Preparar próxima / fim ----------
  const prepararProxima = () => {
    if (currentQuestionIndex < perguntas.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(false);
      setGameState('COUNTDOWN');
    } else {
      // Fim do jogo — navega para a tela de fim passando dados
      router.replace({
        pathname: '/fim-de-jogo',
        params: {
          acertos: acertos,
          total: perguntas.length,
          codigoSala: codigoSala,
          idSala: resolvedIdSalaRef.current ?? paramIdSala ?? null,
        },
      });
    }
  };

  const handleExit = () => {
    Alert.alert('Sair', 'Deseja sair da partida?', [
      { text: 'Não' },
      { text: 'Sim', onPress: () => router.replace('/jogo') },
    ]);
  };

  // ---------------- RENDER ----------------
  if (gameState === 'LOADING') {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={{ color: '#FFF', marginTop: 10, fontFamily: 'Poppins-Bold' }}>{statusText}</Text>
      </SafeAreaView>
    );
  }

  if (gameState === 'RESULT') {
    // mostra o componente full-screen de resultado
    return isCorrect ? <Verified /> : <ErrorScreen />;
  }

  if (gameState === 'COUNTDOWN') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CountdownOverlay segundos={3} onComplete={iniciarPergunta} />
      </SafeAreaView>
    );
  }

  if (!perguntaAtual) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FFF' }}>Aguardando pergunta...</Text>
      </SafeAreaView>
    );
  }

  // Tela de Pergunta
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1CB0FC" />
      <CustomHeader showMenu={true} menuPosition="right" />

      <View style={styles.headerControls}>
        <View style={styles.timerButton}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {selectedAnswer !== null && gameState === 'WAITING_TIME' && <WaitingOverlay />}

          <Text style={styles.counterText}>
            Questão {currentQuestionIndex + 1} / {perguntas.length}
          </Text>

          <Text style={styles.categoryTitle}>
            {perguntaAtual.tema ? perguntaAtual.tema.nomeTema : 'QUIZ'}
          </Text>

          <Text style={styles.questionText}>{perguntaAtual.textoPergunta}</Text>

          <View style={styles.optionsContainer}>
            {perguntaAtual.alternativas &&
              perguntaAtual.alternativas.map((alt) => {
                const isSelected = selectedAnswer === alt.idAlternativa;
                return (
                  <TouchableOpacity
                    key={alt.idAlternativa}
                    style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                    onPress={() => !selectedAnswer && handleAnswerSelect(alt)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.optionText}>{alt.textoAlternativa}</Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ---------- STYLES ----------
const PRIMARY_BLUE = '#1CB0FC';
const DARK_BLUE = '#01324B';
const OPTION_BLUE = '#00B7FF';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#3B3939';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY_BLUE },
  headerControls: {
    position: 'absolute',
    top: height * 0.12,
    right: 20,
    zIndex: 5,
    alignItems: 'flex-end',
  },
  timerButton: {
    backgroundColor: DARK_BLUE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  timerText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
  exitButton: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  exitText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },

  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    position: 'relative',
  },

  counterText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: TEXT_DARK,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },

  optionsContainer: { gap: 12 },
  optionButton: {
    backgroundColor: OPTION_BLUE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionButtonSelected: {
    backgroundColor: '#1D4ED8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
});
