// app/suporte.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import SuporteStyles from '../styles/SuporteStyles';
import CustomHeader from '../components/CustomHeader';

const isEmailValido = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function SuporteScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  // ESTADOS PARA OS ERROS DE CADA CAMPO
  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mensagemError, setMensagemError] = useState('');

  const handleEnviar = () => {
    let hasError = false;

    if (!nome.trim()) {
      setNomeError('O campo Nome é obrigatório.');
      hasError = true;
    } else {
      setNomeError('');
    }

    if (!email.trim()) {
      setEmailError('O campo Email é obrigatório.');
      hasError = true;
    } else if (!isEmailValido(email)) {
      setEmailError('Por favor, insira um e-mail válido.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!mensagem.trim()) {
      setMensagemError('O campo Mensagem é obrigatório.');
      hasError = true;
    } else {
      setMensagemError('');
    }

    if (hasError) {
      return;
    }
    
    setNome('');
    setEmail('');
    setMensagem('');
    setShowSuccessCard(true);

    setTimeout(() => {
      setShowSuccessCard(false);
    }, 3000);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={SuporteStyles.container}>
        <CustomHeader title="" showMenu={true} />

        <Modal
          transparent={true}
          animationType="fade"
          visible={showSuccessCard}
        >
          <View style={SuporteStyles.modalOverlay}>
            <View style={SuporteStyles.successCard}>
              <Feather name="check-circle" size={40} color="#28a745" />
              <Text style={SuporteStyles.successCardText}>Mensagem Enviada!</Text>
            </View>
          </View>
        </Modal>

        <View style={SuporteStyles.newTitleContainer}>
          <View style={SuporteStyles.blueBar} />
          <Text style={SuporteStyles.pageTitle}>Suporte</Text>
        </View>

        <View style={SuporteStyles.content}>
          <Text style={SuporteStyles.label}>Está com problemas com alguma coisa? Envie uma mensagem para a nossa equipe de suporte!</Text>
          
          <Text style={SuporteStyles.inputLabel}>Seu Nome:</Text>
          <TextInput
            style={[SuporteStyles.input, nomeError ? SuporteStyles.inputError : null]}
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={text => { setNome(text); setNomeError(''); }}
          />
          {nomeError ? <Text style={SuporteStyles.errorMessage}>{nomeError}</Text> : null}
          
          <Text style={SuporteStyles.inputLabel}>Email:</Text>
          <TextInput
            style={[SuporteStyles.input, emailError ? SuporteStyles.inputError : null]}
            placeholder="digite seu email"
            value={email}
            onChangeText={text => { setEmail(text); setEmailError(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={SuporteStyles.errorMessage}>{emailError}</Text> : null}
          
          <Text style={SuporteStyles.inputLabel}>Mensagem:</Text>
          <TextInput
            style={[SuporteStyles.textArea, mensagemError ? SuporteStyles.inputError : null]}
            placeholder="Digite sua mensagem"
            value={mensagem}
            onChangeText={text => { setMensagem(text); setMensagemError(''); }}
            multiline
          />
          {mensagemError ? <Text style={SuporteStyles.errorMessage}>{mensagemError}</Text> : null}
          
          <TouchableOpacity style={SuporteStyles.button} onPress={handleEnviar}>
            <Text style={SuporteStyles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}