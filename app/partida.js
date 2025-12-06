// app/partida.js

import * as TextEncoding from 'text-encoding';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoding.TextEncoder;
  global.TextDecoder = TextEncoding.TextDecoder;
}

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

// Ícones
import { CancelIcon } from '../components/icons/icon'; 
import VerifiedIcon from '../components/icons/VerifiedIcon';

import { Client } from '@stomp/stompjs';
import usuarioService from '../services/usuarioService';
import { getFormularioById } from '../services/formulariosService'; 
import salaService from '../services/salaService';

const { width, height } = Dimensions.get('window');

// --- COMPONENTES DE FEEDBACK (CORRETO / ERRADO) ---

const CorrectScreen = () => (
  <SafeAreaView style={styles.feedbackContainer}>
    <CustomHeader title="" showMenu={true} menuPosition="right" />
    <View style={styles.content}>
      <View style={styles.verifiedImageWrapper}>
        <VerifiedIcon width={225} height={225} />
      </View>
      <Text style={styles.correctText}>CORRETO!</Text>
    </View>
  </SafeAreaView>
);

const ErrorScreen = () => (
  <SafeAreaView style={styles.feedbackContainer}>
    <CustomHeader title="" showMenu={true} menuPosition="right" />
    <View style={styles.content}>
      <CancelIcon style={styles.cancelImage} width={200} height={200} />
      <Text style={styles.errorText}>ERRADO!</Text>
    </View>
  </SafeAreaView>
);

// --- TELA PRINCIPAL DA PARTIDA ---

export default function PartidaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { codigoSala, idSala } = params;
  let initialIdFormulario = params.idFormulario;

  // Estados do Jogo
  const [perguntas, setPerguntas] = useState([]); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20); 
  const [bloqueado, setBloqueado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("Preparando o jogo...");
  
  // Estados de Controle Visual
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [showResult, setShowResult] = useState(null); // 'correct' | 'error' | null

  const stompClientRef = useRef(null);
  const timerRef = useRef(null);

  const perguntaAtual = perguntas[currentQuestionIndex];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. INICIALIZAÇÃO
  useEffect(() => {
    const inicializar = async () => {
      try {
        const token = await usuarioService.getToken();
        if (!token) throw new Error("Usuário não autenticado.");

        let finalIdFormulario = initialIdFormulario;

        // Recupera ID do formulário se necessário
        if (!finalIdFormulario) {
            setStatusText("Sincronizando dados...");
            const dadosSala = await salaService.getSalaByPin(codigoSala, token);
            if (dadosSala && dadosSala.idFormulario) {
                finalIdFormulario = dadosSala.idFormulario;
            } else if (dadosSala && dadosSala.formulario && dadosSala.formulario.idFormulario) {
                 finalIdFormulario = dadosSala.formulario.idFormulario;
            } else {
                throw new Error("Não foi possível identificar o formulário.");
            }
        }

        // Busca Perguntas
        setStatusText("Carregando perguntas...");
        const formularioData = await getFormularioById(finalIdFormulario, token); 
        
        if (formularioData && formularioData.perguntas && formularioData.perguntas.length > 0) {
            setPerguntas(formularioData.perguntas);
        } else {
            throw new Error("O formulário não possui perguntas.");
        }

        setLoading(false);

        // Conecta WS
        const wsUrl = 'wss://tccdrakes.azurewebsites.net/ws-native';
        const client = new Client({
          brokerURL: wsUrl,
          connectHeaders: { Authorization: `Bearer ${token}` },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          forceBinaryWSFrames: true,
          appendMissingNULLonIncoming: true,
          onConnect: () => {
            client.subscribe(`/topic/sala/${codigoSala}/game`, (msg) => {
                try {
                    const payload = JSON.parse(msg.body);
                    if (payload.type === 'FIM_DE_JOGO') {
                        router.replace('/home');
                    }
                } catch(e) {}
            });
          }
        });

        client.activate();
        stompClientRef.current = client;

      } catch (error) {
        Alert.alert("Erro", error.message || "Falha ao carregar o jogo.", [
            { text: "Voltar", onPress: () => router.replace('/home') }
        ]);
      }
    };

    inicializar();

    return () => {
      if (stompClientRef.current) stompClientRef.current.deactivate();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 2. CONTAGEM REGRESSIVA (3, 2, 1)
  useEffect(() => {
      if (loading || showResult) return; // Pausa se estiver carregando ou mostrando resultado

      if (showCountdown && countdown > 0) {
          const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
          return () => clearTimeout(timer);
      } else if (showCountdown && countdown === 0) {
          setShowCountdown(false);
          // Inicia pergunta
          const tempoPergunta = perguntaAtual?.tempo || 20; 
          setTimeLeft(tempoPergunta);
          setBloqueado(false);
      }
  }, [showCountdown, countdown, loading, showResult]);

  // 3. TIMER DA PERGUNTA
  useEffect(() => {
    if (!showCountdown && !loading && !showResult && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showCountdown && !loading && !showResult && !bloqueado) {
      clearInterval(timerRef.current);
      handleTimeUp(); // Tempo acabou sem resposta
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, showCountdown, loading, showResult, bloqueado]);

  // Tempo acabou -> Conta como erro e avança
  const handleTimeUp = () => {
      setBloqueado(true);
      setShowResult('error'); // Mostra tela de erro
      setTimeout(nextQuestion, 2000); // Espera 2s e vai
  };

  // 4. LÓGICA DE RESPOSTA
  const handleAnswerSelect = async (alternativa) => {
    if (bloqueado) return;

    setSelectedAnswer(alternativa.idAlternativa);
    setBloqueado(true);

    // Verifica se acertou (supondo que o objeto alternativa tenha o campo 'correta')
    const acertou = alternativa.correta === true;
    
    // Mostra tela de feedback imediatamente
    setShowResult(acertou ? 'correct' : 'error');

    // Envio ao backend (Opcional por enquanto)
    /*
    try {
        const eu = await usuarioService.getMeuPerfil();
        const payload = { ... };
        // enviarResposta(payload, token);
    } catch(e) {}
    */

    // Aguarda 2 segundos vendo o resultado e avança
    setTimeout(nextQuestion, 2000);
  };

  // 5. PRÓXIMA PERGUNTA
  const nextQuestion = () => {
      setShowResult(null); // Remove tela de feedback

      if (currentQuestionIndex < perguntas.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setCountdown(3); 
          setShowCountdown(true); // Reinicia contagem 3,2,1
      } else {
          Alert.alert("Fim", "Você completou todas as perguntas!", [
              { text: "Sair", onPress: () => router.replace('/home') }
          ]);
      }
  };

  const handleExit = () => {
    Alert.alert("Sair", "Deseja sair da partida?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", style: "destructive", onPress: () => router.replace('/home') }
    ]);
  };

  // --- RENDERIZAÇÃO ---

  // 1. Tela de Carregamento Inicial
  if (loading) {
      return (
        <SafeAreaView style={[styles.safeArea, {justifyContent:'center', alignItems:'center'}]}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={{color:'#FFF', marginTop:15, fontFamily: 'Poppins-Bold'}}>
                {statusText}
            </Text>
        </SafeAreaView>
      );
  }

  // 2. Tela de Resultado (Correto / Errado)
  if (showResult === 'correct') return <CorrectScreen />;
  if (showResult === 'error') return <ErrorScreen />;

  // 3. Tela de Contagem Regressiva (3, 2, 1)
  if (showCountdown) {
      return (
          <SafeAreaView style={[styles.safeArea, {justifyContent:'center', alignItems:'center'}]}>
              <CustomHeader showMenu={false} />
              <View style={styles.countdownContainer}>
                 <Text style={styles.countdownText}>
                    {countdown > 0 ? countdown : "JÁ!"}
                 </Text>
              </View>
          </SafeAreaView>
      );
  }

  if (!perguntaAtual) return null;

  // 4. Tela da Pergunta (Jogo)
  return (
    <SafeAreaView style={styles.safeArea}>
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
            {perguntaAtual.alternativas && perguntaAtual.alternativas.map((alt) => (
              <TouchableOpacity
                key={alt.idAlternativa}
                style={[
                  styles.optionButton,
                  // Mantém a cor azul padrão até clicar
                  selectedAnswer === alt.idAlternativa && styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswerSelect(alt)}
                disabled={bloqueado}
              >
                <Text style={styles.optionText}>{alt.textoAlternativa}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const PRIMARY_BLUE = '#1CB0FC';
const DARK_BLUE = '#01324B';
const RED = '#FF0000';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#3B3939';
const OPTION_BLUE = '#00B7FF';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY_BLUE },
  
  // Estilos da Contagem
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 120,
    color: '#FFFFFF',
    fontFamily: 'Blinker-Bold',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
  },

  // Estilos Feedback (Correto/Errado)
  feedbackContainer: {
    flex: 1,
    backgroundColor: '#1CB0FC',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 225,
    height: 225,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 8,
  },
  cancelImage: {
    width: 200,
    height: 200,
    marginTop: -65,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 8,
  },
  correctText: {
    marginTop: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 0.32,
    textTransform: 'uppercase',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.32,
    fontFamily: 'Poppins-Bold',
  },

  // Estilos do Jogo Normal
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
  timerText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
  exitButton: {
    backgroundColor: RED,
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