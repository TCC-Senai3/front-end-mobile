// // app/aguardando.js

// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Dimensions, Alert } from 'react-native';
// import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
// import { GameboyIcon } from '../components/icons/icon';
// import CustomHeader from '../components/CustomHeader';

// import { Client } from '@stomp/stompjs';
// import * as TextEncoding from 'text-encoding';
// import usuarioService from '../services/usuarioService';

// if (!global.TextEncoder) {
//   global.TextEncoder = TextEncoding.TextEncoder;
//   global.TextDecoder = TextEncoding.TextDecoder;
// }

// const { width, height } = Dimensions.get('window');

// export default function Aguardando() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const [codigoSala, setCodigoSala] = useState(params.codigoSala || '');

//   const [status, setStatus] = useState('Conectando ao servidor...');
//   const stompClient = useRef(null);

//   useEffect(() => {
//     if (!codigoSala) return;

//     const conectarWebSocket = async () => {
//       try {
//         const userProfile = await usuarioService.getMeuPerfil();
//         const token = await usuarioService.getToken();

//         if (!token) {
//           setStatus("Erro de autenticação.");
//           return;
//         }

//         const socketUrl = "wss://tccdrakes.azurewebsites.net/ws-native";

//         console.log("🔌 AGUARDANDO: Conectando WS...");

//         const client = new Client({
//           webSocketFactory: () => new WebSocket(socketUrl),
//           connectHeaders: {
//             Authorization: `Bearer ${token}`,
//           },
//           reconnectDelay: 5000,
//           heartbeatIncoming: 4000,
//           heartbeatOutgoing: 4000,
//           forceBinaryWSFrames: true,
//           appendMissingNULLonIncoming: true,

//           onConnect: () => {
//             console.log('✅ AGUARDANDO: Conectado!');
//             setStatus('Aguardando o host iniciar...');

//             // 🔥 AGORA OUVINDO O TÓPICO CORRETO
//             client.subscribe(`/topic/sala/${codigoSala}/game`, (message) => {
//               try {
//                 const payload = JSON.parse(message.body);
//                 console.log('📩 Evento:', payload.type);

//                 // 🔥 Quando o jogo realmente começa, recebemos NOVA_PERGUNTA
//                 if (payload.type === "NOVA_PERGUNTA") {

//                   if (stompClient.current) stompClient.current.deactivate();

//                   router.replace({
//                     pathname: '/partida',
//                     params: {
//                       idFormulario: payload?.idFormulario,
//                       idSala: payload?.idSala,
//                       codigoSala
//                     }
//                   });
//                 }

//                 else if (payload.type === "SALA_FECHADA") {
//                   Alert.alert("Atenção", "A sala foi fechada pelo host.");
//                   if (stompClient.current) stompClient.current.deactivate();
//                   router.replace('/home');
//                 }

//               } catch (e) {
//                 console.error("Erro ao processar mensagem:", e);
//               }
//             });
//           },

//           onStompError: (frame) => {
//             console.error('Broker error:', frame.headers['message']);
//             setStatus('Reconectando...');
//           },

//           onWebSocketClose: () => {
//             console.log("Conexão encerrada.");
//           }
//         });

//         client.activate();
//         stompClient.current = client;

//       } catch (error) {
//         console.error("Erro no WS:", error);
//         setStatus("Erro ao conectar.");
//       }
//     };

//     conectarWebSocket();

//     return () => {
//       if (stompClient.current) stompClient.current.deactivate();
//     };

//   }, [codigoSala]);

//   const handleSair = () => {
//     if (stompClient.current) stompClient.current.deactivate();
//     router.replace('/home');
//   };

//   return (
//     <>
//       <Stack.Screen options={{ headerShown: false }} />
      
//       <SafeAreaView style={styles.container}>
//         <CustomHeader showMenu={true} menuPosition="right" closeButtonSide="left" />
        
//         <View style={styles.content}>

//           <GameboyIcon style={styles.illustration} />
          
//           <Text style={styles.title}>Aguardando o host</Text>

//           <View style={styles.codeContainer}>
//             <Text style={styles.codeLabel}>CÓDIGO DA SALA:</Text>
//             <Text style={styles.code}>{codigoSala || '...'}</Text>
//           </View>

//           <View style={styles.card}>
//             <View style={styles.loadingRow}>
//               <ActivityIndicator size="small" color="#1CB0FC" />
//               <Text style={styles.inputText}>{status}</Text>
//             </View>

//             <View style={styles.exitButtonWrapper}>
//               <View style={styles.exitButtonShadow} />
//               <TouchableOpacity style={styles.exitButton} onPress={handleSair}>
//                 <Text style={styles.exitText}>SAIR</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//         </View>
//       </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1CB0FC',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 50,
//   },
//   illustration: {
//     width: 320,
//     height: 320,
//     marginTop: 20,
//   },
//   title: {
//     marginTop: 8,
//     color: '#FFFFFF',
//     fontFamily: 'Blinker-Bold',
//     fontSize: 28,
//     letterSpacing: 0.3,
//     textAlign: 'center',
//   },
//   codeContainer: {
//     width: '100%',
//     marginTop: 15,
//     marginBottom: 15,
//     alignItems: 'center',
//     paddingHorizontal: 30,
//   },
//   codeLabel: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 14,
//     fontFamily: 'Poppins-Regular',
//     marginBottom: 4,
//   },
//   code: {
//     color: '#FFF',
//     fontSize: 36,
//     fontWeight: 'bold',
//     letterSpacing: 4,
//     fontFamily: 'Blinker-Bold',
//     textAlign: 'center',
//   },
//   card: {
//     width: '80%',
//     maxWidth: 350,
//     backgroundColor: '#DDDDDD',
//     borderRadius: 16,
//     marginTop: 10,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   loadingRow: {
//     flexDirection: 'row',
//     width: 270,
//     height: 42,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#B0B0AF',
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 15,
//     marginHorizontal: 20,
//     alignSelf: 'center',
//     gap: 10,
//   },
//   inputText: {
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: 14,
//     color: '#1CB0FC',
//   },
//   exitButtonWrapper: {
//     position: 'relative',
//     marginHorizontal: 20,
//     alignSelf: 'center',
//   },
//   exitButtonShadow: {
//     position: 'absolute',
//     width: 270,
//     height: 42,
//     left: 0,
//     top: 0,
//     backgroundColor: '#FF0000',
//     borderRadius: 5,
//   },
//   exitButton: {
//     width: 270,
//     height: 42,
//     backgroundColor: '#FF0000',
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   exitText: {
//     fontFamily: 'Blinker-Bold',
//     fontSize: 16,
//     letterSpacing: 0.02,
//     textTransform: 'uppercase',
//     color: '#FFFFFF',
//   },
// });
