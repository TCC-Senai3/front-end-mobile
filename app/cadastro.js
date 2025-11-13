// app/cadastro.js

import React, { useRef, useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, Link, useFocusEffect } from 'expo-router'; // Adicionado useFocusEffect
import { useFonts } from 'expo-font';
import styles from '../styles/CadastroStyles';
import CustomHeader from '../components/CustomHeader';

export default function CadastroScreen() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isSenhaVisivel, setSenhaVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animação de opacidade para os itens da tela
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
  });

  // Animação de foco/desfoco da tela
  useFocusEffect(
    useCallback(() => {
      // Removido: console.log('CadastroScreen: Fade-in dos itens da tela (useFocusEffect)');
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        contentOpacity.setValue(0);
        footerOpacity.setValue(0);
      };
    }, [])
  );

  // --- Lógica de Animação para o Botão (inalterada) ---
  const scaleValue = useRef(new Animated.Value(1)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    Animated.timing(colorAnimation, {
      toValue: isHovered ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isHovered]);

  const onPressIn = () => { /* ... */ };
  const onPressOut = () => { /* ... */ };
  const inputRange = [0, 1];
  const outputRange = ['#17ABF8', '#118ACB'];
  const animatedBackgroundColor = colorAnimation.interpolate({ inputRange, outputRange });
  const animatedButtonStyle = {
    transform: [{ scale: scaleValue }],
    backgroundColor: animatedBackgroundColor,
  };
  // --- Fim da Animação ---

  // Função para navegar após o fade-out dos itens
  const navigateWithFadeOut = (path) => {
    // Removido: console.log('CadastroScreen: Iniciando fade-out dos itens da tela');
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Removido: console.log('CadastroScreen: Fade-out concluído, navegando para:', path);
      router.push(path);
    });
  };

  const handleCadastro = async () => {
    setErro('');
    if (!nomeUsuario || !email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro('Formato de email inválido.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setIsLoading(true);
    // --- LÓGICA DE CADASTRO (simulação) ---
    console.log('Tentando cadastrar com:', nomeUsuario, email);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Simulação: Cadastro bem-sucedido');
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Faça o login.');
    navigateWithFadeOut('/login'); // Usa a função de navegação com fade-out
    setIsLoading(false);
    // --- FIM CADASTRO ---
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* <<< ALTERADO AQUI PARA MOSTRAR O MENU >>> */}
      <CustomHeader
        showMenu={true}
        menuPosition='left'
        closeButtonSide='right'
        headerStyle='solid'
        showBackButton={false}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {/* Elipse no Fundo */}
          <View style={styles.backgroundEllipse} />
          {/* Conteúdo Central com animação de opacidade */}
          <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
            <Text style={styles.title}>Cadastro</Text>
            {/* Campo Nome de Usuário */}
            <TextInput
              placeholder="Nome de Usuário"
              style={styles.input}
              placeholderTextColor="#919191"
              value={nomeUsuario}
              onChangeText={setNomeUsuario}
              autoCapitalize="none"
              returnKeyType="next"
            />
            {/* Campo Email */}
            <TextInput
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#919191"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
            {/* Campo Senha */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Senha"
                style={styles.inputSenha}
                secureTextEntry={!isSenhaVisivel}
                placeholderTextColor="#919191"
                value={senha}
                onChangeText={setSenha}
                returnKeyType="go"
                onSubmitEditing={handleCadastro}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!isSenhaVisivel)} style={styles.eyeIcon}>
                <Feather name={isSenhaVisivel ? 'eye-off' : 'eye'} size={24} color="#919191" />
              </TouchableOpacity>
            </View>
            {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
            {/* Botão Principal Animado */}
            <Animated.View style={[styles.mainButton, animatedButtonStyle]}>
              <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={handleCadastro}
                disabled={isLoading}
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
              >
                {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.mainButtonText}>CADASTRAR-SE</Text>}
              </Pressable>
            </Animated.View>
          </Animated.View>
          {/* Rodapé com animação de opacidade */}
          <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
            <Text style={styles.footerText}>Já está cadastrado?</Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigateWithFadeOut('/login')} // Usa a função de navegação com fade-out
            >
              <Text style={styles.secondaryButtonText}>FAZER LOGIN</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}