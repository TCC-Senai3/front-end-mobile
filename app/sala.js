// app/sala.js

// ====================================================================
// 1. POLYFILL (ESSENCIAL PARA O WEBSOCKET NO REACT NATIVE)
// ====================================================================
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
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import CustomHeader from '../components/CustomHeader';
import Userprofile2Icon from '../components/icons/Userprofile2Icon';
import BodeIcon from '../components/icons/BodeIcon';
import CanetabicIcon from '../components/icons/CanetabicIcon';
import PatoIcon from '../components/icons/PatoIcon';

import { Client } from '@stomp/stompjs';
import usuarioService from '../services/usuarioService';
import salaService from '../services/salaService';

export default function Sala() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Garante que pega o código de onde vier
  const codigo = params.codigo || params.codigoSala || null;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [salaInfo, setSalaInfo] = useState(null);
  const [isDonoDaSala, setIsDonoDaSala] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Controle de Expulsão
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [showExpelModal, setShowExpelModal] = useState(false);

  // Referência para o cliente do socket
  const stompClientRef = useRef(null);
  
  // Avatar Map
  const avatarMap = {
    'bode.svg': BodeIcon, bode: BodeIcon,
    'Canetabic.svg': CanetabicIcon, caneta: CanetabicIcon,
    'Pato.svg': PatoIcon, pato: PatoIcon,
  };

  const getAvatarComponent = (avatarName) => {
    if (!avatarName) return Userprofile2Icon;
    const cleanName = String(avatarName).toLowerCase().replace('.svg', '').trim();
    return avatarMap[cleanName] || Userprofile2Icon;
  };

  // ============================================================
  // 1. CARGA INICIAL (API)
  // ============================================================
  const carregarDadosIniciais = useCallback(async () => {
    if (!codigo) return;
    
    try {
      // 1. Busca quem sou eu
      const eu = await usuarioService.getMeuPerfil();
      setCurrentUser(eu);

      // 2. Busca a sala
      const sala = await salaService.getSalaByPin(codigo);
      if (!sala) return;

      setSalaInfo(sala);
      setIsDonoDaSala(String(eu.id) === String(sala.idUsuario));

      // 3. Monta lista de IDs
      let listaIds = [];
      if (sala.participantes) {
          listaIds = sala.participantes.map(p => p.idUsuario || p.id);
      } else if (sala.idParticipantes) {
          listaIds = sala.idParticipantes;
      }

      // Garante que EU estou na lista
      if (!listaIds.includes(eu.id)) listaIds.push(eu.id);

      // 4. Busca detalhes
      if (listaIds.length > 0) {
        const promises = listaIds.map(id => usuarioService.getUsuarioById(id));
        const results = await Promise.all(promises);
        
        const validUsers = results.filter(u => u && u.id);
        const uniqueUsers = Array.from(new Map(validUsers.map(item => [item.id, item])).values());

        setUsuarios(uniqueUsers);
      }
    } catch (err) {
      console.log('Erro ao carregar lista:', err);
      // Fallback
      try {
        const eu = await usuarioService.getMeuPerfil();
        setUsuarios([{ id: eu.id, name: eu.nome, avatar: eu.avatar }]);
      } catch(e){}
    } finally {
      setLoading(false);
    }
  }, [codigo]);

  useEffect(() => {
      if (!codigo) {
          router.replace('/jogo');
          return;
      }
      carregarDadosIniciais();
  }, [codigo]);

  // ============================================================
  // 2. WEBSOCKET
  // ============================================================
  useEffect(() => {
    if (!codigo) return;

    let client = null;

    const iniciarSocket = async () => {
      try {
        const eu = await usuarioService.getMeuPerfil();
        const userId = String(eu.id);
        const token = await usuarioService.getToken();
        
        // Endpoint Nativo
        const wsUrl = 'wss://tccdrakes.azurewebsites.net/ws-native';

        console.log("🔌 Conectando WS...");

        client = new Client({
          brokerURL: wsUrl,
          connectHeaders: { Authorization: `Bearer ${token}` },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          
          // Flags importantes para React Native
          forceBinaryWSFrames: true,
          appendMissingNULLonIncoming: true,

          onConnect: () => {
            console.log('✅ WS CONECTADO!');

            // --- TÓPICO PRINCIPAL DA SALA ---
            client.subscribe(`/topic/sala/${codigo}`, (msg) => {
              try {
                const payload = JSON.parse(msg.body);
                console.log('📩 SOCKET:', payload.type);

                // CASO 1: USUARIO ENTROU
                if (payload.type === "USUARIO_ENTROU") {
                  const u = payload.usuario;
                  
                  setUsuarios((prev) => {
                    // Evita duplicar se já existe
                    if (prev.find(p => String(p.id) === String(u.id))) return prev;
                    // Adiciona imediatamente
                    return [...prev, { id: u.id, name: u.nome, avatar: u.avatar }];
                  });

                  // Busca detalhes completos (Avatar) em segundo plano
                  usuarioService.getUsuarioById(u.id).then(fullUser => {
                      if (fullUser) {
                        setUsuarios((prev) => prev.map(p => 
                            String(p.id) === String(fullUser.id) ? { ...p, avatar: fullUser.avatar, name: fullUser.nome } : p
                        ));
                      }
                  });
                } 
                
                // CASO 2: LISTA COMPLETA ATUALIZADA (Seu backend envia isso também!)
                else if (payload.type === "USUARIOS_ATUALIZADOS") {
                    const listaNova = payload.participantes || []; // Ajuste conforme seu DTO backend
                    // O backend manda uma lista de payloads simplificados
                    setUsuarios(prev => {
                        // Mescla a lista nova com os avatares que já temos para não piscar
                        const mapaAtual = new Map(prev.map(p => [p.id, p]));
                        
                        return listaNova.map(novo => {
                            const existente = mapaAtual.get(novo.id);
                            return {
                                id: novo.id,
                                name: novo.nome,
                                // Mantém avatar antigo se o novo vier nulo, ou usa o novo
                                avatar: novo.avatar || (existente ? existente.avatar : null)
                            };
                        });
                    });
                }

                // CASO 3: USUARIO SAIU
                else if (payload.type === "USUARIO_SAIU") {
                  setUsuarios((prev) => prev.filter(p => String(p.id) !== String(payload.idUsuario)));
                }
                
                // CASO 4: JOGO INICIOU
                else if (payload.type === "JOGO_INICIADO") {
                   client.deactivate();
                   router.replace({
                    pathname: '/partida',
                    params: {
                      idFormulario: payload.idFormulario,
                      idSala: payload.idSala,
                      codigoSala: payload.codigoSala || codigo,
                    },
                  });
                }
                
                // CASO 5: SALA FECHADA
                else if (payload.type === "SALA_FECHADA") {
                   Alert.alert("Aviso", "A sala foi encerrada.");
                   router.replace('/jogo');
                }

              } catch (err) {
                console.error("Erro JSON:", err);
              }
            });

            // --- TÓPICO ESPECÍFICO DE ATUALIZAÇÃO (Backup) ---
            // Seu backend envia para cá também no SalaService.java
            client.subscribe(`/topic/sala/${codigo}/atualizar`, (msg) => {
                try {
                    const payload = JSON.parse(msg.body);
                    if (payload.type === "USUARIOS_ATUALIZADOS") {
                        console.log("🔄 Recebida lista completa atualizada");
                        // Recarrega via API para garantir integridade total
                        carregarDadosIniciais();
                    }
                } catch(e) {}
            });

            // --- TÓPICO PRIVADO ---
            client.subscribe(`/user/queue/expulso`, (msg) => {
              try {
                const payload = JSON.parse(msg.body);
                if (payload?.type === 'EXPULSO') {
                    Alert.alert("Ops!", "Você foi expulso.");
                    router.replace('/jogo');
                }
              } catch (e) {}
            });
          },
          
          onStompError: (f) => console.log('Erro STOMP:', f.headers.message),
          onWebSocketClose: () => console.log('WS Fechou')
        });

        client.activate();
        stompClientRef.current = client;

      } catch (err) {
        console.error('Erro socket:', err);
      }
    };

    iniciarSocket();

    return () => {
      if (stompClientRef.current) stompClientRef.current.deactivate();
    };
  }, [codigo, carregarDadosIniciais]); // Incluí carregarDadosIniciais nas dependências

  // ============================================================
  // AÇÕES
  // ============================================================
  const handleDesmanchar = async () => {
    setActionLoading(true);
    try {
      const eu = await usuarioService.getMeuPerfil();
      const idSala = salaInfo?.idSala || salaInfo?.id;

      if (isDonoDaSala) {
        await salaService.fecharSala(idSala);
      } else {
        await salaService.sairDaSala(codigo, eu.id);
        router.replace('/jogo');
      }
    } catch (err) {
      console.log("Erro ao sair:", err);
      router.replace('/jogo');
    } finally {
      setActionLoading(false);
    }
  };

  const handleIniciar = async () => {
    if (!isDonoDaSala) return;
    
    if (usuarios.length < 1) { 
        return Alert.alert("Aguarde", "Espere mais jogadores.");
    }

    setActionLoading(true);
    try {
      const eu = await usuarioService.getMeuPerfil();
      const dest = `/app/sala/${codigo}/iniciar`;
      
      if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.publish({
            destination: dest,
            body: JSON.stringify({ idUsuario: eu.id }),
          });
      } else {
          // Fallback via API
          await salaService.iniciarSala(codigo, eu.id); // Se existir no service
      }
    } catch (err) {
      Alert.alert("Erro", "Falha ao iniciar.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExpulsar = async (idUsuario) => {
    setShowExpelModal(false);
    if (!isDonoDaSala) return;
    
    setActionLoading(true);
    try {
      await salaService.expulsarUsuario(codigo, idUsuario);
      // Remove localmente para feedback instantâneo
      setUsuarios(prev => prev.filter(u => String(u.id) !== String(idUsuario)));
    } catch (err) {
      Alert.alert("Erro", "Falha ao expulsar.");
    } finally {
      setActionLoading(false);
      setUsuarioSelecionado(null);
    }
  };

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1CB0FC" />
      <CustomHeader showMenu menuPosition="right" closeButtonSide="left" />

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.codeLabel}>CODE:</Text>
          <Text style={styles.codeValue}>{codigo}</Text>
        </View>
        <Text style={styles.roomName}>{salaInfo?.nomeSala || 'Carregando...'}</Text>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.btnDanger} 
            onPress={handleDesmanchar}
            disabled={actionLoading}
          >
            <Text style={styles.btnText}>{isDonoDaSala ? 'DESMANCHAR SALA' : 'SAIR'}</Text>
          </TouchableOpacity>

          {isDonoDaSala && (
            <TouchableOpacity
              style={[styles.btnWarning, { marginLeft: 10 }]}
              onPress={handleIniciar}
              disabled={actionLoading || loading}
            >
              <Text style={styles.btnText}>INICIAR</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && usuarios.length === 0 ? (
          <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 30 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.playersGrid}>
            {usuarios.length === 0 ? (
                <Text style={styles.msg}>Aguardando jogadores...</Text>
            ) : (
                usuarios.map((p) => {
                const Avatar = getAvatarComponent(p.avatar);
                return (
                    <TouchableOpacity
                        key={p.id}
                        style={styles.playerCard}
                        onLongPress={() => {
                            if (isDonoDaSala && String(p.id) !== String(currentUser?.id)) {
                                setUsuarioSelecionado(p);
                                setShowExpelModal(true);
                            }
                        }}
                        activeOpacity={1}
                    >
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarCircle}>
                        <Avatar width={60} height={60} />
                        </View>
                    </View>
                    <Text style={styles.playerName} numberOfLines={1}>{p.nome}</Text>
                    </TouchableOpacity>
                );
                })
            )}
          </ScrollView>
        )}

        {/* Modal Expulsão */}
        <Modal transparent visible={showExpelModal} animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setShowExpelModal(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Expulsão</Text>
              <Text style={styles.modalMessage}>Remover {usuarioSelecionado?.nome}?</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowExpelModal(false)}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirm} onPress={() => handleExpulsar(usuarioSelecionado.id)}>
                  <Text style={styles.modalConfirmText}>Sim, remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1CB0FC' },
  container: { flex: 1, padding: 16, alignItems: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  codeLabel: { color: '#FFF', fontSize: 20, marginRight: 8, fontWeight: 'bold' },
  codeValue: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  roomName: { color: 'rgba(255,255,255,0.9)', fontSize: 17, marginTop: 5 },
  actions: { flexDirection: 'row', marginTop: 14, marginBottom: 14 },
  btnDanger: { backgroundColor: '#FF0000', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  btnWarning: { backgroundColor: '#FF9D00', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  btnText: { color: '#FFF', fontWeight: '700' },
  playersGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 80, gap: 12 },
  playerCard: { width: 140, height: 100, backgroundColor: '#FFF', borderRadius: 14, margin: 10, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 12, marginTop: 25 },
  avatarWrapper: { position: 'absolute', top: -30, left: 0, right: 0, alignItems: 'center' },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  playerName: { marginTop: 12, fontWeight: '600', color: '#333' },
  msg: { marginTop: 30, color: '#FFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 280, backgroundColor: '#FFF', borderRadius: 12, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalCancel: { backgroundColor: '#ccc', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalCancelText: { fontWeight: '700', color: '#333' },
  modalConfirm: { backgroundColor: '#FF0000', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalConfirmText: { fontWeight: '700', color: '#FFF' },
});