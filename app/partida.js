// app/partida.js

// 1. POLYFILL OBRIGATÓRIO
import * as TextEncoding from 'text-encoding';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoding.TextEncoder;
  global.TextDecoder = TextEncoding.TextDecoder;
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions, 
  Alert, 
  ActivityIndicator,
  StatusBar // ✅ CORREÇÃO: ADICIONADO AQUI
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Componentes Gerais
import CustomHeader from '../components/CustomHeader';

// --- COMPONENTES DO JOGO ---
import CountdownOverlay from '../components/CountdownOverlay';
import WaitingOverlay from '../components/WaitingOverlay';
import Verified from '../app/verified.js'; 
import ErrorScreen from '../app/error.js'; 

// Serviços e Socket
import { Client } from '@stomp/stompjs';
import usuarioService from '../services/usuarioService';
import { getFormularioById } from '../services/formulariosService'; 
import { enviarResposta } from '../services/formulariosService.js'; 
import salaService from '../services/salaService'; 

const { width, height } = Dimensions.get('window');

export default function PartidaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { codigoSala, idSala } = params;
  let initialIdFormulario = params.idFormulario;

  // --- ESTADOS DE DADOS ---
  const [perguntas, setPerguntas] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const perguntaAtual = perguntas[currentQuestionIndex];

  // --- ESTADOS DO FLUXO DO JOGO ---
  const [gameState, setGameState] = useState('LOADING'); 
  const [statusText, setStatusText] = useState("Carregando Quiz...");
  
  const [timeLeft, setTimeLeft] = useState(20); 
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const [isCorrect, setIsCorrect] = useState(false);
  const [acertos, setAcertos] = useState(0);

  const stompClientRef = useRef(null);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================
  // 1. CARGA INICIAL (COM RECUPERAÇÃO DE FALHA)
  // ============================================================
  useEffect(() => {
    const inicializar = async () => {
      try {
        const token = await usuarioService.getToken();
        if (!token) throw new Error("Usuário não autenticado.");

        let finalIdFormulario = initialIdFormulario;

        // Recuperação de falha: Se não veio ID, busca na sala
        if (!finalIdFormulario || finalIdFormulario === 'undefined') {
            console.log("⚠️ ID do formulário perdido. Recuperando dados da sala...");
            setStatusText("Sincronizando dados...");
            
            try {
                const dadosSala = await salaService.getSalaByPin(codigoSala, token);
                
                if (dadosSala?.idFormulario) {
                    finalIdFormulario = dadosSala.idFormulario;
                } else if (dadosSala?.formulario?.idFormulario) {
                    finalIdFormulario = dadosSala.formulario.idFormulario;
                } else if (dadosSala?.formulario?.id) {
                    finalIdFormulario = dadosSala.formulario.id;
                }
                
                console.log("✅ ID do Formulário recuperado:", finalIdFormulario);
            } catch (errSala) {
                console.error("Erro ao recuperar sala:", errSala);
                throw new Error("Não foi possível encontrar os dados da partida.");
            }
        }

        if (!finalIdFormulario) {
            throw new Error("ID do formulário inválido.");
        }

        setStatusText("Baixando perguntas...");
        const dados = await getFormularioById(finalIdFormulario, token);
        
        if (dados && dados.perguntas && dados.perguntas.length > 0) {
            setPerguntas(dados.perguntas);
            setGameState('COUNTDOWN');
        } else {
            throw new Error("Este quiz não tem perguntas.");
        }

        // WebSocket
        const wsUrl = 'wss://tccdrakes.azurewebsites.net/ws-native';
        const client = new Client({
          brokerURL: wsUrl,
          connectHeaders: { Authorization: `Bearer ${token}` },
          reconnectDelay: 5000,
          forceBinaryWSFrames: true,
          appendMissingNULLonIncoming: true,
          onConnect: () => {
             client.subscribe(`/topic/sala/${codigoSala}/game`, (msg) => {
                 try {
                     const pl = JSON.parse(msg.body);
                     if (pl.type === 'FIM_DE_JOGO' || pl.type === 'SALA_FECHADA') {
                         Alert.alert("Aviso", "O jogo foi encerrado.");
                         router.replace('/home');
                     }
                 } catch(e){}
             });
          }
        });
        client.activate();
        stompClientRef.current = client;

      } catch (error) {
        console.error("Erro fatal:", error);
        Alert.alert("Erro", error.message || "Falha ao carregar partida.", [
            { text: "Sair", onPress: () => router.replace('/home') }
        ]);
      }
    };
    inicializar();

    return () => {
        if (stompClientRef.current) stompClientRef.current.deactivate();
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ============================================================
  // 2. CONFIGURAR PERGUNTA
  // ============================================================
  const iniciarPergunta = () => {
      const tempo = perguntaAtual?.tempo || 20; 
      setTimeLeft(tempo);
      setGameState('PLAYING');
  };

  // ============================================================
  // 3. TIMER
  // ============================================================
  useEffect(() => {
    // Timer roda no jogo e no overlay de espera
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

  // ============================================================
  // 4. RESPOSTA DO USUÁRIO
  // ============================================================
  const handleAnswerSelect = async (alternativa) => {
      if (selectedAnswer !== null || gameState !== 'PLAYING' || timeLeft <= 0) return;

      setSelectedAnswer(alternativa.idAlternativa);
      setGameState('WAITING_TIME'); // Mostra overlay

      try {
          const eu = await usuarioService.getMeuPerfil();
          const token = await usuarioService.getToken();
          const payload = {
              idUsuario: eu.id,
              idPergunta: perguntaAtual.idPergunta || perguntaAtual.id,
              idAlternativaSelecionada: alternativa.idAlternativa,
              tempoGasto: (perguntaAtual?.tempo || 20) - timeLeft,
              idSala: idSala
          };
          if (enviarResposta) {
             enviarResposta(payload, token).catch(() => {});
          }
      } catch (e) {}
  };

  // ============================================================
  // 5. FINALIZAR RODADA
  // ============================================================
  const finalizarRodada = () => {
      let acertou = false;
      if (selectedAnswer !== null) {
          const altEscolhida = perguntaAtual.alternativas.find(a => a.idAlternativa === selectedAnswer);
          if (altEscolhida && altEscolhida.correta) {
              acertou = true;
              setAcertos(prev => prev + 1);
          }
      }

      setIsCorrect(acertou);
      setGameState('RESULT'); 

      setTimeout(prepararProxima, 3000);
  };

  // ============================================================
  // 6. PRÓXIMA PERGUNTA
  // ============================================================
  const prepararProxima = () => {
      if (currentQuestionIndex < perguntas.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null); 
          setGameState('COUNTDOWN'); 
      } else {
          router.replace({
            pathname: '/fim-de-jogo',
            params: { 
                acertos: acertos, 
                total: perguntas.length,
                codigoSala: codigoSala,
                idSala: idSala
            }
          });
      }
  };

  const handleExit = () => {
      Alert.alert("Sair", "Deseja sair da partida?", [
          { text: "Não" },
          { text: "Sim", onPress: () => router.replace('/home') }
      ]);
  };

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================

  if (gameState === 'LOADING') {
      return (
        <SafeAreaView style={[styles.safeArea, { justifyContent:'center', alignItems:'center'}]}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={{color:'#FFF', marginTop:10, fontFamily:'Poppins-Bold'}}>
                {statusText}
            </Text>
        </SafeAreaView>
      );
  }

  if (gameState === 'RESULT') {
      return isCorrect ? <Verified /> : <ErrorScreen />;
  }

  if (gameState === 'COUNTDOWN') {
      return (
        <SafeAreaView style={styles.safeArea}>
             <CountdownOverlay 
                segundos={3} 
                onComplete={iniciarPergunta} 
             />
        </SafeAreaView>
      );
  }

  if (!perguntaAtual) return null;

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
          
          {selectedAnswer !== null && gameState === 'WAITING_TIME' && (
             <WaitingOverlay />
          )}

          <Text style={styles.counterText}>
              Questão {currentQuestionIndex + 1} / {perguntas.length}
          </Text>

          <Text style={styles.categoryTitle}>
            {perguntaAtual.tema ? perguntaAtual.tema.nomeTema : 'QUIZ'}
          </Text>
          
          <Text style={styles.questionText}>
            {perguntaAtual.textoPergunta}
          </Text>
          
          <View style={styles.optionsContainer}>
            {perguntaAtual.alternativas && perguntaAtual.alternativas.map((alt) => {
              const isSelected = selectedAnswer === alt.idAlternativa;
              return (
                <TouchableOpacity
                  key={alt.idAlternativa}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected
                  ]}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1CB0FC' },
  headerControls: {
    position: 'absolute',
    top: height * 0.12,
    right: 20,
    zIndex: 5,
    alignItems: 'flex-end',
  },
  timerButton: {
    backgroundColor: '#01324B',
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
    backgroundColor: '#FFFFFF',
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
    position: 'relative' 
  },
  counterText: {
      textAlign: 'center',
      color: '#888',
      marginBottom: 5,
      fontFamily: 'Poppins-Regular'
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#3B3939',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#3B3939',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center'
  },
  optionsContainer: { gap: 12 },
  optionButton: {
    backgroundColor: '#00B7FF',
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