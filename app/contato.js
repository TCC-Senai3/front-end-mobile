// app/contato.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ContatoStyles from '../styles/ContatoStyles';
import CustomHeader from '../components/CustomHeader';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const isEmailValido = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function ContatoScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  // ESTADOS PARA OS ERROS DE CADA CAMPO
  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mensagemError, setMensagemError] = useState('');

   const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Blinker-Regular': require('../assets/fonts/Blinker/Blinker-Regular.ttf'),


  });
  

  const handleEnviar = () => {
    let hasError = false;

    // 1. Valida campo Nome
    if (!nome.trim()) {
      setNomeError('O campo Nome é obrigatório.');
      hasError = true;
    } else {
      setNomeError('');
    }

    // 2. Valida campo Email
    if (!email.trim()) {
      setEmailError('O campo Email é obrigatório.');
      hasError = true;
    } else if (!isEmailValido(email)) {
      setEmailError('Por favor, insira um e-mail válido.');
      hasError = true;
    } else {
      setEmailError('');
    }

    // 3. Valida campo Mensagem
    if (!mensagem.trim()) {
      setMensagemError('O campo Mensagem é obrigatório.');
      hasError = true;
    } else {
      setMensagemError('');
    }

    // Se houver qualquer erro, não continua
    if (hasError) {
      return;
    }
    
    // Se tudo estiver certo, limpa os campos e mostra o sucesso
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
      <View style={ContatoStyles.container}>
        <CustomHeader title="" showMenu={true} />

        <Modal
          transparent={true}
          animationType="fade"
          visible={showSuccessCard}
        >
          <View style={ContatoStyles.modalOverlay}>
            <View style={ContatoStyles.successCard}>
              <Feather name="check-circle" size={40} color="#28a745" />
              <Text style={ContatoStyles.successCardText}>Mensagem Enviada!</Text>
            </View>
          </View>
        </Modal>

        <View style={ContatoStyles.newTitleContainer}>
          <View style={ContatoStyles.blueBar} />
          <Text style={ContatoStyles.pageTitle}>Contato</Text>
        </View>

        <View style={ContatoStyles.content}>
          <Text style={ContatoStyles.label}>Algum problema, dúvida ou sugestão? Dê sua opnião sobre o nosso projeto!</Text>
          
          <Text style={ContatoStyles.inputLabel}>Seu Nome:</Text>
          <TextInput
            style={[ContatoStyles.input, nomeError ? ContatoStyles.inputError : null]}
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={text => { setNome(text); setNomeError(''); }}
          />
          {nomeError ? <Text style={ContatoStyles.errorMessage}>{nomeError}</Text> : null}
          
          <Text style={ContatoStyles.inputLabel}>Email:</Text>
          <TextInput
            style={[ContatoStyles.input, emailError ? ContatoStyles.inputError : null]}
            placeholder="digite seu email"
            value={email}
            onChangeText={text => { setEmail(text); setEmailError(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={ContatoStyles.errorMessage}>{emailError}</Text> : null}
          
          <Text style={ContatoStyles.inputLabel}>Mensagem:</Text>
          <TextInput
            style={[ContatoStyles.textArea, mensagemError ? ContatoStyles.inputError : null]}
            placeholder="Digite sua mensagem"
            value={mensagem}
            onChangeText={text => { setMensagem(text); setMensagemError(''); }}
            multiline
          />
          {mensagemError ? <Text style={ContatoStyles.errorMessage}>{mensagemError}</Text> : null}
          
          <TouchableOpacity style={ContatoStyles.button} onPress={handleEnviar}>
            <Text style={ContatoStyles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}