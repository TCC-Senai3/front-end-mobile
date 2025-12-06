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
  ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Componentes Gerais
import CustomHeader from '../components/CustomHeader';

// --- COMPONENTES DO JOGO (Importe dos arquivos que você criou) ---
import CountdownOverlay from '../components/CountdownOverlay';
import WaitingOverlay from '../components/WaitingOverlay';
import Verified from '../app/verified.js'; // Nome do arquivo enviado foi 'verified.js'
import ErrorScreen from '../app/error.js'; // Nome do arquivo enviado foi 'error.js'

// Serviços e Socket
import { Client } from '@stomp/stompjs';
import usuarioService from '../services/usuarioService';
import { getFormularioById } from '../services/formulariosService'; 
// Se você não tiver o partidaService com enviarResposta, pode comentar a chamada por enquanto
import { enviarResposta } from '../services/formulariosService.js'; 

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
  // 'LOADING' | 'COUNTDOWN' | 'PLAYING' | 'RESULT'
  const [gameState, setGameState] = useState('LOADING'); 
  
  const [timeLeft, setTimeLeft] = useState(20); 
  const [selectedAnswer, setSelectedAnswer] = useState(null); // ID da alternativa selecionada
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Pontuação (opcional, para controle local)
  const [acertos, setAcertos] = useState(0);

  const stompClientRef = useRef(null);
  const timerRef = useRef(null);

  // Formatação de tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================
  // 1. CARGA INICIAL
  // ============================================================
  useEffect(() => {
    const inicializar = async () => {
      try {
        const token = await usuarioService.getToken();
        if (!token) throw new Error("Sem token");

        // Busca o Quiz
        const dados = await getFormularioById(initialIdFormulario, token);
        if (dados && dados.perguntas && dados.perguntas.length > 0) {
            setPerguntas(dados.perguntas);
            // Tudo pronto, inicia a contagem para a 1ª pergunta
            setGameState('COUNTDOWN');
        } else {
            Alert.alert("Erro", "Quiz vazio.");
            router.replace('/home');
        }

        // Conecta WS (para ouvir fim de jogo forçado)
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
                         router.replace('/home');
                     }
                 } catch(e){}
             });
          }
        });
        client.activate();
        stompClientRef.current = client;

      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Falha ao carregar partida.");
        router.replace('/home');
      }
    };
    inicializar();

    return () => {
        if (stompClientRef.current) stompClientRef.current.deactivate();
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ============================================================
  // 2. CONFIGURAR PERGUNTA (Quando sai do Countdown)
  // ============================================================
  const iniciarPergunta = () => {
      // Define tempo da pergunta (padrão 20s ou o que vier do back)
      const tempo = perguntaAtual?.tempo || 20; 
      setTimeLeft(tempo);
      setGameState('PLAYING');
  };

  // ============================================================
  // 3. TIMER (Roda durante 'PLAYING')
  // ============================================================
  useEffect(() => {
    // O timer deve rodar se estamos jogando (mesmo se o usuário já respondeu e está vendo o overlay)
    if (gameState === 'PLAYING' && timeLeft > 0) {
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    finalizarRodada(); // Tempo acabou
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  // ============================================================
  // 4. LÓGICA DE RESPOSTA (Usuário clicou)
  // ============================================================
  const handleAnswerSelect = async (alternativa) => {
      // Se já respondeu ou o tempo acabou, ignora
      if (selectedAnswer !== null || gameState !== 'PLAYING' || timeLeft <= 0) return;

      setSelectedAnswer(alternativa.idAlternativa);

      // Envia resposta ao backend (Sem esperar, para não travar UI)
      try {
          const eu = await usuarioService.getMeuPerfil();
          const token = await usuarioService.getToken();
          
          const payload = {
              idUsuario: eu.id,
              idPergunta: perguntaAtual.idPergunta || perguntaAtual.id,
              idAlternativaSelecionada: alternativa.idAlternativa,
              tempoGasto: (perguntaAtual?.tempo || 20) - timeLeft, // Tempo que levou
              idSala: idSala
          };
          
          // Função importada do seu service (opcional se não tiver implementado ainda)
          if (enviarResposta) {
             enviarResposta(payload, token).catch(err => console.log("Erro envio resposta:", err));
          }
      } catch (e) { console.log(e); }

      // Nota: Não mudamos o gameState aqui. O usuário vê o WaitingOverlay, 
      // mas o timer (useEffect acima) continua rodando até zerar.
  };

  // ============================================================
  // 5. FINALIZAR RODADA (Tempo Esgotou)
  // ============================================================
  const finalizarRodada = () => {
      // Verifica se acertou
      let acertou = false;
      
      // Se o usuário não respondeu, conta como erro
      if (selectedAnswer !== null) {
          const altEscolhida = perguntaAtual.alternativas.find(a => a.idAlternativa === selectedAnswer);
          if (altEscolhida && altEscolhida.correta) {
              acertou = true;
              setAcertos(prev => prev + 1);
          }
      }

      setIsCorrect(acertou);
      setGameState('RESULT'); // Mostra tela de Verified ou Error

      // Aguarda 3 segundos vendo o resultado e vai para próxima
      setTimeout(prepararProxima, 3000);
  };

  // ============================================================
  // 6. PREPARAR PRÓXIMA (Ou Fim)
  // ============================================================
  const prepararProxima = () => {
      if (currentQuestionIndex < perguntas.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null); // Limpa resposta
          setGameState('COUNTDOWN'); // Inicia contagem 3,2,1
      } else {
          // Fim do Jogo
          Alert.alert("Fim de Jogo", `Você acertou ${acertos} de ${perguntas.length}!`, [
              { text: "Sair", onPress: () => router.replace('/home') }
          ]);
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

  // 1. Loading Inicial
  if (gameState === 'LOADING') {
      return (
        <SafeAreaView style={[styles.safeArea, { justifyContent:'center', alignItems:'center'}]}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={{color:'#FFF', marginTop:10, fontFamily:'Poppins-Bold'}}>Carregando Quiz...</Text>
        </SafeAreaView>
      );
  }

  // 2. Tela de Resultado (Importada)
  // O componente ocupa a tela toda, então retornamos ele direto
  if (gameState === 'RESULT') {
      return isCorrect ? <Verified /> : <ErrorScreen />;
  }

  // 3. Contagem Regressiva (3, 2, 1)
  // Usa o seu componente CountdownOverlay
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

  // 4. Tela do Jogo (Pergunta)
  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader showMenu={true} menuPosition="right" />
      
      {/* Timer e Botão Sair */}
      <View style={styles.headerControls}>
        <View style={styles.timerButton}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      {/* Card da Pergunta */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          
          {/* OVERLAY DE ESPERA: Aparece se já respondeu, mas ainda estamos em 'PLAYING' (tempo não acabou) */}
          {selectedAnswer !== null && gameState === 'PLAYING' && (
             <WaitingOverlay />
          )}

          {/* Contador de Questão */}
          <Text style={styles.counterText}>
              Questão {currentQuestionIndex + 1} / {perguntas.length}
          </Text>

          {/* Título/Tema */}
          <Text style={styles.categoryTitle}>
            {perguntaAtual.tema ? perguntaAtual.tema.nomeTema : 'QUIZ'}
          </Text>
          
          {/* Texto da Pergunta */}
          <Text style={styles.questionText}>
            {perguntaAtual.textoPergunta}
          </Text>
          
          {/* Alternativas */}
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
                  // Só clica se ainda não escolheu nenhuma
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

// ============================================================
// ESTILOS
// ============================================================
const PRIMARY_BLUE = '#1CB0FC';
const DARK_BLUE = '#01324B';
const RED = '#FF0000';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#3B3939';
const OPTION_BLUE = '#00B7FF';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY_BLUE },
  
  // Header Controls
  headerControls: {
    position: 'absolute',
    top: height * 0.12,
    right: 20,
    zIndex: 5, // Menor que o overlay
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
    backgroundColor: RED,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  exitText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
  
  // Card
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
    // Importante para o WaitingOverlay ficar preso dentro do card
    overflow: 'hidden', 
    position: 'relative' 
  },
  
  // Textos
  counterText: {
      textAlign: 'center',
      color: '#888',
      marginBottom: 5,
      fontFamily: 'Poppins-Regular'
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: TEXT_DARK,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center'
  },
  
  // Opções
  optionsContainer: { gap: 12 },
  optionButton: {
    backgroundColor: OPTION_BLUE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionButtonSelected: {
    backgroundColor: '#1D4ED8', // Azul mais escuro para indicar seleção
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