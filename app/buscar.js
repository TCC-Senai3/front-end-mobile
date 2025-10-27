import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import BuscaIcon from '../components/icons/BuscaIcon';
import CustomHeader from '../components/CustomHeader';

const MOCK_RESULTADOS = [
  { id: '1', pontos: 50, nome: 'Tecnologia', posicao: 1, status: true },
  { id: '2', pontos: 48, nome: 'Backend', posicao: 2, status: true },
  { id: '3', pontos: 46, nome: 'Frontend', posicao: 3, status: true },
  { id: '4', pontos: 44, nome: 'Redes', posicao: 4, status: true },
  { id: '5', pontos: 42, nome: 'Banco de Dados', posicao: 5, status: true }, 
];

export default function BuscarScreen() {
  const [busca, setBusca] = useState('');
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#03A9F4" />
      <CustomHeader showMenu={true} menuPosition="right" closeButtonSide="left" />
      
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <BuscaIcon width={26} height={29} />
          <TextInput
            style={styles.input}
            placeholder="Buscar..."
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

      {/* HEADER DA LISTA */}
      <View style={styles.headerList}>
        <Text style={styles.headerCol}>PONTOS</Text>
        <Text style={styles.headerCol}>NOME</Text>
        <Text style={styles.headerCol}>POSIÇÃO</Text>
        <Text style={styles.headerCol}>STATUS</Text>
      </View>

      <FlatList
        data={MOCK_RESULTADOS.filter(item =>
          busca.trim() === '' || item.nome.toLowerCase().includes(busca.toLowerCase())
        )}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 47 }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cell}>{item.pontos}</Text>
            <Text style={styles.cell} numberOfLines={1}>{item.nome}</Text>
            <Text style={styles.position}>{item.posicao}</Text>
            <View style={styles.statusWrap}>
              <View style={styles.statusDot} />
            </View>
          </View>
        )}
      />
      </View>
    </SafeAreaView>
  );
}

const PRIMARY_BLUE = '#03A9F4';
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_BLUE,
  },
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BLUE,
    alignItems: 'center',
    paddingTop: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.11,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    color: '#222',
    paddingVertical: 4,
    fontFamily: 'Poppins-Medium',
  },
  headerList: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 14,
    width: '90%',
    justifyContent: 'space-between',
  },
  headerCol: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#222',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    minHeight: 44,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cell: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#222',
    textAlign: 'center',
  },
  position: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#222',
    textAlign: 'center',
  },
  statusWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 17,
    height: 17,
    borderRadius: 17 / 2,
    backgroundColor: '#2fff00',
  },
});
