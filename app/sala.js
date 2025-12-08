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
  const codigo = params.codigo || params.codigoSala || null;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [salaInfo, setSalaInfo] = useState(null);
  const [isDonoDaSala, setIsDonoDaSala] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Expulsão
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [showExpelModal, setShowExpelModal] = useState(false);

  const stompClientRef = useRef(null);

  // ============================================================
  // AVATARS — MAPEAMENTO
  // ============================================================
  const avatarMap = {
    'bode': BodeIcon,
    'bode.svg': BodeIcon,
    'pato': PatoIcon,
    'pato.svg': PatoIcon,
    'canetabic': CanetabicIcon,
    'canetabic.svg': CanetabicIcon,
    'caneta': CanetabicIcon,
  };

  const getAvatarComponent = (avatarName) => {
    if (!avatarName) return Userprofile2Icon;

    const clean = String(avatarName)
      .trim()
      .toLowerCase()
      .replace('.svg', '');

    return avatarMap[clean] || Userprofile2Icon;
  };

  // ============================================================
  // CARREGAR DADOS INICIAIS
  // - busca sala, registra entrada caso necessário e popula lista
  // ============================================================
  const carregarDadosIniciais = useCallback(async () => {
    if (!codigo) return;

    try {
      const eu = await usuarioService.getMeuPerfil();
      const token = await usuarioService.getToken();
      setCurrentUser(eu);

      // 1) Busca a sala (com token, quando disponível)
      const sala = await salaService.getSalaByPin(codigo, token);
      if (!sala) {
        setLoading(false);
        return;
      }

      setSalaInfo(sala);
      setIsDonoDaSala(String(eu.id) === String(sala.idUsuario));

      // Monta lista de IDs dos participantes
      let listaIds = [];
      if (sala.participantes) {
        listaIds = sala.participantes.map(p => p.idUsuario || p.id);
      } else if (sala.idParticipantes) {
        listaIds = sala.idParticipantes;
      }

      // id real da sala (API às vezes usa 'id')
      const idSalaReal = sala.idSala || sala.id;

      // 2) Se eu não estou na lista, registra minha entrada no backend
      if (!listaIds.includes(eu.id)) {
        try {
          // tentar registrar no backend (não trava a UI)
          await salaService.entrarNaSala(idSalaReal, eu.id, token);
          // adiciona visualmente para aparecer na lista local
          listaIds.push(eu.id);
        } catch (err) {
          console.warn("⚠️ Não foi possível registrar entrada:", err);
          // mesmo que o registro falhe, adicionamos visualmente para o usuário ver a si mesmo
          if (!listaIds.includes(eu.id)) listaIds.push(eu.id);
        }
      }

      // 3) Busca dados completos dos usuários (nome/avatar)
      if (listaIds.length > 0) {
        const results = await Promise.all(
          listaIds.map(id => usuarioService.getUsuarioById(id))
        );

        const valid = results.filter(u => u && u.id);
        // remove duplicados mantendo a ordem original
        const unique = Array.from(new Map(valid.map(i => [i.id, i])).values());

        setUsuarios(unique);
      }

    } catch (err) {
      console.error("Erro ao carregar dados iniciais da sala:", err);
      // fallback: tenta pelo menos mostrar o usuário corrente
      try {
        const eu = await usuarioService.getMeuPerfil();
        setCurrentUser(eu);
        setUsuarios([{ id: eu.id, nome: eu.nome, avatar: eu.avatar }]);
      } catch (e) {
        console.warn("Falha no fallback de usuário:", e);
      }
    } finally {
      setLoading(false);
    }
  }, [codigo]);

  useEffect(() => {
    if (!codigo) {
      router.replace('/partida');
      return;
    }
    carregarDadosIniciais();
  }, [codigo, carregarDadosIniciais, router]);

  // ============================================================
  // WEBSOCKET: recebe eventos da sala (entrar, sair, iniciar, etc)
  // ============================================================
  useEffect(() => {
    if (!codigo) return;

    let clientInstance = null;

    const iniciarSocket = async () => {
      try {
        const eu = await usuarioService.getMeuPerfil();
        const token = await usuarioService.getToken();
        const wsUrl = 'wss://tccdrakes.azurewebsites.net/ws-native';

        clientInstance = new Client({
          brokerURL: wsUrl,
          connectHeaders: { Authorization: `Bearer ${token}` },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          forceBinaryWSFrames: true,
          appendMissingNULLonIncoming: true,
          onConnect: () => {
            // subscribe tópico público da sala
            clientInstance.subscribe(`/topic/sala/${codigo}`, (msg) => {
              try {
                const payload = JSON.parse(msg.body);

                if (payload.type === "USUARIO_ENTROU") {
                  const u = payload.usuario;
                  // adiciona rápido se não existir
                  setUsuarios(prev => {
                    if (prev.some(p => String(p.id) === String(u.id))) return prev;
                    return [...prev, { id: u.id, nome: u.nome, avatar: u.avatar ?? null }];
                  });

                  // busca dados completos e atualiza
                  usuarioService.getUsuarioById(u.id).then(full => {
                    if (full && full.id) {
                      setUsuarios(prev =>
                        prev.map(p =>
                          String(p.id) === String(full.id)
                            ? { ...p, nome: full.nome, avatar: full.avatar || p.avatar }
                            : p
                        )
                      );
                    }
                  }).catch(() => {});
                }

                else if (payload.type === "USUARIOS_ATUALIZADOS") {
                  const lista = payload.participantes || [];
                  setUsuarios(prev => {
                    const old = new Map(prev.map(u => [String(u.id), u]));
                    return lista.map(n => ({
                      id: n.id,
                      nome: n.nome,
                      avatar: n.avatar || old.get(String(n.id))?.avatar || null
                    }));
                  });
                }

                else if (payload.type === "USUARIO_SAIU") {
                  setUsuarios(prev =>
                    prev.filter(p => String(p.id) !== String(payload.idUsuario))
                  );
                }

                else if (payload.type === "JOGO_INICIADO") {
                  // desconecta ws e vai para /partida com parâmetros do servidor
                  clientInstance.deactivate();
                  router.replace({
                    pathname: '/partida',
                    params: {
                      idFormulario: payload.idFormulario,
                      idSala: payload.idSala,
                      codigoSala: payload.codigoSala || codigo,
                    },
                  });
                }

                else if (payload.type === "SALA_FECHADA") {
                  Alert.alert("Aviso", "A sala foi encerrada.");
                  router.replace('/jogo');
                }

              } catch (err) {
                console.log("Erro ao parsear payload WS:", err);
              }
            });

            // tópico privado para expulso
            clientInstance.subscribe(`/user/queue/expulso`, (msg) => {
              try {
                const payload = JSON.parse(msg.body);
                if (payload?.type === 'EXPULSO') {
                  Alert.alert("Ops!", "Você foi expulso.");
                  router.replace('/jogo');
                }
              } catch (e) {}
            });
          },
        });

        clientInstance.activate();
        stompClientRef.current = clientInstance;

      } catch (err) {
        console.error('Erro socket:', err);
      }
    };

    iniciarSocket();

    return () => {
      try {
        stompClientRef.current?.deactivate();
        stompClientRef.current = null;
      } catch (e) {}
    };
  }, [codigo, router]);

  // ============================================================
  // AÇÕES: sair/desmanchar sala
  // ============================================================
  const handleDesmanchar = async () => {
    setActionLoading(true);
    try {
      const eu = await usuarioService.getMeuPerfil();
      const token = await usuarioService.getToken();
      const idSala = salaInfo?.idSala || salaInfo?.id;

      if (isDonoDaSala) {
        await salaService.fecharSala(idSala, token);
      } else {
        await salaService.sairDaSala(codigo, eu.id, token);
      }
      router.replace('/jogo');
    } catch (err) {
      console.error("Erro ao desmanchar/sair:", err);
      router.replace('/jogo');
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // AÇÃO: iniciar jogo (corrigido para enviar o idSala correto)
  // ============================================================
  const handleIniciar = async () => {
    if (!isDonoDaSala) return;

    if (usuarios.length < 1) {
      return Alert.alert("Aguarde", "Espere mais jogadores.");
    }

    setActionLoading(true);
    try {
      const eu = await usuarioService.getMeuPerfil();
      const token = await usuarioService.getToken();
      const dest = `/app/sala/${codigo}/iniciar`;

      // Envia mensagem WS (se estiver conectado)
      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: dest,
          body: JSON.stringify({ idUsuario: eu.id }),
        });
      } else {
        // fallback: requisita via API
        await salaService.iniciarSala(codigo, eu.id, token);
      }

      // **CORREÇÃO IMPORTANTE**: usar 'id' primeiro (id real da sala)
      const idSalaReal = salaInfo?.id || salaInfo?.idSala;

      router.replace({
        pathname: '/partida',
        params: {
          codigoSala: codigo,
          idSala: idSalaReal,     // <--- AGORA SEMPRE VEM CERTO
          idFormulario: salaInfo?.idFormulario,
        }
      });

    } catch (err) {
      console.error("Falha ao iniciar sala:", err);
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
      const token = await usuarioService.getToken();
      await salaService.expulsarUsuario(codigo, idUsuario, token);

      setUsuarios(prev =>
        prev.filter(u => String(u.id) !== String(idUsuario))
      );
    } catch (err) {
      console.error("Erro ao expulsar:", err);
      Alert.alert("Erro", "Falha ao expulsar.");
    } finally {
      setActionLoading(false);
      setUsuarioSelecionado(null);
    }
  };

  // ============================================================
  // RENDER
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

        <Text style={styles.roomName}>
          {salaInfo?.nomeSala || 'Carregando...'}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnDanger}
            onPress={handleDesmanchar}
            disabled={actionLoading}
          >
            <Text style={styles.btnText}>
              {isDonoDaSala ? 'DESMANCHAR SALA' : 'SAIR'}
            </Text>
          </TouchableOpacity>

          {isDonoDaSala && (
            <TouchableOpacity
              style={[styles.btnWarning, { marginLeft: 10 }]}
              onPress={handleIniciar}
              disabled={actionLoading || loading}
            >
              {actionLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnText}>INICIAR</Text>
              )}
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
              usuarios.map(p => {
                const Avatar = getAvatarComponent(p.avatar);
                const isMe = String(p.id) === String(currentUser?.id);
                const canExpel = isDonoDaSala && !isMe;

                return (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.playerCard}
                    onPress={() => {
                      if (canExpel) {
                        setUsuarioSelecionado(p);
                        setShowExpelModal(true);
                      }
                    }}
                    activeOpacity={canExpel ? 0.7 : 1}
                  >
                    <View style={styles.avatarWrapper}>
                      <View style={styles.avatarCircle}>
                        <Avatar width={60} height={60} />
                      </View>
                    </View>

                    <Text style={styles.playerName} numberOfLines={1}>
                      {p.nome || (isMe ? currentUser?.nome : 'Jogador')}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}

        <Modal transparent visible={showExpelModal} animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setShowExpelModal(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Expulsão</Text>
              <Text style={styles.modalMessage}>
                Remover {usuarioSelecionado?.nome}?
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowExpelModal(false)}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirm}
                  onPress={() => handleExpulsar(usuarioSelecionado?.id)}
                >
                  <Text style={styles.modalConfirmText}>Sim, remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>

        {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      </View>
    </SafeAreaView>
  );
}

/* ------------------ STYLES ------------------ */

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

  playersGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 80,
    gap: 12,
  },

  playerCard: {
    width: 140,
    height: 100,
    backgroundColor: '#FFF',
    borderRadius: 14,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
    marginTop: 25,
  },

  avatarWrapper: { position: 'absolute', top: -20, left: 10, right: 0, alignItems: 'center' },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },

  playerName: { marginTop: 12, fontWeight: '600', color: '#333' },

  msg: { marginTop: 30, color: '#FFF' },
  error: { marginTop: 12, color: '#ffdddd' },

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
