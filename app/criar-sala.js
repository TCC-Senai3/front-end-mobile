// app/criar-sala.js

import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  TextInput, Dimensions, Modal, FlatList, ActivityIndicator, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeader from '../components/CustomHeader';

import { getQuestionarios } from '../services/formulariosService';
import salaService from '../services/salaService'; // Importando o objeto completo
import usuarioService from '../services/usuarioService';

const { width } = Dimensions.get('window');

export default function CriarSalaScreen() {
  const router = useRouter();
  
  const [nomeSala, setNomeSala] = useState('');
  const [questionarioSelecionado, setQuestionarioSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [listaQuestionarios, setListaQuestionarios] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setLoadingList(true);
      try {
        const data = await getQuestionarios();
        setListaQuestionarios(data);
      } catch (error) {
        console.error("Erro lista:", error);
      } finally {
        setLoadingList(false);
      }
    };
    carregarDados();
  }, []);

  const handleCriar = async () => {
    if (!nomeSala.trim() || !questionarioSelecionado) {
        Alert.alert("Erro", "Preencha todos os campos.");
        return;
    }

    setCreating(true);

    try {
      // 1. Pegar dados do Host
      const perfil = await usuarioService.getMeuPerfil();
      const idUsuario = perfil.id;

      // 2. Montar Payload
      const payload = {
        nomeSala: nomeSala,
        idUsuario: idUsuario,
        statusSala: "DISPONIVEL",
        idFormulario: questionarioSelecionado.idFormulario,
        idTema: 1
        // Outros campos o backend gera ou ignora
      };

      // 3. CRIAR SALA
      const salaCriada = await salaService.createSala(payload);
      const codigoGerado = salaCriada.codigoSala;

      if (!codigoGerado) throw new Error("Backend não retornou código.");

      console.log("Sala criada:", codigoGerado);

      // 4. 🔥 O PULO DO GATO: ENTRAR NA SALA IMEDIATAMENTE (IGUAL AO WEB) 🔥
      // Isso garante que o backend registre o Host como participante oficial
      await salaService.entrarNaSala(codigoGerado, idUsuario);
      console.log("Host entrou na sala com sucesso via API.");

      // 5. Navegar
      router.push({
        pathname: '/sala', 
        params: { 
          codigoSala: codigoGerado,
          nomeSala: salaCriada.nomeSala
        }
      });

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Não foi possível criar a sala.";
      Alert.alert("Erro", msg);
    } finally {
      setCreating(false);
    }
  };

  // ... (RenderModalItem e Return mantidos idênticos ao anterior para economizar espaço visual, pois o foco era a lógica acima)
  
  const RenderModalItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.modalItem, 
        questionarioSelecionado?.idFormulario === item.idFormulario && styles.modalItemSelected
      ]}
      onPress={() => { setQuestionarioSelecionado(item); setModalVisible(false); }}
    >
      <Text style={[styles.modalItemText, questionarioSelecionado?.idFormulario === item.idFormulario && styles.modalItemTextSelected]}>
        {item.titulo}
      </Text>
      {questionarioSelecionado?.idFormulario === item.idFormulario && <Feather name="check" size={20} color="#00A9FF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader showMenu={true} menuPosition="right" />
      <View style={styles.container}>
        <Text style={styles.title}>CRIAR SALA</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.label}>Nome da Sala</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da sala"
              placeholderTextColor="#6B6B6B"
              value={nomeSala}
              onChangeText={setNomeSala}
              maxLength={20}
            />
            <Text style={styles.label}>Questionário</Text>
            <TouchableOpacity 
              style={[styles.selectorButton, !questionarioSelecionado && styles.selectorPlaceholder]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.selectorText, !questionarioSelecionado && { color: '#6B6B6B' }]}>
                {questionarioSelecionado ? questionarioSelecionado.titulo : "Selecione um questionário"}
              </Text>
              <Feather name="chevron-down" size={24} color="#6B6B6B" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, (!nomeSala.trim() || !questionarioSelecionado) && styles.buttonDisabled]} 
              onPress={handleCriar}
              disabled={!nomeSala.trim() || !questionarioSelecionado || creating}
            >
              {creating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>CRIAR</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha um Questionário</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Feather name="x" size={24} color="#333" /></TouchableOpacity>
            </View>
            {loadingList ? <ActivityIndicator size="large" color="#00A9FF" style={{ marginTop: 20 }} /> : 
              <FlatList
                data={listaQuestionarios}
                keyExtractor={(item) => item.idFormulario.toString()}
                renderItem={({ item }) => <RenderModalItem item={item} />}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum questionário disponível.</Text>}
              />
            }
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const PRIMARY_BLUE = '#00A9FF';
const SUCCESS_GREEN = '#00ED4B';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#2F2E2E';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY_BLUE },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontFamily: 'Poppins-Bold', color: '#FFFFFF', textAlign: 'center', marginTop: 40, marginBottom: 12 },
  cardContainer: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20 },
  card: { backgroundColor: CARD_BG, borderRadius: 20, padding: 28, width: '100%', maxWidth: 360, elevation: 10 },
  label: { fontFamily: 'Poppins-Medium', fontSize: 14, color: TEXT_DARK, marginBottom: 8, marginLeft: 4 },
  input: { borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontFamily: 'Poppins-Regular', color: TEXT_DARK, backgroundColor: '#FFFFFF', marginBottom: 20 },
  selectorButton: { borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF', marginBottom: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectorText: { fontSize: 16, fontFamily: 'Poppins-Regular', color: TEXT_DARK, flex: 1 },
  button: { backgroundColor: SUCCESS_GREEN, borderRadius: 16, paddingVertical: 20, alignItems: 'center', justifyContent: 'center', minHeight: 60, width: '100%' },
  buttonDisabled: { backgroundColor: '#CCCCCC' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Poppins-Bold', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, height: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10 },
  modalTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: TEXT_DARK },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalItemSelected: { backgroundColor: '#F0F8FF', marginHorizontal: -24, paddingHorizontal: 24 },
  modalItemText: { fontSize: 16, fontFamily: 'Poppins-Regular', color: '#666' },
  modalItemTextSelected: { color: '#00A9FF', fontFamily: 'Poppins-SemiBold' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999', fontFamily: 'Poppins-Regular' }
});