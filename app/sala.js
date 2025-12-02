// app/sala.js
// Versão React Native (Expo) adaptada do seu código web
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

/**
 * Nota:
 * - Certifique-se de ter instalado: @stomp/stompjs
 * - O endpoint WS deve aceitar Upgrade websocket em wss://tccdrakes.azurewebsites.net/ws
 * - Se seu servidor usar SockJS no backend, o endpoint base ainda normalmente é /ws.
 */

export default function Sala() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // recebe `codigo` do navigate/web; aceita params.codigo ou params.codigoSala
  const codigo = params.codigo || params.codigoSala || null;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [salaInfo, setSalaInfo] = useState(null);
  const [isDonoDaSala, setIsDonoDaSala] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const stompClientRef = useRef(null);
  const isMountedRef = useRef(false);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // avatar map (mesma lógica)
  const avatarMap = {
    'bode.svg': BodeIcon,
    bode: BodeIcon,
    'Canetabic.svg': CanetabicIcon,
    caneta: CanetabicIcon,
    'Pato.svg': PatoIcon,
    pato: PatoIcon,
  };

  const getAvatarComponent = (avatarName) => {
    if (!avatarName) return Userprofile2Icon;
    const cleanName = String(avatarName).trim();
    if (cleanName.startsWith('data:') || cleanName.startsWith('http')) {
      // caso queira renderizar imagens remotas, substitua por <Image> no lugar do SVG component
      return Userprofile2Icon;
    }
    return avatarMap[cleanName] || Userprofile2Icon;
  };

  // ---------------- carregarDadosIniciais (igual ao web) ----------------
  const carregarDadosIniciais = useCallback(async () => {
    if (!codigo) return;
    if (!isMountedRef.current) return;

    setLoading(true);
    try {
      const sala = await salaService.getSalaByPin(codigo);
      if (!isMountedRef.current || !sala) return;

      setSalaInfo(sala);
      setIsDonoDaSala(String(sala.idUsuario) === String((await usuarioService.getMeuPerfil()).id));

      const participantesIds =
        (sala.participantes && sala.participantes.map((p) => p.idUsuario)) || sala.idParticipantes || [];

      if (participantesIds.length > 0) {
        const promises = participantesIds.map((id) => usuarioService.getUsuarioById(id));
        const results = await Promise.allSettled(promises);

        if (!isMountedRef.current) return;

        const validUsers = results
          .filter((r) => r.status === 'fulfilled' && r.value && r.value.id)
          .map((r) => r.value);

        setUsuarios(validUsers);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      if (isMountedRef.current) setErrorMsg('Falha ao carregar informações da sala.');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [codigo]);

  // ---------------- tratar mensagens (igual ao web) ----------------
  const tratarMensagem = (payload) => {
    if (!payload || !payload.type) return;

    if (payload.type === 'JOGO_INICIADO') {
      const { idFormulario, idSala, codigoSala } = payload;
      // ajusta rota conforme seu app mobile; usei /jogo (como no web)
      router.push({
        pathname: '/jogo',
        params: { idFormulario, idSala, codigoSala: codigoSala || codigo },
      });
      return;
    }

    if (payload.type === 'USUARIO_ENTROU') {
      const novoUsuario = payload.usuario;
      if (!novoUsuario) return;
      setUsuarios((prev) => {
        if (prev.find((u) => String(u.id) === String(novoUsuario.id))) return prev;
        return [...prev, novoUsuario];
      });

      // atualiza dados completos via API
      usuarioService
        .getUsuarioById(novoUsuario.id)
        .then((full) => {
          if (isMountedRef.current && full) {
            setUsuarios((prev) => prev.map((u) => (String(u.id) === String(full.id) ? full : u)));
          }
        })
        .catch(() => {});
      return;
    }

    if (payload.type === 'USUARIO_SAIU') {
      setUsuarios((prev) => prev.filter((u) => String(u.id) !== String(payload.idUsuario)));
      setUsuarioSelecionado(null);
      return;
    }

    if (payload.type === 'SALA_FECHADA') {
      router.replace('/game'); // mesmo comportamento do web
      return;
    }

    if (payload.type === 'EXPULSO') {
      router.replace('/game');
      return;
    }
  };

  // ---------------- efeito WebSocket / STOMP ----------------
  useEffect(() => {
    if (!codigo) return;

    isMountedRef.current = true;
    let client = null;

    const iniciarSocket = async () => {
      try {
        const eu = await usuarioService.getMeuPerfil();
        const userId = String(eu.id);

        // IMPORTANTE: usar WSS (SSL) para Azure
        const wsUrl = 'wss://tccdrakes.azurewebsites.net/ws';

        client = new Client({
          webSocketFactory: () => new WebSocket(wsUrl),

          reconnectDelay: 10000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,

          connectHeaders: {
            login: userId,
          },

          debug: () => {
            // comentei para não poluir logs; descomente se quiser ver handshake
            // console.log(str);
          },

          onConnect: () => {
            if (!isMountedRef.current) return;
            setIsConnected(true);

            const topic = `/topic/sala/${codigo}`;
            client.subscribe(topic, (message) => {
              if (!isMountedRef.current) return;
              try {
                const payload = JSON.parse(message.body);
                tratarMensagem(payload);
              } catch (e) {
                // silent
              }
            });

            const privateTopic = `/user/queue/expulso`;
            client.subscribe(privateTopic, (message) => {
              if (!isMountedRef.current) return;
              try {
                const payload = JSON.parse(message.body);
                if (payload?.type === 'EXPULSO') {
                  router.replace('/game');
                }
              } catch (e) {
                // silent
              }
            });
          },

          onStompError: (frame) => {
            console.warn('STOMP ERROR:', frame && frame.headers ? frame.headers.message : frame);
          },

          onWebSocketError: (evt) => {
            console.warn('WEBSOCKET ERROR:', evt?.message ?? evt);
          },

          onWebSocketClose: () => {
            setIsConnected(false);
            console.log('⚠️ WS Desconectado.');
          },
        });

        client.activate();
        stompClientRef.current = client;
      } catch (err) {
        console.error('Erro iniciando socket:', err);
      }
    };

    iniciarSocket();

    return () => {
      isMountedRef.current = false;
      setIsConnected(false);
      if (stompClientRef.current?.active) stompClientRef.current.deactivate();
    };
  }, [codigo, router]);

  // ---------------- trigger de carga inicial (igual web) ----------------
  useEffect(() => {
    if (!codigo) {
      router.replace('/game');
      return;
    }
    isMountedRef.current = true;
    carregarDadosIniciais();
    return () => {
      isMountedRef.current = false;
    };
  }, [codigo, carregarDadosIniciais, router]);

  // ---------------- contingência: se removido da lista, forçamos saída ----------------
  useEffect(() => {
    if (loading || !salaInfo) return;
    (async () => {
      try {
        const eu = await usuarioService.getMeuPerfil();
        const userStillInList = usuarios.some((p) => String(p.id) === String(eu.id));
        if (!isDonoDaSala && !userStillInList && !actionLoading) {
          router.replace('/game');
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [usuarios, loading, salaInfo, isDonoDaSala, actionLoading, router]);

  // ---------------- ações: iniciar / desmanchar / expulsar ----------------
  const handleIniciar = async () => {
    if (!salaInfo || !isDonoDaSala || actionLoading || !isConnected) return;
    setActionLoading(true);
    try {
      const eu = await usuarioService.getMeuPerfil();
      const dest = `/app/sala/${codigo}/iniciar`;
      stompClientRef.current.publish({
        destination: dest,
        body: JSON.stringify({ idUsuario: eu.id }),
      });
    } catch (err) {
      setErrorMsg('Falha ao enviar comando de iniciar jogo.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDesmanchar = async () => {
    try {
      setActionLoading(true);
      const eu = await usuarioService.getMeuPerfil();
      if (!salaInfo || !eu) return;

      if (String(salaInfo.idUsuario) === String(eu.id)) {
        // dono fecha sala
        await salaService.fecharSala(salaInfo.idSala || salaInfo.id);
        router.replace('/game');
      } else {
        // sai da sala
        await salaService.sairDaSala(codigo, eu.id);
        router.replace('/game');
      }
    } catch (err) {
      setErrorMsg('Erro ao sair/desmanchar. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExpulsar = async (idUsuarioExpulso) => {
    if (!salaInfo || !isDonoDaSala || actionLoading) return;
    setActionLoading(true);
    try {
      await salaService.expulsarUsuario(codigo, idUsuarioExpulso);
      setUsuarios((prev) => prev.filter((u) => String(u.id) !== String(idUsuarioExpulso)));
    } catch (err) {
      setErrorMsg('Falha ao expulsar usuário. Apenas o dono pode fazer isso.');
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1CB0FC" />
      <CustomHeader showMenu menuPosition="right" closeButtonSide="left" />

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.codeLabel}>CODE:</Text>
          <Text style={styles.codeValue}>{codigo || 'ERRO'}</Text>
        </View>

        <Text style={styles.roomName}>{salaInfo?.nomeSala || 'Carregando...'}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnDanger}
            onPress={handleDesmanchar}
            disabled={actionLoading || !salaInfo}
          >
            <Text style={styles.btnText}>{isDonoDaSala ? 'DESMANCHAR SALA' : 'SAIR DA SALA'}</Text>
          </TouchableOpacity>

          {isDonoDaSala && (
            <TouchableOpacity
              style={[styles.btnWarning, { marginLeft: 12 }]}
              onPress={handleIniciar}
              disabled={loading || actionLoading || usuarios.length < 1 || !isConnected}
            >
              <Text style={styles.btnText}>INICIAR</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 30 }} />
        ) : usuarios.length === 0 ? (
          <Text style={styles.msg}>Aguardando jogadores...</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.playersGrid}>
            {usuarios.map((p) => {
              const Avatar = getAvatarComponent(p.avatar);
              return (
                <View key={p.id} style={styles.playerCard}>
                  <View style={styles.avatarWrapper}>
                    <View style={styles.avatarCircle}>
                      <Avatar width={60} height={60} />
                    </View>
                  </View>

                  <Text style={styles.playerName}>{p.nome || p.name || 'Jogador'}</Text>

                  {isDonoDaSala && String(p.id) !== String((usuarioService.getMeuPerfil && '')) ? (
                    <TouchableOpacity style={styles.expelBtn} onPress={() => handleExpulsar(p.id)}>
                      <Text style={styles.expelText}>Expulsar</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
          </ScrollView>
        )}

        {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      </View>
    </SafeAreaView>
  );
}

// ---------------- styles ----------------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1CB0FC' },
  container: { flex: 1, padding: 16, alignItems: 'center' },

  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  codeLabel: { color: '#FFF', fontSize: 20, marginRight: 8, fontWeight: '600' },
  codeValue: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  roomName: { color: 'rgba(255,255,255,0.9)', fontSize: 16, marginTop: 8 },

  actions: { flexDirection: 'row', marginTop: 18, marginBottom: 12 },
  btnDanger: {
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnWarning: {
    backgroundColor: '#FF9D00',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnText: { color: '#FFF', fontWeight: '700' },

  playersGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 120,
    gap: 12,
  },

  playerCard: {
    width: 140,
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 12,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },

  avatarWrapper: { position: 'absolute', top: -30, left: 0, right: 0, alignItems: 'center' },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playerName: { marginTop: 12, fontWeight: '600', color: '#333' },

  expelBtn: { marginTop: 6, backgroundColor: '#ffdddd', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 },
  expelText: { color: '#cc0000', fontWeight: '700' },

  msg: { marginTop: 30, color: '#fff' },
  error: { marginTop: 12, color: '#ffdddd' },
});
