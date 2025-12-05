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
  ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

import { Client } from '@stomp/stompjs';
import usuarioService from '../services/usuarioService';

const { width, height } = Dimensions.get('window');

export default function PartidaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Recebe dados da navegação anterior
  const { codigoSala, idSala, idFormulario } = params;

  // --- ESTADOS DO JOGO ---
  const [perguntaAtual, setPerguntaAtual] = useState(null); // Guarda a pergunta inteira
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Índice da resposta escolhida
  const [timeLeft, setTimeLeft] = useState(0); // Tempo restante
  const [bloqueado, setBloqueado] = useState(false); // Bloqueia cliques após responder
  const [conectado, setConectado] = useState(false); // Status do socket
  const [statusJogo, setStatusJogo] = useState('AGUARDANDO'); // AGUARDANDO, RESPONDENDO, FIM

  const stompClientRef = useRef(null);
  const timerRef = useRef(null);

  // Formata segundos para MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================
  // 1. CONEXÃO WEBSOCKET E LÓGICA DO JOGO
  // ============================================================
  useEffect(() => {
    const conectarJogo = async () => {
      try {
        const token = await usuarioService.getToken();
        const eu = await usuarioService.getMeuPerfil();
        
        if (!token || !codigoSala) {
            Alert.alert("Erro", "Dados da partida inválidos.");
            router.replace('/home');
            return;
        }

        const wsUrl = 'wss://tccdrakes.azurewebsites.net/ws-native';

        const client = new Client({
          brokerURL: wsUrl,
          connectHeaders: { Authorization: `Bearer ${token}` }, // Token JWT
          reconnectDelay: 5000,
          forceBinaryWSFrames: true,
          appendMissingNULLonIncoming: true,

          onConnect: () => {
            console.log('✅ Conectado ao Jogo na sala:', codigoSala);
            setConectado(true);

            // A) Escutar Eventos do Jogo (Nova Pergunta, Fim, etc.)
            client.subscribe(`/topic/sala/${codigoSala}/game`, (msg) => {
              try {
                const payload = JSON.parse(msg.body);
                console.log('🎮 Evento Jogo:', payload.type);

                if (payload.type === 'NOVA_PERGUNTA') {
                  // Recebeu pergunta: Atualiza tela e reseta timer
                  setPerguntaAtual(payload.pergunta); 
                  // Se o back mandar 'tempo' use ele, senão 30s padrão
                  setTimeLeft(payload.tempo || 30);   
                  setSelectedAnswer(null);            
                  setBloqueado(false);
                  setStatusJogo('RESPONDENDO');                
                } 
                else if (payload.type === 'FIM_DE_JOGO') {
                  setStatusJogo('FIM');
                  Alert.alert("Fim de Jogo", "A partida acabou!");
                  router.replace('/home'); // Futuramente: Tela de Placar
                }
                else if (payload.type === 'SALA_FECHADA') {
                   Alert.alert("Aviso", "A sala foi encerrada.");
                   router.replace('/home');
                }
              } catch(e) { console.error("Erro parsing jogo:", e); }
            });

            // B) Opcional: Se precisar avisar que carregou
            // client.publish({ destination: `/app/sala/${codigoSala}/pronto` });
          },
          
          onStompError: (f) => console.log('Erro STOMP Jogo:', f.headers.message),
          onWebSocketClose: () => console.log('WS Jogo Fechou')
        });

        client.activate();
        stompClientRef.current = client;

      } catch (error) {
        console.error("Erro WS Jogo:", error);
      }
    };

    conectarJogo();

    return () => {
      if (stompClientRef.current) stompClientRef.current.deactivate();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [codigoSala]);

  // ============================================================
  // 2. LÓGICA DO TIMER
  // ============================================================
  useEffect(() => {
    if (timeLeft > 0 && statusJogo === 'RESPONDENDO') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && perguntaAtual && statusJogo === 'RESPONDENDO') {
      // Tempo acabou!
      clearInterval(timerRef.current);
      if (!bloqueado) {
         setBloqueado(true); // Bloqueia interações
         // Aqui você pode forçar o envio de resposta vazia se o backend exigir
      }
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, perguntaAtual, statusJogo]);

  // ============================================================
  // 3. ENVIAR RESPOSTA
  // ============================================================
  const handleAnswerSelect = async (index) => {
    if (bloqueado) return; // Evita duplo clique

    setSelectedAnswer(index);
    setBloqueado(true); // Trava para não mudar a resposta

    try {
      const eu = await usuarioService.getMeuPerfil();
      
      // Envia resposta via WebSocket
      if (stompClientRef.current && stompClientRef.current.connected) {
        const payload = {
            idUsuario: eu.id,
            idPergunta: perguntaAtual.id || perguntaAtual.idPergunta, // Ajuste conforme seu DTO
            indiceResposta: index 
        };

        // Rota de resposta no backend (Verifique se é esta no seu Controller)
        stompClientRef.current.publish({
            destination: `/app/sala/${codigoSala}/responder`,
            body: JSON.stringify(payload)
        });
        console.log("Resposta enviada:", index);
      }
    } catch (error) {
      console.error("Erro ao responder:", error);
      Alert.alert("Erro", "Falha ao enviar resposta");
      setBloqueado(false); // Destrava se der erro
    }
  };

  const handleExit = () => {
    Alert.alert("Sair", "Deseja sair da partida?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", style: "destructive", onPress: () => router.replace('/home') }
    ]);
  };

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================
  
  // TELA DE CARREGAMENTO (Enquanto não chega a pergunta)
  if (!perguntaAtual) {
      return (
        <SafeAreaView style={[styles.safeArea, {justifyContent: 'center', alignItems:'center'}]}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={{color: '#FFF', marginTop: 20, fontFamily: 'Poppins-Bold', fontSize: 18}}>
                {conectado ? "Aguardando o início..." : "Conectando ao jogo..."}
            </Text>
            {/* Botão de emergência para sair se travar */}
            <TouchableOpacity onPress={handleExit} style={{marginTop: 40, padding: 10}}>
                <Text style={{color: '#FF0000', fontFamily: 'Poppins-Bold'}}>Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader showMenu={true} menuPosition="right" />
      
      {/* Header Controls (Tempo e Sair) */}
      <View style={styles.headerControls}>
        <View style={styles.timerButton}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      {/* Card Principal */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Categoria */}
          <Text style={styles.categoryTitle}>
            {perguntaAtual.categoria || 'PERGUNTA'}
          </Text>
          
          {/* Enunciado */}
          <Text style={styles.questionText}>
            {perguntaAtual.enunciado || perguntaAtual.question || "Carregando pergunta..."}
          </Text>
          
          {/* Opções */}
          <View style={styles.optionsContainer}>
            {/* Verifica se 'opcoes' existe e é array */}
            {perguntaAtual.options && perguntaAtual.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.optionButtonSelected,
                  // Estilo visual se estiver bloqueado (respondido)
                  bloqueado && selectedAnswer !== index && { opacity: 0.5 }
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={bloqueado} // Desabilita clique se já respondeu ou tempo acabou
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY_BLUE = '#1CB0FC';
const DARK_BLUE = '#01324B';
const RED = '#FF0000';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#3B3939';
const OPTION_BLUE = '#00B7FF';

const styles = StyleSheet.create({
  safeArea: {
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