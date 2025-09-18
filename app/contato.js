import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, Stack } from 'expo-router';
import ContatoStyles from '../styles/ContatoStyles';
import CustomHeader from '../components/CustomHeader';

export default function ContatoScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleEnviar = () => {
    if (!nome || !email || !mensagem) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    Alert.alert('Sucesso', 'Sua mensagem foi enviada!');
    setNome('');
    setEmail('');
    setMensagem('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={ContatoStyles.container}>
        {/* Usando o componente CustomHeader no lugar do cabeçalho antigo */}
        <CustomHeader title="" showMenu={true} menuPosition="right" />

        {/* Novo Título com a barra */}
        <View style={ContatoStyles.newTitleContainer}>
          <View style={ContatoStyles.blueBar} />
          <Text style={ContatoStyles.pageTitle}>Contato</Text>
        </View>

        <View style={ContatoStyles.content}>
          <Text style={ContatoStyles.label}>Algum problema, dúvida ou sugestão? Dê sua opnião sobre o nosso projeto!</Text>
          <Text style={ContatoStyles.inputLabel}>Seu Nome:</Text>
          <TextInput
            style={ContatoStyles.input}
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />
          <Text style={ContatoStyles.inputLabel}>Email:</Text>
          <TextInput
            style={ContatoStyles.input}
            placeholder="digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Text style={ContatoStyles.inputLabel}>Mensagem:</Text>
          <TextInput
            style={ContatoStyles.textArea}
            placeholder="Digite sua mensagem"
            value={mensagem}
            onChangeText={setMensagem}
            multiline
          />
          <TouchableOpacity style={ContatoStyles.button} onPress={handleEnviar}>
            <Text style={ContatoStyles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}