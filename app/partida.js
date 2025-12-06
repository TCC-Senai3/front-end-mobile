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
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

import { Client } from '@stomp/stompjs';
import usuarioService from '../services/usuarioService';
import salaService from '../services/salaService';

const { width, height } = Dimensions.get('window');

/**
 * CountdownOverlay - componente interno simples para 3,2,1
 * recebe: segundos (default 3) e onComplete()
 */
function CountdownOverlay({ segundos = 3, onComplete, visible }) {
  const [count, setCount] = useState(segundos);

  useEffect(() => {
    if (!visible) {
      setCount(segundos);
      return;
    }

    if (count <= 0) {
      onComplete && onComplete();
      return;
    }

    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={localStyles.countdownOverlay}>
        <Text style={localStyles.countdownText}>Próxima pergunta em...</Text>
        <Text style={localStyles.countdownNumber}>{count}</Text>
      </View>
    </Modal>
  );
}

export default function PartidaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Recebe dados da navegação anterior
  const { codigoSala, idSala, idFormulario } = params;

  // --- ESTADOS DO JOGO ---
  const [perguntaAtual, setPerguntaAtual] = useState(null); 
  const [opcoes, setOpcoes] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [conectado, setConectado] = useState(false);
  const [statusJogo, setStatusJogo] = useState('AGUARDANDO'); 

  // UI states
  const [showCountdown, setShowCountdown] = useState(false);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  const stompRef = useRef(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================
  // 1) Conectar WebSocket e ouvir eventos da partida
  // ============================================================
  useEffect(() => {
    iniciarSocket();
    return () => {
      if (stompRef.current) {
        try { stompRef.current.deactivate(); } catch (e) {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [codigoSala]);

  const iniciarSocket = async () => {
    try {
      const token = await usuarioService.getToken();
      if (!token || !codigoSala) {
        Alert.alert('Erro', 'Dados da partida inválidos.');
        router.replace('/home');
        return;
      }

      const wsUrl = 'wss://tccdrakes.azurewebsites.net/ws-native';
      const client = new Client({
        brokerURL: wsUrl,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 3000,
        forceBinaryWSFrames: true,
        appendMissingNULLonIncoming: true,
        onConnect: () => {
          console.log('WS PARTIDA conectado');
          setConectado(true);

          client.subscribe(`/topic/partida/${codigoSala}`, (msg) => {
            try {
              const payload = JSON.parse(msg.body);
              console.log('EVENTO PARTIDA (WS):', payload);

              if (payload.type === 'NOVA_PERGUNTA') {
                receberNovaPerguntaDoServidor(payload.pergunta);
              }

              if (payload.type === 'RESULTADO_RESPOSTA') {
                console.log('Resultado da resposta (broadcast):', payload.resultado);
              }

              if (payload.type === 'JOGO_FINALIZADO') {
                setStatusJogo('FIM');
                Alert.alert('Fim de Jogo', 'A partida acabou.');
                router.replace('/home');
              }

              if (payload.type === 'SALA_FECHADA') {
                Alert.alert('Aviso', 'A sala foi encerrada.');
                router.replace('/home');
              }

            } catch (e) {
              console.error('Erro parse mensagem partida WS', e);
            }
          });
        },
      });

      client.activate();
      stompRef.current = client;
      setLoading(false);

    } catch (e) {
      console.error('Erro iniciarSocket:', e);
      setLoading(false);
    }
  };

  const pendingPerguntaRef = useRef(null);

  const receberNovaPerguntaDoServidor = (pergunta) => {
    setShowResultScreen(false);
    setIsCorrect(false);
    setSelectedAnswer(null);
    setBloqueado(false);

    setShowCountdown(true);
    pendingPerguntaRef.current = pergunta;
  };
  const aplicarPerguntaPendente = () => {
    const p = pendingPerguntaRef.current;
    if (!p) return;
    pendingPerguntaRef.current = null;

    const options =
      p.alternativas ||
      p.options ||
      p.opcoes ||
      p.alternativasPergunta ||
      [];

    const tempo = p.tempo || p.time || 30;

    setPerguntaAtual(p);
    setOpcoes(options);
    setTimeLeft(tempo);
    setBloqueado(false);
    setSelectedAnswer(null);
    setStatusJogo('RESPONDENDO');

    iniciarTimerPergunta();
  };

  // ============================================================
  // 3) Timer da pergunta
  // ============================================================
  const iniciarTimerPergunta = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);

          if (!bloqueado) {
            setBloqueado(true);
            enviarResposta(null);
            setIsCorrect(false);
            setShowResultScreen(true);

            setTimeout(() => {
              setShowCountdown(true);
            }, 2000);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ============================================================
  // 4) Enviar resposta para backend
  // ============================================================
  const enviarResposta = async (idAlternativa) => {
    try {
      const eu = await usuarioService.getMeuPerfil();
      const token = await usuarioService.getToken();

      const payload = {
        idSala,
        idUsuario: eu?.id,
        idPergunta: perguntaAtual?.id || perguntaAtual?.idPergunta,
        idAlternativaSelecionada: idAlternativa,
      };

      const res = await salaService.enviarResposta(payload, token);

      if (res && typeof res.correta !== 'undefined') {
        setIsCorrect(Boolean(res.correta));
        setShowResultScreen(true);
        setBloqueado(true);

        if (timerRef.current) clearInterval(timerRef.current);

        if (res.proximaPergunta) {
          setTimeout(() => {
            pendingPerguntaRef.current = res.proximaPergunta;
            setShowResultScreen(false);
            setShowCountdown(true);
          }, 1500);
        } else {
          setTimeout(() => {
            Alert.alert('Fim', 'Última pergunta.');
            router.replace('/home');
          }, 1500);
        }
      } else {
        setShowResultScreen(true);
        setIsCorrect(false);
        setBloqueado(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } catch (err) {
      console.error('Erro enviarResposta:', err);
      Alert.alert('Erro', 'Falha ao enviar resposta.');
      setBloqueado(false);
    }
  };

  // ============================================================
  // 5) Quando usuário toca em uma opção
  // ============================================================
  const handleAnswerSelect = async (indexOrOption) => {
    if (bloqueado) return;

    let indice = indexOrOption;

    if (typeof indexOrOption === 'object' && indexOrOption !== null) {
      indice =
        indexOrOption.idAlternativa ??
        indexOrOption.id ??
        indexOrOption.index ??
        null;
    }

    setSelectedAnswer(indice);
    setBloqueado(true);

    if (timerRef.current) clearInterval(timerRef.current);

    await enviarResposta(indice);
  };

  // ============================================================
  // 6) Ao terminar o countdown (3,2,1)
  // ============================================================
  const onCountdownComplete = () => {
    setShowCountdown(false);
    aplicarPerguntaPendente();
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (loading || (!conectado && !perguntaAtual)) {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={{ color: '#FFF', marginTop: 20 }}>
          {conectado ? 'Aguardando pergunta...' : 'Conectando ao jogo...'}
        </Text>

        <TouchableOpacity
          onPress={() => router.replace('/home')}
          style={{ marginTop: 30 }}
        >
          <Text style={{ color: '#FF0000' }}>Sair</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader showMenu={true} menuPosition="right" />

      <CountdownOverlay
        segundos={3}
        visible={showCountdown}
        onComplete={onCountdownComplete}
      />

      <Modal visible={showResultScreen} transparent animationType="fade">
        <View style={localStyles.resultOverlay}>
          <View style={localStyles.resultCard}>
            <Text style={localStyles.resultText}>
              {isCorrect ? 'Correto ✓' : 'Errado ✕'}
            </Text>
          </View>
        </View>
      </Modal>

      <View style={styles.headerControls}>
        <View style={styles.timerButton}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>

        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => {
            Alert.alert('Sair', 'Deseja sair da partida?', [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Sim',
                style: 'destructive',
                onPress: () => router.replace('/home'),
              },
            ]);
          }}
        >
          <Text style={styles.exitText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.categoryTitle}>
            {perguntaAtual?.categoria ||
              perguntaAtual?.tema ||
              'PERGUNTA'}
          </Text>

          <Text style={styles.questionText}>
            {perguntaAtual?.enunciado ||
              perguntaAtual?.question ||
              perguntaAtual?.textoPergunta ||
              '...'}
          </Text>

          <View style={styles.optionsContainer}>
            {opcoes && opcoes.length > 0 ? (
              opcoes.map((opt, idx) => {
                const label =
                  typeof opt === 'string'
                    ? opt
                    : opt.textoAlternativa ||
                      opt.text ||
                      opt.label ||
                      JSON.stringify(opt);

                const optId =
                  typeof opt === 'string'
                    ? idx
                    : opt.idAlternativa ?? opt.id ?? idx;

                const selected =
                  String(selectedAnswer) === String(optId);

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionButton,
                      selected && styles.optionButtonSelected,
                      bloqueado &&
                        !selected && { opacity: 0.6 },
                    ]}
                    onPress={() => handleAnswerSelect(optId)}
                    disabled={bloqueado}
                  >
                    <Text style={styles.optionText}>{label}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={{ textAlign: 'center' }}>
                Nenhuma opção disponível
              </Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}


/* ============================
   STYLES (mantive sua paleta)
   ============================ */
const PRIMARY_BLUE = '#1CB0FC';
const DARK_BLUE = '#01324B';
const RED = '#FF0000';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#3B3939';
const OPTION_BLUE = '#00B7FF';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PRIMARY_BLUE,
  },
  headerControls: {
    position: 'absolute',
    top: height * 0.12,
    right: 20,
    zIndex: 10,
    alignItems: 'flex-end',
  },
  timerButton: {
    backgroundColor: DARK_BLUE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  exitButton: {
    backgroundColor: RED,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  exitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
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
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 20,
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
  optionsContainer: {
    gap: 12,
  },
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

/* ============================
   Overlays e Modais
   ============================ */
const localStyles = StyleSheet.create({
  countdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 14,
    fontFamily: 'Poppins-Regular',
  },
  countdownNumber: {
    color: '#FFD700',
    fontSize: 96,
    fontWeight: '900',
  },
  resultOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: 260,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
});
